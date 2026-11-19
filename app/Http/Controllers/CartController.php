<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    private function getOrCreateCart(int $userId): Cart
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $cart = $this->getOrCreateCart($user->id);
        $cart->load(['items.product.category', 'items.product.images']);

        $validItems = $cart->items->filter(function ($item) {
            return $item->product && $item->product->is_active;
        })->values();

        $subtotal = $validItems->sum(function ($item) {
            return (float) ($item->product?->price ?? 0) * (int) $item->quantity;
        });

        $cartCount = (int) $validItems->sum('quantity');

        return Inertia::render('Cart/Index', [
            'auth' => ['user' => $user],
            'items' => $validItems,
            'subtotal' => round($subtotal, 2),
            'cartCount' => $cartCount,
        ]);
    }

    public function store(Request $request, Product $product)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $validated = $request->validate([
            'quantity' => 'nullable|integer|min:1',
        ]);

        $qtyToAdd = (int) ($validated['quantity'] ?? 1);
        $stock = (int) $product->stock;

        if ($stock <= 0 || !$product->is_active) {
            return back()->withErrors([
                'cart' => 'Este producto no está disponible en stock.',
            ]);
        }

        return DB::transaction(function () use ($user, $product, $qtyToAdd, $stock) {
            $cart = $this->getOrCreateCart($user->id);
            $item = $cart->items()->where('product_id', $product->id)->lockForUpdate()->first();

            $currentQty = $item ? (int) $item->quantity : 0;
            $newQty = min($stock, $currentQty + $qtyToAdd);

            if ($item && $newQty <= $currentQty) {
                return back()->withErrors([
                    'cart' => "Ya alcanzaste el stock máximo disponible ({$stock}) de este producto.",
                ]);
            }

            if ($item) {
                $item->update([
                    'quantity' => $newQty,
                ]);
            } else {
                $cart->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $newQty,
                ]);
            }

            return back()->with('success', 'Producto agregado al carrito.');
        });
    }

    public function update(Request $request, CartItem $cartItem)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $cartItem->loadMissing(['cart', 'product']);

        if (!$cartItem->cart || (int) $cartItem->cart->user_id !== (int) $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $stock = (int) ($cartItem->product?->stock ?? 0);
        if (!$cartItem->product || !$cartItem->product->is_active || $stock <= 0) {
            return back()->withErrors([
                'cart' => 'Este producto ya no tiene stock disponible.',
            ]);
        }

        $newQty = min($stock, (int) $validated['quantity']);

        $cartItem->update([
            'quantity' => $newQty,
        ]);

        return back()->with('success', 'Cantidad actualizada.');
    }

    public function destroy(Request $request, CartItem $cartItem)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $cartItem->loadMissing('cart');

        if (!$cartItem->cart || (int) $cartItem->cart->user_id !== (int) $user->id) {
            abort(403);
        }

        $cartItem->delete();

        return back()->with('success', 'Producto eliminado del carrito.');
    }
}
