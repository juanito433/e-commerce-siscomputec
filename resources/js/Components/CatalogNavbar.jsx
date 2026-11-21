import { useEffect, useRef, useState } from "react";
import { Link, router } from "@inertiajs/react";

export default function CatalogNavbar({
    user,
    searchQuery = "",
    onSearchChange,
    favoritesCount = 0,
    cartCount = 0,
    location = {
        status: "idle",
        city: "Cancún",
        postalCode: "77500",
        inCancun: true,
    },
    onRefreshLocation,
    onOpenNotificationsPreview,
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dismissedWarning, setDismissedWarning] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        const handleEsc = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [menuOpen]);

    const handleLogout = () => {
        setMenuOpen(false);
        router.post(route("logout"));
    };

    const handleReCheckLocation = () => {
        setDismissedWarning(false);
        onRefreshLocation?.();
    };

    const userInitial = (user?.name || "U").charAt(0).toUpperCase();
    const isLoadingLoc = location.status === "loading";
    const showOutOfZoneBanner =
        !dismissedWarning &&
        location.status !== "idle" &&
        location.status !== "loading" &&
        !location.inCancun;

    return (
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/90">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Fila principal */}
                <div className="h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
                    {/* Izquierda: Logo + Ubicación real */}
                    <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                        <Link
                            href="/"
                            className="text-base sm:text-xl font-black text-blue-700 tracking-tight flex items-center gap-2 flex-shrink-0"
                        >
                            <img
                                src="/images/logo.svg"
                                alt="Siscomputec"
                                className="h-7 sm:h-9 w-auto object-contain"
                            />
                            <span className="tracking-tighter">SISCOMPUTEC</span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleReCheckLocation}
                            title="Actualizar ubicación actual"
                            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-left transition cursor-pointer ${
                                location.inCancun
                                    ? "bg-slate-50 hover:bg-blue-50/70 border-slate-200/80"
                                    : "bg-amber-50/80 hover:bg-amber-100/70 border-amber-300"
                            }`}
                        >
                            <svg
                                className={`w-4 h-4 flex-shrink-0 ${
                                    location.inCancun ? "text-blue-600" : "text-amber-600"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <div className="leading-tight max-w-[140px]">
                                <span className="text-[10px] font-medium text-slate-500 block truncate">
                                    {isLoadingLoc ? "Detectando..." : location.city}
                                </span>
                                <span className="text-xs font-extrabold text-slate-800 font-mono">
                                    {isLoadingLoc
                                        ? "GPS..."
                                        : location.postalCode && location.postalCode !== "—"
                                        ? `CP ${location.postalCode}`
                                        : "Verificar"}
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Centro: Buscador en Tablet y Escritorio (md+) */}
                    <div className="hidden md:block flex-1 max-w-lg mx-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                placeholder="Buscar por nombre, descripción o SKU..."
                                className="w-full rounded-2xl bg-slate-100/90 border border-slate-200/60 focus:border-blue-600 focus:bg-white pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/15 transition"
                            />
                            {searchQuery ? (
                                <button
                                    type="button"
                                    onClick={() => onSearchChange?.("")}
                                    aria-label="Limpiar búsqueda"
                                    className="w-6 h-6 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 flex items-center justify-center absolute right-2.5 top-1/2 -translate-y-1/2 text-xs cursor-pointer"
                                >
                                    ✕
                                </button>
                            ) : (
                                <svg
                                    className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Derecha: Iconos unificados + Menú de Usuario */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <Link
                            href={user ? "/mi-cuenta?tab=favorites" : route("login")}
                            title="Mis favoritos"
                            aria-label="Mis favoritos"
                            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200/80 bg-white hover:bg-blue-50 hover:border-blue-200 text-slate-600 hover:text-blue-700 flex items-center justify-center transition"
                        >
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {favoritesCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-slate-800 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                                    {favoritesCount}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            onClick={onOpenNotificationsPreview}
                            title="Notificaciones"
                            aria-label="Notificaciones"
                            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200/80 bg-white hover:bg-blue-50 hover:border-blue-200 text-slate-600 hover:text-blue-700 flex items-center justify-center transition cursor-pointer"
                        >
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-white" />
                        </button>

                        <Link
                            href={user ? "/mi-cuenta?tab=cart" : route("login")}
                            title="Mi carrito"
                            aria-label="Mi carrito"
                            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200/80 bg-white hover:bg-blue-50 hover:border-blue-200 text-slate-600 hover:text-blue-700 flex items-center justify-center transition"
                        >
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    aria-expanded={menuOpen}
                                    className={`h-9 sm:h-10 pl-1.5 pr-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition cursor-pointer ${
                                        menuOpen
                                            ? "border-blue-600 bg-blue-50/60 text-blue-700"
                                            : "border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700"
                                    }`}
                                >
                                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-700 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">
                                        {userInitial}
                                    </span>
                                    <span className="hidden sm:inline max-w-[105px] truncate">
                                        {user.name}
                                    </span>
                                    <svg
                                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                            menuOpen ? "rotate-180 text-blue-600" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-xl border border-slate-200/90 py-2 z-50 overflow-hidden">
                                        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
                                            <p className="text-xs font-extrabold text-slate-900 truncate">
                                                {user.name} {user.last_name || ""}
                                            </p>
                                            <p className="text-[11px] text-slate-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div className="py-1.5">
                                            <Link
                                                href={route("customer.dashboard")}
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                            >
                                                <span>Mi Cuenta</span>
                                            </Link>
                                            <Link
                                                href="/mi-cuenta?tab=orders"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                            >
                                                <span>Mis Pedidos</span>
                                            </Link>
                                            <Link
                                                href="/mi-cuenta?tab=cart"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                            >
                                                <span>Mi Carrito</span>
                                                {cartCount > 0 && (
                                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                                                        {cartCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <Link
                                                href="/mi-cuenta?tab=favorites"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                            >
                                                <span>Favoritos</span>
                                                {favoritesCount > 0 && (
                                                    <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                                                        {favoritesCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <Link
                                                href="/mi-cuenta?tab=profile"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                            >
                                                <span>Ajustes de cuenta</span>
                                            </Link>
                                        </div>

                                        <div className="pt-1 border-t border-slate-100">
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                            >
                                                <span>Cerrar sesión</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href={route("login")}
                                className="h-9 sm:h-10 px-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center transition"
                            >
                                Ingresar
                            </Link>
                        )}
                    </div>
                </div>

                {/* Buscador completo en móvil (< md) */}
                <div className="md:hidden pb-3">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            placeholder="Buscar productos, modelos o SKU..."
                            className="w-full rounded-xl bg-slate-100/90 border border-slate-200/70 focus:border-blue-600 focus:bg-white pl-3.5 pr-9 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/15 transition"
                        />
                        {searchQuery ? (
                            <button
                                type="button"
                                onClick={() => onSearchChange?.("")}
                                aria-label="Limpiar búsqueda"
                                className="w-6 h-6 rounded-full text-slate-400 hover:text-slate-700 flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 text-xs cursor-pointer"
                            >
                                ✕
                            </button>
                        ) : (
                            <svg
                                className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>

            {/* Franja informativa base */}
            <div className="bg-slate-50 border-t border-slate-100 px-3 sm:px-6 lg:px-8 py-1.5">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px] text-slate-600">
                    <span className="truncate">
                        Compra en línea · <strong className="text-slate-800">Recolección en sucursal (Cancún)</strong> · Envíos locales sujetos a disponibilidad
                    </span>
                    <button
                        type="button"
                        onClick={handleReCheckLocation}
                        className="lg:hidden font-mono font-bold text-blue-700 flex-shrink-0 cursor-pointer"
                    >
                        {isLoadingLoc
                            ? "GPS..."
                            : location.postalCode && location.postalCode !== "—"
                            ? `${location.city} · CP ${location.postalCode}`
                            : "Verificar ubicación"}
                    </button>
                </div>
            </div>

            {/* Advertencia automática si está fuera de Cancún o sin permiso de GPS */}
            {showOutOfZoneBanner && (
                <div className="bg-amber-50 border-t border-amber-200 px-3 sm:px-6 lg:px-8 py-2.5">
                    <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-2.5 text-xs text-amber-900">
                            <svg
                                className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <span>
                                {location.status === "denied" ? (
                                    <>
                                        No pudimos verificar tu ubicación.{" "}
                                        <strong>Te recomendamos realizar tu compra únicamente si te encuentras dentro de Cancún</strong>, ya que las entregas son por recolección en sucursal o envío local.
                                    </>
                                ) : (
                                    <>
                                        Detectamos que accedes desde <strong>{location.city}</strong>.{" "}
                                        <strong>Cualquier compra en línea solo se recomienda si estás dentro de Cancún</strong>, ya que los pedidos se entregan en nuestro local o mediante envío local sujeto a disponibilidad.
                                    </>
                                )}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                type="button"
                                onClick={handleReCheckLocation}
                                className="text-[11px] font-extrabold text-amber-800 underline hover:text-amber-950 cursor-pointer"
                            >
                                Reintentar
                            </button>
                            <button
                                type="button"
                                onClick={() => setDismissedWarning(true)}
                                aria-label="Cerrar aviso"
                                className="text-amber-700 hover:text-amber-950 p-1 rounded-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
