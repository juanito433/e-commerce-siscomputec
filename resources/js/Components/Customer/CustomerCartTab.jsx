import { Link, router } from "@inertiajs/react";

export default function CustomerCartTab({ items = [], onBack }) {
    const totalUnits = items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
    );

    const totalAmount = items.reduce(
        (sum, item) =>
            sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
        0,
    );

    const netSubtotal = totalAmount / 1.16;
    const taxAmount = totalAmount - netSubtotal;

    const handleUpdateQty = (cartItem, nextQty) => {
        if (nextQty < 1) return;
        router.patch(
            route("cart.items.update", cartItem.id),
            { quantity: nextQty },
            { preserveScroll: true },
        );
    };

    const handleRemoveItem = (cartItem) => {
        router.delete(route("cart.items.destroy", cartItem.id), {
            preserveScroll: true,
        });
    };

    const handleProceedToCheckout = () => {
        router.visit(route("checkout.index"));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                        Mi Carrito ({totalUnits})
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Precios con IVA (16%) incluido · Recolección en sucursal en Cancún y facturación CFDI 4.0.
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

            {items.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs text-center space-y-3">
                    <p className="text-sm font-bold text-slate-800">
                        Tu carrito está vacío
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                    >
                        Explorar productos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 space-y-4">
                        {items.map((item) => {
                            const product = item.product || {};
                            const qty = Number(item.quantity || 1);
                            const unitPrice = Number(product.price || 0);
                            const lineTotal = unitPrice * qty;
                            const imgUrl =
                                product.images?.find((i) => i.is_primary)?.image_url ||
                                product.images?.[0]?.image_url ||
                                "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80";

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <img
                                            src={imgUrl}
                                            alt={product.name || "Producto"}
                                            className="w-16 h-16 rounded-2xl object-contain bg-slate-50 border border-slate-200 p-1 flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <span className="text-[11px] font-extrabold uppercase text-blue-600">
                                                {product.category?.name || "Catálogo"}
                                            </span>
                                            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                                {product.name}
                                            </h2>
                                            <p className="text-xs text-slate-500">
                                                ${unitPrice.toFixed(2)} MXN c/u (IVA incl.)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4">
                                        <span className="text-sm sm:text-base font-black text-slate-900">
                                            ${lineTotal.toFixed(2)}
                                        </span>

                                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQty(item, qty - 1)}
                                                disabled={qty <= 1}
                                                className="px-2.5 py-1 text-xs font-black text-slate-700 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                                            >
                                                −
                                            </button>
                                            <span className="px-3 py-1 text-xs font-extrabold text-slate-900 bg-white border-x border-slate-200">
                                                {qty}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQty(item, qty + 1)}
                                                className="px-2.5 py-1 text-xs font-black text-slate-700 hover:bg-slate-200 cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item)}
                                            className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 lg:sticky lg:top-28">
                        <h2 className="text-base font-black text-slate-900">
                            Resumen del pedido
                        </h2>

                        <div className="space-y-2 text-xs sm:text-sm border-b border-slate-100 pb-4">
                            <div className="flex justify-between text-slate-500">
                                <span>Subtotal ({totalUnits} uds.)</span>
                                <span className="font-semibold text-slate-800">
                                    ${netSubtotal.toFixed(2)} MXN
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>IVA (16%)</span>
                                <span className="font-semibold text-slate-800">
                                    ${taxAmount.toFixed(2)} MXN
                                </span>
                            </div>
                        </div>

                        <div className="flex items-baseline justify-between">
                            <span className="text-xs font-extrabold uppercase text-slate-700">
                                Total a pagar
                            </span>
                            <div>
                                <span className="text-xl sm:text-2xl font-black text-slate-900">
                                    ${totalAmount.toFixed(2)}
                                </span>
                                <span className="text-xs font-bold text-slate-400 ml-1">
                                    MXN
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-500 space-y-0.5">
                            <p className="font-semibold text-slate-700">
                                Precios con IVA incluido · Factura opcional
                            </p>
                            <p>Elige efectivo o tarjeta en el siguiente paso.</p>
                        </div>

                        <div className="space-y-2.5 pt-1">
                            <button
                                type="button"
                                onClick={handleProceedToCheckout}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-2xl text-xs sm:text-sm transition cursor-pointer"
                            >
                                Continuar compra
                            </button>

                            <Link
                                href="/"
                                className="w-full block text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition"
                            >
                                Seguir comprando
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
