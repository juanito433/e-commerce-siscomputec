<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Mostrar el panel de administración con productos, categorías y métricas
    public function index()
    {
        // Cargamos los productos con su categoría y sus imágenes asociadas
        $products = Product::with(['category', 'images'])->latest()->get();
        $categories = Category::all();

        // Control de órdenes seguras (si el modelo Order ya está creado)
        $ordersCount = class_exists(Order::class) ? Order::where('status', 'pending')->count() : 0;
        $totalSales = class_exists(Order::class) ? Order::where('status', 'completed')->sum('total') : 0.00;

        return Inertia::render('Admin/Dashboard', [
            'products' => $products,
            'categories' => $categories, // Necesario para el selector del modal en React
            'ordersCount' => $ordersCount,
            'totalSales' => $totalSales,
        ]);
    }

    // Guardar un nuevo producto en la base de datos
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'sku' => 'nullable|string|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Validación de archivo real
            'is_new' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Crear el producto principal con los campos correctos de tu BD
        $product = Product::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'sku' => $validated['sku'] ?? null,
            'is_new' => $request->boolean('is_new'),
            'is_active' => $request->boolean('is_active', true),
        ]);

        // Si se subió un archivo físico de imagen, guardarlo en storage/app/public/products
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');

            $product->images()->create([
                'image_url' => '/storage/' . $path,
                'is_primary' => true,
            ]);
        }

        return redirect()->back()->with('success', 'Producto registrado correctamente.');
    }

    // Actualizar un producto existente
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_new' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $product->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'sku' => $validated['sku'],
            'is_new' => $request->boolean('is_new'),
            'is_active' => $request->boolean('is_active'),
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');

            $product->images()->updateOrCreate(
                ['is_primary' => true],
                ['image_url' => '/storage/' . $path]
            );
        }

        return redirect()->back()->with('success', '¡Producto actualizado correctamente!');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back()->with('success', '¡Producto eliminado del sistema!');
    }
}
