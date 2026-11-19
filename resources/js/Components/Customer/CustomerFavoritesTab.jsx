import { Link } from "@inertiajs/react";

export default function CustomerFavoritesTab({ favorites = [], onBack }) {
    return (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Favoritos y Guardados
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Productos que marcaste con Me Gusta en el catálogo.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onBack}
                    className="self-start sm:self-auto text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                    ← Volver a Mi cuenta
                </button>
            </div>

            {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {favorites.map((item) => {
                        const img =
                            item.images?.find((i) => i.is_primary)?.image_url ||
                            item.images?.[0]?.image_url;
                        return (
                            <Link
                                key={item.id}
                                href={route("products.show", item.id)}
                                className="border border-slate-200 rounded-2xl p-4 hover:shadow-md transition flex flex-col justify-between bg-white"
                            >
                                <div>
                                    <div className="h-36 bg-slate-50 rounded-xl overflow-hidden mb-3">
                                        <img
                                            src={img || "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1">
                                        {item.name}
                                    </h4>
                                    {item.sku && (
                                        <span className="text-[11px] font-mono text-slate-400">
                                            SKU: {item.sku}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-sm font-black text-slate-900">
                                        ${Number(item.price || 0).toFixed(2)}
                                    </span>
                                    <span className="text-xs font-bold text-blue-600">
                                        Ver producto →
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-rose-500 flex items-center justify-center mx-auto font-black text-lg">
                        ♥
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800">
                        Aún no tienes favoritos guardados
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Guarda cámaras, refacciones o accesorios para encontrarlos rápido cuando los necesites.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
                    >
                        Ir al Catálogo
                    </Link>
                </div>
            )}
        </div>
    );
}
