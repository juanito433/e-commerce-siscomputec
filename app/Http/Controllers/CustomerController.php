<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $orders = [];
        if (Schema::hasTable('orders') && method_exists($user, 'orders')) {
            $orders = $user->orders()->latest()->get();
        }

        $favorites = [];
        if (Schema::hasTable('favorites') && method_exists($user, 'favorites')) {
            $favorites = $user->favorites()
                ->with(['category', 'images'])
                ->latest('favorites.created_at')
                ->get();
        }

        $cartItems = [];
        if (Schema::hasTable('carts') && Schema::hasTable('cart_items') && method_exists($user, 'cart')) {
            $cart = $user->cart()->with(['items.product.category', 'items.product.images'])->first();
            if ($cart) {
                $cartItems = $cart->items->filter(function ($item) {
                    return $item->product && $item->product->is_active;
                })->values();
            }
        }

        return Inertia::render('Profile/CustomerDashboard', [
            'auth' => [
                'user' => $user,
            ],
            'orders' => $orders,
            'favorites' => $favorites,
            'cartItems' => $cartItems,
        ]);
    }

    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Tus datos de perfil se actualizaron correctamente.');
    }
}
