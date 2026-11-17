import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ProductShow({ auth, product, recommendedProducts = [] }) {
    const [quantity, setQuantity] = useState(1);
    const [addedMessage, setAddedMessage] = useState(false);

    // Estados para acordeones
    const [descOpen, setDescOpen] = useState(true);
    const [techOpen, setTechOpen] = useState(false);

    const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url;

    const handleAddToCart = () => {
        setAddedMessage(true);
        setTimeout(() => setAddedMessage(false), 3000);
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-blue-600 selection:text-white pb-24 lg:pb-12">
            <Head title={`${product.name} - Siscomputec`} />

            {/* Navbar superior */}
            <header className="bg-white/95 backdrop-blur-md shadow-xs sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link href="/" className="text-lg sm:text-2xl font-black text-blue-700 tracking-tight flex items-center gap-2">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        <span className="tracking-tighter">SISCOMPUTEC</span>
                    </Link>

                    <Link href="/" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        Volver al Catálogo
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">

                {addedMessage && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                        <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                        <span className="text-xs sm:text-sm font-bold">¡Producto agregado al carrito exitosamente! ({quantity} unidad{quantity > 1 ? 'es' : ''})</span>
                    </div>
                )}

                {/* BLOQUE PRINCIPAL SUPERIOR (Imagen + Información y Compra de un vistazo) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Columna Izquierda: Imagen del Producto */}
                    <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
                        <div className="relative w-full h-72 sm:h-[450px] bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center">
                            <img
                                src={primaryImage || 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80'}
                                alt={product.name}
                                className="object-cover h-full w-full"
                            />
                            {product.is_new && (
                                <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md tracking-wider">
                                    NUEVO
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha (y primer plano en móvil): Nombre, Precio, SKU y Compra directa */}
                    <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-blue-600 font-extrabold uppercase tracking-wider">
                                    {product.category?.name || 'General'}
                                </span>
                                <span className="font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-200">
                                    SKU: {product.sku || 'N/D'}
                                </span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                                {product.name}
                            </h1>

                            {/* Estrellas y Opiniones */}
                            <div className="flex items-center gap-2 pt-1">
                                <div className="flex text-amber-400 text-xs">
                                    ★★★★★
                                </div>
                                <span className="text-xs font-bold text-slate-500">4.9 (128 opiniones)</span>
                            </div>
                        </div>

                        {/* Precio y Stock */}
                        <div className="flex items-baseline justify-between py-4 border-y border-slate-100">
                            <span className="text-3xl sm:text-4xl font-black text-slate-900">
                                ${Number(product.price).toFixed(2)}
                            </span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                {product.stock > 0 ? `En Stock (${product.stock})` : 'Agotado'}
                            </span>
                        </div>

                        {/* Selector de Cantidad y Botón de Compra */}
                        {product.stock > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 uppercase">Cantidad:</span>
                                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 font-bold transition cursor-pointer">-</button>
                                        <span className="px-4 py-2 font-black text-sm text-slate-900">{quantity}</span>
                                        <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 font-bold transition cursor-pointer">+</button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base active:scale-95"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Agregar al Carrito
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                {/* BLOQUE SECUNDARIO INFERIOR (Acordeones de Descripción y Comentarios) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-6">

                        {/* Acordeones de Descripción */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-3">
                            <h3 className="font-black text-slate-900 text-sm sm:text-base mb-2">Detalles Técnicos</h3>

                            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                                <button
                                    onClick={() => setDescOpen(!descOpen)}
                                    className="w-full px-4 py-3.5 flex justify-between items-center font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    <span>Descripción general</span>
                                    <span className="text-lg font-black text-blue-600">{descOpen ? '−' : '+'}</span>
                                </button>
                                {descOpen && (
                                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                        {product.description || 'Equipamiento tecnológico de alto rendimiento respaldado con garantía y soporte directo en taller Siscomputec.'}
                                    </div>
                                )}
                            </div>

                            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                                <button
                                    onClick={() => setTechOpen(!techOpen)}
                                    className="w-full px-4 py-3.5 flex justify-between items-center font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    <span>Tecnología y Soporte en Taller</span>
                                    <span className="text-lg font-black text-blue-600">{techOpen ? '−' : '+'}</span>
                                </button>
                                {techOpen && (
                                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 space-y-1">
                                        <p>✔ Diagnóstico de hardware incluido.</p>
                                        <p>✔ Compatible con configuraciones avanzadas.</p>
                                        <p>✔ Facturación disponible para empresas y particulares en Cancún.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SECCIÓN DE COMENTARIOS (VISTA / MOCK) */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-black text-slate-900 text-sm sm:text-base">Opiniones de Clientes</h3>
                                <span className="text-xs text-blue-600 font-bold">Ver todas (128)</span>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-xs text-slate-800">Carlos M.</span>
                                        <span className="text-amber-400 text-xs">★★★★★</span>
                                    </div>
                                    <p className="text-xs text-slate-600">Excelente componente, llegó súper rápido y el soporte en taller resolvió todas mis dudas.</p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-xs text-slate-800">Roberto S.</span>
                                        <span className="text-amber-400 text-xs">★★★★★</span>
                                    </div>
                                    <p className="text-xs text-slate-600">100% original y funcionando al máximo rendimiento en mi setup. Muy recomendable.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* PRODUCTOS RECOMENDADOS */}
                {recommendedProducts.length > 0 && (
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                        <h3 className="font-black text-slate-900 text-base sm:text-lg">Productos Relacionados en {product.category?.name}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {recommendedProducts.map((rec) => {
                                const recImage = rec.images?.find(img => img.is_primary)?.image_url || rec.images?.[0]?.image_url;
                                return (
                                    <Link key={rec.id} href={`/products/${rec.id}`} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg transition group flex flex-col justify-between">
                                        <div>
                                            <div className="h-40 bg-slate-50 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                                                <img src={recImage || 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80'} alt={rec.name} className="object-cover h-full w-full group-hover:scale-105 transition" />
                                            </div>
                                            <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1">{rec.name}</h4>
                                            <span className="text-[10px] font-mono text-slate-400">SKU: {rec.sku}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                                            <span className="font-black text-slate-900">${Number(rec.price).toFixed(2)}</span>
                                            <span className="text-xs font-bold text-blue-600 group-hover:underline">Ver detalle →</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            {/* BOTÓN FLOTANTE FIJO EXCLUSIVO PARA MÓVIL */}
            {product.stock > 0 && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-lg z-50">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total</span>
                            <span className="text-base font-black text-slate-900">${(Number(product.price) * quantity).toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-xs active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            AGREGAR AL CARRITO
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
