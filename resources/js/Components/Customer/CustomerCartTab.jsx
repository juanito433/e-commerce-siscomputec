import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import LegalModal from "../LegalModal";

const TAX_RATE = 0.16;
const TAX_DIVISOR = 1.16;

const REGIMENES_FISCALES = [
    { code: "601", label: "601 - General de Ley Personas Morales" },
    { code: "612", label: "612 - Personas Físicas con Actividades Empresariales y Profesionales" },
    { code: "626", label: "626 - Régimen Simplificado de Confianza (RESICO)" },
    { code: "605", label: "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios" },
    { code: "616", label: "616 - Sin obligaciones fiscales" },
];

const USOS_CFDI = [
    { code: "G03", label: "G03 - Gastos en general" },
    { code: "G01", label: "G01 - Adquisición de mercancías" },
    { code: "I04", label: "I04 - Equipo de cómputo y accesorios" },
    { code: "S01", label: "S01 - Sin efectos fiscales" },
];

export default function CustomerCartTab({ items = [], onBack, onCheckout }) {
    const { errors, auth } = usePage().props;
    const userEmail = auth?.user?.email || "";

    const [requiresInvoice, setRequiresInvoice] = useState(false);
    const [billing, setBilling] = useState({
        rfc: "",
        business_name: "",
        postal_code: "",
        tax_regime: "612",
        cfdi_use: "G03",
        invoice_email: userEmail,
    });
    const [acceptedPolicies, setAcceptedPolicies] = useState(false);
    const [formError, setFormError] = useState("");
    const [legalDoc, setLegalDoc] = useState(null);

    const totalItems = items.reduce(
        (acc, item) => acc + Number(item.quantity || 0),
        0
    );

    const totalWithTax = items.reduce(
        (acc, item) =>
            acc + Number(item.product?.price || 0) * Number(item.quantity || 0),
        0
    );

    const subtotalWithoutTax = totalWithTax / TAX_DIVISOR;
    const taxAmount = totalWithTax - subtotalWithoutTax;

    const updateQuantity = (itemId, nextQty) => {
        if (nextQty < 1) return;
        router.patch(
            route("cart.items.update", itemId),
            { quantity: nextQty },
            { preserveScroll: true }
        );
    };

    const removeItem = (itemId) => {
        router.delete(route("cart.items.destroy", itemId), {
            preserveScroll: true,
        });
    };

    const handleBillingChange = (field, value) => {
        setFormError("");
        setBilling((prev) => ({
            ...prev,
            [field]: field === "rfc" ? value.toUpperCase() : value,
        }));
    };

    const validateBeforeContinue = () => {
        if (requiresInvoice) {
            const cleanRfc = billing.rfc.trim().toUpperCase();
            const rfcRegex = /^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})$/;
            const cpRegex = /^\d{5}$/;

            if (!rfcRegex.test(cleanRfc)) {
                setFormError(
                    "Ingresa un RFC válido de 12 (moral) o 13 (física) caracteres."
                );
                return false;
            }
            if (!billing.business_name.trim()) {
                setFormError(
                    "Ingresa el nombre o razón social tal como aparece en tu constancia."
                );
                return false;
            }
            if (!cpRegex.test(billing.postal_code.trim())) {
                setFormError("El código postal fiscal debe tener 5 dígitos.");
                return false;
            }
            if (!billing.invoice_email.trim() || !billing.invoice_email.includes("@")) {
                setFormError(
                    "Ingresa un correo válido para recibir tu factura XML y PDF."
                );
                return false;
            }
        }

        if (!acceptedPolicies) {
            setFormError(
                "Debes aceptar los Términos y Condiciones y el Aviso de Privacidad para continuar."
            );
            return false;
        }

        return true;
    };

    const handleContinuePurchase = () => {
        if (!validateBeforeContinue()) return;

        const payload = {
            requires_invoice: requiresInvoice,
            accepted_policies: true,
            billing: requiresInvoice
                ? {
                      ...billing,
                      rfc: billing.rfc.trim().toUpperCase(),
                      business_name: billing.business_name.trim(),
                      postal_code: billing.postal_code.trim(),
                      invoice_email: billing.invoice_email.trim(),
                  }
                : null,
            totals: {
                subtotal: Number(subtotalWithoutTax.toFixed(2)),
                iva: Number(taxAmount.toFixed(2)),
                total: Number(totalWithTax.toFixed(2)),
            },
        };

        if (typeof onCheckout === "function") {
            onCheckout(payload);
            return;
        }

        alert(
            requiresInvoice
                ? `Factura CFDI 4.0 activada para RFC ${payload.billing.rfc}. Total: $${totalWithTax.toFixed(2)} MXN`
                : `Pedido listo sin factura individual (público en general). Total: $${totalWithTax.toFixed(2)} MXN`
        );
    };

    return (
        <>
            <div
                className={`bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs space-y-6 ${
                    items.length > 0 ? "pb-48 xl:pb-8" : ""
                }`}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-900">
                            Mi Carrito ({totalItems})
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Precios con IVA (16%) incluido · Recolección en sucursal en Cancún y facturación CFDI 4.0.
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

                {errors?.cart && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-bold">
                        {errors.cart}
                    </div>
                )}

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                        {/* Columna izquierda: Productos + Facturación + Aceptación Legal */}
                        <div className="xl:col-span-8 space-y-4">
                            <div className="space-y-3.5">
                                {items.map((item) => {
                                    const product = item.product || {};
                                    const img =
                                        product.images?.find((i) => i.is_primary)?.image_url ||
                                        product.images?.[0]?.image_url ||
                                        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80";
                                    const unitPrice = Number(product.price || 0);
                                    const qty = Number(item.quantity || 1);
                                    const lineTotal = unitPrice * qty;
                                    const maxStock = Math.max(1, Number(product.stock || 1));

                                    return (
                                        <div
                                            key={item.id}
                                            className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 flex flex-col sm:flex-row justify-between gap-4"
                                        >
                                            <div className="flex gap-3.5 min-w-0">
                                                <Link
                                                    href={route("products.show", product.id)}
                                                    className="w-20 h-20 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </Link>

                                                <div className="min-w-0 space-y-1">
                                                    <span className="text-[10px] font-extrabold uppercase text-blue-600">
                                                        {product.category?.name || "Hardware"}
                                                    </span>
                                                    <Link
                                                        href={route("products.show", product.id)}
                                                        className="block text-sm font-extrabold text-slate-900 hover:text-blue-600 line-clamp-2"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <p className="text-xs text-slate-500">
                                                        ${unitPrice.toFixed(2)} MXN c/u{" "}
                                                        <span className="text-[11px] text-slate-400">
                                                            (IVA incl.)
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/70">
                                                <span className="text-base font-black text-slate-900">
                                                    ${lineTotal.toFixed(2)}
                                                </span>

                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.id, qty - 1)}
                                                            disabled={qty <= 1}
                                                            aria-label="Disminuir cantidad"
                                                            className="px-2.5 py-1 text-xs font-black text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="px-3 py-1 text-xs font-extrabold border-x border-slate-200">
                                                            {qty}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.id, qty + 1)}
                                                            disabled={qty >= maxStock}
                                                            aria-label="Aumentar cantidad"
                                                            className="px-2.5 py-1 text-xs font-black text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                                                    >
                                                        Quitar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Tarjeta Opcional de Facturación CFDI 4.0 */}
                            <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50/60 space-y-4">
                                <label className="flex items-start sm:items-center justify-between gap-3 cursor-pointer">
                                    <div className="space-y-0.5">
                                        <span className="text-sm font-extrabold text-slate-900 block">
                                            Requiero factura (CFDI 4.0)
                                        </span>
                                        <span className="text-xs text-slate-500 block">
                                            Si no la marcas, se emitirá bajo venta a público en general.
                                        </span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={requiresInvoice}
                                        onChange={(e) => {
                                            setFormError("");
                                            setRequiresInvoice(e.target.checked);
                                        }}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1 sm:mt-0 cursor-pointer"
                                    />
                                </label>

                                {requiresInvoice && (
                                    <div className="pt-4 border-t border-slate-200 space-y-3.5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                    RFC *
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength={13}
                                                    placeholder="XAXX010101000"
                                                    value={billing.rfc}
                                                    onChange={(e) => handleBillingChange("rfc", e.target.value)}
                                                    className="w-full rounded-xl border-slate-200 bg-white text-xs font-mono uppercase focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                    Código Postal Fiscal *
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength={5}
                                                    placeholder="77500"
                                                    value={billing.postal_code}
                                                    onChange={(e) =>
                                                        handleBillingChange(
                                                            "postal_code",
                                                            e.target.value.replace(/\D/g, "")
                                                        )
                                                    }
                                                    className="w-full rounded-xl border-slate-200 bg-white text-xs font-mono focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                Nombre o Razón Social (sin régimen societario) *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ej. JUAN CARLOS LOPEZ SURIAN"
                                                value={billing.business_name}
                                                onChange={(e) =>
                                                    handleBillingChange("business_name", e.target.value)
                                                }
                                                className="w-full rounded-xl border-slate-200 bg-white text-xs focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                    Régimen Fiscal
                                                </label>
                                                <select
                                                    value={billing.tax_regime}
                                                    onChange={(e) =>
                                                        handleBillingChange("tax_regime", e.target.value)
                                                    }
                                                    className="w-full rounded-xl border-slate-200 bg-white text-xs focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    {REGIMENES_FISCALES.map((reg) => (
                                                        <option key={reg.code} value={reg.code}>
                                                            {reg.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                    Uso de CFDI
                                                </label>
                                                <select
                                                    value={billing.cfdi_use}
                                                    onChange={(e) =>
                                                        handleBillingChange("cfdi_use", e.target.value)
                                                    }
                                                    className="w-full rounded-xl border-slate-200 bg-white text-xs focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    {USOS_CFDI.map((uso) => (
                                                        <option key={uso.code} value={uso.code}>
                                                            {uso.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                Correo para envío de factura (XML y PDF) *
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="facturacion@empresa.com"
                                                value={billing.invoice_email}
                                                onChange={(e) =>
                                                    handleBillingChange("invoice_email", e.target.value)
                                                }
                                                className="w-full rounded-xl border-slate-200 bg-white text-xs focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Aceptación de Avisos Legales y Privacidad */}
                            <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white space-y-2.5">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={acceptedPolicies}
                                        onChange={(e) => {
                                            setFormError("");
                                            setAcceptedPolicies(e.target.checked);
                                        }}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                                    />
                                    <span className="text-xs text-slate-600 leading-relaxed">
                                        Acepto los{" "}
                                        <button
                                            type="button"
                                            onClick={() => setLegalDoc("terms")}
                                            className="font-bold text-blue-600 hover:underline cursor-pointer"
                                        >
                                            Términos y Condiciones
                                        </button>
                                        , la{" "}
                                        <button
                                            type="button"
                                            onClick={() => setLegalDoc("warranty")}
                                            className="font-bold text-blue-600 hover:underline cursor-pointer"
                                        >
                                            Política de Garantías
                                        </button>{" "}
                                        y el{" "}
                                        <button
                                            type="button"
                                            onClick={() => setLegalDoc("privacy")}
                                            className="font-bold text-blue-600 hover:underline cursor-pointer"
                                        >
                                            Aviso de Privacidad
                                        </button>{" "}
                                        de Siscomputec (recolección en sucursal en Cancún).
                                    </span>
                                </label>

                                {formError && (
                                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs font-bold">
                                        {formError}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resumen lateral fijo en pantallas grandes (xl+) */}
                        <aside className="hidden xl:block xl:col-span-4 xl:sticky xl:top-28 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                            <h3 className="text-sm font-black text-slate-900 pb-2.5 border-b border-slate-200">
                                Resumen del pedido
                            </h3>

                            <div className="space-y-2 text-xs text-slate-600">
                                <div className="flex items-center justify-between">
                                    <span>
                                        Subtotal ({totalItems} {totalItems === 1 ? "ud." : "uds."})
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                        ${subtotalWithoutTax.toFixed(2)} MXN
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span>IVA ({Math.round(TAX_RATE * 100)}%)</span>
                                    <span className="font-semibold text-slate-800">
                                        ${taxAmount.toFixed(2)} MXN
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2.5 border-t border-slate-200 flex items-baseline justify-between">
                                <span className="text-xs font-extrabold uppercase text-slate-700">
                                    Total a pagar
                                </span>
                                <span className="text-xl font-black text-slate-900">
                                    ${totalWithTax.toFixed(2)}{" "}
                                    <span className="text-[11px] font-bold text-slate-400">
                                        MXN
                                    </span>
                                </span>
                            </div>

                            <div className="text-[11px] text-slate-500 bg-white rounded-xl p-2.5 border border-slate-200/70 space-y-1">
                                <p>
                                    {requiresInvoice
                                        ? `Factura activada: ${billing.rfc || "RFC pendiente"}`
                                        : "Precios con IVA incluido · Factura opcional"}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                    Recolección en local · Cancún, Q. Roo
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleContinuePurchase}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
                            >
                                Continuar compra
                            </button>

                            <Link
                                href="/"
                                className="block w-full text-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
                            >
                                Seguir comprando
                            </Link>
                        </aside>
                    </div>
                ) : (
                    <div className="text-center py-12 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-800">
                            Tu carrito está vacío
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Explora nuestro catálogo de cómputo, redes y CCTV para agregar productos.
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

            {/* Barra inferior fija de Resumen del pedido en Móvil y Tableta (< xl) */}
            {items.length > 0 && (
                <div className="xl:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-4 sm:px-6 py-3">
                    <div className="max-w-4xl mx-auto space-y-2.5">
                        {formError && (
                            <p className="text-[11px] font-bold text-rose-600 truncate">
                                {formError}
                            </p>
                        )}

                        <div className="flex items-baseline justify-between gap-2">
                            <div>
                                <span className="text-[11px] font-bold text-slate-700 block leading-none">
                                    Resumen del pedido
                                </span>
                                <span className="text-[11px] text-slate-500">
                                    Sub: ${subtotalWithoutTax.toFixed(2)} · IVA: ${taxAmount.toFixed(2)}
                                </span>
                            </div>

                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">
                                    Total (IVA incl.)
                                </span>
                                <span className="text-lg sm:text-xl font-black text-slate-900">
                                    ${totalWithTax.toFixed(2)}{" "}
                                    <span className="text-[11px] font-bold text-slate-400">
                                        MXN
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                href="/"
                                className="text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs transition"
                            >
                                Seguir comprando
                            </Link>

                            <button
                                type="button"
                                onClick={handleContinuePurchase}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-3 rounded-xl text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
                            >
                                Continuar compra
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <LegalModal docKey={legalDoc} onClose={() => setLegalDoc(null)} />
        </>
    );
}
