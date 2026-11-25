import { useEffect, useMemo, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";

const PENDING_CHECKOUT_KEY = "siscomputec_pending_checkout";

export default function CheckoutIndex({
    auth,
    directProduct = null,
    quantity = 1,
    cartItems = [],
    cards = [],
}) {
    const [pendingBanner, setPendingBanner] = useState(null);

    const itemsSummary = useMemo(() => {
        if (directProduct) {
            const qty = Math.max(1, Number(quantity || 1));
            const unit = Number(directProduct.price || 0);
            return [
                {
                    id: directProduct.id,
                    name: directProduct.name,
                    sku: directProduct.sku,
                    quantity: qty,
                    unit_price: unit,
                    line_total: unit * qty,
                },
            ];
        }

        return cartItems.map((it) => ({
            id: it.product?.id || it.product_id,
            name: it.product?.name || "Producto",
            sku: it.product?.sku || "",
            quantity: Number(it.quantity || 1),
            unit_price: Number(it.product?.price || 0),
            line_total: Number(it.product?.price || 0) * Number(it.quantity || 1),
        }));
    }, [directProduct, quantity, cartItems]);

    const totalAmount = useMemo(
        () => itemsSummary.reduce((acc, row) => acc + Number(row.line_total || 0), 0),
        [itemsSummary],
    );

    const defaultCardId = cards.find((c) => c.is_default)?.id || cards[0]?.id || "";

    const form = useForm({
        payment_method: cards.length > 0 ? "card" : "cash",
        payment_card_id: defaultCardId,
        delivery_method: "pickup",
        direct_product_id: directProduct?.id ?? null,
        quantity: Math.max(1, Number(quantity || 1)),
        requires_invoice: false,
        billing_data: {
            rfc: "",
            business_name: "",
            regime: "",
            cfdi_use: "G03",
        },
        accepted_policies: true,
    });

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(PENDING_CHECKOUT_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed?.returnedFromCards) {
                    setPendingBanner(parsed);
                    if (cards.length > 0) {
                        form.setData("payment_method", "card");
                        form.setData("payment_card_id", cards[0].id);
                    }
                    sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
                }
            }
        } catch {
            // Ignorar errores de storage
        }
    }, [cards.length]);

    const goToAddCardInCustomerPanel = () => {
        try {
            sessionStorage.setItem(
                PENDING_CHECKOUT_KEY,
                JSON.stringify({
                    returnedFromCards: true,
                    directProductId: directProduct?.id ?? null,
                    quantity: Math.max(1, Number(quantity || 1)),
                    itemsSummary,
                    totalAmount,
                }),
            );
        } catch {
            // Ignorar
        }

        router.visit(
            route("customer.dashboard", {
                from_checkout: 1,
                tab: "cards",
                product_id: directProduct?.id ?? "",
                quantity: Math.max(1, Number(quantity || 1)),
            }) + "#tarjetas",
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.data.payment_method === "card" && cards.length === 0) {
            goToAddCardInCustomerPanel();
            return;
        }

        form.post(route("orders.store"), {
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
            <Head title="Finalizar compra · Siscomputec" />

            <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Siscomputec · Proceso de compra
                    </span>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                        Confirmación de pedido
                    </h1>
                </div>
                <Link
                    href="/"
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                    ← Seguir comprando
                </Link>
            </header>

            <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
                {pendingBanner && (
                    <div className="rounded-2xl border-2 border-blue-600 bg-blue-50/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-blue-800">
                                Continúa tu compra pendiente
                            </p>
                            <p className="text-xs text-blue-950">
                                Tienes listo tu pedido por{" "}
                                <strong>
                                    ${Number(pendingBanner.totalAmount || totalAmount).toFixed(2)} MXN
                                </strong>{" "}
                                {cards.length > 0 &&
                                    "y tu tarjeta ya está disponible para seleccionar."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPendingBanner(null)}
                            className="text-xs font-semibold text-blue-700 hover:underline self-end sm:self-center cursor-pointer"
                        >
                            Entendido
                        </button>
                    </div>
                )}

                {itemsSummary.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                        <p className="text-sm font-bold text-slate-900">
                            No hay productos seleccionados para comprar
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl"
                        >
                            Ir al catálogo
                        </Link>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                    >
                        <div className="lg:col-span-7 space-y-5">
                            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3">
                                <h2 className="text-sm font-bold text-slate-900">
                                    1. Forma de entrega
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => form.setData("delivery_method", "pickup")}
                                        className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                                            form.data.delivery_method === "pickup"
                                                ? "border-blue-600 bg-blue-50/70 text-blue-950 font-semibold"
                                                : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <span className="block font-bold">
                                            Recolección en sucursal
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                            Presenta tu QR o código corto en mostrador
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            form.setData("delivery_method", "local_delivery")
                                        }
                                        className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                                            form.data.delivery_method === "local_delivery"
                                                ? "border-blue-600 bg-blue-50/70 text-blue-950 font-semibold"
                                                : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <span className="block font-bold">
                                            Envío local (Cancún)
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                            Entrega a domicilio con validación QR/código
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
                                <h2 className="text-sm font-bold text-slate-900">
                                    2. Método de pago
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => form.setData("payment_method", "cash")}
                                        className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                                            form.data.payment_method === "cash"
                                                ? "border-blue-600 bg-blue-50/70 text-blue-950 font-semibold"
                                                : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <span className="block font-bold">Efectivo</span>
                                        <span className="text-[11px] text-slate-500">
                                            Pagas al recoger o recibir el paquete
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => form.setData("payment_method", "card")}
                                        className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                                            form.data.payment_method === "card"
                                                ? "border-blue-600 bg-blue-50/70 text-blue-950 font-semibold"
                                                : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <span className="block font-bold">
                                            Tarjeta de débito o crédito
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                            Usa tus tarjetas guardadas o agrega una
                                        </span>
                                    </button>
                                </div>

                                {form.data.payment_method === "cash" && (
                                    <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-3.5 text-xs text-amber-950">
                                        <strong>Al confirmar en efectivo:</strong> se generará tu
                                        ticket y código QR/corto marcando el pago como{" "}
                                        <strong>pendiente en efectivo</strong> hasta que pagues al
                                        recoger o al recibir tu paquete.
                                    </div>
                                )}

                                {form.data.payment_method === "card" && (
                                    <div className="space-y-3 pt-1">
                                        {cards.length > 0 ? (
                                            <div className="space-y-2">
                                                {cards.map((card) => (
                                                    <label
                                                        key={card.id}
                                                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer ${
                                                            String(form.data.payment_card_id) ===
                                                            String(card.id)
                                                                ? "border-blue-600 bg-blue-50/60"
                                                                : "border-slate-200"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <input
                                                                type="radio"
                                                                name="payment_card_id"
                                                                checked={
                                                                    String(
                                                                        form.data.payment_card_id,
                                                                    ) === String(card.id)
                                                                }
                                                                onChange={() =>
                                                                    form.setData(
                                                                        "payment_card_id",
                                                                        card.id,
                                                                    )
                                                                }
                                                            />
                                                            <div>
                                                                <p className="font-bold text-slate-900 uppercase">
                                                                    {card.brand} •••• {card.last4}
                                                                </p>
                                                                <p className="text-[11px] text-slate-500">
                                                                    {card.bank_name || "Tarjeta"} ·{" "}
                                                                    {card.holder_name} ·{" "}
                                                                    {card.exp_month}/{card.exp_year}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={goToAddCardInCustomerPanel}
                                                    className="text-xs font-semibold text-blue-600 hover:underline pt-1 cursor-pointer"
                                                >
                                                    + Agregar otra tarjeta en Mi Cuenta
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 space-y-2.5 text-xs">
                                                <p className="font-bold text-rose-800">
                                                    No tienes ninguna tarjeta registrada
                                                </p>
                                                <p className="text-rose-700">
                                                    Te llevaremos a tu panel de cliente para
                                                    registrar y validar tu tarjeta, y podrás volver a
                                                    continuar con este pedido.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={goToAddCardInCustomerPanel}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                                                >
                                                    Ir a agregar tarjeta en Mi Cuenta →
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3">
                                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.requires_invoice}
                                        onChange={(e) =>
                                            form.setData("requires_invoice", e.target.checked)
                                        }
                                        className="rounded border-slate-300 text-blue-600"
                                    />
                                    <span>3. Requiere factura (opcional)</span>
                                </label>

                                {form.data.requires_invoice && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        <input
                                            type="text"
                                            placeholder="RFC (ej. XAXX010101000)"
                                            value={form.data.billing_data.rfc}
                                            onChange={(e) =>
                                                form.setData("billing_data", {
                                                    ...form.data.billing_data,
                                                    rfc: e.target.value.toUpperCase(),
                                                })
                                            }
                                            className="rounded-xl border-slate-200 text-xs uppercase"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Razón social / Nombre"
                                            value={form.data.billing_data.business_name}
                                            onChange={(e) =>
                                                form.setData("billing_data", {
                                                    ...form.data.billing_data,
                                                    business_name: e.target.value,
                                                })
                                            }
                                            className="rounded-xl border-slate-200 text-xs"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 sticky top-6">
                                <h2 className="text-sm font-bold text-slate-900">
                                    Resumen de tu compra
                                </h2>

                                <div className="divide-y divide-slate-100 text-xs">
                                    {itemsSummary.map((row, idx) => (
                                        <div
                                            key={`${row.id}-${idx}`}
                                            className="py-2.5 flex items-center justify-between gap-2"
                                        >
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {row.quantity}× {row.name}
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    ${Number(row.unit_price).toFixed(2)} c/u
                                                </p>
                                            </div>
                                            <span className="font-bold text-slate-900">
                                                ${Number(row.line_total).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">
                                        Total (IVA incl.)
                                    </span>
                                    <span className="text-lg font-bold text-slate-900">
                                        ${totalAmount.toFixed(2)} MXN
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl transition disabled:opacity-50 cursor-pointer"
                                >
                                    {form.processing
                                        ? "Procesando..."
                                        : "Confirmar compra y generar ticket"}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}
