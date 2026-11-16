export default function ProductTable({ products, categories, onEdit, onDelete, onOpenCreate, searchQuery, setSearchQuery }) {
    const filteredProducts = (products || []).filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre o SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-80 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 rounded-xl py-2.5 px-4 text-xs sm:text-sm"
                />
                <button
                    onClick={onOpenCreate}
                    className="w-full sm:w-auto bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-blue-700 transition shadow-md shadow-blue-500/20 cursor-pointer whitespace-nowrap"
                >
                    + Nuevo Producto / Servicio
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-200">
                            <th className="p-4">SKU / Ítem</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4">Precio ($)</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => {
                                const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url;
                                return (
                                    <tr key={product.id} className="hover:bg-slate-50 transition">
                                        <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                                            <img
                                                src={primaryImage || 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=100&q=80'}
                                                alt=""
                                                className="w-12 h-12 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                                            />
                                            <div>
                                                <p className="line-clamp-1 text-slate-900 font-bold">{product.name}</p>
                                                {/* SKU MUCHO MÁS VISIBLE Y DESTACADO */}
                                                <span className="inline-block mt-1 font-mono text-xs font-black tracking-wider bg-slate-100 text-blue-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                                                    SKU: {product.sku || 'N/D'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-700 font-semibold">{product.category?.name || 'General'}</td>
                                        <td className="p-4 font-black text-slate-900">${Number(product.price).toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${product.stock > 3 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                                {product.stock} un.
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${product.is_active ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {product.is_active ? 'Activo' : 'Oculto'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="text-slate-700 font-bold text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5 rounded-lg transition cursor-pointer"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => onDelete(product.id)}
                                                className="text-rose-600 font-bold text-xs bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-16 text-slate-400">
                                    {(categories || []).length === 0 ? (
                                        <span>⚠️ Aún no hay categorías registradas. Crea una categoría primero.</span>
                                    ) : (
                                        <span>No hay productos registrados en este filtro.</span>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
