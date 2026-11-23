import { useEffect, useMemo, useState } from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";

const SMOOTH_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const ORDER_STATUS_LABELS = {
    pending: "Pendiente",
    preparing: "En preparación",
    ready_for_pickup: "Listo para recoger / entregar",
    completed: "Completado",
    cancelled: "Cancelado",
};

const PAYMENT_STATUS_LABELS = {
    unpaid: "Por pagar (efectivo/local)",
    pending: "Pago pendiente",
    paid: "Pagado",
    failed: "Fallido",
    refunded: "Reembolsado",
};

const CATEGORY_ICONS = {
    cctv: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),
    network: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
    ),
    hardware: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
    ),
    cables: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
};

function CategoryIcon({ name = "" }) {
    const key = name.toLowerCase();
    if (key.includes("cctv") || key.includes("cámara") || key.includes("camara")) {
        return CATEGORY_ICONS.cctv;
    }
    if (key.includes("router") || key.includes("switch") || key.includes("red") || key.includes("wifi")) {
        return CATEGORY_ICONS.network;
    }
    if (key.includes("cable") || key.includes("hdmi") || key.includes("utp")) {
        return CATEGORY_ICONS.cables;
    }
    return CATEGORY_ICONS.hardware;
}

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
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-xs font-semibold text-slate-600">
                    Sin datos de ventas todavía
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                    Aquí se graficará el monto de tus órdenes recientes conforme los clientes confirmen pedidos.
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
                                    style={{
                                        height: `${heightPct}%`,
                                        transitionTimingFunction: SMOOTH_EASE,
                                    }}
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
                        Por cobrar / pendiente
                    </span>
                </div>
            </div>
        </div>
    );
}

function CategoryDistributionChart({ categories = [], products = [], onCreateCategory }) {
    const rows = useMemo(() => {
        if (!Array.isArray(categories) || categories.length === 0) return [];
        return categories.map((cat) => {
            const count =
                typeof cat.products_count === "number"
                    ? cat.products_count
                    : products.filter((p) => String(p.category_id) === String(cat.id)).length;
            return {
                id: cat.id,
                name: cat.name,
                count,
            };
        });
    }, [categories, products]);

    const maxCount = useMemo(() => {
        if (rows.length === 0) return 1;
        return Math.max(1, ...rows.map((r) => r.count));
    }, [rows]);

    if (rows.length === 0) {
        return (
            <div className="h-56 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center p-6 text-center space-y-2.5">
                <p className="text-xs font-semibold text-slate-600">
                    Sin categorías para distribuir
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                    Crea categorías como Switches, Routers o CCTV para visualizar el balance de tu inventario.
                </p>
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
                                style={{
                                    width: `${widthPct}%`,
                                    transitionTimingFunction: SMOOTH_EASE,
                                }}
                                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function Dashboard({
    auth,
    products = [],
    categories = [],
    orders = [],
}) {
    const { flash } = usePage().props;

    const firstCategoryId = categories[0]?.id ? String(categories[0].id) : "";

    const [activeTab, setActiveTab] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [orderFilter, setOrderFilter] = useState("all");
    const [dismissedFlash, setDismissedFlash] = useState(false);
    const [dismissedMissingAlert, setDismissedMissingAlert] = useState(false);

    // Modal de Producto
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Modal de Categoría
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Validación rápida de código de entrega/recolección en Órdenes
    const [codeInputs, setCodeInputs] = useState({});
    const [codeFeedback, setCodeFeedback] = useState({});

    const productForm = useForm({
        name: "",
        sku: "",
        category_id: firstCategoryId,
        price: "",
        stock: "1",
        is_active: true,
        is_new: true,
        description: "",
        image: null,
    });

    const categoryForm = useForm({
        name: "",
    });

    useEffect(() => {
        if (flash?.success) {
            setDismissedFlash(false);
            setDismissedMissingAlert(false);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (categories.length > 0 && !productForm.data.category_id) {
            productForm.setData("category_id", String(categories[0].id));
        }
    }, [categories]);

    const missingChecklist = useMemo(() => {
        const outOfStockCount = products.filter((p) => Number(p.stock ?? 0) <= 0).length;
        const hiddenProductsCount = products.filter((p) => !p.is_active).length;

        if (categories.length === 0) {
            return {
                key: "no_categories",
                severity: "warning",
                title: "Falta crear categorías",
                message:
                    "Aún no hay categorías registradas. Crea la primera (ej. Router, Switch, CCTV) para habilitar el alta de productos.",
                actionLabel: "+ Crear categoría",
                onAction: () => {
                    setActiveTab("categories");
                    setEditingCategory(null);
                    categoryForm.reset();
                    setCategoryModalOpen(true);
                },
            };
        }

        if (products.length === 0) {
            return {
                key: "no_products",
                severity: "info",
                title: "Falta registrar productos o servicios",
                message:
                    "Ya tienes categorías creadas, pero aún no hay productos en el inventario. Agrega el primero para mostrarlo en el catálogo.",
                actionLabel: "+ Nuevo Producto / Servicio",
                onAction: () => {
                    setActiveTab("products");
                    setEditingProduct(null);
                    productForm.reset();
                    productForm.setData({
                        name: "",
                        sku: "",
                        category_id: String(categories[0].id),
                        price: "",
                        stock: "1",
                        is_active: true,
                        is_new: true,
                        description: "",
                        image: null,
                    });
                    setProductModalOpen(true);
                },
            };
        }

        if (outOfStockCount > 0) {
            return {
                key: `low_stock_${outOfStockCount}`,
                severity: "warning",
                title: "Productos sin stock disponible",
                message: `Detectamos ${outOfStockCount} ${
                    outOfStockCount === 1 ? "producto con stock en 0" : "productos con stock en 0"
                }. Revisa el inventario para evitar pedidos sin existencia.`,
                actionLabel: "Ver inventario",
                onAction: () => setActiveTab("products"),
            };
        }

        if (hiddenProductsCount > 0) {
            return {
                key: `hidden_prods_${hiddenProductsCount}`,
                severity: "info",
                title: "Productos ocultos en tienda",
                message: `Tienes ${hiddenProductsCount} ${
                    hiddenProductsCount === 1 ? "artículo marcado como oculto" : "artículos marcados como ocultos"
                } para los clientes.`,
                actionLabel: "Revisar productos",
                onAction: () => setActiveTab("products"),
            };
        }

        return null;
    }, [categories, products]);

    const confirmedRevenue = useMemo(() => {
        return orders
            .filter((o) => o.payment_status === "paid")
            .reduce((sum, o) => sum + Number(o.total || 0), 0);
    }, [orders]);

    const filteredProducts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return products;
        return products.filter(
            (p) =>
                p.name?.toLowerCase().includes(q) ||
                p.sku?.toLowerCase().includes(q) ||
                p.category?.name?.toLowerCase().includes(q)
        );
    }, [products, searchQuery]);

    const filteredOrders = useMemo(() => {
        if (orderFilter === "all") return orders;
        return orders.filter((o) => o.status === orderFilter);
    }, [orders, orderFilter]);

    // --- Handlers de Categorías ---
    const openCreateCategory = () => {
        setEditingCategory(null);
        categoryForm.reset();
        setCategoryModalOpen(true);
    };

    const openEditCategory = (cat) => {
        setEditingCategory(cat);
        categoryForm.setData({
            name: cat.name || "",
        });
        setCategoryModalOpen(true);
    };

    const submitCategory = (e) => {
        e.preventDefault();
        if (editingCategory) {
            categoryForm.put(route("admin.categories.update", editingCategory.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setCategoryModalOpen(false);
                    setDismissedMissingAlert(false);
                },
            });
        } else {
            categoryForm.post(route("admin.categories.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    setCategoryModalOpen(false);
                    setDismissedMissingAlert(false);
                    setActiveTab("products");
                },
            });
        }
    };

    const deleteCategory = (cat) => {
        if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
        router.delete(route("admin.categories.destroy", cat.id), {
            preserveScroll: true,
        });
    };

    // --- Handlers de Productos ---
    const openCreateProduct = () => {
        if (categories.length === 0) {
            setDismissedMissingAlert(false);
            setActiveTab("categories");
            openCreateCategory();
            return;
        }
        const defaultCatId = String(categories[0].id);
        setEditingProduct(null);
        productForm.reset();
        productForm.setData({
            name: "",
            sku: "",
            category_id: defaultCatId,
            price: "",
            stock: "1",
            is_active: true,
            is_new: true,
            description: "",
            image: null,
        });
        setProductModalOpen(true);
    };

    const openEditProduct = (prod) => {
        setEditingProduct(prod);
        productForm.setData({
            name: prod.name || "",
            sku: prod.sku || "",
            category_id: String(prod.category_id ?? categories[0]?.id ?? ""),
            price: prod.price ?? "",
            stock: prod.stock ?? 0,
            is_active: Boolean(prod.is_active ?? true),
            is_new: Boolean(prod.is_new ?? false),
            description: prod.description || "",
            image: null,
        });
        setProductModalOpen(true);
    };

    const submitProduct = (e) => {
        e.preventDefault();
        const resolvedCategoryId =
            String(productForm.data.category_id || "") ||
            (categories[0]?.id ? String(categories[0].id) : "");

        productForm.transform((data) => ({
            ...data,
            category_id: resolvedCategoryId,
        }));

        const callbacks = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                productForm.transform((d) => d);
                setProductModalOpen(false);
                setDismissedMissingAlert(false);
            },
            onError: () => {
                productForm.transform((d) => d);
            },
        };

        if (editingProduct) {
            productForm.post(route("admin.products.update", editingProduct.id), callbacks);
        } else {
            productForm.post(route("admin.products.store"), callbacks);
        }
    };

    const deleteProduct = (prod) => {
        if (!confirm(`¿Eliminar "${prod.name}" del inventario?`)) return;
        router.delete(route("admin.products.destroy", prod.id), {
            preserveScroll: true,
        });
    };

    // --- Validación de código de entrega ---
    const handleConfirmCodeOrStatus = (order, nextStatus = "completed") => {
        const enteredCode = (codeInputs[order.id] || "").trim().toUpperCase();

        if (nextStatus === "completed" && order.pickup_code) {
            if (!enteredCode) {
                setCodeFeedback((prev) => ({
                    ...prev,
                    [order.id]: { ok: false, text: "Ingresa el código de entrega del cliente." },
                }));
                return;
            }
            if (enteredCode !== String(order.pickup_code).toUpperCase()) {
                setCodeFeedback((prev) => ({
                    ...prev,
                    [order.id]: { ok: false, text: "El código no coincide con esta orden." },
                }));
                return;
            }
        }

        try {
            router.patch(
                route("admin.orders.update", order.id),
                {
                    status: nextStatus,
                    pickup_code: enteredCode || order.pickup_code,
                    mark_paid: order.payment_status !== "paid" && nextStatus === "completed",
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setCodeFeedback((prev) => ({
                            ...prev,
                            [order.id]: {
                                ok: true,
                                text: "Código validado · Pedido marcado como completado.",
                            },
                        }));
                    },
                }
            );
        } catch {
            setCodeFeedback((prev) => ({
                ...prev,
                [order.id]: {
                    ok: true,
                    text: `Código ${enteredCode} verificado (conecta PATCH /admin/ordenes/{order} para persistir en BD).`,
                },
            }));
        }
    };

    const navItems = [
        {
            id: "overview",
            label: "Resumen General",
            badge: null,
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
        },
        {
            id: "products",
            label: "Inventario y Productos",
            badge: products.length,
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            id: "categories",
            label: "Gestión de Categorías",
            badge: categories.length,
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
        },
        {
            id: "orders",
            label: "Órdenes de Clientes",
            badge: orders.length,
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-800 font-sans antialiased">
            <Head title="Panel de Administración · Siscomputec" />

            {/* 30% SECUNDARIO: Barra lateral oscura de navegación */}
            <aside className="w-full lg:w-64 bg-slate-900 text-slate-200 flex flex-col justify-between flex-shrink-0">
                <div>
                    <div className="px-6 py-5 border-b border-slate-800">
                        <span className="text-base font-bold tracking-tight text-white block">
                            SISCOMPUTEC
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 mt-0.5 block">
                            Gestión de Taller y Tienda · Cancún
                        </span>
                    </div>

                    <nav aria-label="Secciones del panel" className="p-3 space-y-1">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveTab(item.id)}
                                    style={{ transitionTimingFunction: SMOOTH_EASE }}
                                    className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-slate-300 hover:bg-slate-800/90 hover:text-white"
                                    }`}
                                >
                                    <span className="flex items-center gap-2.5 truncate">
                                        {item.icon}
                                        <span className="truncate">{item.label}</span>
                                    </span>
                                    {item.badge !== null && (
                                        <span
                                            className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                                                isActive
                                                    ? "bg-white/20 text-white"
                                                    : "bg-slate-800 text-slate-400"
                                            }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <Link
                        href="/"
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200"
                    >
                        <span>← Volver a la Tienda</span>
                    </Link>
                </div>
            </aside>

            {/* 60% DOMINANTE + 10% ACENTO AZUL: Área principal de trabajo */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200/80 px-5 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                            {activeTab === "overview" && "Resumen General"}
                            {activeTab === "products" && "Inventario General y Servicios"}
                            {activeTab === "categories" && "Gestión de Categorías"}
                            {activeTab === "orders" && "Órdenes de Clientes"}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {activeTab === "overview" &&
                                "Vista general de tu tienda, movimientos recientes y distribución del catálogo."}
                            {activeTab === "products" &&
                                "Administra existencias, precios con IVA incluido y publicaciones del catálogo."}
                            {activeTab === "categories" &&
                                "Organiza tus líneas de hardware, redes, CCTV y servicios técnicos."}
                            {activeTab === "orders" &&
                                "Revisa pedidos, estados de pago, facturación CFDI 4.0 y códigos de entrega."}
                        </p>
                    </div>

                    <span className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        {auth?.user?.name ? `Admin: ${auth.user.name}` : "Admin: Sistemas"}
                    </span>
                </header>

                {!dismissedFlash && flash?.success && (
                    <div className="px-5 sm:px-8 pt-4">
                        <div
                            role="status"
                            style={{ transitionTimingFunction: SMOOTH_EASE }}
                            className="rounded-2xl border border-blue-200 bg-blue-50/80 text-blue-950 px-4 py-3 flex items-center justify-between gap-3 text-xs transition-all duration-300"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                                <span className="font-semibold">{flash.success}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDismissedFlash(true)}
                                aria-label="Cerrar notificación"
                                className="text-blue-700 hover:text-blue-950 px-2 py-1 rounded-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {!dismissedMissingAlert && missingChecklist && (
                    <div className="px-5 sm:px-8 pt-4">
                        <div
                            role="status"
                            style={{ transitionTimingFunction: SMOOTH_EASE }}
                            className={`rounded-2xl border px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300 ${
                                missingChecklist.severity === "warning"
                                    ? "bg-amber-50/90 border-amber-200 text-amber-950"
                                    : "bg-slate-100/90 border-slate-200 text-slate-900"
                            }`}
                        >
                            <div className="flex items-start sm:items-center gap-2.5 text-xs">
                                <span
                                    className={`w-2 h-2 rounded-full mt-1 sm:mt-0 flex-shrink-0 ${
                                        missingChecklist.severity === "warning"
                                            ? "bg-amber-500"
                                            : "bg-blue-600"
                                    }`}
                                />
                                <div>
                                    <span className="font-semibold block">
                                        {missingChecklist.title}
                                    </span>
                                    <span>{missingChecklist.message}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                                {missingChecklist.onAction && (
                                    <button
                                        type="button"
                                        onClick={missingChecklist.onAction}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                    >
                                        {missingChecklist.actionLabel}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setDismissedMissingAlert(true)}
                                    aria-label="Cerrar aviso"
                                    className="text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg text-xs cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 p-5 sm:p-8 space-y-6">
                    {/* RESUMEN GENERAL */}
                    {activeTab === "overview" && (
                        <section
                            key="tab-overview"
                            style={{ transitionTimingFunction: SMOOTH_EASE }}
                            className="space-y-6 transition-all duration-300"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1">
                                    <span className="text-xs font-medium text-slate-500">
                                        Ingresos confirmados
                                    </span>
                                    <p className="text-xl font-bold text-slate-900">
                                        ${confirmedRevenue.toFixed(2)}{" "}
                                        <span className="text-xs font-medium text-slate-400">
                                            MXN
                                        </span>
                                    </p>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1">
                                    <span className="text-xs font-medium text-slate-500">
                                        Órdenes registradas
                                    </span>
                                    <p className="text-xl font-bold text-slate-900">
                                        {orders.length}
                                    </p>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1">
                                    <span className="text-xs font-medium text-slate-500">
                                        Productos en catálogo
                                    </span>
                                    <p className="text-xl font-bold text-slate-900">
                                        {products.length}
                                    </p>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-1">
                                    <span className="text-xs font-medium text-slate-500">
                                        Categorías activas
                                    </span>
                                    <p className="text-xl font-bold text-slate-900">
                                        {categories.length}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                                <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <h2 className="text-sm font-bold text-slate-900">
                                                Flujo de pedidos recientes
                                            </h2>
                                            <p className="text-xs text-slate-500">
                                                Montos en MXN por orden registrada.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("orders")}
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
                                            <p className="text-xs text-slate-500">
                                                Cantidad de artículos por línea.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("categories")}
                                            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                                        >
                                            Gestionar →
                                        </button>
                                    </div>
                                    <CategoryDistributionChart
                                        categories={categories}
                                        products={products}
                                        onCreateCategory={() => {
                                            setActiveTab("categories");
                                            openCreateCategory();
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
                                <h2 className="text-sm font-bold text-slate-900">
                                    Actividad reciente
                                </h2>

                                {orders.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {orders.slice(0, 4).map((ord) => (
                                            <div
                                                key={ord.id}
                                                className="py-3 flex items-center justify-between gap-3 text-xs"
                                            >
                                                <div>
                                                    <span className="font-mono font-semibold text-slate-900">
                                                        {ord.order_number || `#${ord.id}`}
                                                    </span>
                                                    <span className="text-slate-500 ml-2">
                                                        {ord.user?.name || "Cliente"} ·{" "}
                                                        {ORDER_STATUS_LABELS[ord.status] || ord.status}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-slate-900">
                                                    ${Number(ord.total || 0).toFixed(2)} MXN
                                                </span>
                                            </div>
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
                        </section>
                    )}

                    {/* INVENTARIO Y PRODUCTOS */}
                    {activeTab === "products" && (
                        <section
                            key="tab-products"
                            style={{ transitionTimingFunction: SMOOTH_EASE }}
                            className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5 transition-all duration-300"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="relative w-full sm:max-w-xs">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Buscar por nombre o SKU..."
                                        className="w-full rounded-xl bg-slate-50 border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all duration-200"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={openCreateProduct}
                                    className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                >
                                    <span>+ Nuevo Producto / Servicio</span>
                                </button>
                            </div>

                            {categories.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center space-y-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Aún no hay categorías registradas
                                    </p>
                                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                                        Para dar de alta productos o servicios en Siscomputec, primero crea al menos una categoría.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTab("categories");
                                            openCreateCategory();
                                        }}
                                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors duration-200 cursor-pointer"
                                    >
                                        Ir a crear primera categoría
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                                <th className="py-3 pr-4">SKU / Ítem</th>
                                                <th className="py-3 px-4">Categoría</th>
                                                <th className="py-3 px-4">Precio ($)</th>
                                                <th className="py-3 px-4">Stock</th>
                                                <th className="py-3 px-4">Estado</th>
                                                <th className="py-3 pl-4 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((prod) => {
                                                    const primaryImg =
                                                        prod.images?.find((i) => i.is_primary)?.image_url ||
                                                        prod.images?.[0]?.image_url;

                                                    return (
                                                        <tr
                                                            key={prod.id}
                                                            className="hover:bg-slate-50/90 transition-colors duration-150"
                                                        >
                                                            <td className="py-3.5 pr-4">
                                                                <div className="flex items-center gap-3">
                                                                    {primaryImg && (
                                                                        <img
                                                                            src={primaryImg}
                                                                            alt={prod.name}
                                                                            className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 p-0.5 flex-shrink-0"
                                                                        />
                                                                    )}
                                                                    <div>
                                                                        <p className="font-semibold text-slate-900">
                                                                            {prod.name}
                                                                        </p>
                                                                        <p className="text-xs text-slate-400 font-mono">
                                                                            {prod.sku || "Sin SKU"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3.5 px-4 text-xs text-slate-600">
                                                                <span className="inline-flex items-center gap-2">
                                                                    <CategoryIcon name={prod.category?.name || ""} />
                                                                    <span>{prod.category?.name || "—"}</span>
                                                                </span>
                                                            </td>
                                                            <td className="py-3.5 px-4 font-semibold text-slate-900">
                                                                ${Number(prod.price || 0).toFixed(2)}
                                                            </td>
                                                            <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                                                                {prod.stock ?? 0} uds.
                                                            </td>
                                                            <td className="py-3.5 px-4">
                                                                <span
                                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        prod.is_active
                                                                            ? "bg-blue-50 text-blue-700"
                                                                            : "bg-slate-100 text-slate-500"
                                                                    }`}
                                                                >
                                                                    {prod.is_active ? "Activo" : "Oculto"}
                                                                </span>
                                                            </td>
                                                            <td className="py-3.5 pl-4 text-right space-x-2 whitespace-nowrap">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openEditProduct(prod)}
                                                                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => deleteProduct(prod)}
                                                                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="py-10 text-center text-xs text-slate-500"
                                                    >
                                                        {products.length === 0
                                                            ? "Aún no hay productos registrados. Haz clic en '+ Nuevo Producto / Servicio' para agregar el primero."
                                                            : "No se encontraron productos con ese criterio."}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    )}

                    {/* GESTIÓN DE CATEGORÍAS */}
                    {activeTab === "categories" && (
                        <section
                            key="tab-categories"
                            style={{ transitionTimingFunction: SMOOTH_EASE }}
                            className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900">
                                        Categorías del catálogo
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Paso 1 del catálogo: crea las categorías base para tus productos y servicios.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={openCreateCategory}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                >
                                    + Nueva Categoría
                                </button>
                            </div>

                            {categories.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categories.map((cat) => (
                                        <div
                                            key={cat.id}
                                            className="rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 p-4 flex items-center justify-between gap-3 transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <CategoryIcon name={cat.name || ""} />
                                                </span>
                                                <h3 className="text-sm font-semibold text-slate-900 truncate">
                                                    {cat.name}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditCategory(cat)}
                                                    className="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteCategory(cat)}
                                                    className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center space-y-2">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Comienza creando tu primera categoría
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Por ejemplo: Switches, Routers, CCTV, Cables o Mantenimiento.
                                    </p>
                                </div>
                            )}
                        </section>
                    )}

                    {/* ÓRDENES DE CLIENTES */}
                    {activeTab === "orders" && (
                        <section
                            key="tab-orders"
                            style={{ transitionTimingFunction: SMOOTH_EASE }}
                            className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5 transition-all duration-300"
                        >
                            <div className="flex flex-wrap items-center gap-1.5">
                                {[
                                    { id: "all", label: "Todas" },
                                    { id: "pending", label: "Pendientes" },
                                    { id: "ready_for_pickup", label: "Listas para entrega" },
                                    { id: "completed", label: "Completadas" },
                                ].map((f) => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => setOrderFilter(f.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                            orderFilter === f.id
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {filteredOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredOrders.map((order) => {
                                        const fb = codeFeedback[order.id];
                                        return (
                                            <div
                                                key={order.id}
                                                className="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 sm:p-5 space-y-4"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-sm font-bold text-slate-900 font-mono">
                                                                {order.order_number || `#${order.id}`}
                                                            </span>
                                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                                                {ORDER_STATUS_LABELS[order.status] || order.status}
                                                            </span>
                                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                                {PAYMENT_STATUS_LABELS[order.payment_status] ||
                                                                    order.payment_status}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Cliente:{" "}
                                                            <strong className="text-slate-700">
                                                                {order.user?.name || "Cliente"}
                                                            </strong>{" "}
                                                            ·{" "}
                                                            {order.delivery_method === "local_delivery"
                                                                ? "Envío local Cancún"
                                                                : "Recolección en sucursal"}
                                                            {order.requires_invoice && (
                                                                <span className="ml-2 text-blue-700 font-semibold">
                                                                    · Factura CFDI 4.0 ({order.billing_data?.rfc})
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="text-left md:text-right">
                                                        <span className="text-xs text-slate-400 block">
                                                            Total (IVA incl.)
                                                        </span>
                                                        <span className="text-base font-bold text-slate-900">
                                                            ${Number(order.total || 0).toFixed(2)} MXN
                                                        </span>
                                                    </div>
                                                </div>

                                                {order.items?.length > 0 && (
                                                    <div className="text-xs text-slate-600 space-y-1">
                                                        {order.items.map((it) => (
                                                            <div
                                                                key={it.id}
                                                                className="flex items-center justify-between gap-2"
                                                            >
                                                                <span>
                                                                    {it.quantity}× {it.product_name}
                                                                </span>
                                                                <span className="font-medium text-slate-800">
                                                                    ${Number(it.line_total || 0).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {order.status !== "completed" && order.status !== "cancelled" && (
                                                    <div className="pt-3 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <input
                                                                type="text"
                                                                maxLength={12}
                                                                placeholder="Código de entrega del cliente"
                                                                value={codeInputs[order.id] || ""}
                                                                onChange={(e) =>
                                                                    setCodeInputs((prev) => ({
                                                                        ...prev,
                                                                        [order.id]: e.target.value.toUpperCase(),
                                                                    }))
                                                                }
                                                                className="rounded-xl bg-white border-slate-200 text-xs font-mono uppercase w-52 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleConfirmCodeOrStatus(order, "completed")
                                                                }
                                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
                                                            >
                                                                Confirmar entrega
                                                            </button>
                                                        </div>

                                                        {fb && (
                                                            <span
                                                                className={`text-xs font-semibold ${
                                                                    fb.ok ? "text-blue-700" : "text-rose-600"
                                                                }`}
                                                            >
                                                                {fb.text}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center space-y-1">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Sin órdenes en esta vista
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Cuando los clientes confirmen compras desde su carrito, aparecerán aquí.
                                    </p>
                                </div>
                            )}
                        </section>
                    )}
                </main>
            </div>

            {/* MODAL DE CATEGORÍA */}
            {categoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setCategoryModalOpen(false)}
                        className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs"
                    />
                    <form
                        onSubmit={submitCategory}
                        className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4"
                    >
                        <h3 className="text-base font-bold text-slate-900">
                            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                        </h3>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Nombre de la categoría *
                            </label>
                            <input
                                type="text"
                                required
                                value={categoryForm.data.name}
                                onChange={(e) => categoryForm.setData("name", e.target.value)}
                                placeholder="Ej. Switches, Routers, CCTV"
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                            />
                            {categoryForm.errors.name && (
                                <p className="text-xs text-rose-600 mt-1">{categoryForm.errors.name}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setCategoryModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={categoryForm.processing}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 cursor-pointer"
                            >
                                {editingCategory ? "Guardar cambios" : "Crear categoría"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* MODAL DE PRODUCTO */}
            {productModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setProductModalOpen(false)}
                        className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs"
                    />
                    <form
                        onSubmit={submitProduct}
                        className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
                    >
                        <h3 className="text-base font-bold text-slate-900">
                            {editingProduct ? "Editar Producto / Servicio" : "Nuevo Producto / Servicio"}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={productForm.data.name}
                                    onChange={(e) => productForm.setData("name", e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    value={productForm.data.sku}
                                    onChange={(e) => productForm.setData("sku", e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Categoría *
                                </label>
                                <select
                                    required
                                    value={String(productForm.data.category_id || firstCategoryId)}
                                    onChange={(e) =>
                                        productForm.setData("category_id", String(e.target.value))
                                    }
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {productForm.errors.category_id && (
                                    <p className="text-xs text-rose-600 mt-1">
                                        {productForm.errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Precio MXN (IVA incl.) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={productForm.data.price}
                                    onChange={(e) => productForm.setData("price", e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Stock disponible *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={productForm.data.stock}
                                    onChange={(e) => productForm.setData("stock", e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Imagen del producto
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={(e) =>
                                    productForm.setData("image", e.target.files?.[0] || null)
                                }
                                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {productForm.errors.image && (
                                <p className="text-xs text-rose-600 mt-1">
                                    {productForm.errors.image}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Descripción y especificaciones
                            </label>
                            <textarea
                                rows={3}
                                value={productForm.data.description}
                                onChange={(e) =>
                                    productForm.setData("description", e.target.value)
                                }
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-5 pt-1 text-xs font-medium text-slate-700">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={productForm.data.is_active}
                                    onChange={(e) =>
                                        productForm.setData("is_active", e.target.checked)
                                    }
                                    className="rounded border-slate-300 text-blue-600"
                                />
                                <span>Visible en tienda</span>
                            </label>

                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={productForm.data.is_new}
                                    onChange={(e) =>
                                        productForm.setData("is_new", e.target.checked)
                                    }
                                    className="rounded border-slate-300 text-blue-600"
                                />
                                <span>Marcar como NUEVO</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setProductModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={productForm.processing}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 cursor-pointer"
                            >
                                {editingProduct ? "Guardar cambios" : "Guardar producto"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
