import { useEffect, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import CustomerOverviewTab from "../../Components/Customer/CustomerOverviewTab";
import CustomerProfileTab from "../../Components/Customer/CustomerProfileTab";
import CustomerSecurityTab from "../../Components/Customer/CustomerSecurityTab";
import CustomerOrdersTab from "../../Components/Customer/CustomerOrdersTab";
import CustomerAddressesTab from "../../Components/Customer/CustomerAddressesTab";
import CustomerFavoritesTab from "../../Components/Customer/CustomerFavoritesTab";
import CustomerReviewsTab from "../../Components/Customer/CustomerReviewsTab";
import CustomerCartTab from "../../Components/Customer/CustomerCartTab";
import CustomerBillingTab from "../../Components/Customer/CustomerBillingTab";
import AnimatedCardManager from "@/Components/Customer/AnimatedCardManager";

export default function CustomerDashboard({
    auth,
    orders = [],
    favorites = [],
    addresses = [],
    reviews = [],
    cartItems = [],
    cards = [],
}) {
    const { flash } = usePage().props;
    const user = auth?.user || {};
    const cartCount = cartItems.reduce(
        (acc, item) => acc + Number(item.quantity || 0),
        0,
    );
    const validTabs = [
        "overview",
        "profile",
        "security",
        "addresses",
        "orders",
        "favorites",
        "reviews",
        "cart",
        "cards",
        "billing",
    ];

    const getInitialTab = () => {
        if (typeof window === "undefined") return "overview";
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        if (tab && validTabs.includes(tab)) return tab;
        if (
            window.location.hash === "#tarjetas" ||
            params.get("from_checkout") === "1"
        ) {
            return "cards";
        }
        return "overview";
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        setActiveTab(getInitialTab());
    }, []);

    useEffect(() => {
        if (!mobileNavOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setMobileNavOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [mobileNavOpen]);

    const selectTab = (tab) => {
        setActiveTab(tab);
        setMobileNavOpen(false);
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("tab", tab);
            window.history.replaceState({}, "", url.toString());
        }
    };

    const initials =
        `${user.name?.[0] || "C"}${user.last_name?.[0] || ""}`.toUpperCase();

    const handleLogout = () => {
        router.post(route("logout"));
    };

    const navItems = [
        {
            id: "overview",
            label: "Mi cuenta",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            ),
        },
        {
            id: "cart",
            label: "Carrito",
            count: cartCount,
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            ),
        },
        {
            id: "orders",
            label: "Compras",
            count: orders.length,
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                </svg>
            ),
        },
        {
            id: "cards",
            label: "Tarjetas",
            count: cards.length,
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                </svg>
            ),
        },
        {
            id: "billing",
            label: "Facturación",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            ),
        },
        {
            id: "favorites",
            label: "Favoritos",
            count: favorites.length,
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            ),
        },
        {
            id: "reviews",
            label: "Opiniones",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            ),
        },
        {
            id: "addresses",
            label: "Direcciones",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            ),
        },
        {
            id: "profile",
            label: "Datos personales",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            ),
        },
        {
            id: "security",
            label: "Seguridad",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col">
            <Head title="Mi Cuenta - Siscomputec" />

            <header className="bg-white/95 backdrop-blur-md shadow-xs sticky top-0 z-30 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <button
                            type="button"
                            onClick={() => setMobileNavOpen((prev) => !prev)}
                            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer flex-shrink-0"
                            aria-label="Abrir menú de cuenta"
                            aria-expanded={mobileNavOpen}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <Link
                            href="/"
                            className="text-base sm:text-2xl font-black text-blue-700 tracking-tight flex items-center gap-2 truncate"
                        >
                            <img
                                src="/images/logo.svg"
                                alt="Siscomputec"
                                className="h-7 sm:h-10 w-auto object-contain flex-shrink-0"
                            />
                            <span className="tracking-tighter truncate">
                                SISCOMPUTEC
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {user.role === "admin" && (
                            <Link
                                href={route("admin.dashboard")}
                                className="hidden md:inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition"
                            >
                                Panel Admin
                            </Link>
                        )}
                        <Link
                            href="/"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 whitespace-nowrap"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            <span>Volver a la Tienda</span>
                        </Link>
                    </div>
                </div>
            </header>

            {mobileNavOpen && (
                <div
                    onClick={() => setMobileNavOpen(false)}
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
                    aria-hidden="true"
                />
            )}

            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8">
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[82vw] bg-white border-r border-slate-200 shadow-2xl transform transition-transform duration-300 ease-out lg:static lg:inset-auto lg:z-auto lg:w-64 lg:max-w-none lg:bg-transparent lg:border-0 lg:shadow-none lg:transform-none lg:flex-shrink-0 ${
                        mobileNavOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }`}
                >
                    <div className="h-full overflow-y-auto lg:h-auto lg:overflow-visible lg:bg-white lg:rounded-3xl lg:border lg:border-slate-200 lg:shadow-xs lg:sticky lg:top-28 flex flex-col justify-between">
                        <div>
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <span className="font-black text-sm text-slate-900 tracking-tight">
                                    Mi cuenta
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                        {user.role === "admin"
                                            ? "Admin"
                                            : "Cliente"}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setMobileNavOpen(false)}
                                        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                                        aria-label="Cerrar menú"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <nav className="py-2">
                                {navItems.map((item) => {
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
                                                <span
                                                    className={
                                                        isActive
                                                            ? "text-blue-600"
                                                            : "text-slate-400"
                                                    }
                                                >
                                                    {item.icon}
                                                </span>
                                                <span>{item.label}</span>
                                            </span>
                                            {typeof item.count === "number" &&
                                                item.count > 0 && (
                                                    <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                                                        {item.count}
                                                    </span>
                                                )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="border-t border-slate-100 p-3">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 min-w-0 space-y-6">
                    {flash?.success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold">
                            {flash.success}
                        </div>
                    )}

                    {activeTab === "overview" && (
                        <CustomerOverviewTab
                            user={user}
                            initials={initials}
                            ordersCount={orders.length}
                            addressesCount={addresses.length}
                            favoritesCount={favorites.length}
                            onSelectTab={selectTab}
                        />
                    )}

                    {activeTab === "profile" && (
                        <CustomerProfileTab
                            user={user}
                            onBack={() => selectTab("overview")}
                        />
                    )}

                    {activeTab === "security" && (
                        <CustomerSecurityTab
                            onBack={() => selectTab("overview")}
                        />
                    )}

                    {activeTab === "cart" && (
                        <CustomerCartTab
                            items={cartItems}
                            onBack={() => selectTab("overview")}
                        />
                    )}

                    {activeTab === "orders" && (
                        <CustomerOrdersTab
                            orders={orders}
                            onBack={() => selectTab("overview")}
                        />
                    )}

                    {activeTab === "cards" && (
                        <AnimatedCardManager cards={cards} />
                    )}

                    {activeTab === "billing" && (
                        <CustomerBillingTab
                            user={user}
                            onBack={() => selectTab("overview")}
                        />
                    )}

                    {activeTab === "addresses" && (
                        <CustomerAddressesTab
                            addresses={addresses}
                            onBack={() => selectTab("overview")}
                        />
                    )}

                    {activeTab === "favorites" && (
                        <CustomerFavoritesTab
                            favorites={favorites}
                            onBack={() => selectTab("overview")}
                        />
                    )}

                    {activeTab === "reviews" && (
                        <CustomerReviewsTab
                            reviews={reviews}
                            onBack={() => selectTab("overview")}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
