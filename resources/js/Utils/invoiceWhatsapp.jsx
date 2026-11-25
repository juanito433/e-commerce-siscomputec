import { router } from "@inertiajs/react";
import { PENDING_INVOICE_RETURN_KEY } from "@/Components/Customer/CustomerBillingTab";

const CFDI_USES = {
    G03: "G03 - Gastos en general",
    G01: "G01 - Adquisición de mercancías",
    I04: "I04 - Equipo de cómputo y accesorios",
    S01: "S01 - Sin efectos fiscales",
};

const REGIMES = {
    "601": "601 - General de Ley Personas Morales",
    "612": "612 - Personas Físicas con Actividades Empresariales y Profesionales",
    "626": "626 - Régimen Simplificado de Confianza (RESICO)",
};

export function hasCompleteBillingData(user = {}) {
    return Boolean(
        user?.billing_rfc &&
            String(user.billing_rfc).trim().length >= 12 &&
            user?.billing_business_name &&
            String(user.billing_business_name).trim().length > 1 &&
            user?.billing_zip_code &&
            /^\d{5}$/.test(String(user.billing_zip_code).trim()),
    );
}

export function buildInvoiceWhatsappUrl({
    order,
    user,
    phoneNumber = "529980000000",
}) {
    const isCash =
        String(order?.payment_provider || "").startsWith("cash") ||
        order?.payment_method === "cash";

    const paymentLabel = isCash
        ? order?.payment_status === "paid"
            ? "Efectivo (Pagado)"
            : "Efectivo (Pendiente de pago al recoger o recibir)"
        : "Tarjeta de débito / crédito";

    const itemsSummary = (order?.items || [])
        .map(
            (it) =>
                `• ${it.quantity}× ${it.product_name} — $${Number(it.line_total || 0).toFixed(2)} MXN`,
        )
        .join("\n");

    const lines = [
        "Hola Siscomputec, solicito factura para mi compra:",
        `Folio: ${order?.order_number || `#${order?.id}`}`,
        `Código de orden: ${order?.pickup_code || "—"}`,
        `Método de pago: ${paymentLabel}`,
        `Subtotal: $${Number(order?.subtotal || 0).toFixed(2)} MXN`,
        `IVA: $${Number(order?.tax_amount || 0).toFixed(2)} MXN`,
        `Total: $${Number(order?.total || 0).toFixed(2)} MXN`,
        "",
        "Datos fiscales del cliente:",
        `RFC: ${String(user?.billing_rfc || "").toUpperCase()}`,
        `Razón social / Nombre: ${user?.billing_business_name || ""}`,
        `Régimen fiscal: ${REGIMES[user?.billing_regime] || user?.billing_regime || "—"}`,
        `Uso de CFDI: ${CFDI_USES[user?.billing_cfdi_use] || user?.billing_cfdi_use || "G03"}`,
        `Código postal: ${user?.billing_zip_code || ""}`,
    ];

    if (itemsSummary) {
        lines.push("", "Artículos comprados:", itemsSummary);
    }

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function triggerInvoiceWhatsapp({ order, user }) {
    if (!hasCompleteBillingData(user)) {
        try {
            sessionStorage.setItem(
                PENDING_INVOICE_RETURN_KEY,
                JSON.stringify({
                    orderId: order.id,
                    orderNumber: order.order_number || `#${order.id}`,
                    ticketUrl: route("orders.ticket", order.id),
                }),
            );
        } catch {
            // Ignorar
        }
        router.visit(route("customer.dashboard", { tab: "billing" }));
        return;
    }

    const waUrl = buildInvoiceWhatsappUrl({ order, user });
    router.post(
        route("orders.invoice.whatsapp", order.id),
        {},
        {
            preserveScroll: true,
            onSuccess: () => {
                window.open(waUrl, "_blank", "noopener,noreferrer");
            },
        },
    );
}
