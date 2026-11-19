export default function CustomerOverviewTab({
    user,
    initials,
    ordersCount,
    addressesCount,
    favoritesCount,
    onSelectTab,
}) {
    const cards = [
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
            badge: ordersCount > 0 ? `${ordersCount} registradas` : null,
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
            badge: addressesCount === 0 ? "Sin dirección" : null,
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
            badge: favoritesCount > 0 ? `${favoritesCount} ítems` : null,
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

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-600 to-slate-900 text-white flex items-center justify-center text-lg sm:text-2xl font-black shadow-md flex-shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                            {user.name} {user.last_name || ""}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
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
                    onClick={() => onSelectTab("profile")}
                    className="w-full sm:w-auto text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                    Editar datos
                </button>
            </div>

            {!user.phone && (
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 border-l-4 border-l-blue-600 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-extrabold text-slate-800">
                                Agrega tu teléfono de contacto para coordinar tus entregas
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Facilita el seguimiento de pedidos y soporte técnico.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onSelectTab("profile")}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs whitespace-nowrap transition cursor-pointer"
                    >
                        Agregar teléfono
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {cards.map((card) => (
                    <button
                        key={card.id}
                        type="button"
                        onClick={() => onSelectTab(card.id)}
                        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition text-left flex flex-col justify-between gap-4 cursor-pointer group"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="w-11 h-11 rounded-2xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition flex-shrink-0">
                                {card.icon}
                            </div>
                            {card.badge && (
                                <span className="text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
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
    );
}
