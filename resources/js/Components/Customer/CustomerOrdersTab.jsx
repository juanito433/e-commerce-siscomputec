import { Link } from "@inertiajs/react";

export default function CustomerOrdersTab({ orders = [], onBack }) {
    return (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Compras y Órdenes
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Historial de pedidos realizados en Siscomputec.
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
    );
}
