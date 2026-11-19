<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ProfileController;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rutas Públicas (Tienda)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    $favoriteIds = [];

    if (Auth::check()) {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $favoriteIds = $user->favorites()->pluck('products.id')->toArray();
    }

    return Inertia::render('Welcome', [
        'products' => Product::with(['category', 'images'])->where('is_active', true)->latest()->get(),
        'categories' => Category::all(),
        'favoriteIds' => $favoriteIds,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

Route::get('/products/{product}', function (Product $product) {
    $product->load(['category', 'images']);

    $isFavorite = false;
    if (Auth::check()) {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $isFavorite = $user->favorites()->where('product_id', $product->id)->exists();
    }

    return Inertia::render('Products/Show', [
        'product' => $product,
        'isFavorite' => $isFavorite,
        'auth' => [
            'user' => Auth::user(),
        ],
    ]);
})->name('products.show');

/*
|--------------------------------------------------------------------------
| Rutas Autenticadas (Clientes y Perfil)
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

    // Favoritos / Me Gustas
    Route::post('/favoritos/{product}/toggle', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
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
});

require __DIR__ . '/auth.php';
