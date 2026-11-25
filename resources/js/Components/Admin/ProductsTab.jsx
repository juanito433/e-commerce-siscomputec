import { useMemo, useState } from "react";
import CategoryIcon from "./CategoryIcon";

export default function ProductsTab({
    mode = "products", // "products" | "categories"
    products = [],
    categories = [],
    searchQuery,
    setSearchQuery,
    onOpenCreateCategory,
    onOpenEditCategory,
    onDeleteCategory,
    onOpenCreateProduct,
    onOpenEditProduct,
    onDeleteProduct,
    productModalOpen,
    setProductModalOpen,
    editingProduct,
    productForm,
    onSubmitProduct,
    categoryModalOpen,
    setCategoryModalOpen,
    editingCategory,
    categoryForm,
    onSubmitCategory,
}) {
    const [onlyLowStock, setOnlyLowStock] = useState(false);

    const firstCategoryId = categories[0]?.id ? String(categories[0].id) : "";

    const filteredProducts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return products.filter((p) => {
            if (onlyLowStock && Number(p.stock ?? 0) > 2) return false;
            if (!q) return true;
            return (
                p.name?.toLowerCase().includes(q) ||
                p.sku?.toLowerCase().includes(q) ||
                p.category?.name?.toLowerCase().includes(q)
            );
        });
    }, [products, searchQuery, onlyLowStock]);

    return (
        <>
            {mode === "products" && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar por nombre o SKU..."
                                className="w-full sm:w-64 rounded-xl bg-slate-50 border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                            />
                            <button
                                type="button"
                                onClick={() => setOnlyLowStock((prev) => !prev)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                    onlyLowStock
                                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                                }`}
                            >
                                Stock bajo / 0
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onOpenCreateProduct}
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
                                Crea primero al menos una categoría para dar de alta productos o servicios.
                            </p>
                            <button
                                type="button"
                                onClick={onOpenCreateCategory}
                                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
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
                                            const stockVal = Number(prod.stock ?? 0);

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
                                                    <td className="py-3.5 px-4 text-xs font-medium">
                                                        <span
                                                            className={
                                                                stockVal === 0
                                                                    ? "text-rose-600 font-bold"
                                                                    : stockVal <= 2
                                                                    ? "text-amber-700 font-semibold"
                                                                    : "text-slate-700"
                                                            }
                                                        >
                                                            {stockVal} uds.
                                                        </span>
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
                                                            onClick={() => onOpenEditProduct(prod)}
                                                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => onDeleteProduct(prod)}
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
                                                No se encontraron productos con ese criterio.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            )}

            {mode === "categories" && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">
                                Categorías del catálogo
                            </h2>
                            <p className="text-xs text-slate-500">
                                Crea y organiza las categorías base para tus productos y servicios.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onOpenCreateCategory}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
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
                                            onClick={() => onOpenEditCategory(cat)}
                                            className="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDeleteCategory(cat)}
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

            {/* MODAL DE CATEGORÍA */}
            {categoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setCategoryModalOpen(false)}
                        className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs"
                    />
                    <form
                        onSubmit={onSubmitCategory}
                        className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4"
                    >
                        <h3 className="text-base font-bold text-slate-900">
                            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                        </h3>

                        {Object.keys(categoryForm.errors).length > 0 && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs space-y-1">
                                {Object.values(categoryForm.errors).map((err, idx) => (
                                    <p key={idx} className="font-semibold">
                                        {err}
                                    </p>
                                ))}
                            </div>
                        )}

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
                        onSubmit={onSubmitProduct}
                        className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
                    >
                        <h3 className="text-base font-bold text-slate-900">
                            {editingProduct ? "Editar Producto / Servicio" : "Nuevo Producto / Servicio"}
                        </h3>

                        {Object.keys(productForm.errors).length > 0 && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs space-y-1">
                                {Object.values(productForm.errors).map((err, idx) => (
                                    <p key={idx} className="font-semibold">
                                        {err}
                                    </p>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={255}
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
        </>
    );
}
