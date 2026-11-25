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
            $orderColumn = Schema::hasColumn('orders', 'created_at') ? 'created_at' : 'id';
            $orders = $user->orders()->reorder($orderColumn, 'desc')->get();
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
        
        $cards = [];
        if (Schema::hasTable('payment_cards') && method_exists($user, 'paymentCards')) {
            $cards = $user->paymentCards()->get();
        }

        return Inertia::render('Profile/CustomerDashboard', [
            'auth' => [
                'user' => $user,
            ],
            'orders' => $orders,
            'favorites' => $favorites,
            'cartItems' => $cartItems,
            'cards' => $cards,
        ]);

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
    public function storeCard(Request $request)
    {
        $validated = $request->validate([
            'holder_name' => 'required|string|max:120',
            'brand' => 'required|string|max:30',
            'bank_name' => 'nullable|string|max:80',
            'last4' => 'required|digits:4',
            'exp_month' => 'required|digits:2',
            'exp_year' => 'required|digits:4',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->paymentCards()->update(['is_default' => false]);

        $card = $user->paymentCards()->create([
            ...$validated,
            'is_default' => true,
        ]);

        return redirect()->back()->with([
            'success' => 'Tarjeta guardada correctamente.',
            'created_card_id' => $card->id,
        ]);
    }

    public function destroyCard(\App\Models\PaymentCard $paymentCard)
    {
        if ($paymentCard->user_id !== Auth::id()) {
            abort(403);
        }
        $paymentCard->delete();

        return redirect()->back()->with('success', 'Tarjeta eliminada.');
    }
}
