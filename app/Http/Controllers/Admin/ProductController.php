<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Mostrar el panel de administración con resumen, productos, categorías y órdenes
    public function index()
    {
        $products = Product::with(['category', 'images'])->latest()->get();
        $categories = Category::withCount('products')->get();

        $orders = collect();
        $ordersCount = 0;
        $totalSales = 0.00;

        if (class_exists(Order::class) && Schema::hasTable('orders')) {
            $orders = Order::with(['user', 'items'])->orderByDesc('id')->get();
            $ordersCount = $orders->where('status', 'pending')->count();
            $totalSales = (float) $orders->where('payment_status', 'paid')->sum('total');
        }

        return Inertia::render('Admin/Dashboard', [
            'products' => $products,
            'categories' => $categories,
            'orders' => $orders,
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_new' => 'boolean',
            'is_active' => 'boolean',
        ]);

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
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
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
            'sku' => $validated['sku'] ?? null,
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

    // Actualizar estado de pago y/o entrega de una orden desde el panel admin
    public function updateOrder(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'nullable|in:pending,preparing,ready_for_pickup,completed,cancelled',
            'payment_status' => 'nullable|in:unpaid,pending,paid,failed,refunded',
            'pickup_code' => 'nullable|string|max:20',
        ]);

        if (!empty($validated['payment_status'])) {
            $order->payment_status = $validated['payment_status'];
            if ($validated['payment_status'] === 'paid' && !$order->paid_at) {
                $order->paid_at = now();
            }
        }

        if (!empty($validated['status'])) {
            $order->status = $validated['status'];
        }

        $order->save();

        return redirect()->back()->with('success', 'Orden actualizada correctamente.');
    }
}
