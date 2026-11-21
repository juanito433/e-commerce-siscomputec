import { useEffect } from "react";

export default function LegalModal({ docKey, onClose }) {
    useEffect(() => {
        if (!docKey) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [docKey, onClose]);

    if (!docKey) return null;

    const docs = {
        privacy: {
            title: "Aviso de Privacidad",
            subtitle: "Protección de datos personales · Siscomputec (Cancún, Q. Roo)",
            body: [
                "Siscomputec recaba datos de identificación y contacto (nombre, correo electrónico, teléfono y, en su caso, datos de facturación o ubicación de referencia) con el propósito de gestionar cuentas de cliente, procesar pedidos, coordinar la recolección en sucursal en Cancún o entregas locales y brindar soporte técnico.",
                "No comercializamos tus datos personales con terceros ajenos a la operación del servicio. Puedes solicitar el acceso, rectificación, cancelación u oposición (derechos ARCO) de tus datos a través de nuestros canales oficiales de contacto.",
            ],
        },
        terms: {
            title: "Términos y Condiciones",
            subtitle: "Condiciones de compra en línea · Operación en Cancún",
            body: [
                "Todos los precios publicados en el catálogo se expresan en pesos mexicanos (MXN) e incluyen el IVA correspondiente (16%), salvo indicación expresa en contrario.",
                "Las compras realizadas en la plataforma están orientadas a clientes en Cancún, Quintana Roo, principalmente bajo modalidad de recolección en sucursal (los envíos a domicilio están sujetos a disponibilidad y cobertura local). La confirmación del pedido depende de la disponibilidad de stock al momento de procesar la orden.",
            ],
        },
        warranty: {
            title: "Política de Garantías y Devoluciones",
            subtitle: "Hardware, redes, accesorios y soporte técnico",
            body: [
                "Los productos cuentan con garantía conforme a las condiciones del fabricante y/o de Siscomputec, aplicable por defectos de fabricación bajo uso normal.",
                "No aplica garantía en equipos o componentes con daños físicos, humedad, sobrecargas o variaciones eléctricas, manipulación indebida, instalación incorrecta o violación de sellos/etiquetas de identificación. Para revisión, es necesario presentar el comprobante o folio del pedido.",
            ],
        },
        billing: {
            title: "Facturación Fiscal (SAT · CFDI 4.0)",
            subtitle: "Desglose de IVA y comprobantes fiscales",
            body: [
                "Si requieres factura CFDI 4.0, debes activar la opción de facturación e ingresar tu RFC, Nombre o Razón Social, Código Postal Fiscal, Régimen Fiscal y Uso de CFDI tal como figuran en tu Constancia de Situación Fiscal.",
                "Las compras que no soliciten factura individual o cuyos datos no sean proporcionados en tiempo podrán integrarse en la factura global al público en general conforme a las disposiciones fiscales vigentes.",
            ],
        },
    };

    const current = docs[docKey] || docs.privacy;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs"
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                            {current.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{current.subtitle}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[65vh] overflow-y-auto">
                    {current.body.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                    ))}
                </div>

                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-slate-900 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}
