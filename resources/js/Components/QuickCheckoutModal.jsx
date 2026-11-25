import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import CustomerOrderTicketModal from "./CustomerOrderTicketModal";

export default function QuickCheckoutModal({
    open,
    onClose,
    directProduct = null, // { id, name, price, sku } cuando viene de un producto
    quantity = 1,
    cartItems = [], // cuando viene del carrito
    cartTotal = 0,
}) {
    const { flash } = usePage().props;
    const [ticketOrder, setTicketOrder] = useState(null);

    const form = useForm({
        payment_method: "cash", // "cash" | "card"
        delivery_method: "pickup", // "pickup" | "local_delivery"
        direct_product_id: directProduct?.id ?? null,
        quantity: quantity ?? 1,
        requires_invoice: false,
        billing_data: { rfc: "", business_name: "" },
        accepted_policies: true,
    });

    useEffect(() => {
        form.setData({
            payment_method: form.data.payment_method || "cash",
            delivery_method: form.data.delivery_method || "pickup",
            direct_product_id: directProduct?.id ?? null,
            quantity: Math.max(1, Number(quantity || 1)),
            requires_invoice: false,
            billing_data: { rfc: "", business_name: "" },
            accepted_policies: true,
        });
    }, [directProduct, quantity, open]);

    useEffect(() => {
        if (flash?.created_order) {
            setTicketOrder(flash.created_order);
            onClose?.();
        }
    }, [flash?.created_order]);

    const computedTotal = directProduct
        ? Number(directProduct.price || 0) * Math.max(1, Number(quantity || 1))
        : Number(cartTotal || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route("orders.store"), {
            preserveScroll: true,
        });
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/55 backdrop-blur-2xs"
                    />

                    <form
                        onSubmit={handleSubmit}
                        className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[92vh] overflow-y-auto"
                    >
                        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                                    Siscomputec · Confirmar compra
                                </span>
                                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                                    {directProduct
                                        ? `${Math.max(1, Number(quantity || 1))}× ${directProduct.name}`
                                        : `Carrito (${cartItems.length} ${
                                              cartItems.length === 1 ? "artículo" : "artículos"
                                          })`}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {Object.keys(form.errors).length > 0 && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs space-y-1">
                                {Object.values(form.errors).map((err, idx) => (
                                    <p key={idx} className="font-semibold">
                                        {err}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Método de pago */}
                        <div className="space-y-2">
                            <span className="block text-xs font-semibold text-slate-700">
                                ¿Cómo deseas pagar? *
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => form.setData("payment_method", "cash")}
                                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                                        form.data.payment_method === "cash"
                                            ? "border-blue-600 bg-blue-50/80 text-blue-950 font-semibold"
                                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    <span className="block font-bold">Efectivo</span>
                                    <span className="text-[11px] text-slate-500">
                                        Se marca pendiente hasta pagar al recoger o recibir
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => form.setData("payment_method", "card")}
                                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                                        form.data.payment_method === "card"
                                            ? "border-blue-600 bg-blue-50/80 text-blue-950 font-semibold"
                                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    <span className="block font-bold">
                                        Tarjeta de débito o crédito
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                        Confirmación inmediata de pago en orden
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Modalidad de entrega */}
                        <div className="space-y-2">
                            <span className="block text-xs font-semibold text-slate-700">
                                Modalidad de entrega *
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => form.setData("delivery_method", "pickup")}
                                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                                        form.data.delivery_method === "pickup"
                                            ? "border-blue-600 bg-blue-50/80 text-blue-950 font-semibold"
                                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    <span className="block font-bold">Recolección en sucursal</span>
                                    <span className="text-[11px] text-slate-500">
                                        Presentas código corto o QR
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => form.setData("delivery_method", "local_delivery")}
                                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                                        form.data.delivery_method === "local_delivery"
                                            ? "border-blue-600 bg-blue-50/80 text-blue-950 font-semibold"
                                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    <span className="block font-bold">Envío local en Cancún</span>
                                    <span className="text-[11px] text-slate-500">
                                        Entrega a domicilio con código/QR
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600">
                                Total a pagar (IVA incl.)
                            </span>
                            <span className="text-base font-bold text-slate-900">
                                ${computedTotal.toFixed(2)} MXN
                            </span>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 cursor-pointer"
                            >
                                {form.processing ? "Generando ticket..." : "Confirmar y ver ticket"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <CustomerOrderTicketModal
                order={ticketOrder}
                onClose={() => setTicketOrder(null)}
            />
        </>
    );
}
