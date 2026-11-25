import { useMemo, useState } from "react";
import CategoryIcon from "./CategoryIcon";

const SMOOTH_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const ORDER_STATUS_LABELS = {
    pending: "Pendiente",
    preparing: "En preparación",
    ready_for_pickup: "Listo para recoger / entregar",
    completed: "Completado",
    cancelled: "Cancelado",
};

function SalesBarChart({ orders = [] }) {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const series = useMemo(() => {
        if (!Array.isArray(orders) || orders.length === 0) return [];
        return orders
            .slice(0, 7)
            .reverse()
            .map((ord, idx) => ({
                label: ord.order_number ? ord.order_number.slice(-4) : `#${ord.id || idx + 1}`,
                fullLabel: ord.order_number || `Orden #${ord.id || idx + 1}`,
                amount: Number(ord.total || 0),
                paid: ord.payment_status === "paid",
            }));
    }, [orders]);

    const maxAmount = useMemo(() => {
        if (series.length === 0) return 100;
        const top = Math.max(...series.map((s) => s.amount));
        return top > 0 ? top : 100;
    }, [series]);

    if (series.length === 0) {
        return (
            <div className="h-56 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <p className="text-xs font-semibold text-slate-600">Sin datos de ventas todavía</p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                    Aquí se graficará el monto de tus órdenes recientes conforme entren pedidos.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="h-52 rounded-2xl bg-slate-50/70 border border-slate-100 px-4 pt-8 pb-3 flex items-end justify-between gap-2 sm:gap-4 relative">
                {series.map((point, idx) => {
                    const heightPct = Math.max(8, Math.round((point.amount / maxAmount) * 100));
                    const isHovered = hoveredIdx === idx;
                    return (
                        <div
                            key={`${point.fullLabel}-${idx}`}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            className="flex-1 h-full flex flex-col items-center justify-end gap-2 group relative"
                        >
                            {isHovered && (
                                <div className="-top-1 absolute bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-md whitespace-nowrap z-10 pointer-events-none">
                                    {point.fullLabel}: ${point.amount.toFixed(2)}
                                </div>
                            )}
                            <div className="w-full max-w-[38px] flex-1 flex items-end">
                                <div
                                    style={{ height: `${heightPct}%`, transitionTimingFunction: SMOOTH_EASE }}
                                    className={`w-full rounded-t-xl transition-all duration-300 ${
                                        point.paid
                                            ? "bg-blue-600 group-hover:bg-blue-700"
                                            : "bg-blue-300/80 group-hover:bg-blue-500"
                                    }`}
                                />
                            </div>
                            <span className="text-[11px] font-mono text-slate-500 truncate max-w-full">
                                {point.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Últimas {series.length} órdenes</span>
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                        Pagadas
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-blue-300/80" />
                        Por cobrar
                    </span>
                </div>
            </div>
        </div>
    );
}

function CategoryDistributionChart({ categories = [], products = [], onCreateCategory }) {
    const rows = useMemo(() => {
        if (!Array.isArray(categories) || categories.length === 0) return [];
        return categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            count:
                typeof cat.products_count === "number"
                    ? cat.products_count
                    : products.filter((p) => String(p.category_id) === String(cat.id)).length,
        }));
    }, [categories, products]);

    const maxCount = useMemo(() => {
        if (rows.length === 0) return 1;
        return Math.max(1, ...rows.map((r) => r.count));
    }, [rows]);

    if (rows.length === 0) {
        return (
            <div className="h-56 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center p-6 text-center space-y-2.5">
                <p className="text-xs font-semibold text-slate-600">Sin categorías para distribuir</p>
                {onCreateCategory && (
                    <button
                        type="button"
                        onClick={onCreateCategory}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                    >
                        + Crear categoría
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="h-56 rounded-2xl bg-slate-50/70 border border-slate-100 p-4 flex flex-col justify-center space-y-3.5 overflow-y-auto">
            {rows.map((row) => {
                const widthPct = Math.max(6, Math.round((row.count / maxCount) * 100));
                return (
                    <div key={row.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="inline-flex items-center gap-2 font-medium text-slate-700 truncate">
                                <CategoryIcon name={row.name || ""} />
                                <span className="truncate">{row.name}</span>
                            </span>
                            <span className="font-semibold text-slate-900 ml-2">
                                {row.count} {row.count === 1 ? "ítem" : "ítems"}
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200/80 overflow-hidden">
                            <div
                                style={{ width: `${widthPct}%`, transitionTimingFunction: SMOOTH_EASE }}
                                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function OverviewTab({
    products = [],
    categories = [],
    orders = [],
    onNavigateTab,
    onOpenCreateCategory,
    onSelectOrder,
}) {
    const [assumedMarginPct, setAssumedMarginPct] = useState(25);

    const financeAndInventory = useMemo(() => {
        const paidOrders = orders.filter((o) => o.payment_status === "paid");
        const confirmedRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

        const productMap = new Map(products.map((p) => [Number(p.id), p]));
        let realCost = 0;
        let hasRealCostData = false;
        const soldQtyByProduct = new Map();

        orders
            .filter((o) => o.status !== "cancelled")
            .forEach((ord) => {
                (ord.items || []).forEach((item) => {
                    const pid = Number(item.product_id);
                    const qty = Number(item.quantity || 0);
                    soldQtyByProduct.set(pid, (soldQtyByProduct.get(pid) || 0) + qty);

                    if (ord.payment_status === "paid") {
                        const prod = productMap.get(pid);
                        const unitCost = Number(prod?.cost_price ?? prod?.purchase_price ?? 0);
                        if (unitCost > 0) {
                            hasRealCostData = true;
                            realCost += unitCost * qty;
                        }
                    }
                });
            });

        const estimatedProfit = hasRealCostData
            ? Math.max(0, confirmedRevenue - realCost)
            : confirmedRevenue * (Number(assumedMarginPct || 0) / 100);

        const inventoryRetailValue = products.reduce(
            (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0),
            0
        );

        const restockItems = products
            .map((p) => {
                const stock = Number(p.stock || 0);
                const sold = soldQtyByProduct.get(Number(p.id)) || 0;
                const suggestedUnits = Math.max(3, sold > 0 ? sold * 2 : 5);
                const unitCost =
                    Number(p.cost_price ?? p.purchase_price ?? 0) ||
                    Number(p.price || 0) * (1 - Number(assumedMarginPct || 0) / 100);

                return {
                    ...p,
                    stock,
                    sold,
                    suggestedUnits,
                    estimatedInvestment: suggestedUnits * unitCost,
                };
            })
            .filter((p) => p.stock <= 2 || p.sold >= 2)
            .sort((a, b) => {
                if (a.stock === 0 && b.stock > 0) return -1;
                if (b.stock === 0 && a.stock > 0) return 1;
                return b.sold - a.sold || a.stock - b.stock;
            });

        const topInvestmentIdeas = [...restockItems]
            .sort((a, b) => b.sold - a.sold || a.stock - b.stock)
            .slice(0, 4);

        const totalRestockBudget = restockItems.reduce(
            (sum, item) => sum + item.estimatedInvestment,
            0
        );

        return {
            confirmedRevenue,
            estimatedProfit,
            hasRealCostData,
            inventoryRetailValue,
            restockItems,
            topInvestmentIdeas,
            totalRestockBudget,
        };
    }, [orders, products, assumedMarginPct]);

    return (
        <section className="space-y-6">
            {/* Tarjetas financieras y de operación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1">
                    <span className="text-xs font-medium text-slate-500">Ingresos confirmados</span>
                    <p className="text-xl font-bold text-slate-900">
                        ${financeAndInventory.confirmedRevenue.toFixed(2)}{" "}
                        <span className="text-xs font-medium text-slate-400">MXN</span>
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-slate-500">
                            Ganancia {financeAndInventory.hasRealCostData ? "calculada" : "estimada"}
                        </span>
                        {!financeAndInventory.hasRealCostData && (
                            <label className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                <span>Margen %</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="95"
                                    value={assumedMarginPct}
                                    onChange={(e) => setAssumedMarginPct(e.target.value)}
                                    className="w-12 rounded-lg border-slate-200 px-1.5 py-0.5 text-[11px] text-right"
                                />
                            </label>
                        )}
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                        ${financeAndInventory.estimatedProfit.toFixed(2)}{" "}
                        <span className="text-xs font-medium text-slate-400">MXN</span>
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1">
                    <span className="text-xs font-medium text-slate-500">Valor en inventario</span>
                    <p className="text-xl font-bold text-slate-900">
                        ${financeAndInventory.inventoryRetailValue.toFixed(2)}{" "}
                        <span className="text-xs font-medium text-slate-400">MXN</span>
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1">
                    <span className="text-xs font-medium text-slate-500">Reposición sugerida</span>
                    <p className="text-xl font-bold text-slate-900">
                        ${financeAndInventory.totalRestockBudget.toFixed(2)}{" "}
                        <span className="text-xs font-medium text-slate-400">MXN</span>
                    </p>
                </div>
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Flujo de pedidos recientes
                            </h2>
                            <p className="text-xs text-slate-500">Montos en MXN por orden registrada.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigateTab("orders")}
                            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                            Ver órdenes →
                        </button>
                    </div>
                    <SalesBarChart orders={orders} />
                </div>

                <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Catálogo por categoría
                            </h2>
                            <p className="text-xs text-slate-500">Cantidad de artículos por línea.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigateTab("categories")}
                            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                            Gestionar →
                        </button>
                    </div>
                    <CategoryDistributionChart
                        categories={categories}
                        products={products}
                        onCreateCategory={onOpenCreateCategory}
                    />
                </div>
            </div>

            {/* Reposición, qué conviene invertir y actividad reciente */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Qué reponer y dónde conviene invertir
                            </h2>
                            <p className="text-xs text-slate-500">
                                Basado en stock bajo/agotado y demanda registrada en órdenes.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigateTab("products")}
                            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                            Ir a inventario →
                        </button>
                    </div>

                    {financeAndInventory.topInvestmentIdeas.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {financeAndInventory.topInvestmentIdeas.map((item) => (
                                <div
                                    key={item.id}
                                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-900">{item.name}</p>
                                        <p className="text-slate-500">
                                            Stock actual:{" "}
                                            <strong
                                                className={
                                                    item.stock === 0 ? "text-rose-600" : "text-amber-700"
                                                }
                                            >
                                                {item.stock} uds
                                            </strong>{" "}
                                            · Vendidos: <strong>{item.sold}</strong> · Reponer:{" "}
                                            <strong>+{item.suggestedUnits} uds</strong>
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <span className="text-[11px] text-slate-400 block">
                                            Inversión estimada
                                        </span>
                                        <span className="font-bold text-slate-900">
                                            ${item.estimatedInvestment.toFixed(2)} MXN
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
                            <p className="text-xs font-medium text-slate-500">
                                Tu stock está saludable por ahora. Cuando algún producto baje a 2 unidades o tenga alta rotación, aparecerá aquí.
                            </p>
                        </div>
                    )}
                </div>

                <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
                    <h2 className="text-sm font-bold text-slate-900">Actividad reciente</h2>
                    {orders.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {orders.slice(0, 4).map((ord) => (
                                <button
                                    key={ord.id}
                                    type="button"
                                    onClick={() => onSelectOrder?.(ord)}
                                    className="w-full py-3 flex items-center justify-between gap-3 text-xs text-left hover:bg-slate-50 px-2 rounded-xl transition cursor-pointer"
                                >
                                    <div className="min-w-0">
                                        <span className="font-mono font-semibold text-slate-900">
                                            {ord.order_number || `#${ord.id}`}
                                        </span>
                                        <span className="text-slate-500 ml-2">
                                            {ord.user?.name || "Cliente"} ·{" "}
                                            {ORDER_STATUS_LABELS[ord.status] || ord.status}
                                        </span>
                                    </div>
                                    <span className="font-bold text-slate-900 flex-shrink-0">
                                        ${Number(ord.total || 0).toFixed(2)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
                            <p className="text-xs font-medium text-slate-500">
                                Aún no hay actividad de órdenes. Cuando entre el primer pedido, aparecerá aquí.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
