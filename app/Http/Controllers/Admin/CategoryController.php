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

        // Icono por defecto (Caja / Hardware general)
        $icon = 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';

        // 1. MONITORES / PANTALLAS / DISPLAYS
        if (str_contains($nameLower, 'monitor') || str_contains($nameLower, 'pantalla') || str_contains($nameLower, 'display') || str_contains($nameLower, 'lcd')) {
            $icon = 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
        }
        // 2. MOUSE / RATONES / INALÁMBRICOS
        elseif (str_contains($nameLower, 'mouse') || str_contains($nameLower, 'raton') || str_contains($nameLower, 'inalambrico')) {
            $icon = 'M12 3v4m0 10v4m9-9h-4M7 12H3m15.364-6.364l-2.828 2.828M7.464 16.536l-2.828 2.828m0-12.728l2.828 2.828m10.072 10.072l-2.828-2.828';
        }
        // 3. TECLADOS
        elseif (str_contains($nameLower, 'teclado') || str_contains($nameLower, 'keyboard')) {
            $icon = 'M4 7h16M4 11h16M4 15h16M6 19h12';
        }
        // 4. FUNDAS / ESTUCHES / PROTECCIÓN / MOCHILAS
        elseif (str_contains($nameLower, 'funda') || str_contains($nameLower, 'estuche') || str_contains($nameLower, 'mochila') || str_contains($nameLower, 'proteccion') || str_contains($nameLower, 'case') || str_contains($nameLower, 'micas')) {
            $icon = 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10';
        }
        // 5. COMPONENTES / PIEZAS / HARDWARE INTERNO (Tarjetas madre, procesadores, etc.)
        elseif (str_contains($nameLower, 'componente') || str_contains($nameLower, 'pieza') || str_contains($nameLower, 'tarjeta') || str_contains($nameLower, 'procesador') || str_contains($nameLower, 'motherboard') || str_contains($nameLower, 'ram')) {
            $icon = 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z';
        }
        // 6. VIDEO / TARJETAS GRÁFICAS / CAPTURADORAS / CÁMARAS DE STREAM
        elseif (str_contains($nameLower, 'video') || str_contains($nameLower, 'grafica') || str_contains($nameLower, 'gpu') || str_contains($nameLower, 'capturadora') || str_contains($nameLower, 'streaming')) {
            $icon = 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z';
        }
        // 7. ALMACENAMIENTO (Discos SSD, HDD, M.2)
        elseif (str_contains($nameLower, 'disco') || str_contains($nameLower, 'ssd') || str_contains($nameLower, 'hdd') || str_contains($nameLower, 'almacenamiento') || str_contains($nameLower, 'duro') || str_contains($nameLower, 'm.2')) {
            $icon = 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4';
        }
        // 8. MEMORIAS (USB, SD, MicroSD)
        elseif (str_contains($nameLower, 'memoria') || str_contains($nameLower, 'usb') || str_contains($nameLower, 'sd') || str_contains($nameLower, 'flash')) {
            $icon = 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
        }
        // 9. AUDIO Y AUDÍFONOS (Bocinas, micrófonos, auriculares)
        elseif (str_contains($nameLower, 'audio') || str_contains($nameLower, 'audifono') || str_contains($nameLower, 'auricular') || str_contains($nameLower, 'bocina') || str_contains($nameLower, 'microfono') || str_contains($nameLower, 'sonido')) {
            $icon = 'M15.536 11.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z';
        }
        // 10. CABLES Y ADAPTADORES (Cargadores, convertidores)
        elseif (str_contains($nameLower, 'cable') || str_contains($nameLower, 'adaptador') || str_contains($nameLower, 'cargador') || str_contains($nameLower, 'convertidor') || str_contains($nameLower, 'energia')) {
            $icon = 'M13 10V3L4 14h7v7l9-11h-7z';
        }
        // 11. REDES (Routers, antenas WiFi, switches)
        elseif (str_contains($nameLower, 'red') || str_contains($nameLower, 'router') || str_contains($nameLower, 'wifi') || str_contains($nameLower, 'switch') || str_contains($nameLower, 'antena')) {
            $icon = 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0';
        }
        // 12. IMPRESORAS Y TINTAS
        elseif (str_contains($nameLower, 'impresor') || str_contains($nameLower, 'tinta') || str_contains($nameLower, 'toner')) {
            $icon = 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z';
        }
        // ==========================================
        // NUEVAS CATEGORÍAS AÑADIDAS:
        // ==========================================
        // 13. CCTV / CAMARAS DE SEGURIDAD / DVR / NVR / VIDEOVIGILANCIA
        elseif (str_contains($nameLower, 'cctv') || str_contains($nameLower, 'camara') || str_contains($nameLower, 'dvr') || str_contains($nameLower, 'nvr') || str_contains($nameLower, 'seguridad') || str_contains($nameLower, 'vigilancia') || str_contains($nameLower, 'domo')) {
            $icon = 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z';
        }
        // 14. LAPTOPS / COMPUTADORAS / LAPTOP / PC / NOTEBOOK
        elseif (str_contains($nameLower, 'laptop') || str_contains($nameLower, 'computadora') || str_contains($nameLower, 'pc') || str_contains($nameLower, 'notebook') || str_contains($nameLower, 'desktop') || str_contains($nameLower, 'equipos')) {
            $icon = 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
        }
        // 15. HERRAMIENTAS Y TALLER (Cautines, multímetros, desarmadores, kit de reparación)
        elseif (str_contains($nameLower, 'herramienta') || str_contains($nameLower, 'cautin') || str_contains($nameLower, 'multimetro') || str_contains($nameLower, 'soldador') || str_contains($nameLower, 'taller') || str_contains($nameLower, 'kit')) {
            $icon = 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z';
        }

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'icon_url' => $icon,
        ]);

        return redirect()->back()->with('success', 'Categoría creada con icono automático.');
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
