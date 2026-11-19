import { useEffect, useState } from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";

export default function CustomerDashboard({
    auth,
    orders = [],
    favorites = [],
    addresses = [],
    reviews = [],
}) {
    const { flash } = usePage().props;
    const user = auth?.user || {};

    const validTabs = [
        "overview",
        "profile",
        "security",
        "addresses",
        "orders",
        "favorites",
        "reviews",
    ];

    const getInitialTab = () => {
        if (typeof window === "undefined") return "overview";
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        return validTabs.includes(tab) ? tab : "overview";
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        setActiveTab(getInitialTab());
    }, []);

    const selectTab = (tab) => {
        setActiveTab(tab);
        setMobileNavOpen(false);
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("tab", tab);
            window.history.replaceState({}, "", url.toString());
        }
    };

    // Iniciales del usuario para el avatar
    const initials = `${user.name?.[0] || "C"}${user.last_name?.[0] || ""}`.toUpperCase();

    // Formulario de Perfil
    const profileForm = useForm({
        name: user.name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.patch(route("customer.profile.update"), {
            preserveScroll: true,
        });
    };

    // Formulario de Seguridad (Cambio de contraseña estándar de Laravel Breeze)
    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handleLogout = () => {
        router.post(route("logout"));
    };

    // Tarjetas de acceso rápido en la pantalla "Resumen" (estilo Mercado Libre)
    const overviewCards = [
        {
            id: "profile",
            title: "Información de tu perfil",
            description: "Datos personales, nombre completo y teléfono de contacto.",
            badge: !user.phone ? "Completa tu teléfono" : null,
            icon: (
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
            ),
        },
        {
            id: "security",
            title: "Seguridad",
            description: "Actualiza tu contraseña y protege el acceso a tu cuenta.",
            badge: null,
            icon: (
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
        },
        {
            id: "orders",
            title: "Mis compras y órdenes",
            description: "Consulta el historial de pedidos y estatus de entrega.",
            badge: orders.length > 0 ? `${orders.length} registradas` : null,
            icon: (
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
        },
        {
            id: "addresses",
            title: "Direcciones",
            description: "Direcciones de envío guardadas para tus pedidos.",
            badge: addresses.length === 0 ? "Sin dirección" : null,
            icon: (
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            id: "favorites",
            title: "Favoritos y guardados",
            description: "Equipos, refacciones y accesorios que te interesan.",
            badge: favorites.length > 0 ? `${favorites.length} ítems` : null,
            icon: (
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
        },
        {
            id: "reviews",
            title: "Opiniones y reseñas",
            description: "Calificaciones y comentarios en productos comprados.",
            badge: null,
            icon: (
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
        },
    ];

    const sidebarItems = [
        {
            id: "overview",
            label: "Mi cuenta",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            ),
        },
        {
            id: "orders",
            label: "Compras",
            count: orders.length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
        },
        {
            id: "favorites",
            label: "Favoritos",
            count: favorites.length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
        },
        {
            id: "reviews",
            label: "Opiniones",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
        },
        {
            id: "addresses",
            label: "Direcciones",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            id: "profile",
            label: "Datos personales",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            id: "security",
            label: "Seguridad",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col">
            <Head title="Mi Cuenta - Siscomputec" />

            {/* Navbar Superior */}
            <header className="bg-white/95 backdrop-blur-md shadow-xs sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {/* Botón menú lateral en móvil */}
                        <button
                            type="button"
                            onClick={() => setMobileNavOpen((prev) => !prev)}
                            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
                            aria-label="Abrir menú de cuenta"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Link
                            href="/"
                            className="text-lg sm:text-2xl font-black text-blue-700 tracking-tight flex items-center gap-2"
                        >
                            <img
                                src="/images/logo.svg"
                                alt="Siscomputec"
                                className="h-8 sm:h-10 w-auto object-contain"
                            />
                            <span className="tracking-tighter">SISCOMPUTEC</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {user.role === "admin" && (
                            <Link
                                href={route("admin.dashboard")}
                                className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition"
                            >
                                Panel Admin
                            </Link>
                        )}
                        <Link
                            href="/"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Volver a la Tienda</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Contenedor Principal con Sidebar estilo Mercado Libre */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8">

                {/* SIDEBAR LATERAL */}
                <aside
                    className={`w-full lg:w-64 flex-shrink-0 ${
                        mobileNavOpen ? "block" : "hidden lg:block"
                    }`}
                >
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden lg:sticky lg:top-28">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <span className="font-black text-sm text-slate-900 tracking-tight">
                                Mi cuenta
                            </span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                {user.role === "admin" ? "Admin" : "Cliente"}
                            </span>
                        </div>

                        <nav className="py-2">
                            {sidebarItems.map((item) => {
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => selectTab(item.id)}
                                        className={`w-full flex items-center justify-between px-5 py-3 text-sm transition cursor-pointer relative ${
                                            isActive
                                                ? "text-blue-700 font-extrabold bg-blue-50/70"
                                                : "text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                    >
                                        {isActive && (
                                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r-full" />
                                        )}
                                        <span className="flex items-center gap-3">
                                            <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                                                {item.icon}
                                            </span>
                                            <span>{item.label}</span>
                                        </span>
                                        {typeof item.count === "number" && item.count > 0 && (
                                            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                                                {item.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Botón Cerrar Sesión dedicado al final del menú lateral */}
                        <div className="border-t border-slate-100 p-3">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* ÁREA DE CONTENIDO DERECHA */}
                <main className="flex-1 min-w-0 space-y-6">
                    {flash?.success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between">
                            <span>{flash.success}</span>
                        </div>
                    )}

                    {/* =========================================================
                        VISTA 0: RESUMEN GENERAL (ESTILO MERCADO LIBRE)
                    ========================================================= */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* Cabecera con Avatar y Correo */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-600 to-slate-900 text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-md flex-shrink-0">
                                        {initials}
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                            {user.name} {user.last_name || ""}
                                        </h1>
                                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                            {user.email}
                                        </p>
                                        {user.phone && (
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Tel: {user.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => selectTab("profile")}
                                    className="self-start sm:self-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                                >
                                    Editar datos
                                </button>
                            </div>

                            {/* Banner informativo (si falta teléfono) */}
                            {!user.phone && (
                                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 border-l-4 border-l-blue-600 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-extrabold text-slate-800">
                                                Agrega tu teléfono de contacto para coordinar tus entregas
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Facilita el seguimiento de pedidos y soporte técnico en Cancún.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => selectTab("profile")}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs whitespace-nowrap transition cursor-pointer"
                                    >
                                        Agregar teléfono
                                    </button>
                                </div>
                            )}

                            {/* Grid de Tarjetas estilo Mercado Libre */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                                {overviewCards.map((card) => (
                                    <button
                                        key={card.id}
                                        type="button"
                                        onClick={() => selectTab(card.id)}
                                        className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition text-left flex flex-col justify-between gap-4 cursor-pointer group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="w-11 h-11 rounded-2xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition">
                                                {card.icon}
                                            </div>
                                            {card.badge && (
                                                <span className="text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                                    {card.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                                                {card.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                {card.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* =========================================================
                        VISTA 1: INFORMACIÓN DE TU PERFIL
                    ========================================================= */}
                    {activeTab === "profile" && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">
                                        Información de tu perfil
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Actualiza tus datos personales y teléfono de contacto.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => selectTab("overview")}
                                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                                >
                                    ← Volver a Mi cuenta
                                </button>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-2xl">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                            Nombre(s)
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData("name", e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                            required
                                        />
                                        {profileForm.errors.name && (
                                            <span className="text-xs font-bold text-rose-500 mt-1 block">
                                                {profileForm.errors.name}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                            Apellido(s)
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.data.last_name}
                                            onChange={(e) => profileForm.setData("last_name", e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        />
                                        {profileForm.errors.last_name && (
                                            <span className="text-xs font-bold text-rose-500 mt-1 block">
                                                {profileForm.errors.last_name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                            Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            disabled
                                            value={user.email || ""}
                                            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                            Teléfono de Contacto
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ej. 9981234567"
                                            value={profileForm.data.phone}
                                            onChange={(e) => profileForm.setData("phone", e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        />
                                        {profileForm.errors.phone && (
                                            <span className="text-xs font-bold text-rose-500 mt-1 block">
                                                {profileForm.errors.phone}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={profileForm.processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* =========================================================
                        VISTA 2: SEGURIDAD Y CONTRASEÑA
                    ========================================================= */}
                    {activeTab === "security" && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">
                                        Seguridad de la cuenta
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Cambia tu contraseña periódicamente para mantener tu cuenta protegida.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => selectTab("overview")}
                                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                                >
                                    ← Volver a Mi cuenta
                                </button>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                        Contraseña Actual
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData("current_password", e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        required
                                    />
                                    {passwordForm.errors.current_password && (
                                        <span className="text-xs font-bold text-rose-500 mt-1 block">
                                            {passwordForm.errors.current_password}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                        Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData("password", e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        required
                                    />
                                    {passwordForm.errors.password && (
                                        <span className="text-xs font-bold text-rose-500 mt-1 block">
                                            {passwordForm.errors.password}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData("password_confirmation", e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
                                    >
                                        Actualizar Contraseña
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* =========================================================
                        VISTA 3: COMPRAS Y ÓRDENES
                    ========================================================= */}
                    {activeTab === "orders" && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">
                                        Compras y Órdenes
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Historial de pedidos realizados en Siscomputec.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => selectTab("overview")}
                                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                                >
                                    ← Volver a Mi cuenta
                                </button>
                            </div>

                            {orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
                                        >
                                            <div>
                                                <span className="text-xs font-mono font-bold text-blue-600">
                                                    Orden #{order.id}
                                                </span>
                                                <p className="text-base font-black text-slate-900 mt-0.5">
                                                    ${Number(order.total || 0).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Estado: <span className="font-bold capitalize">{order.status || "Pendiente"}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-extrabold text-slate-800">
                                        Aún no tienes compras registradas
                                    </h3>
                                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                        Cuando realices tu primer pedido desde el catálogo, aparecerá aquí con su seguimiento.
                                    </p>
                                    <Link
                                        href="/"
                                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
                                    >
                                        Explorar Productos
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* =========================================================
                        VISTA 4: DIRECCIONES DE ENVÍO
                    ========================================================= */}
                    {activeTab === "addresses" && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">
                                        Direcciones de envío
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Administra tus domicilios de entrega para futuros pedidos.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => selectTab("overview")}
                                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                                >
                                    ← Volver a Mi cuenta
                                </button>
                            </div>

                            {addresses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                                            <p className="font-extrabold text-sm text-slate-900">{addr.street}</p>
                                            <p className="text-xs text-slate-500 mt-1">{addr.city}, {addr.state} - CP {addr.zip_code}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-extrabold text-slate-800">
                                        No tienes direcciones guardadas
                                    </h3>
                                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                        Podrás guardar tus direcciones de entrega al realizar un pedido o cuando activemos el módulo de direcciones.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* =========================================================
                        VISTA 5: FAVORITOS Y GUARDADOS
                    ========================================================= */}
                    {activeTab === "favorites" && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">
                                        Favoritos y Guardados
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Productos que marcaste con Me Gusta en el catálogo.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => selectTab("overview")}
                                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
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
                    )}

                    {/* =========================================================
                        VISTA 6: OPINIONES Y RESEÑAS
                    ========================================================= */}
                    {activeTab === "reviews" && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">
                                        Opiniones y Reseñas
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Tus valoraciones sobre los productos adquiridos.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => selectTab("overview")}
                                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                                >
                                    ← Volver a Mi cuenta
                                </button>
                            </div>

                            {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map((rev) => (
                                        <div key={rev.id} className="border border-slate-200 rounded-2xl p-4">
                                            <p className="text-sm font-bold text-slate-900">{rev.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-amber-500 flex items-center justify-center mx-auto font-black text-lg">
                                        ★
                                    </div>
                                    <h3 className="text-sm font-extrabold text-slate-800">
                                        No has publicado opiniones todavía
                                    </h3>
                                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                        Después de recibir tus compras podrás calificar los equipos y ayudar a otros clientes.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
