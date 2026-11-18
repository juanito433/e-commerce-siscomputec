import { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ProductModal({ isOpen, onClose, form, onSubmit, categories, isEditing }) {

    // Autoseleccionar la primera categoría si el formulario no tiene una asignada y hay categorías disponibles
    useEffect(() => {
        if (isOpen && !form.data.category_id && categories && categories.length > 0) {
            form.setData('category_id', categories[0].id);
        }
    }, [isOpen, categories]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                    <h2 className="text-lg font-black text-slate-900">
                        {isEditing ? 'Editar Producto o Servicio' : 'Registrar Producto o Servicio'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer">✕</button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Comercial</label>
                            <input
                                type="text"
                                value={form.data.name}
                                onChange={e => form.setData('name', e.target.value)}
                                placeholder="Ej. Kit Cámaras Hikvision"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {form.errors.name && <span className="text-rose-500 text-xs mt-1 block">{form.errors.name}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoría</label>
                            <select
                                value={form.data.category_id}
                                onChange={e => form.setData('category_id', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                required
                            >
                                <option value="">Selecciona una categoría...</option>
                                {(categories || []).length > 0 ? (
                                    categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))
                                ) : (
                                    <option value="" disabled>Crea una categoría primero</option>
                                )}
                            </select>
                            {form.errors.category_id && <span className="text-rose-500 text-xs mt-1 block">{form.errors.category_id}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">SKU / Código</label>
                            <input
                                type="text"
                                value={form.data.sku}
                                onChange={e => form.setData('sku', e.target.value)}
                                placeholder="SRV-001"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono font-bold"
                                required
                            />
                            {form.errors.sku && <span className="text-rose-500 text-xs mt-1 block">{form.errors.sku}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Precio ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.data.price}
                                onChange={e => form.setData('price', e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stock / Unidades</label>
                            <input
                                type="number"
                                value={form.data.stock}
                                onChange={e => form.setData('stock', e.target.value)}
                                placeholder="10"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fotografía del Ítem</label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={e => form.setData('image', e.target.files[0])}
                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer bg-slate-50 border border-slate-200 rounded-xl"
                        />
                        {form.errors.image && <span className="text-rose-500 text-xs mt-1 block">{form.errors.image}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descripción</label>
                        <textarea
                            rows="3"
                            value={form.data.description}
                            onChange={e => form.setData('description', e.target.value)}
                            placeholder="Especificaciones o condiciones del servicio..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                            <input
                                type="checkbox"
                                checked={form.data.is_new}
                                onChange={e => form.setData('is_new', e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 w-4 h-4"
                            />
                            Marcar como Novedad
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={e => form.setData('is_active', e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 w-4 h-4"
                            />
                            Visible en Tienda
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                        >
                            {isEditing ? 'Actualizar Cambios' : 'Guardar Ítem'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
