import { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import ProductCard from "../Components/ProductCard";
import CatalogNavbar from "../Components/CatalogNavbar";
import { useUserLocation } from "../Hooks/useUserLocation";
import StoreFooter from "../Components/StoreFooter";

export default function Welcome({
    auth,
    products = [],
    categories = [],
    favoriteIds = [],
    cartCount = 0,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOrder, setSortOrder] = useState("relevancia");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userLocation = useUserLocation();
    const toggleCategory = (catName) => {
        setSelectedCategories((prev) =>
            prev.includes(catName)
                ? prev.filter((c) => c !== catName)
                : [...prev, catName],
        );
    };

    const handleLogout = (e) => {
        e.preventDefault();
        setUserMenuOpen(false);
        router.post(route("logout"));
    };

    const filteredProducts = useMemo(() => {
        let result = products.filter((product) => {
            const matchSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

            const categoryName = product.category?.name || "";
            const matchCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(categoryName);

            const matchMin =
                minPrice === "" ||
                Number(product.price) >= parseFloat(minPrice);
            const matchMax =
                maxPrice === "" ||
                Number(product.price) <= parseFloat(maxPrice);

            return matchSearch && matchCategory && matchMin && matchMax;
        });

        switch (sortOrder) {
            case "menor_precio":
                return [...result].sort(
                    (a, b) => Number(a.price) - Number(b.price),
                );
            case "mayor_precio":
                return [...result].sort(
                    (a, b) => Number(b.price) - Number(a.price),
                );
            case "nuevos":
                return [...result].sort((a, b) =>
                    a.is_new === b.is_new ? 0 : a.is_new ? -1 : 1,
                );
            default:
                return result;
        }
    }, [
        products,
        searchTerm,
        selectedCategories,
        minPrice,
        maxPrice,
        sortOrder,
    ]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title="Catálogo de Hardware - Siscomputec" />

            {/* Navbar */}
            <CatalogNavbar
                user={auth?.user}
                searchQuery={searchTerm} // <-- usa el nombre de tu estado de búsqueda
                onSearchChange={setSearchTerm}
                favoritesCount={favoriteIds?.length ?? 0}
                cartCount={cartCount ?? 0}
                location={userLocation}
                onRefreshLocation={userLocation.requestLocation}
                onOpenNotificationsPreview={() =>
                    alert(
                        "Notificaciones (vista previa): Aquí aparecerán avisos de pedidos listos para recoger.",
                    )
                }
            />

            {/* Banner Hero */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
                <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10 max-w-xl">
                        <span className="bg-blue-500/30 text-blue-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30 uppercase tracking-wider">
                            Alto Rendimiento y Taller
                        </span>
                        <h1 className="text-xl sm:text-3xl font-black mt-2 tracking-tight leading-snug">
                            Hardware, Componentes y Soporte Técnico
                        </h1>
                        <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                            Equipamiento tecnológico, refacciones y servicios
                            profesionales en Cancún.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenido Principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Botón Filtros Móvil */}
                <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
                    <span className="font-bold text-xs sm:text-sm text-slate-700">
                        Filtrar Catálogo
                    </span>
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition active:scale-95 cursor-pointer"
                    >
                        {mobileFiltersOpen ? "Ocultar Filtros" : "Ver Filtros"}
                    </button>
                </div>

                {/* Sidebar de Filtros */}
                <aside
                    className={`w-full lg:w-72 flex-shrink-0 space-y-5 bg-white p-5 rounded-2xl sm:rounded-3xl shadow-xs border border-slate-200 h-fit lg:sticky lg:top-28 transition-all ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}
                >
                    <div>
                        <h3 className="font-extrabold text-slate-900 mb-3 uppercase tracking-wider text-xs flex items-center gap-2">
                            <svg
                                className="w-4 h-4 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                            Categorías
                        </h3>
                        <ul className="space-y-1.5">
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <label
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition ${selectedCategories.includes(cat.name) ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(
                                                cat.name,
                                            )}
                                            onChange={() =>
                                                toggleCategory(cat.name)
                                            }
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                        />
                                        <div className="w-5 h-5 text-blue-600 flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d={
                                                        cat.icon_url ||
                                                        "M4 6h16M4 12h16M4 18h16"
                                                    }
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-xs sm:text-sm">
                                            {cat.name}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="font-extrabold text-slate-900 mb-3 uppercase tracking-wider text-xs">
                            Rango de Precio ($)
                        </h3>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                placeholder="Mín"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full text-xs sm:text-sm border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 py-2 px-3"
                            />
                            <span className="text-slate-400 font-bold">-</span>
                            <input
                                type="number"
                                placeholder="Máx"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full text-xs sm:text-sm border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 py-2 px-3"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setSelectedCategories([]);
                            setMinPrice("");
                            setMaxPrice("");
                            setSearchTerm("");
                            setSortOrder("relevancia");
                        }}
                        className="w-full bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-200 transition cursor-pointer"
                    >
                        Limpiar Filtros
                    </button>
                </aside>

                {/* Listado de Productos */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-200 gap-4">
                        <div>
                            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                                Catálogo Disponible
                            </h2>
                            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                                Mostrando {filteredProducts.length} resultados
                            </p>
                        </div>
                        <div className="w-full sm:w-auto">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full sm:w-auto border-slate-200 bg-white rounded-xl text-xs sm:text-sm font-medium focus:ring-blue-500 focus:border-blue-500 shadow-xs cursor-pointer py-2.5 px-4"
                            >
                                <option value="relevancia">
                                    Ordenar por: Relevancia
                                </option>
                                <option value="nuevos">Lo más nuevo</option>
                                <option value="menor_precio">
                                    Menor a mayor precio
                                </option>
                                <option value="mayor_precio">
                                    Mayor a menor precio
                                </option>
                            </select>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            {filteredProducts.map((product, index) => {
                                const primaryImage =
                                    product.images?.find(
                                        (img) => img.is_primary,
                                    )?.image_url ||
                                    product.images?.[0]?.image_url;

                                return (
                                    <ProductCard
                                        key={`${product.id}-${sortOrder}`}
                                        id={product.id}
                                        name={product.name}
                                        category={
                                            product.category?.name || "General"
                                        }
                                        price={product.price}
                                        sku={product.sku}
                                        imageUrl={primaryImage}
                                        isNew={product.is_new}
                                        isFavorite={favoriteIds.includes(
                                            product.id,
                                        )}
                                        delay={index * 40}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
                            <svg
                                className="w-14 h-14 text-slate-300 mx-auto mb-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="text-sm sm:text-base font-bold text-slate-800">
                                No se encontraron productos
                            </h3>
                            <p className="text-slate-400 text-xs mt-1">
                                Prueba ajustando los filtros de categoría o
                                búsqueda (nombre o SKU).
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <StoreFooter />
        </div>
    );
}
