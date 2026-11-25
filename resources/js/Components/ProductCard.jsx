import { Link, router } from "@inertiajs/react";

const NEW_BADGE_MAX_DAYS = 14;

function resolveIsNew(isNew, createdAt) {
    if (!isNew) return false;
    if (!createdAt) return true;

    const createdTime = new Date(createdAt).getTime();
    if (Number.isNaN(createdTime)) return true;

    const ageInDays = (Date.now() - createdTime) / (1000 * 60 * 60 * 24);
    return ageInDays <= NEW_BADGE_MAX_DAYS;
}

export default function ProductCard({
    id,
    name,
    category,
    price,
    sku,
    stock = 1,
    createdAt = null,
    imageUrl,
    isNew = false,
    isFavorite = false,
    delay = 0,
}) {
    const numericPrice = Number(price || 0);
    const numericStock = Number(stock ?? 1);
    const isOutOfStock = numericStock <= 0;
    const showNew = resolveIsNew(isNew, createdAt);

    const displayImage =
        imageUrl ||
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80";

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(
            route("favorites.toggle", id),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <article
            style={{ animationDelay: `${delay}ms` }}
            className={`group rounded-2xl sm:rounded-3xl border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                isOutOfStock
                    ? "bg-slate-50/90 border-rose-200/90"
                    : "bg-white border-slate-200/80 hover:border-blue-300"
            }`}
        >
            <div>
                <Link
                    href={route("products.show", id)}
                    className="relative block h-44 sm:h-52 bg-slate-50 overflow-hidden border-b border-slate-100 p-4"
                >
                    <img
                        src={displayImage}
                        alt={name}
                        className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 ${
                            isOutOfStock ? "opacity-65 grayscale-[30%]" : ""
                        }`}
                    />

                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                        {showNew && !isOutOfStock && (
                            <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                                Nuevo
                            </span>
                        )}

                        {isOutOfStock && (
                            <span className="bg-rose-50 border border-rose-300 text-rose-900 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                                ✕ Agotado · Sin stock
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleToggleFavorite}
                        title={
                            isFavorite
                                ? "Quitar de favoritos"
                                : "Guardar en favoritos"
                        }
                        aria-label={
                            isFavorite
                                ? "Quitar de favoritos"
                                : "Guardar en favoritos"
                        }
                        className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center border transition cursor-pointer active:scale-90 ${
                            isFavorite
                                ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                                : "bg-white/95 border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200"
                        }`}
                    >
                        <svg
                            className="w-4 h-4"
                            fill={isFavorite ? "currentColor" : "none"}
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
                </Link>

                <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full truncate">
                            {category || "General"}
                        </span>
                        {sku && (
                            <span className="text-[11px] font-mono font-semibold text-slate-400 truncate">
                                SKU: {sku}
                            </span>
                        )}
                    </div>

                    <Link
                        href={route("products.show", id)}
                        className="block text-sm sm:text-base font-extrabold text-slate-900 hover:text-blue-700 transition line-clamp-2 leading-snug"
                    >
                        {name}
                    </Link>
                </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                    <span className="text-base sm:text-lg font-black text-slate-900">
                        ${numericPrice.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 ml-1">
                        MXN
                    </span>
                </div>

                {isOutOfStock ? (
                    <Link
                        href={route("products.show", id)}
                        className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-extrabold hover:bg-rose-100 transition"
                    >
                        Ver detalle
                    </Link>
                ) : (
                    <Link
                        href={route("products.show", id)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition shadow-xs"
                    >
                        Ver producto
                    </Link>
                )}
            </div>
        </article>
    );
}
