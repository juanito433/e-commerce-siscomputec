import { useEffect, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";

export default function Show({
    auth,
    product,
    isFavorite = false,
    favoritesCount = 0,
    cartCount = 0,
}) {
    const user = auth?.user || null;
    const images = product?.images || [];
    const primaryImage =
        images.find((img) => img.is_primary)?.image_url ||
        images[0]?.image_url ||
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80";

    const [selectedImage, setSelectedImage] = useState(primaryImage);
    const [quantity, setQuantity] = useState(1);
    const [addedQty, setAddedQty] = useState(0);
    const [currentCartCount, setCurrentCartCount] = useState(Number(cartCount || 0));
    const [currentFavoritesCount, setCurrentFavoritesCount] = useState(Number(favoritesCount || 0));

    useEffect(() => {
        setCurrentFavoritesCount(Number(favoritesCount || 0));
    }, [favoritesCount]);

    useEffect(() => {
        setCurrentCartCount(Number(cartCount || 0));
    }, [cartCount]);

    const unitPrice = Number(product?.price || 0);
    const totalPrice = unitPrice * quantity;
    const stock = Number(product?.stock || 0);
    const inStock = stock > 0;

    const handleBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            window.history.back();
        } else {
            router.visit("/");
        }
    };

    const handleToggleFavorite = () => {
        if (!user) {
            router.visit(route("login"));
            return;
        }

        setCurrentFavoritesCount((prev) =>
            isFavorite ? Math.max(0, prev - 1) : prev + 1
        );

        router.post(
            route("favorites.toggle", product.id),
            {},
            {
                preserveScroll: true,
                onError: () => {
                    setCurrentFavoritesCount(Number(favoritesCount || 0));
                },
            }
        );
    };

    const decreaseQty = () => {
        setQuantity((q) => Math.max(1, q - 1));
    };

    const increaseQty = () => {
        setQuantity((q) => Math.min(stock, q + 1));
    };

    const handleAddToCart = () => {
        if (!user) {
            router.visit(route("login"));
            return;
        }
        if (!inStock) return;

        setAddedQty((prev) => prev + quantity);
        setCurrentCartCount((prev) => prev + quantity);
    };

    const handleBuyNow = () => {
        if (!user) {
            router.visit(route("login"));
            return;
        }
        if (!inStock) return;

        alert(
            `Compra directa: ${quantity} x ${product.name} — Total: $${totalPrice.toFixed(2)} MXN`
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white pb-32 lg:pb-16">
            <Head title={`${product.name} - Siscomputec`} />

            {/* Navbar Superior */}
            <header className="bg-white/95 backdrop-blur-md shadow-xs sticky top-0 z-40 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
                    <Link
                        href="/"
                        className="text-base sm:text-2xl font-black text-blue-700 tracking-tight flex items-center gap-2 truncate"
                    >
                        <img
                            src="/images/logo.svg"
                            alt="Siscomputec"
                            className="h-7 sm:h-9 w-auto object-contain flex-shrink-0"
                        />
                        <span className="tracking-tighter truncate">SISCOMPUTEC</span>
                    </Link>

                    {/* Derecha: Favoritos, Carrito y Nombre del Cliente */}
                    <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                        <Link
                            href={user ? "/mi-cuenta?tab=favorites" : route("login")}
                            title="Ver guardados"
                            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 border border-slate-200/80 transition"
                        >
                            <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="hidden md:inline">Favoritos</span>
                            <span className="bg-rose-100 text-rose-700 text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                {currentFavoritesCount}
                            </span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            title="Ver carrito"
                            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 transition cursor-pointer"
                        >
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="hidden md:inline">Carrito</span>
                            <span className="bg-blue-600 text-white text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                {currentCartCount}
                            </span>
                        </button>

                        {user ? (
                            <Link
                                href={route("customer.dashboard")}
                                title="Ir a tu cuenta"
                                className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-100/80 transition max-w-[115px] sm:max-w-[150px]"
                            >
                                <span className="truncate">{user.name}</span>
                                <span className="text-[11px] text-slate-400">›</span>
                            </Link>
                        ) : (
                            <Link
                                href={route("login")}
                                className="text-xs font-semibold text-slate-600 hover:text-blue-700 px-2 py-1.5 transition"
                            >
                                Ingresar
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Barra superior encima del producto: Volver / Categoría / Nombre */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-2">
                <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-1 hover:text-blue-600 font-bold text-slate-700 cursor-pointer"
                    >
                        <span>← Volver</span>
                    </button>
                    <span>/</span>
                    {product.category && (
                        <>
                            <span className="text-blue-600 font-bold">
                                {product.category.name}
                            </span>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-slate-700 font-medium truncate max-w-[200px] sm:max-w-md">
                        {product.name}
                    </span>
                </nav>
            </div>

            {/* Contenedor Principal: Móvil/Tableta (apilado + barra inferior fija) / PC (2 columnas con panel sticky) */}
            <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">

                    {/* =========================================================
                        COLUMNA IZQUIERDA (7 cols): Galería, Resumen Móvil/Tablet y Detalles
                    ========================================================= */}
                    <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
                            <div className="relative w-full h-64 sm:h-80 md:h-96 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100">
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain p-3 sm:p-4 transition-all duration-300"
                                />
                                {product.is_new && (
                                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs">
                                        NUEVO
                                    </span>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                                    {images.map((img) => {
                                        const isSelected = selectedImage === img.image_url;
                                        return (
                                            <button
                                                key={img.id}
                                                type="button"
                                                onClick={() => setSelectedImage(img.image_url)}
                                                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden flex-shrink-0 bg-slate-50 p-1 transition cursor-pointer ${
                                                    isSelected
                                                        ? "border-blue-600 ring-2 ring-blue-100"
                                                        : "border-slate-200 hover:border-slate-300"
                                                }`}
                                            >
                                                <img
                                                    src={img.image_url}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Resumen arriba del contenido en Teléfono y Tableta (< lg) */}
                        <div className="lg:hidden bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                                            {product.category?.name || "Hardware"}
                                        </span>
                                        {product.sku && (
                                            <span className="text-[11px] font-mono font-bold text-slate-400">
                                                SKU: {product.sku}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug pt-1">
                                        {product.name}
                                    </h1>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleToggleFavorite}
                                    title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
                                    aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-200 flex-shrink-0 cursor-pointer active:scale-90 ${
                                        isFavorite
                                            ? "bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-600/25"
                                            : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600"
                                    }`}
                                >
                                    <svg
                                        className="w-5 h-5"
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
                            </div>

                            <div className="flex items-baseline justify-between gap-2 pt-3 border-t border-slate-100">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                                        Precio unitario
                                    </span>
                                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                                        ${unitPrice.toFixed(2)}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 ml-1">
                                        MXN
                                    </span>
                                </div>

                                {inStock ? (
                                    <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Stock: {stock}
                                    </span>
                                ) : (
                                    <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full">
                                        Agotado
                                    </span>
                                )}
                            </div>

                            {addedQty > 0 && (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center justify-between">
                                    <span>✓ Agregaste {addedQty} {addedQty === 1 ? "unidad" : "unidades"} al carrito</span>
                                    <span className="font-black">Total carrito: {currentCartCount}</span>
                                </div>
                            )}
                        </div>

                        {/* Tarjeta de Descripción y Especificaciones */}
                        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                            <div className="border-b border-slate-100 pb-4">
                                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                                    Descripción y Especificaciones
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Información técnica detallada del producto o servicio
                                </p>
                            </div>

                            <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                                {product.description ||
                                    "Este equipo cuenta con garantía directa y soporte técnico especializado por parte de Siscomputec en Cancún."}
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                                    Ficha Técnica Rápida
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                                    <div className="bg-slate-50 rounded-2xl p-3.5 flex justify-between border border-slate-100">
                                        <span className="text-slate-500 font-semibold">Categoría</span>
                                        <span className="font-extrabold text-slate-900">
                                            {product.category?.name || "General"}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-3.5 flex justify-between border border-slate-100">
                                        <span className="text-slate-500 font-semibold">Código / SKU</span>
                                        <span className="font-mono font-extrabold text-slate-900">
                                            {product.sku || "N/A"}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-3.5 flex justify-between border border-slate-100">
                                        <span className="text-slate-500 font-semibold">Condición</span>
                                        <span className="font-extrabold text-slate-900">
                                            {product.is_new ? "Nuevo" : "Estándar"}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-3.5 flex justify-between border border-slate-100">
                                        <span className="text-slate-500 font-semibold">Disponibilidad</span>
                                        <span className={`font-extrabold ${inStock ? "text-emerald-600" : "text-rose-600"}`}>
                                            {inStock ? `${stock} unidades` : "Agotado"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                                        Respaldo y Soporte Técnico Siscomputec
                                    </h4>
                                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                        Atención personalizada en Cancún, asesoría de compatibilidad e instalación profesional disponible.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =========================================================
                        COLUMNA DERECHA (5 cols): Caja de Compra FIJA en PC (lg+)
                    ========================================================= */}
                    <aside className="hidden lg:block lg:col-span-5 lg:sticky lg:top-28 space-y-4">
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                                            {product.category?.name || "Hardware"}
                                        </span>
                                        {product.sku && (
                                            <span className="text-[11px] font-mono font-bold text-slate-400">
                                                SKU: {product.sku}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug pt-1">
                                        {product.name}
                                    </h1>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleToggleFavorite}
                                    title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
                                    aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
                                    className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-200 flex-shrink-0 cursor-pointer active:scale-90 ${
                                        isFavorite
                                            ? "bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-600/25"
                                            : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600"
                                    }`}
                                >
                                    <svg
                                        className="w-5 h-5"
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
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-3">
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                                        {quantity > 1 ? `Total (${quantity} uds.)` : "Precio de contado"}
                                    </span>
                                    <div className="flex items-baseline gap-2 mt-0.5">
                                        <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">
                                            MXN
                                        </span>
                                    </div>
                                </div>
                                {quantity > 1 && (
                                    <span className="text-xs font-semibold text-slate-400">
                                        ${unitPrice.toFixed(2)} c/u
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-600">
                                    Disponibilidad:
                                </span>
                                {inStock ? (
                                    <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        En stock ({stock} disponibles)
                                    </span>
                                ) : (
                                    <span className="text-xs font-extrabold text-rose-600">
                                        Sin existencias
                                    </span>
                                )}
                            </div>

                            {inStock && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 uppercase">
                                        Cantidad a llevar
                                    </span>
                                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={decreaseQty}
                                            className="px-3.5 py-2 text-sm font-black text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                                        >
                                            −
                                        </button>
                                        <span className="px-4 py-2 text-sm font-extrabold text-slate-900 bg-white border-x border-slate-200">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={increaseQty}
                                            className="px-3.5 py-2 text-sm font-black text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {addedQty > 0 && (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between">
                                    <span>✓ Agregaste {addedQty} {addedQty === 1 ? "unidad" : "unidades"}</span>
                                    <span className="font-black">En carrito: {currentCartCount}</span>
                                </div>
                            )}

                            <div className="space-y-2.5 pt-1">
                                <button
                                    type="button"
                                    disabled={!inStock}
                                    onClick={handleBuyNow}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-extrabold py-3.5 px-5 rounded-2xl text-sm shadow-md shadow-blue-500/20 transition cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {inStock ? `Comprar ahora · $${totalPrice.toFixed(2)}` : "Producto agotado"}
                                </button>

                                <button
                                    type="button"
                                    disabled={!inStock}
                                    onClick={handleAddToCart}
                                    className="w-full bg-blue-50 hover:bg-blue-100 disabled:bg-slate-100 text-blue-700 disabled:text-slate-400 font-extrabold py-3.5 px-5 rounded-2xl text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Agregar al carrito</span>
                                    {currentCartCount > 0 && (
                                        <span className="bg-blue-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                                            {currentCartCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                <button
                                    type="button"
                                    onClick={handleToggleFavorite}
                                    className="font-bold text-slate-600 hover:text-rose-600 transition cursor-pointer"
                                >
                                    {isFavorite
                                        ? "♥ Quitar de favoritos"
                                        : "♡ Agregar a favoritos"}
                                </button>
                                <span className="text-slate-400 font-semibold">
                                    {currentFavoritesCount} en favoritos
                                </span>
                            </div>
                        </div>
                    </aside>

                </div>
            </main>

            {/* =========================================================
                BARRA INFERIOR FIJA EN TELÉFONO Y TABLETA (< lg)
            ========================================================= */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-3 sm:px-6 py-3">
                <div className="max-w-3xl mx-auto space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                        {inStock ? (
                            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={decreaseQty}
                                    aria-label="Disminuir cantidad"
                                    className="px-2.5 py-1 text-xs font-black text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                                >
                                    −
                                </button>
                                <span className="px-3 py-1 text-xs font-extrabold text-slate-900 bg-white border-x border-slate-200">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={increaseQty}
                                    aria-label="Aumentar cantidad"
                                    className="px-2.5 py-1 text-xs font-black text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <span className="text-xs font-extrabold text-rose-600">
                                Agotado
                            </span>
                        )}

                        <div className="text-right leading-tight">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                                A pagar ({quantity} {quantity === 1 ? "ud." : "uds."})
                            </span>
                            <span className="text-base sm:text-lg font-black text-slate-900">
                                ${totalPrice.toFixed(2)} <span className="text-[11px] font-bold text-slate-400">MXN</span>
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            disabled={!inStock}
                            onClick={handleAddToCart}
                            className={`font-extrabold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
                                addedQty > 0
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                    : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
                            }`}
                        >
                            <span>
                                {addedQty > 0 ? `✓ En carrito (${currentCartCount})` : "Agregar al carrito"}
                            </span>
                        </button>

                        <button
                            type="button"
                            disabled={!inStock}
                            onClick={handleBuyNow}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-extrabold py-2.5 px-3 rounded-xl text-xs shadow-md shadow-blue-500/20 transition cursor-pointer disabled:cursor-not-allowed"
                        >
                            {inStock ? "Comprar ahora" : "Sin stock"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
