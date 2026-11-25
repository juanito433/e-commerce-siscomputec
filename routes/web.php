<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rutas Públicas (Tienda)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    $favoriteIds = [];
    $cartCount = 0;

    if (Auth::check()) {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $favoriteIds = $user->favorites()->pluck('products.id')->toArray();

        if (Schema::hasTable('cart_items') && method_exists($user, 'cart')) {
            $cartCount = (int) ($user->cart?->items()->sum('quantity') ?? 0);
        }
    }

    return Inertia::render('Welcome', [
        'products' => Product::with(['category', 'images'])
            ->where('is_active', true)
            ->latest()
            ->get(),
        'categories' => Category::all(),
        'favoriteIds' => $favoriteIds,
        'cartCount' => $cartCount,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

Route::get('/products/{product}', function (Product $product) {
    $product->load(['category', 'images']);

    $isFavorite = false;
    $favoritesCount = 0;
    $cartCount = 0;
    $cartItem = null;

    if (Auth::check()) {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $isFavorite = $user->favorites()->where('product_id', $product->id)->exists();
        $favoritesCount = $user->favorites()->count();

        if (Schema::hasTable('cart_items') && method_exists($user, 'cart')) {
            $cart = $user->cart;
            $cartCount = (int) ($cart?->items()->sum('quantity') ?? 0);
            if ($cart) {
                $cartItem = $cart->items()->where('product_id', $product->id)->first();
            }
        }
    }

    $relatedProducts = Product::with(['category', 'images'])
        ->where('is_active', true)
        ->where('stock', '>', 0)
        ->where('id', '!=', $product->id)
        ->orderByRaw('category_id = ? DESC', [$product->category_id])
        ->latest()
        ->take(4)
        ->get();

    return Inertia::render('Products/Show', [
        'product' => $product,
        'relatedProducts' => $relatedProducts,
        'isFavorite' => $isFavorite,
        'favoritesCount' => $favoritesCount,
        'cartCount' => $cartCount,
        'cartItem' => $cartItem,
        'auth' => [
            'user' => Auth::user(),
        ],
    ]);
})->name('products.show');

/*
|--------------------------------------------------------------------------
| Rutas Autenticadas (Clientes, Perfil, Favoritos y Carrito)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware('verified')->name('dashboard');

    // Perfil base (Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Portal de Cliente ("Mi Cuenta")
    Route::get('/mi-cuenta', [CustomerController::class, 'index'])->name('customer.dashboard');
    Route::patch('/mi-cuenta/perfil', [CustomerController::class, 'updateProfile'])->name('customer.profile.update');

    // Facturación y Tarjetas
    Route::patch('/mi-cuenta/facturacion', [CustomerController::class, 'updateBilling'])->name('customer.billing.update');
    Route::post('/ordenes/{order}/factura-whatsapp', [OrderController::class, 'markInvoiceWhatsapp'])->name('orders.invoice.whatsapp');

    // Tarjetas del cliente (modo prueba)
    Route::post('/mi-cuenta/tarjetas', [CustomerController::class, 'storeCard'])->name('customer.cards.store');
    Route::delete('/mi-cuenta/tarjetas/{paymentCard}', [CustomerController::class, 'destroyCard'])->name('customer.cards.destroy');

    // Favoritos / Me Gustas
    Route::post('/favoritos/{product}/toggle', [FavoriteController::class, 'toggle'])->name('favorites.toggle');

    // Carrito de Compras (solo usuarios logueados)
    Route::get('/carrito', [CartController::class, 'index'])->name('cart.index');
    Route::post('/carrito/{product}', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/carrito/items/{cartItem}', [CartController::class, 'update'])->name('cart.items.update');
    Route::delete('/carrito/items/{cartItem}', [CartController::class, 'destroy'])->name('cart.items.destroy');

    // Pantalla de Checkout por pasos y vista de Ticket / QR / Factura WhatsApp
    Route::get('/checkout', [OrderController::class, 'create'])->name('checkout.index');
    Route::post('/ordenes', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/ordenes/{order}/ticket', [OrderController::class, 'ticket'])->name('orders.ticket');
});

/*
|--------------------------------------------------------------------------
| Rutas de Administración
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [ProductController::class, 'index'])->name('dashboard');

    // Productos
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::match(['put', 'post'], '/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Categorías
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Órdenes
    Route::patch('/ordenes/{order}', [ProductController::class, 'updateOrder'])->name('orders.update');
});

require __DIR__ . '/auth.php';
