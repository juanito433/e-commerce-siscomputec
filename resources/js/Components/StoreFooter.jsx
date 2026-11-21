import { useState } from "react";
import LegalModal from "./LegalModal";

export default function StoreFooter() {
    const [activeDoc, setActiveDoc] = useState(null);

    return (
        <>
            <footer className="bg-white border-t border-slate-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-black text-slate-900">
                                SISCOMPUTEC · Cancún, Quintana Roo
                            </p>
                            <p className="text-xs text-slate-500">
                                Precios en MXN con IVA (16%) incluido · Compra en línea con recolección en sucursal y envíos locales sujetos a disponibilidad.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
                            <button
                                type="button"
                                onClick={() => setActiveDoc("privacy")}
                                className="hover:text-blue-700 transition cursor-pointer"
                            >
                                Aviso de Privacidad
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveDoc("terms")}
                                className="hover:text-blue-700 transition cursor-pointer"
                            >
                                Términos y Condiciones
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveDoc("warranty")}
                                className="hover:text-blue-700 transition cursor-pointer"
                            >
                                Garantías y Devoluciones
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveDoc("billing")}
                                className="hover:text-blue-700 transition cursor-pointer"
                            >
                                Facturación CFDI 4.0
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
                        <span>© {new Date().getFullYear()} Siscomputec. Todos los derechos reservados.</span>
                        <span>Comprobantes fiscales CFDI 4.0 disponibles bajo solicitud.</span>
                    </div>
                </div>
            </footer>

            <LegalModal docKey={activeDoc} onClose={() => setActiveDoc(null)} />
        </>
    );
}
