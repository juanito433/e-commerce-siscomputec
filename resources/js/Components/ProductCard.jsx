import { Link, router, usePage } from "@inertiajs/react";

export default function ProductCard({
    id,
    name,
    category,
    price,
    sku,
    imageUrl,
    isNew,
    isFavorite = false,
}) {
    const { auth } = usePage().props;

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            router.visit(route("login"));
            return;
        }

        router.post(
            route("favorites.toggle", id),
            {},
            { preserveScroll: true }
        );
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-4 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between relative">
            <button
                type="button"
                onClick={handleToggleFavorite}
                title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
                aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
                className={`absolute top-6 right-6 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${
                    isFavorite
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-white"
                        : "bg-slate-900/70 backdrop-blur-xs text-white hover:bg-rose-600 shadow-md ring-2 ring-white/90"
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

            <Link href={route("products.show", id)} className="block">
                <div className="relative w-full h-44 bg-slate-50 rounded-2xl overflow-hidden mb-3 flex items-center justify-center">
                    <img
                        src={imageUrl || "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80"}
                        alt={name}
                        className="object-cover h-full w-full group-hover:scale-105 transition duration-300"
                    />
                    {isNew && (
                        <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                            NUEVO
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-blue-600 font-extrabold uppercase tracking-wider">
                        {category}
                    </span>
                    {sku && (
                        <span className="font-mono text-slate-400 font-bold">
                            SKU: {sku}
                        </span>
                    )}
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                    {name}
                </h3>
            </Link>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Precio
                    </span>
                    <span className="text-lg font-black text-slate-900">
                        ${Number(price).toFixed(2)}
                    </span>
                </div>
                <Link
                    href={route("products.show", id)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                >
                    Ver detalle →
                </Link>
            </div>
        </div>
    );
}
