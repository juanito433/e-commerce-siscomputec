<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $nameLower = mb_strtolower($validated['name']);
        $icon = 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';

        if (str_contains($nameLower, 'red') || str_contains($nameLower, 'cctv') || str_contains($nameLower, 'camara') || str_contains($nameLower, 'seguridad')) {
            $icon = 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z';
        } elseif (str_contains($nameLower, 'impresor') || str_contains($nameLower, 'renta') || str_contains($nameLower, 'tinta')) {
            $icon = 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z';
        } elseif (str_contains($nameLower, 'laptop') || str_contains($nameLower, 'comput') || str_contains($nameLower, 'gamer') || str_contains($nameLower, 'procesador')) {
            $icon = 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z';
        }

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'icon_url' => $icon,
        ]);

        return redirect()->back()->with('success', 'Categoría creada correctamente.');
    }

    // NUEVO: Actualizar categoría existente
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->back()->with('success', 'Categoría actualizada correctamente.');
    }

    // NUEVO: Eliminar categoría con validación de seguridad
    public function destroy(Category $category)
    {
        if ($category->products()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'No puedes eliminar una categoría que tiene productos o servicios activos. Reasigna o borra los ítems primero.']);
        }

        $category->delete();

        return redirect()->back()->with('success', 'Categoría eliminada correctamente.');
    }
}
