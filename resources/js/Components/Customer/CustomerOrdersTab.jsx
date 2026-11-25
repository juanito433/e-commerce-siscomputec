import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { triggerInvoiceWhatsapp } from "@/Utils/invoiceWhatsapp";

const ORDER_STATUS_LABELS = {
    pending: "Pendiente",
    preparing: "En preparación",
    ready_for_pickup: "Listo para recoger / entregar",
    completed: "Completado",
    cancelled: "Cancelado",
};

export default function CustomerOrdersTab({ orders = [], onBack }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const [expandedOrderId, setExpandedOrderId] = useState(
        orders[0]?.id ?? null,
    );

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                        Mis Compras ({orders.length})
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Consulta desgloses, QR/códigos de entrega, reimprime tickets o solicita factura por WhatsApp.
                    </p>
                </div>

                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                        ← Volver a Mi cuenta
                    </button>
                )}
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs text-center space-y-3">
                    <p className="text-sm font-bold text-slate-800">
                        Aún no has realizado compras
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                    >
                        Ir a la tienda
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const isOpen = expandedOrderId === order.id;
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

                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                            qrPayload,
                        )}`;

                        const waCount = Number(order.invoice_whatsapp_count || 0);

                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono text-sm sm:text-base font-black text-slate-900">
                                                {order.order_number || `#${order.id}`}
                                            </span>
                                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                                {ORDER_STATUS_LABELS[order.status] ||
                                                    order.status}
                                            </span>
                                            <span
                                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                                    isCashUnpaid
                                                        ? "bg-amber-100 text-amber-900"
                                                        : "bg-emerald-50 text-emerald-700"
                                                }`}
                                            >
                                                {isCashUnpaid
                                                    ? "Pago pendiente (Efectivo)"
                                                    : "Pagado"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Código:{" "}
                                            <span className="font-mono font-bold text-slate-800">
                                                {order.pickup_code || "—"}
                                            </span>{" "}
                                            · Factura por WA:{" "}
                                            <strong className="text-slate-700">
                                                {waCount > 0 ? `${waCount} enviada(s)` : "No enviada"}
                                            </strong>
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm sm:text-base font-black text-slate-900 mr-1">
                                            ${Number(order.total || 0).toFixed(2)} MXN
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpandedOrderId(isOpen ? null : order.id)
                                            }
                                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                                        >
                                            {isOpen ? "Ocultar desglose" : "Desglosar compra"}
                                        </button>

                                        <Link
                                            href={route("orders.ticket", order.id)}
                                            className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition"
                                        >
                                            Ticket / QR
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                triggerInvoiceWhatsapp({ order, user })
                                            }
                                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                                        >
                                            Facturar por WhatsApp
                                        </button>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-start">
                                        <div className="md:col-span-8 space-y-3">
                                            {isCashUnpaid && (
                                                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950 font-semibold">
                                                    ⚠ Hace falta pagar en efectivo al momento de recoger o recibir el paquete.
                                                </div>
                                            )}

                                            <div className="rounded-2xl border border-slate-100 divide-y divide-slate-100 text-xs">
                                                {(order.items || []).map((it) => (
                                                    <div
                                                        key={it.id}
                                                        className="p-3 flex items-center justify-between gap-2"
                                                    >
                                                        <div>
                                                            <p className="font-semibold text-slate-900">
                                                                {it.quantity}× {it.product_name}
                                                            </p>
                                                            <p className="text-[11px] text-slate-400">
                                                                ${Number(it.unit_price || 0).toFixed(2)} c/u
                                                            </p>
                                                        </div>
                                                        <span className="font-bold text-slate-900">
                                                            ${Number(it.line_total || 0).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="rounded-2xl bg-slate-50 p-3.5 space-y-1 text-xs">
                                                <div className="flex justify-between text-slate-600">
                                                    <span>Subtotal</span>
                                                    <span>${Number(order.subtotal || 0).toFixed(2)} MXN</span>
                                                </div>
                                                <div className="flex justify-between text-slate-600">
                                                    <span>IVA</span>
                                                    <span>${Number(order.tax_amount || 0).toFixed(2)} MXN</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                                                    <span>Total</span>
                                                    <span>${Number(order.total || 0).toFixed(2)} MXN</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-4 rounded-2xl bg-slate-50 border border-slate-200/70 p-4 flex flex-col items-center text-center space-y-1.5">
                                            <img
                                                src={qrUrl}
                                                alt={`QR ${order.order_number || order.id}`}
                                                className="w-28 h-28 rounded-xl border border-slate-200 bg-white p-1"
                                            />
                                            <span className="text-xs font-mono font-bold text-slate-900">
                                                {order.pickup_code || "—"}
                                            </span>
                                            <span className="text-[11px] text-slate-500">
                                                Presenta este QR o código al recoger/recibir
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
