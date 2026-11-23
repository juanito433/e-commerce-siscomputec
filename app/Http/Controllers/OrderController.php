<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'accepted_policies' => ['required', 'accepted'],
            'requires_invoice' => ['required', 'boolean'],
            'delivery_method' => ['nullable', 'in:pickup,local_delivery'],
            'payment_provider' => ['nullable', 'in:pay_on_pickup,stripe,mercadopago,conekta'],
            'billing' => ['nullable', 'array', 'required_if:requires_invoice,true'],
            'billing.rfc' => ['required_if:requires_invoice,true', 'string', 'regex:/^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})$/i'],
            'billing.business_name' => ['required_if:requires_invoice,true', 'string', 'max:255'],
            'billing.postal_code' => ['required_if:requires_invoice,true', 'digits:5'],
            'billing.tax_regime' => ['required_if:requires_invoice,true', 'string', 'max:10'],
            'billing.cfdi_use' => ['required_if:requires_invoice,true', 'string', 'max:10'],
            'billing.invoice_email' => ['required_if:requires_invoice,true', 'email', 'max:255'],
        ], [
            'accepted_policies.accepted' => 'Debes aceptar los Términos y Condiciones y el Aviso de Privacidad.',
            'billing.rfc.regex' => 'El formato del RFC no es válido.',
            'billing.postal_code.digits' => 'El código postal fiscal debe tener 5 dígitos.',
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();
        $cart = $user->cart()->with('items')->first();

        if (! $cart || $cart->items->isEmpty()) {
            return back()->withErrors(['cart' => 'Tu carrito está vacío.']);
        }

        $billingData = null;
        if ($validated['requires_invoice']) {
            $billingData = [
                'rfc' => strtoupper(trim($validated['billing']['rfc'])),
                'business_name' => trim($validated['billing']['business_name']),
                'postal_code' => trim($validated['billing']['postal_code']),
                'tax_regime' => $validated['billing']['tax_regime'],
                'cfdi_use' => $validated['billing']['cfdi_use'],
                'invoice_email' => trim($validated['billing']['invoice_email']),
            ];
        }

        $order = DB::transaction(function () use ($user, $cart, $validated, $billingData) {
            $totalWithTax = 0;
            $preparedLines = [];

            foreach ($cart->items as $cartItem) {
                // Bloqueo pesimista para evitar sobreventa concurrente
                $product = Product::where('id', $cartItem->product_id)
                    ->where('is_active', true)
                    ->lockForUpdate()
                    ->first();

                if (! $product) {
                    throw ValidationException::withMessages([
                        'cart' => 'Uno de los productos ya no está disponible en el catálogo.',
                    ]);
                }

                if ($product->stock < $cartItem->quantity) {
                    throw ValidationException::withMessages([
                        'cart' => "Stock insuficiente para {$product->name} (disponibles: {$product->stock}).",
                    ]);
                }

                $unitPrice = round((float) $product->price, 2);
                $lineTotal = round($unitPrice * $cartItem->quantity, 2);
                $totalWithTax += $lineTotal;

                $preparedLines[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'unit_price' => $unitPrice,
                    'quantity' => $cartItem->quantity,
                    'line_total' => $lineTotal,
                ];

                // Descontar inventario
                $product->decrement('stock', $cartItem->quantity);
            }

            $totalWithTax = round($totalWithTax, 2);
            $subtotalWithoutTax = round($totalWithTax / 1.16, 2);
            $taxAmount = round($totalWithTax - $subtotalWithoutTax, 2);

            $order = Order::create([
                'order_number' => 'SC-' . now()->format('Ymd') . '-' . strtoupper(Str::random(4)),
                'user_id' => $user->id,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_provider' => $validated['payment_provider'] ?? 'pay_on_pickup',
                'delivery_method' => $validated['delivery_method'] ?? 'pickup',
                'pickup_code' => strtoupper(Str::random(6)),
                'subtotal' => $subtotalWithoutTax,
                'tax_amount' => $taxAmount,
                'total' => $totalWithTax,
                'currency' => 'MXN',
                'requires_invoice' => $validated['requires_invoice'],
                'billing_data' => $billingData,
                'accepted_policies_at' => now(),
            ]);

            $order->items()->createMany($preparedLines);

            // Vaciar carrito una vez creada la orden
            $cart->items()->delete();

            return $order;
        });

        // Punto de extensión futuro para pasarela de pagos:
        // Si payment_provider === 'stripe' o 'mercadopago', aquí creas la sesión de pago
        // usando $order->total y $order->order_number, y rediriges al checkout externo.

        return redirect('/mi-cuenta?tab=orders')
            ->with('success', "Pedido {$order->order_number} registrado correctamente. Código de recolección: {$order->pickup_code}");
    }
}
