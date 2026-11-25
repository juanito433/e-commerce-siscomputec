import { Head, Link } from "@inertiajs/react";

const WHATSAPP_BILLING_NUMBER = "529321027425"; // Cambia por el WhatsApp de facturación de Siscomputec

export default function OrderTicket({ order }) {
    const isCashUnpaid =
        order.payment_status !== "paid" &&
        (String(order.payment_provider || "").startsWith("cash") ||
            order.payment_status === "unpaid");

    const qrPayload = JSON.stringify({
        folio: order.order_number || order.id,
        code: order.pickup_code || "",
        total: Number(order.total || 0).toFixed(2),
        payment_status: order.payment_status,
    });

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
        qrPayload
    )}`;

    const itemsLines = (order.items || [])
        .map((it) => `- ${it.quantity}x ${it.product_name}: $${Number(it.line_total || 0).toFixed(2)} MXN`)
        .join("\n");

    const invoiceText = [
        `Hola Siscomputec, necesito facturar mi compra:`,
        `Folio: ${order.order_number || order.id}`,
        `Código de orden: ${order.pickup_code || "-"}`,
        `Total: $${Number(order.total || 0).toFixed(2)} MXN`,
        itemsLines ? `Detalle:\n${itemsLines}` : "",
        order.billing_data?.rfc ? `RFC: ${order.billing_data.rfc}` : "",
        order.billing_data?.business_name
            ? `Razón social: ${order.billing_data.business_name}`
            : "",
    ]
        .filter(Boolean)
        .join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_BILLING_NUMBER}?text=${encodeURIComponent(
        invoiceText
    )}`;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 print:bg-white print:p-0">
            <Head title={`Ticket ${order.order_number || order.id} · Siscomputec`} />

            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print:shadow-none print:border-0">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                            Siscomputec · Ticket de Compra
                        </span>
                        <h1 className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                            {order.order_number || `Orden #${order.id}`}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Entrega:{" "}
                            <strong className="text-slate-800">
                                {order.delivery_method === "local_delivery"
                                    ? "Envío local en Cancún"
                                    : "Recolección en sucursal"}
                            </strong>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 print:hidden">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
                        >
                            Imprimir / Descargar
                        </button>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition"
                        >
                            Facturar por WhatsApp
                        </a>
                    </div>
                </div>

                {/* Aviso remarcado para pago en efectivo */}
                {isCashUnpaid ? (
                    <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-amber-950 space-y-1">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-amber-800">
                            ⚠ NO PAGADO · PAGO EN EFECTIVO PENDIENTE
                        </p>
                        <p className="text-xs leading-relaxed">
                            Seleccionaste <strong>Efectivo</strong>. Este ticket{" "}
                            <strong>aún no se ha pagado</strong>: hace falta pagar{" "}
                            <strong>${Number(order.total || 0).toFixed(2)} MXN</strong> en efectivo
                            al momento de{" "}
                            {order.delivery_method === "local_delivery"
                                ? "que te entreguen el paquete"
                                : "recoger tu pedido"}.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900">
                        ✓ Compra registrada con tarjeta (modo prueba) · Total: $
                        {Number(order.total || 0).toFixed(2)} MXN
                    </div>
                )}

                {/* QR + Código corto */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                    <div className="sm:col-span-8 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-700">
                            Código corto y QR de verificación
                        </p>
                        <p className="text-xs text-slate-500">
                            Muestra este código o QR para acreditar la compra y recoger o recibir el paquete:
                        </p>
                        <div className="pt-1">
                            <span className="font-mono text-base font-bold tracking-wider bg-white text-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-300 inline-block">
                                {order.pickup_code || "—"}
                            </span>
                        </div>
                    </div>

                    <div className="sm:col-span-4 flex flex-col items-center">
                        <img
                            src={qrUrl}
                            alt={`QR ${order.order_number || order.id}`}
                            className="w-32 h-32 rounded-xl border border-slate-200 bg-white p-1"
                        />
                        <span className="text-[10px] font-mono text-slate-400 mt-1">
                            QR de Orden
                        </span>
                    </div>
                </div>

                {/* Desglose completo */}
                <div className="space-y-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Desglose de artículos
                    </h2>
                    <div className="rounded-2xl border border-slate-200/80 divide-y divide-slate-100 text-xs">
                        {(order.items || []).map((it) => (
                            <div
                                key={it.id}
                                className="p-3.5 flex items-center justify-between gap-3"
                            >
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {it.quantity}× {it.product_name}
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-mono">
                                        SKU: {it.product_sku || "—"} · Unitario: $
                                        {Number(it.unit_price || 0).toFixed(2)} MXN
                                    </p>
                                </div>
                                <span className="font-bold text-slate-900">
                                    ${Number(it.line_total || 0).toFixed(2)} MXN
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subtotal, IVA y Total */}
                <div className="rounded-2xl bg-slate-50 p-4 space-y-1.5 text-xs">
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

                <div className="flex items-center justify-between pt-2 print:hidden">
                    <Link
                        href={route("customer.dashboard")}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                        Ver mis pedidos en Mi Cuenta →
                    </Link>
                    <Link
                        href="/"
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        </div>
    );
}
