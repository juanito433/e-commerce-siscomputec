export default function CustomerAddressesTab({ addresses = [], onBack }) {
    return (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Direcciones de envío
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Administra tus domicilios de entrega para futuros pedidos.
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

            {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                            <p className="font-extrabold text-sm text-slate-900">{addr.street}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                {addr.city}, {addr.state} - CP {addr.zip_code}
                            </p>
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
    );
}
