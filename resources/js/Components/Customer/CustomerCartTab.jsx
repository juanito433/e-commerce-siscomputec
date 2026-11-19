import { Link, router, usePage } from "@inertiajs/react";

export default function CustomerCartTab({ items = [], onBack }) {
    const { errors } = usePage().props;

    const totalItems = items.reduce(
        (acc, item) => acc + Number(item.quantity || 0),
        0
    );

    const subtotal = items.reduce(
        (acc, item) =>
            acc + Number(item.product?.price || 0) * Number(item.quantity || 0),
        0
    );

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

    return (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Mi Carrito ({totalItems})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Revisa los productos que tienes listos para pedir en Siscomputec.
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
                    {/* Lista de productos en el carrito */}
                    <div className="xl:col-span-8 space-y-3.5">
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
                                                ${unitPrice.toFixed(2)} MXN c/u
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

                    {/* Resumen de compra */}
                    <div className="xl:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                        <h3 className="text-sm font-black text-slate-900 pb-2.5 border-b border-slate-200">
                            Resumen del pedido
                        </h3>

                        <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>Productos ({totalItems})</span>
                            <span className="font-bold text-slate-900">
                                ${subtotal.toFixed(2)} MXN
                            </span>
                        </div>

                        <div className="pt-2.5 border-t border-slate-200 flex items-baseline justify-between">
                            <span className="text-xs font-extrabold uppercase text-slate-700">
                                Total estimado
                            </span>
                            <span className="text-xl font-black text-slate-900">
                                ${subtotal.toFixed(2)}{" "}
                                <span className="text-[11px] font-bold text-slate-400">
                                    MXN
                                </span>
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => alert("Listo para conectar con Checkout / Órdenes")}
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
                    </div>
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
    );
}
