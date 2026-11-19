import { useEffect, useState } from "react";
import { Link, router } from "@inertiajs/react";

const ANIMATION_MS = 300;

export default function AddedToCartDrawer({
    open,
    onClose,
    product,
    productImage,
    cartItem = null,
    addedQuantity = 1,
    cartCount = 0,
    relatedProducts = [],
    
}) {
    const [shouldRender, setShouldRender] = useState(open);
    const [visible, setVisible] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        let enterRaf;
        let closeTimer;

        if (open) {
            setShouldRender(true);
            enterRaf = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setVisible(true);
                });
            });
        } else {
            setVisible(false);
            closeTimer = setTimeout(() => {
                setShouldRender(false);
            }, ANIMATION_MS);
        }

        return () => {
            if (enterRaf) cancelAnimationFrame(enterRaf);
            if (closeTimer) clearTimeout(closeTimer);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!shouldRender || !product) return null;

    const unitPrice = Number(product.price || 0);
    const maxStock = Math.max(1, Number(product.stock || 1));
    const currentItemQty = Number(cartItem?.quantity ?? addedQuantity ?? 1);
    const itemSubtotal = unitPrice * currentItemQty;

    const handleDecrement = () => {
        if (!cartItem?.id || updating) return;

        if (currentItemQty <= 1) {
            handleRemove();
            return;
        }

        router.patch(
            route("cart.items.update", cartItem.id),
            { quantity: currentItemQty - 1 },
            {
                preserveScroll: true,
                onStart: () => setUpdating(true),
                onFinish: () => setUpdating(false),
            }
        );
    };

    const handleIncrement = () => {
        if (!cartItem?.id || updating || currentItemQty >= maxStock) return;

        router.patch(
            route("cart.items.update", cartItem.id),
            { quantity: currentItemQty + 1 },
            {
                preserveScroll: true,
                onStart: () => setUpdating(true),
                onFinish: () => setUpdating(false),
            }
        );
    };

    const handleRemove = () => {
        if (!cartItem?.id || updating) return;

        router.delete(route("cart.items.destroy", cartItem.id), {
            preserveScroll: true,
            onStart: () => setUpdating(true),
            onFinish: () => {
                setUpdating(false);
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end items-end sm:items-stretch pointer-events-none">
            {/* Backdrop suave */}
            <div
                onClick={onClose}
                style={{ transitionDuration: `${ANIMATION_MS}ms` }}
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity ease-out ${
                    visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                aria-hidden="true"
            />

            {/* Panel deslizable minimalista */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Producto en el carrito"
                style={{
                    transitionDuration: `${ANIMATION_MS}ms`,
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                className={`pointer-events-auto relative z-10 w-full sm:max-w-md bg-white shadow-2xl rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none sm:h-full flex flex-col justify-between max-h-[90vh] sm:max-h-none overflow-hidden transition-transform will-change-transform ${
                    visible
                        ? "translate-y-0 sm:translate-x-0"
                        : "translate-y-full sm:translate-y-0 sm:translate-x-full"
                }`}
            >
                {/* Cuerpo */}
                <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1">
                    {/* Cabecera limpia */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-semibold tracking-wide text-slate-500">
                                En tu carrito
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar"
                            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tarjeta principal con ajuste de cantidad y quitar */}
                    <div className="rounded-2xl bg-slate-50/90 border border-slate-200/70 p-4 sm:p-5 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200/60 p-2 flex items-center justify-center flex-shrink-0">
                                <img
                                    src={productImage}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium text-blue-600">
                                    {product.category?.name || "Siscomputec"}
                                </p>
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug mt-0.5">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    ${unitPrice.toFixed(2)} MXN c/u
                                </p>
                            </div>
                        </div>

                        {/* Controles de cantidad y quitar */}
                        <div className="pt-3.5 border-t border-slate-200/70 flex items-center justify-between gap-3">
                            {cartItem?.id ? (
                                <div className="flex items-center gap-2">
                                    <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden">
                                        <button
                                            type="button"
                                            disabled={updating}
                                            onClick={handleDecrement}
                                            aria-label="Disminuir cantidad"
                                            className="px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                                        >
                                            −
                                        </button>
                                        <span className="px-3 py-1.5 text-xs font-extrabold text-slate-900 border-x border-slate-200">
                                            {currentItemQty}
                                        </span>
                                        <button
                                            type="button"
                                            disabled={updating || currentItemQty >= maxStock}
                                            onClick={handleIncrement}
                                            aria-label="Aumentar cantidad"
                                            className="px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={updating}
                                        onClick={handleRemove}
                                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition disabled:opacity-40 cursor-pointer"
                                    >
                                        Quitar
                                    </button>
                                </div>
                            ) : (
                                <span className="text-xs font-medium text-slate-500">
                                    {currentItemQty} {currentItemQty === 1 ? "unidad" : "unidades"}
                                </span>
                            )}

                            <div className="text-right">
                                <span className="text-[10px] font-medium text-slate-400 block">
                                    Subtotal
                                </span>
                                <span className="text-lg font-black text-slate-900 tracking-tight">
                                    ${itemSubtotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sugerencias minimalistas */}
                    {relatedProducts.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-slate-400">
                                También te puede servir
                            </h4>

                            <div className="divide-y divide-slate-100">
                                {relatedProducts.slice(0, 3).map((item) => {
                                    const img =
                                        item.images?.find((i) => i.is_primary)?.image_url ||
                                        item.images?.[0]?.image_url ||
                                        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80";

                                    return (
                                        <Link
                                            key={item.id}
                                            href={route("products.show", item.id)}
                                            onClick={onClose}
                                            className="py-2.5 flex items-center justify-between gap-3 group hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img
                                                    src={img}
                                                    alt={item.name}
                                                    className="w-11 h-11 rounded-xl object-contain bg-slate-50 p-1 flex-shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-500 mt-0.5">
                                                        ${Number(item.price || 0).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-300 group-hover:text-blue-600 transition">
                                                ›
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Acciones al pie */}
                <div className="p-6 pt-4 border-t border-slate-100 bg-white space-y-2.5">
                    <Link
                        href="/mi-cuenta?tab=cart"
                        className="w-full flex items-center justify-center bg-slate-900 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-2xl text-sm transition"
                    >
                        Ver carrito ({cartCount})
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2.5 px-4 rounded-2xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                    >
                        Seguir viendo
                    </button>
                </div>
            </aside>
        </div>
    );
}
