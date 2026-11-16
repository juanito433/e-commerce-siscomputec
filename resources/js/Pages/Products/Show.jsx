import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ProductShow({ auth, product }) {
    const [quantity, setQuantity] = useState(1);
    const [addedMessage, setAddedMessage] = useState(false);

    // Obtener imagen principal o la primera disponible
    const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url;

    const handleAddToCart = () => {
        // Aquí puedes conectar posteriormente tu lógica de carrito (Context, Zustand o LocalStorage)
        setAddedMessage(true);
        setTimeout(() => setAddedMessage(false), 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title={`${product.name} - Siscomputec`} />

            {/* Navbar Simple / Regresar */}
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

            {/* Contenido de Detalles */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

                {/* Alerta flotante de agregado al carrito */}
                {addedMessage && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm animate-fade-in-up">
                        <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                        <span className="text-xs sm:text-sm font-bold">¡Producto agregado al carrito exitosamente! ({quantity} unidad{quantity > 1 ? 'es' : ''})</span>
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                    {/* Columna de Imagen */}
                    <div className="relative bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center h-80 sm:h-[450px]">
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

                    {/* Columna de Información y Compra */}
                    <div className="flex flex-col h-full space-y-6">
                        <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-blue-600 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                                    {product.category?.name || 'General'}
                                </span>
                                <span className="font-mono text-xs font-black bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 tracking-wider">
                                    SKU: {product.sku || 'N/D'}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                {product.name}
                            </h1>
                        </div>

                        <div className="flex items-baseline gap-4 py-4 border-y border-slate-100">
                            <span className="text-3xl sm:text-4xl font-black text-slate-900">
                                ${Number(product.price).toFixed(2)}
                            </span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                {product.stock > 0 ? `En Stock (${product.stock} disponibles)` : 'Agotado'}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Descripción del Producto</h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                {product.description || 'Este artículo cuenta con garantía y soporte técnico profesional en taller Siscomputec.'}
                            </p>
                        </div>

                        {/* Selector de Cantidad y Botón de Carrito */}
                        {product.stock > 0 && (
                            <div className="space-y-4 pt-4 border-t border-slate-100 mt-auto">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-slate-700 uppercase">Cantidad:</span>
                                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 font-bold transition cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 font-black text-sm text-slate-900">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                            className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 font-bold transition cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
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
            </main>
        </div>
    );
}
