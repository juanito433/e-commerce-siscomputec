import { useEffect, useMemo, useState } from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import OverviewTab from "@/Components/Admin/OverviewTab";
import ProductsTab from "@/Components/Admin/ProductsTab";
import OrdersTab from "@/Components/Admin/OrdersTab";

const SMOOTH_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function Dashboard({
    auth,
    products = [],
    categories = [],
    orders = [],
}) {
    const { flash } = usePage().props;
    const firstCategoryId = categories[0]?.id ? String(categories[0].id) : "";

    const [activeTab, setActiveTab] = useState("overview");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dismissedFlash, setDismissedFlash] = useState(false);
    const [dismissedMissingAlert, setDismissedMissingAlert] = useState(false);

    const [productModalOpen, setProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [selectedOrder, setSelectedOrder] = useState(null);
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
                severity: "warning",
                title: "Falta crear categorías",
                message:
                    "Crea la primera categoría (ej. Router, Switch, CCTV) para habilitar el alta de productos.",
                actionLabel: "+ Crear categoría",
                onAction: () => openCreateCategory(),
            };
        }

        if (products.length === 0) {
            return {
                severity: "info",
                title: "Falta registrar productos o servicios",
                message: "Agrega tu primer producto o servicio para poblar el catálogo.",
                actionLabel: "+ Nuevo Producto / Servicio",
                onAction: () => openCreateProduct(),
            };
        }

        if (outOfStockCount > 0) {
            return {
                severity: "warning",
                title: "Productos sin stock disponible",
                message: `Hay ${outOfStockCount} ${
                    outOfStockCount === 1 ? "artículo con stock en 0" : "artículos con stock en 0"
                }.`,
                actionLabel: "Ver inventario",
                onAction: () => setActiveTab("products"),
            };
        }

        if (hiddenProductsCount > 0) {
            return {
                severity: "info",
                title: "Productos ocultos en tienda",
                message: `Tienes ${hiddenProductsCount} ${
                    hiddenProductsCount === 1 ? "artículo oculto" : "artículos ocultos"
                } para clientes.`,
                actionLabel: "Revisar productos",
                onAction: () => setActiveTab("products"),
            };
        }

        return null;
    }, [categories, products]);

    // --- Categorías ---
    const openCreateCategory = () => {
        setEditingCategory(null);
        categoryForm.reset();
        categoryForm.clearErrors();
        setActiveTab("categories");
        setCategoryModalOpen(true);
    };

    const openEditCategory = (cat) => {
        setEditingCategory(cat);
        categoryForm.setData({ name: cat.name || "" });
        categoryForm.clearErrors();
        setCategoryModalOpen(true);
    };

    const submitCategory = (e) => {
        e.preventDefault();
        if (editingCategory) {
            categoryForm.put(route("admin.categories.update", editingCategory.id), {
                preserveScroll: true,
                onSuccess: () => setCategoryModalOpen(false),
            });
        } else {
            categoryForm.post(route("admin.categories.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    setCategoryModalOpen(false);
                    setActiveTab("products");
                },
            });
        }
    };

    const deleteCategory = (cat) => {
        if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
        router.delete(route("admin.categories.destroy", cat.id), { preserveScroll: true });
    };

    // --- Productos ---
    const openCreateProduct = () => {
        if (categories.length === 0) {
            openCreateCategory();
            return;
        }
        setEditingProduct(null);
        productForm.reset();
        productForm.clearErrors();
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
        setActiveTab("products");
        setProductModalOpen(true);
    };

    const openEditProduct = (prod) => {
        setEditingProduct(prod);
        productForm.clearErrors();
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
        const catId =
            String(productForm.data.category_id || "") ||
            (categories[0]?.id ? String(categories[0].id) : "");
        if (!catId) return;

        productForm.setData("category_id", catId);
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                productForm.reset();
                setProductModalOpen(false);
            },
        };

        if (editingProduct) {
            productForm.post(route("admin.products.update", editingProduct.id), options);
        } else {
            productForm.post(route("admin.products.store"), options);
        }
    };

    const deleteProduct = (prod) => {
        if (!confirm(`¿Eliminar "${prod.name}" del inventario?`)) return;
        router.delete(route("admin.products.destroy", prod.id), { preserveScroll: true });
    };

    // --- Órdenes: Pago y Entrega (código corto / QR) ---
    const handleConfirmPayment = (order) => {
        router.patch(
            route("admin.orders.update", order.id),
            { payment_status: "paid" },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCodeFeedback((prev) => ({
                        ...prev,
                        [order.id]: { ok: true, text: "Pago marcado como pagado." },
                    }));
                },
            }
        );
    };

    const handleConfirmDelivery = (order) => {
        const rawInput = (codeInputs[order.id] || "").trim().toUpperCase();
        let extractedCode = rawInput;

        if (rawInput.startsWith("{")) {
            try {
                const parsed = JSON.parse(rawInput);
                extractedCode = String(parsed.code || "").trim().toUpperCase();
            } catch {
                // Usa el texto tal cual si no es JSON válido
            }
        }

        if (order.pickup_code) {
            if (!extractedCode) {
                setCodeFeedback((prev) => ({
                    ...prev,
                    [order.id]: { ok: false, text: "Ingresa el código corto o escanea el QR." },
                }));
                return;
            }
            if (extractedCode !== String(order.pickup_code).toUpperCase()) {
                setCodeFeedback((prev) => ({
                    ...prev,
                    [order.id]: { ok: false, text: "El código o QR no coincide con esta orden." },
                }));
                return;
            }
        }

        router.patch(
            route("admin.orders.update", order.id),
            {
                status: "completed",
                pickup_code: extractedCode || order.pickup_code,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCodeFeedback((prev) => ({
                        ...prev,
                        [order.id]: {
                            ok: true,
                            text: "Entrega autenticada · Pedido completado.",
                        },
                    }));
                },
            }
        );
    };

    const navItems = [
        { id: "overview", label: "Resumen General", badge: null },
        { id: "products", label: "Inventario y Productos", badge: products.length },
        { id: "categories", label: "Gestión de Categorías", badge: categories.length },
        { id: "orders", label: "Órdenes de Clientes", badge: orders.length },
    ];

    const renderSidebarNav = (onAfterSelect) => (
        <nav aria-label="Secciones del panel" className="p-3 space-y-1">
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                            setActiveTab(item.id);
                            onAfterSelect?.();
                        }}
                        style={{ transitionTimingFunction: SMOOTH_EASE }}
                        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            isActive
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-300 hover:bg-slate-800/90 hover:text-white"
                        }`}
                    >
                        <span className="truncate">{item.label}</span>
                        {item.badge !== null && (
                            <span
                                className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                                    isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                                }`}
                            >
                                {item.badge}
                            </span>
                        )}
                    </button>
                );
            })}
        </nav>
    );

    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-slate-50 text-slate-800 font-sans antialiased">
            <Head title="Panel de Administración · Siscomputec" />

            {/* SIDEBAR FIJA EN ESCRITORIO (no scrollea con el contenido) */}
            <aside className="hidden lg:flex w-64 lg:h-screen bg-slate-900 text-slate-200 flex-col justify-between flex-shrink-0">
                <div>
                    <div className="px-6 py-5 border-b border-slate-800">
                        <span className="text-base font-bold tracking-tight text-white block">
                            SISCOMPUTEC
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 mt-0.5 block">
                            Gestión de Taller y Tienda · Cancún
                        </span>
                    </div>
                    {renderSidebarNav()}
                </div>

                <div className="p-4 border-t border-slate-800">
                    <Link
                        href="/"
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        <span>← Volver a la Tienda</span>
                    </Link>
                </div>
            </aside>

            {/* MENÚ MÓVIL DESLIZABLE (DRAWER) */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-950/60"
                    />
                    <aside className="relative z-10 w-72 max-w-[82vw] h-full bg-slate-900 text-slate-200 flex flex-col justify-between shadow-2xl">
                        <div>
                            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                                <div>
                                    <span className="text-sm font-bold text-white block">
                                        SISCOMPUTEC
                                    </span>
                                    <span className="text-[11px] text-slate-400">
                                        Panel Administrativo
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-slate-400 hover:text-white px-2 py-1 rounded-lg text-xs cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                            {renderSidebarNav(() => setMobileMenuOpen(false))}
                        </div>

                        <div className="p-4 border-t border-slate-800">
                            <Link
                                href="/"
                                className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                            >
                                ← Volver a la Tienda
                            </Link>
                        </div>
                    </aside>
                </div>
            )}

            {/* CONTENEDOR PRINCIPAL: SOLO ESTO SCROLLEA EN ESCRITORIO */}
            <div className="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-y-auto">
                <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 flex items-center justify-between gap-3 sticky top-0 z-20">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Abrir menú"
                            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white text-sm font-semibold flex-shrink-0 cursor-pointer"
                        >
                            ☰
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate">
                                {activeTab === "overview" && "Resumen General"}
                                {activeTab === "products" && "Inventario General y Servicios"}
                                {activeTab === "categories" && "Gestión de Categorías"}
                                {activeTab === "orders" && "Órdenes de Clientes"}
                            </h1>
                            <p className="text-xs text-slate-500 truncate hidden sm:block">
                                {activeTab === "overview" &&
                                    "Ganancias, movimientos recientes, reposición e inversión."}
                                {activeTab === "products" &&
                                    "Administra existencias, precios con IVA y catálogo."}
                                {activeTab === "categories" &&
                                    "Organiza tus categorías de hardware, redes y CCTV."}
                                {activeTab === "orders" &&
                                    "Filtra folios, autentica entregas por QR/código e imprime tickets."}
                            </p>
                        </div>
                    </div>

                    <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium flex-shrink-0">
                        {auth?.user?.name ? `Admin: ${auth.user.name}` : "Admin"}
                    </span>
                </header>

                {!dismissedFlash && flash?.success && (
                    <div className="px-4 sm:px-8 pt-4">
                        <div className="rounded-2xl border border-blue-200 bg-blue-50/80 text-blue-950 px-4 py-3 flex items-center justify-between gap-3 text-xs">
                            <span className="font-semibold">{flash.success}</span>
                            <button
                                type="button"
                                onClick={() => setDismissedFlash(true)}
                                className="text-blue-700 hover:text-blue-950 px-2 py-1 rounded-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {!dismissedMissingAlert && missingChecklist && (
                    <div className="px-4 sm:px-8 pt-4">
                        <div
                            className={`rounded-2xl border px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                                missingChecklist.severity === "warning"
                                    ? "bg-amber-50/90 border-amber-200 text-amber-950"
                                    : "bg-slate-100/90 border-slate-200 text-slate-900"
                            }`}
                        >
                            <div>
                                <span className="font-semibold block">{missingChecklist.title}</span>
                                <span>{missingChecklist.message}</span>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                                {missingChecklist.onAction && (
                                    <button
                                        type="button"
                                        onClick={missingChecklist.onAction}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
                                    >
                                        {missingChecklist.actionLabel}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setDismissedMissingAlert(true)}
                                    className="text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg text-xs cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 p-4 sm:p-8 space-y-6">
                    {activeTab === "overview" && (
                        <OverviewTab
                            products={products}
                            categories={categories}
                            orders={orders}
                            onNavigateTab={setActiveTab}
                            onOpenCreateCategory={openCreateCategory}
                            onSelectOrder={(ord) => {
                                setSelectedOrder(ord);
                                setActiveTab("orders");
                            }}
                        />
                    )}

                    {(activeTab === "products" || activeTab === "categories") && (
                        <ProductsTab
                            mode={activeTab}
                            products={products}
                            categories={categories}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onOpenCreateCategory={openCreateCategory}
                            onOpenEditCategory={openEditCategory}
                            onDeleteCategory={deleteCategory}
                            onOpenCreateProduct={openCreateProduct}
                            onOpenEditProduct={openEditProduct}
                            onDeleteProduct={deleteProduct}
                            productModalOpen={productModalOpen}
                            setProductModalOpen={setProductModalOpen}
                            editingProduct={editingProduct}
                            productForm={productForm}
                            onSubmitProduct={submitProduct}
                            categoryModalOpen={categoryModalOpen}
                            setCategoryModalOpen={setCategoryModalOpen}
                            editingCategory={editingCategory}
                            categoryForm={categoryForm}
                            onSubmitCategory={submitCategory}
                        />
                    )}

                    {activeTab === "orders" && (
                        <OrdersTab
                            orders={orders}
                            selectedOrder={selectedOrder}
                            setSelectedOrder={setSelectedOrder}
                            codeInputs={codeInputs}
                            setCodeInputs={setCodeInputs}
                            codeFeedback={codeFeedback}
                            onConfirmPayment={handleConfirmPayment}
                            onConfirmDelivery={handleConfirmDelivery}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
