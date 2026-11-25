import { useMemo, useState } from "react";
import OrderDetailModal from "./OrderDetailModal";

const ORDER_STATUS_LABELS = {
    pending: "Pendiente",
    preparing: "En preparación",
    ready_for_pickup: "Listo para recoger / entregar",
    completed: "Completado",
    cancelled: "Cancelado",
};

const PAYMENT_STATUS_LABELS = {
    unpaid: "Por pagar",
    pending: "Pago pendiente",
    paid: "Pagado",
    failed: "Fallido",
    refunded: "Reembolsado",
};

export default function OrdersTab({
    orders = [],
    selectedOrder,
    setSelectedOrder,
    codeInputs,
    setCodeInputs,
    codeFeedback,
    onConfirmPayment,
    onConfirmDelivery,
}) {
    const [folioOrClientQuery, setFolioOrClientQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [orderFilter, setOrderFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");

    const filteredOrders = useMemo(() => {
        const q = folioOrClientQuery.trim().toLowerCase();

        return orders.filter((ord) => {
            if (orderFilter !== "all" && ord.status !== orderFilter) return false;
            if (paymentFilter !== "all" && ord.payment_status !== paymentFilter) return false;

            if (dateFilter) {
                const rawDate = String(ord.created_at || "");
                if (!rawDate.startsWith(dateFilter)) return false;
            }

            if (q) {
                const folioMatch = String(ord.order_number || ord.id || "")
                    .toLowerCase()
                    .includes(q);
                const clientMatch = String(ord.user?.name || "")
                    .toLowerCase()
                    .includes(q);
                const codeMatch = String(ord.pickup_code || "")
                    .toLowerCase()
                    .includes(q);
                if (!folioMatch && !clientMatch && !codeMatch) return false;
            }

            return true;
        });
    }, [orders, folioOrClientQuery, dateFilter, orderFilter, paymentFilter]);

    const activeDetailOrder = useMemo(() => {
        if (!selectedOrder) return null;
        return orders.find((o) => o.id === selectedOrder.id) || selectedOrder;
    }, [orders, selectedOrder]);

    return (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5">
            {/* Barra de filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                    type="text"
                    value={folioOrClientQuery}
                    onChange={(e) => setFolioOrClientQuery(e.target.value)}
                    placeholder="Buscar folio, cliente o código..."
                    className="rounded-xl bg-slate-50 border-slate-200 text-xs focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                />

                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="rounded-xl bg-slate-50 border-slate-200 text-xs focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                />

                <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="rounded-xl bg-slate-50 border-slate-200 text-xs focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                >
                    <option value="all">Estado: Todas las órdenes</option>
                    <option value="pending">Pendientes</option>
                    <option value="preparing">En preparación</option>
                    <option value="ready_for_pickup">Listas para entrega</option>
                    <option value="completed">Completadas</option>
                    <option value="cancelled">Canceladas</option>
                </select>

                <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="rounded-xl bg-slate-50 border-slate-200 text-xs focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                >
                    <option value="all">Pago: Todos</option>
                    <option value="paid">Pagados</option>
                    <option value="unpaid">Por pagar</option>
                    <option value="pending">Pago pendiente</option>
                </select>
            </div>

            {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const fb = codeFeedback[order.id];
                        return (
                            <div
                                key={order.id}
                                className="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 sm:p-5 space-y-4"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900 font-mono">
                                                {order.order_number || `#${order.id}`}
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                                {ORDER_STATUS_LABELS[order.status] || order.status}
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                {PAYMENT_STATUS_LABELS[order.payment_status] ||
                                                    order.payment_status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Cliente:{" "}
                                            <strong className="text-slate-700">
                                                {order.user?.name || "Cliente"}
                                            </strong>{" "}
                                            · Código:{" "}
                                            <span className="font-mono font-semibold text-slate-800">
                                                {order.pickup_code || "—"}
                                            </span>
                                            {order.requires_invoice && (
                                                <span className="ml-2 text-blue-700 font-semibold">
                                                    · CFDI 4.0 ({order.billing_data?.rfc})
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-3">
                                        <div className="text-left md:text-right">
                                            <span className="text-xs text-slate-400 block">
                                                Total (IVA incl.)
                                            </span>
                                            <span className="text-base font-bold text-slate-900">
                                                ${Number(order.total || 0).toFixed(2)} MXN
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedOrder(order)}
                                            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
                                        >
                                            Ver desglose / Ticket
                                        </button>
                                    </div>
                                </div>

                                {order.status !== "completed" && order.status !== "cancelled" && (
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <input
                                                type="text"
                                                maxLength={40}
                                                placeholder="Código corto o QR"
                                                value={codeInputs[order.id] || ""}
                                                onChange={(e) =>
                                                    setCodeInputs((prev) => ({
                                                        ...prev,
                                                        [order.id]: e.target.value.toUpperCase(),
                                                    }))
                                                }
                                                className="rounded-xl bg-white border-slate-200 text-xs font-mono uppercase w-48 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => onConfirmDelivery(order)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
                                            >
                                                Confirmar entrega
                                            </button>
                                        </div>

                                        {fb && (
                                            <span
                                                className={`text-xs font-semibold ${
                                                    fb.ok ? "text-blue-700" : "text-rose-600"
                                                }`}
                                            >
                                                {fb.text}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center space-y-1">
                    <p className="text-sm font-semibold text-slate-800">
                        No hay órdenes con esos filtros
                    </p>
                    <p className="text-xs text-slate-500">
                        Ajusta el folio, fecha o estado para consultar compras anteriores.
                    </p>
                </div>
            )}

            <OrderDetailModal
                order={activeDetailOrder}
                onClose={() => setSelectedOrder(null)}
                codeInput={activeDetailOrder ? codeInputs[activeDetailOrder.id] || "" : ""}
                onCodeInputChange={(val) =>
                    activeDetailOrder &&
                    setCodeInputs((prev) => ({ ...prev, [activeDetailOrder.id]: val }))
                }
                feedback={activeDetailOrder ? codeFeedback[activeDetailOrder.id] : null}
                onConfirmPayment={onConfirmPayment}
                onConfirmDelivery={onConfirmDelivery}
            />
        </section>
    );
}
