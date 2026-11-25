<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function create(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $directProduct = null;
        $quantity = max(1, (int) $request->query('quantity', 1));

        if ($request->filled('product_id')) {
            $directProduct = Product::with(['category', 'images'])
                ->where('id', (int) $request->query('product_id'))
                ->where('is_active', true)
                ->first();
        }

        $cartItems = [];
        if (Schema::hasTable('carts') && Schema::hasTable('cart_items')) {
            $cart = Cart::with(['items.product.category', 'items.product.images'])
                ->where('user_id', $user->id)
                ->first();

            if ($cart) {
                $cartItems = $cart->items
                    ->filter(fn($item) => $item->product && $item->product->is_active)
                    ->values();
            }
        }

        $cards = Schema::hasTable('payment_cards')
            ? $user->paymentCards()->get()
            : collect();

        return Inertia::render('Checkout/Index', [
            'auth' => ['user' => $user],
            'directProduct' => $directProduct,
            'quantity' => $quantity,
            'cartItems' => $cartItems,
            'cards' => $cards,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:cash,card',
            'payment_card_id' => 'nullable|integer',
            'delivery_method' => 'required|in:pickup,local_delivery',
            'direct_product_id' => 'nullable|integer|exists:products,id',
            'quantity' => 'nullable|integer|min:1|max:999',
            'requires_invoice' => 'boolean',
            'billing_data' => 'nullable|array',
            'accepted_policies' => 'required|accepted',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $isDirectBuy = !empty($validated['direct_product_id']);

        if ($validated['payment_method'] === 'card') {
            $hasCard = Schema::hasTable('payment_cards') && $user->paymentCards()->exists();
            if (!$hasCard) {
                return redirect()->back()->withErrors([
                    'payment_card_id' => 'No tienes una tarjeta registrada. Agrégala en tu panel de cliente para continuar.',
                ]);
            }
        }

        $order = DB::transaction(function () use ($user, $validated, $isDirectBuy) {
            $subtotal = 0;
            $itemsPayload = [];
            $cart = null;

            if ($isDirectBuy) {
                $product = Product::where('id', $validated['direct_product_id'])
                    ->where('is_active', true)
                    ->firstOrFail();

                $qty = max(1, (int) ($validated['quantity'] ?? 1));
                $unitPrice = (float) $product->price;
                $lineTotal = round($unitPrice * $qty, 2);
                $subtotal = $lineTotal;

                $itemsPayload[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $qty,
                    'unit_price' => $unitPrice,
                    'line_total' => $lineTotal,
                ];

                if (!is_null($product->stock)) {
                    $product->decrement('stock', min($qty, max(0, (int) $product->stock)));
                }
            } else {
                $cart = Cart::with(['items.product'])
                    ->where('user_id', $user->id)
                    ->first();

                if (!$cart || $cart->items->isEmpty()) {
                    abort(422, 'Tu carrito está vacío.');
                }

                foreach ($cart->items as $item) {
                    $product = $item->product;
                    if (!$product || !$product->is_active) {
                        continue;
                    }

                    $qty = max(1, (int) $item->quantity);
                    $unitPrice = (float) $product->price;
                    $lineTotal = round($unitPrice * $qty, 2);
                    $subtotal += $lineTotal;

                    $itemsPayload[] = [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_sku' => $product->sku,
                        'quantity' => $qty,
                        'unit_price' => $unitPrice,
                        'line_total' => $lineTotal,
                    ];

                    if (!is_null($product->stock)) {
                        $product->decrement('stock', min($qty, max(0, (int) $product->stock)));
                    }
                }
            }

            $total = round($subtotal, 2);
            $netSubtotal = round($total / 1.16, 2);
            $taxAmount = round($total - $netSubtotal, 2);

            $isCash = $validated['payment_method'] === 'cash';
            $selectedCard = null;
            if (!$isCash && Schema::hasTable('payment_cards')) {
                $selectedCard = !empty($validated['payment_card_id'])
                    ? $user->paymentCards()->where('id', $validated['payment_card_id'])->first()
                    : $user->paymentCards()->first();
            }

            $paymentStatus = $isCash ? 'unpaid' : 'paid';
            $paymentProvider = $isCash
                ? ($validated['delivery_method'] === 'local_delivery' ? 'cash_on_delivery' : 'cash_on_pickup')
                : ('card_test' . ($selectedCard ? "_{$selectedCard->brand}_{$selectedCard->last4}" : ''));

            $createdOrder = Order::create([
                'order_number' => 'SC-' . now()->format('Ymd') . '-' . strtoupper(Str::random(4)),
                'user_id' => $user->id,
                'status' => 'pending',
                'payment_status' => $paymentStatus,
                'payment_provider' => $paymentProvider,
                'delivery_method' => $validated['delivery_method'],
                'pickup_code' => strtoupper(Str::random(6)),
                'subtotal' => $netSubtotal,
                'tax_amount' => $taxAmount,
                'total' => $total,
                'currency' => 'MXN',
                'requires_invoice' => !empty($validated['requires_invoice']),
                'billing_data' => !empty($validated['requires_invoice']) ? ($validated['billing_data'] ?? null) : null,
                'accepted_policies_at' => now(),
                'paid_at' => $isCash ? null : now(),
            ]);

            $createdOrder->items()->createMany($itemsPayload);

            if (!$isDirectBuy && $cart) {
                $cart->items()->delete();
            }

            return $createdOrder;
        });

        return redirect()->route('orders.ticket', $order->id);
    }

    public function ticket(Order $order)
    {
        if ($order->user_id !== Auth::id() && Auth::user()?->role !== 'admin') {
            abort(403);
        }

        $order->load(['items', 'user']);

        return Inertia::render('Orders/Ticket', [
            'order' => $order,
        ]);
    }
    public function markInvoiceWhatsapp(\App\Models\Order $order)
    {
        if ($order->user_id !== Auth::id() && Auth::user()?->role !== 'admin') {
            abort(403);
        }

        $order->increment('invoice_whatsapp_count');
        $order->forceFill(['invoice_requested_at' => now()])->save();

        return back();
    }
}
