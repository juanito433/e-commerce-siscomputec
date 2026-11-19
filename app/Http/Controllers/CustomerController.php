<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Muestra el panel del cliente (Perfil, Órdenes/Compras y Me Gustas/Guardados).
     */
    public function index()
    {
        $user = Auth::user();

        $orders = [];
        if (Schema::hasTable('orders') && method_exists($user, 'orders')) {
            $orders = $user->orders()->latest()->get();
        }

        $favorites = [];
        if (Schema::hasTable('favorites') && method_exists($user, 'favorites')) {
            $favorites = $user->favorites()->with(['category', 'images'])->latest()->get();
        }

        return Inertia::render('Profile/CustomerDashboard', [
            'auth' => [
                'user' => $user,
            ],
            'orders' => $orders,
            'favorites' => $favorites,
        ]);
    }

    /**
     * Actualiza los datos básicos del perfil del cliente.
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::findOrFail($request->user()->id);
        $user->update($validated);

        return redirect()->back()->with('success', 'Tus datos de perfil se actualizaron correctamente.');
    }
}
