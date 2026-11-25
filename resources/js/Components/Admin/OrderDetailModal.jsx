export default function OrderDetailModal({
    order,
    onClose,
    codeInput,
    onCodeInputChange,
    feedback,
    onConfirmPayment,
    onConfirmDelivery,
}) {
    if (!order) return null;

    const qrPayload = JSON.stringify({
        folio: order.order_number || order.id,
        code: order.pickup_code || "",
        total: Number(order.total || 0).toFixed(2),
    });

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
        qrPayload
    )}`;

    const handlePrintTicket = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:static">
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs print:hidden"
            />

            <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-5 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-0">
                {/* Encabezado */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                            Siscomputec · Ticket y Desglose de Orden
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                            {order.order_number || `Orden #${order.id}`}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Cliente: <strong className="text-slate-800">{order.user?.name || "Cliente"}</strong>{" "}
                            {order.user?.email ? `(${order.user.email})` : ""}
                        </p>
                        {order.created_at && (
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                Fecha: {String(order.created_at).slice(0, 16).replace("T", " ")}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                        <button
                            type="button"
                            onClick={handlePrintTicket}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
                        >
                            Imprimir / Descargar Ticket
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar modal"
                            className="px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Código de recolección + QR */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-50 rounded-2xl border border-slate-200/80 p-4">
                    <div className="sm:col-span-8 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-700">
                            Autenticación de entrega (Código corto / QR)
                        </p>
                        <p className="text-xs text-slate-500">
                            Modalidad:{" "}
                            <strong className="text-slate-800">
                                {order.delivery_method === "local_delivery"
                                    ? "Envío local Cancún"
                                    : "Recolección en mostrador"}
                            </strong>
                        </p>
                        <p className="text-xs text-slate-500">
                            Código de entrega:{" "}
                            <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                {order.pickup_code || "SIN CÓDIGO"}
                            </span>
                        </p>
                        {order.requires_invoice && (
                            <p className="text-xs text-blue-700 font-semibold pt-1">
                                Factura CFDI 4.0 requerida · RFC: {order.billing_data?.rfc || "N/A"}
                            </p>
                        )}
                    </div>

                    <div className="sm:col-span-4 flex flex-col items-center justify-center">
                        <img
                            src={qrUrl}
                            alt={`QR ${order.order_number || order.id}`}
                            className="w-28 h-28 rounded-xl border border-slate-200 bg-white p-1"
                        />
                        <span className="text-[10px] font-mono text-slate-400 mt-1">
                            QR Verificación
                        </span>
                    </div>
                </div>

                {/* Desglose de productos / servicios */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Desglose de artículos
                    </h4>
                    <div className="rounded-2xl border border-slate-200/80 divide-y divide-slate-100 text-xs">
                        {(order.items || []).map((it) => (
                            <div
                                key={it.id}
                                className="p-3 flex items-center justify-between gap-3"
                            >
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {it.quantity}× {it.product_name}
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-mono">
                                        SKU: {it.product_sku || "—"} · Unitario: $
                                        {Number(it.unit_price || 0).toFixed(2)}
                                    </p>
                                </div>
                                <span className="font-bold text-slate-900">
                                    ${Number(it.line_total || 0).toFixed(2)} MXN
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
                        <span>Total</span>
                        <span>${Number(order.total || 0).toFixed(2)} MXN</span>
                    </div>
                </div>

                {/* Acciones operativas: Confirmar pago y Confirmar entrega */}
                <div className="space-y-3 pt-2 border-t border-slate-200 print:hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-700">
                            Estado de pago:{" "}
                            <span
                                className={
                                    order.payment_status === "paid"
                                        ? "text-emerald-700"
                                        : "text-amber-700"
                                }
                            >
                                {order.payment_status === "paid" ? "Pagado" : "Pendiente / Por cobrar"}
                            </span>
                        </span>

                        {order.payment_status !== "paid" && (
                            <button
                                type="button"
                                onClick={() => onConfirmPayment(order)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
                            >
                                Confirmar pago recibido
                            </button>
                        )}
                    </div>

                    {order.status !== "completed" && order.status !== "cancelled" && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <input
                                type="text"
                                maxLength={40}
                                placeholder="Código corto o texto escaneado del QR"
                                value={codeInput || ""}
                                onChange={(e) => onCodeInputChange(e.target.value.toUpperCase())}
                                className="flex-1 rounded-xl bg-slate-50 border-slate-200 text-xs font-mono uppercase focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                            />
                            <button
                                type="button"
                                onClick={() => onConfirmDelivery(order)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                            >
                                Autenticar y confirmar entrega
                            </button>
                        </div>
                    )}

                    {feedback && (
                        <p
                            className={`text-xs font-semibold ${
                                feedback.ok ? "text-blue-700" : "text-rose-600"
                            }`}
                        >
                            {feedback.text}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
