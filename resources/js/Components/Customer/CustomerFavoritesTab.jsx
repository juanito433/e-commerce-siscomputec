import { Link, router } from "@inertiajs/react";

export default function CustomerFavoritesTab({ favorites = [], onBack }) {
    const handleRemoveFavorite = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();

        router.post(
            route("favorites.toggle", productId),
            {},
            { preserveScroll: true }
        );
    };

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
                            <div
                                key={item.id}
                                className="border border-slate-200 rounded-2xl p-4 hover:shadow-md transition flex flex-col justify-between bg-white relative group"
                            >
                                <button
                                    type="button"
                                    onClick={(e) => handleRemoveFavorite(e, item.id)}
                                    title="Quitar de favoritos"
                                    aria-label="Quitar de favoritos"
                                    className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 ring-2 ring-white flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2.2"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </button>

                                <Link href={route("products.show", item.id)} className="block">
                                    <div className="h-36 bg-slate-50 rounded-xl overflow-hidden mb-3">
                                        <img
                                            src={
                                                img ||
                                                "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80"
                                            }
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                    <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
                                        {item.name}
                                    </h4>
                                    {item.sku && (
                                        <span className="text-[11px] font-mono text-slate-400">
                                            SKU: {item.sku}
                                        </span>
                                    )}
                                </Link>

                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-sm font-black text-slate-900">
                                        ${Number(item.price || 0).toFixed(2)}
                                    </span>
                                    <Link
                                        href={route("products.show", item.id)}
                                        className="text-xs font-bold text-blue-600 hover:underline"
                                    >
                                        Ver producto →
                                    </Link>
                                </div>
                            </div>
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
