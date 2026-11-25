import { useMemo, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import {
    detectBankName,
    detectCardBrand,
    formatCardNumber,
    isValidLuhn,
} from "@/Utils/cardValidator";

export default function AnimatedCardManager({ cards = [] }) {
    const [rawNumber, setRawNumber] = useState("");
    const [holderName, setHolderName] = useState("");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [isFlipped, setIsFlipped] = useState(false);
    const [localError, setLocalError] = useState("");

    const storeForm = useForm({
        holder_name: "",
        brand: "visa",
        bank_name: "",
        last4: "",
        exp_month: "",
        exp_year: "",
    });

    const digits = rawNumber.replace(/\D/g, "");
    const brand = useMemo(() => detectCardBrand(digits), [digits]);
    const bankName = useMemo(() => detectBankName(digits), [digits]);
    const luhnValid = useMemo(() => (digits.length >= 13 ? isValidLuhn(digits) : false), [digits]);

    const handleSaveCard = (e) => {
        e.preventDefault();
        setLocalError("");

        if (!isValidLuhn(digits)) {
            setLocalError(
                "El número de tarjeta no pasa la verificación de seguridad (Luhn). Verifica que no sea un número inventado al azar."
            );
            return;
        }

        const cleanMonth = expMonth.padStart(2, "0");
        const cleanYear = expYear.length === 2 ? `20${expYear}` : expYear;

        if (!/^(0[1-9]|1[0-2])$/.test(cleanMonth) || !/^20\d{2}$/.test(cleanYear)) {
            setLocalError("Ingresa una fecha de vencimiento válida (MM / AA).");
            return;
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            setLocalError("Ingresa un CVV válido de 3 o 4 dígitos.");
            return;
        }

        router.post(
            route("customer.cards.store"),
            {
                holder_name: holderName.trim() || "TITULAR",
                brand,
                bank_name: bankName,
                last4: digits.slice(-4),
                exp_month: cleanMonth,
                exp_year: cleanYear,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRawNumber("");
                    setHolderName("");
                    setExpMonth("");
                    setExpYear("");
                    setCvv("");
                    setIsFlipped(false);
                },
            }
        );
    };

    const hasPendingCheckout = (() => {
        try {
            return Boolean(sessionStorage.getItem("siscomputec_pending_checkout"));
        } catch {
            return false;
        }
    })();

    return (
        <section id="tarjetas" className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-bold text-slate-900">
                        Mis tarjetas (modo prueba)
                    </h2>
                    <p className="text-xs text-slate-500">
                        Detección automática de banco/red y validación de numeración real antes de guardar.
                    </p>
                </div>

                {hasPendingCheckout && cards.length > 0 && (
                    <button
                        type="button"
                        onClick={() => router.visit(route("checkout.index"))}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                        Continuar con mi compra →
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Tarjeta animada */}
                <div className="lg:col-span-5 space-y-3">
                    <div
                        style={{ perspective: "1000px" }}
                        className="w-full h-48"
                    >
                        <div
                            style={{
                                transformStyle: "preserve-3d",
                                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                                transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                            className="relative w-full h-full"
                        >
                            {/* Frente */}
                            <div
                                style={{ backfaceVisibility: "hidden" }}
                                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white p-5 flex flex-col justify-between shadow-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-blue-200 truncate">
                                        {bankName}
                                    </span>
                                    <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/15">
                                        {brand}
                                    </span>
                                </div>

                                <div className="font-mono text-base sm:text-lg tracking-widest">
                                    {formatCardNumber(digits) || "•••• •••• •••• ••••"}
                                </div>

                                <div className="flex items-end justify-between text-xs">
                                    <div>
                                        <span className="text-[10px] uppercase text-slate-400 block">
                                            Titular
                                        </span>
                                        <span className="font-semibold uppercase">
                                            {holderName || "NOMBRE DEL TITULAR"}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] uppercase text-slate-400 block">
                                            Vence
                                        </span>
                                        <span className="font-mono font-semibold">
                                            {expMonth || "MM"}/{expYear || "AA"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Reverso */}
                            <div
                                style={{
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)",
                                }}
                                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white py-5 flex flex-col justify-between shadow-lg"
                            >
                                <div className="w-full h-9 bg-slate-950/90" />
                                <div className="px-5">
                                    <span className="text-[10px] uppercase text-slate-400 block mb-1">
                                        Código de seguridad (CVV)
                                    </span>
                                    <div className="bg-white text-slate-900 font-mono text-sm font-bold px-3 py-1.5 rounded-lg text-right">
                                        {cvv || "•••"}
                                    </div>
                                </div>
                                <div className="px-5 text-[10px] text-slate-400">
                                    Siscomputec · Tarjeta registrada en modo prueba
                                </div>
                            </div>
                        </div>
                    </div>

                    {digits.length >= 13 && (
                        <p
                            className={`text-xs font-semibold ${
                                luhnValid ? "text-emerald-700" : "text-rose-600"
                            }`}
                        >
                            {luhnValid
                                ? `✓ Numeración válida · ${bankName}`
                                : "✕ Número de tarjeta inválido según verificación Luhn"}
                        </p>
                    )}
                </div>

                {/* Formulario de alta */}
                <form onSubmit={handleSaveCard} className="lg:col-span-7 space-y-3">
                    {localError && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
                            {localError}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Número de tarjeta *
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            required
                            value={formatCardNumber(rawNumber)}
                            onFocus={() => setIsFlipped(false)}
                            onChange={(e) => setRawNumber(e.target.value)}
                            placeholder="0000 0000 0000 0000"
                            className="w-full rounded-xl border-slate-200 font-mono text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Nombre como aparece en la tarjeta *
                        </label>
                        <input
                            type="text"
                            required
                            value={holderName}
                            onFocus={() => setIsFlipped(false)}
                            onChange={(e) => setHolderName(e.target.value.toUpperCase())}
                            placeholder="JUAN CARLOS LÓPEZ"
                            className="w-full rounded-xl border-slate-200 text-xs sm:text-sm uppercase"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Mes (MM) *
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={2}
                                required
                                value={expMonth}
                                onFocus={() => setIsFlipped(false)}
                                onChange={(e) =>
                                    setExpMonth(e.target.value.replace(/\D/g, "").slice(0, 2))
                                }
                                placeholder="12"
                                className="w-full rounded-xl border-slate-200 font-mono text-xs sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Año (AA) *
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={2}
                                required
                                value={expYear}
                                onFocus={() => setIsFlipped(false)}
                                onChange={(e) =>
                                    setExpYear(e.target.value.replace(/\D/g, "").slice(0, 2))
                                }
                                placeholder="28"
                                className="w-full rounded-xl border-slate-200 font-mono text-xs sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                CVV *
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                required
                                value={cvv}
                                onFocus={() => setIsFlipped(true)}
                                onBlur={() => setIsFlipped(false)}
                                onChange={(e) =>
                                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                                }
                                placeholder="123"
                                className="w-full rounded-xl border-slate-200 font-mono text-xs sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={storeForm.processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
                        >
                            Guardar tarjeta
                        </button>

                        {hasPendingCheckout && cards.length > 0 && (
                            <button
                                type="button"
                                onClick={() => router.visit(route("checkout.index"))}
                                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                            >
                                Regresar a terminar mi compra
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {cards.length > 0 && (
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-center justify-between gap-2 text-xs"
                        >
                            <div>
                                <p className="font-bold text-slate-900 uppercase">
                                    {card.brand} •••• {card.last4}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    {card.bank_name} · {card.exp_month}/{card.exp_year}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    router.delete(route("customer.cards.destroy", card.id), {
                                        preserveScroll: true,
                                    })
                                }
                                className="text-rose-600 hover:underline font-semibold cursor-pointer"
                            >
                                Quitar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
