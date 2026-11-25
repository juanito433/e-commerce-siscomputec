import { useEffect, useState } from "react";
import { router, useForm } from "@inertiajs/react";

export const PENDING_INVOICE_RETURN_KEY = "siscomputec_pending_invoice_order";

export default function CustomerBillingTab({ user = {}, onBack }) {
    const [pendingReturn, setPendingReturn] = useState(null);

    const form = useForm({
        billing_rfc: user?.billing_rfc || "",
        billing_business_name: user?.billing_business_name || "",
        billing_regime: user?.billing_regime || "612",
        billing_cfdi_use: user?.billing_cfdi_use || "G03",
        billing_zip_code: user?.billing_zip_code || "",
    });

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(PENDING_INVOICE_RETURN_KEY);
            if (raw) {
                setPendingReturn(JSON.parse(raw));
            }
        } catch {
            // Ignorar
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        form.patch(route("customer.billing.update"), {
            preserveScroll: true,
        });
    };

    const handleGoBackToTicket = () => {
        const targetUrl = pendingReturn?.ticketUrl;
        try {
            sessionStorage.removeItem(PENDING_INVOICE_RETURN_KEY);
        } catch {
            // Ignorar
        }
        if (targetUrl) {
            router.visit(targetUrl);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                        Datos para Facturación
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Guarda tu RFC, razón social, régimen fiscal, uso de CFDI y código postal para enviarlos al facturar por WhatsApp.
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

            {/* Advertencia en ÁMBAR: datos fiscales incompletos / acción requerida para facturar */}
            {pendingReturn && (
                <div
                    role="alert"
                    className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                    <div className="flex items-start gap-3 text-xs text-amber-950">
                        <span
                            aria-hidden="true"
                            className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-black flex items-center justify-center flex-shrink-0 mt-0.5"
                        >
                            ⚠
                        </span>
                        <div className="space-y-0.5">
                            <p className="font-extrabold uppercase tracking-wide text-amber-900">
                                Datos fiscales incompletos · Compra {pendingReturn.orderNumber || ""}
                            </p>
                            <p>
                                Hace falta completar tus datos de facturación antes de mandar el WhatsApp. Al guardarlos, podrás volver directo a tu compra para facturar.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleGoBackToTicket}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex-shrink-0 cursor-pointer"
                    >
                        Ir a mi compra y facturar →
                    </button>
                </div>
            )}

            {/* Error en ROJO: validación fallida al guardar */}
            {Object.keys(form.errors).length > 0 && (
                <div
                    role="alert"
                    className="rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-900 flex items-start gap-2.5"
                >
                    <span
                        aria-hidden="true"
                        className="font-black text-rose-700 flex-shrink-0"
                    >
                        ✕
                    </span>
                    <div className="space-y-1">
                        {Object.values(form.errors).map((err, i) => (
                            <p key={i} className="font-bold">
                                {err}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        RFC *
                    </label>
                    <input
                        type="text"
                        required
                        maxLength={13}
                        value={form.data.billing_rfc}
                        onChange={(e) =>
                            form.setData("billing_rfc", e.target.value.toUpperCase())
                        }
                        placeholder="XAXX010101000"
                        className="w-full rounded-xl border-slate-200 font-mono text-xs sm:text-sm uppercase"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        Código Postal (C.P.) *
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        required
                        maxLength={5}
                        value={form.data.billing_zip_code}
                        onChange={(e) =>
                            form.setData(
                                "billing_zip_code",
                                e.target.value.replace(/\D/g, "").slice(0, 5),
                            )
                        }
                        placeholder="77500"
                        className="w-full rounded-xl border-slate-200 font-mono text-xs sm:text-sm"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nombre o Razón Social *
                    </label>
                    <input
                        type="text"
                        required
                        value={form.data.billing_business_name}
                        onChange={(e) =>
                            form.setData("billing_business_name", e.target.value)
                        }
                        placeholder="Ej. Juan Carlos López Surian / Empresa S.A. de C.V."
                        className="w-full rounded-xl border-slate-200 text-xs sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        Régimen Fiscal *
                    </label>
                    <select
                        value={form.data.billing_regime}
                        onChange={(e) => form.setData("billing_regime", e.target.value)}
                        className="w-full rounded-xl border-slate-200 text-xs sm:text-sm"
                    >
                        <option value="612">
                            612 - Personas Físicas con Actividades Empresariales
                        </option>
                        <option value="626">
                            626 - Régimen Simplificado de Confianza (RESICO)
                        </option>
                        <option value="601">
                            601 - General de Ley Personas Morales
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        Uso de CFDI *
                    </label>
                    <select
                        value={form.data.billing_cfdi_use}
                        onChange={(e) =>
                            form.setData("billing_cfdi_use", e.target.value)
                        }
                        className="w-full rounded-xl border-slate-200 text-xs sm:text-sm"
                    >
                        <option value="G03">G03 - Gastos en general</option>
                        <option value="G01">G01 - Adquisición de mercancías</option>
                        <option value="I04">
                            I04 - Equipo de cómputo y accesorios
                        </option>
                        <option value="S01">S01 - Sin efectos fiscales</option>
                    </select>
                </div>

                <div className="sm:col-span-2 pt-2 flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-xl transition disabled:opacity-50 cursor-pointer"
                    >
                        {form.processing
                            ? "Guardando..."
                            : "Guardar datos de facturación"}
                    </button>

                    {pendingReturn && (
                        <button
                            type="button"
                            onClick={handleGoBackToTicket}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-xl transition cursor-pointer"
                        >
                            Volver a mi compra y facturar por WhatsApp →
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
