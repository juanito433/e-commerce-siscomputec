export default function CustomerOrderTicketModal({ order, onClose }) {
    if (!order) return null;

    const isCashUnpaid =
        order.payment_status !== "paid" &&
        (order.payment_provider?.startsWith("cash") || order.payment_status === "unpaid");

    const qrData = JSON.stringify({
        folio: order.order_number || order.id,
        code: order.pickup_code || "",
        total: Number(order.total || 0).toFixed(2),
        payment_status: order.payment_status,
    });

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        qrData
    )}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:static">
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-2xs print:hidden"
            />

            <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-0">
                {/* Encabezado */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                            Siscomputec · Ticket de Compra
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                            {order.order_number || `Orden #${order.id}`}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Entrega:{" "}
                            <strong className="text-slate-800">
                                {order.delivery_method === "local_delivery"
                                    ? "Envío local a domicilio (Cancún)"
                                    : "Recolección en sucursal"}
                            </strong>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
                        >
                            Imprimir / Descargar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar ticket"
                            className="px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Aviso remarcado cuando el pago es en efectivo y está pendiente */}
                {isCashUnpaid ? (
                    <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-amber-950 space-y-1">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-amber-800">
                            ⚠ NO PAGADO · PAGO EN EFECTIVO PENDIENTE
                        </p>
                        <p className="text-xs font-medium leading-relaxed">
                            Elegiste pagar en <strong>efectivo</strong>. Este ticket{" "}
                            <strong>aún no está pagado</strong>: hace falta realizar el pago en efectivo
                            por <strong>${Number(order.total || 0).toFixed(2)} MXN</strong> al momento
                            de {order.delivery_method === "local_delivery" ? "que te entreguen el paquete" : "recoger tu pedido"}.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-emerald-900 text-xs font-semibold">
                        ✓ Pagado con tarjeta (${Number(order.total || 0).toFixed(2)} MXN)
                    </div>
                )}

                {/* Código corto + QR */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-50 rounded-2xl border border-slate-200/80 p-4">
                    <div className="sm:col-span-8 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-700">
                            Código de validación para entrega
                        </p>
                        <p className="text-xs text-slate-500">
                            Muéstralo en mostrador o al repartidor junto con tu QR:
                        </p>
                        <div className="pt-1">
                            <span className="font-mono text-base font-bold tracking-wider text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-300 inline-block">
                                {order.pickup_code || "—"}
                            </span>
                        </div>
                    </div>

                    <div className="sm:col-span-4 flex flex-col items-center justify-center">
                        <img
                            src={qrUrl}
                            alt={`QR ${order.order_number || order.id}`}
                            className="w-28 h-28 rounded-xl border border-slate-200 bg-white p-1"
                        />
                        <span className="text-[10px] font-mono text-slate-400 mt-1">
                            QR de Orden
                        </span>
                    </div>
                </div>

                {/* Desglose de productos */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Detalle de la compra
                    </h4>
                    <div className="rounded-2xl border border-slate-200/80 divide-y divide-slate-100 text-xs">
                        {(order.items || []).map((item, idx) => (
                            <div
                                key={item.id || idx}
                                className="p-3 flex items-center justify-between gap-3"
                            >
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {item.quantity}× {item.product_name}
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Unitario: ${Number(item.unit_price || 0).toFixed(2)} MXN
                                    </p>
                                </div>
                                <span className="font-bold text-slate-900">
                                    ${Number(item.line_total || 0).toFixed(2)} MXN
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totales */}
                <div className="bg-slate-50/80 rounded-2xl p-4 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>${Number(order.subtotal || 0).toFixed(2)} MXN</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>IVA</span>
                        <span>${Number(order.tax_amount || 0).toFixed(2)} MXN</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                        <span>Total a pagar / pagado</span>
                        <span>${Number(order.total || 0).toFixed(2)} MXN</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
