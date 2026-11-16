import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import ProductCard from '../Components/ProductCard';

const mockProducts = [
    { id: 1, name: "Laptop ASUS ROG Strix G16", category: "Laptops Gamer", price: 1850.00, isNew: true },
    { id: 2, name: "Procesador AMD Ryzen 9 7900X", category: "Procesadores", price: 549.99, isNew: false },
    { id: 3, name: "Tarjeta Gráfica NVIDIA RTX 4070", category: "Tarjetas Gráficas", price: 799.00, isNew: true },
    { id: 4, name: "Monitor Curvo Samsung Odyssey G7", category: "Monitores", price: 650.00, isNew: false },
    { id: 5, name: "Teclado Mecánico Razer BlackWidow", category: "Periféricos", price: 129.50, isNew: false },
    { id: 6, name: "SSD NVMe WD Black 2TB", category: "Almacenamiento", price: 189.99, isNew: true },
];

const categoriesList = ['Laptops Gamer', 'Procesadores', 'Tarjetas Gráficas', 'Monitores', 'Periféricos', 'Almacenamiento'];

export default function Welcome({ auth }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOrder, setSortOrder] = useState("relevancia");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const filteredProducts = useMemo(() => {
        let result = mockProducts.filter(product => {
            const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const matchMin = minPrice === "" || product.price >= parseFloat(minPrice);
            const matchMax = maxPrice === "" || product.price <= parseFloat(maxPrice);
            return matchSearch && matchCategory && matchMin && matchMax;
        });

        switch (sortOrder) {
            case "menor_precio":
                return result.sort((a, b) => a.price - b.price);
            case "mayor_precio":
                return result.sort((a, b) => b.price - a.price);
            case "nuevos":
                return result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
            default:
                return result;
        }
    }, [searchTerm, selectedCategories, minPrice, maxPrice, sortOrder]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head title="Catálogo - Siscomputec" />

            {/* Menú Superior Adaptativo */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-8 flex-1">
                        <Link href="/" className="text-2xl sm:text-3xl font-black text-blue-700 tracking-tighter hover:text-blue-800 transition">
                            SISCOMPUTEC
                        </Link>
                        {/* Buscador Integrado (Visible en todas las pantallas) */}
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Buscar hardware..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full py-2 pl-4 pr-10 text-xs sm:text-sm transition-all"
                            />
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="font-bold text-xs sm:text-sm text-gray-600 hover:text-blue-600">Mi Panel</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="hidden sm:inline font-bold text-sm text-gray-600 hover:text-blue-600">Ingresar</Link>
                                <Link href={route('register')} className="bg-blue-600 text-white font-bold px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm hover:bg-blue-700 transition transform hover:-translate-y-0.5">Crear Cuenta</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Contenedor Principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col md:flex-row gap-6 sm:gap-8">

                {/* Botón de Filtros Móvil */}
                <div className="md:hidden flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <span className="font-bold text-sm text-gray-700">Filtrar Productos</span>
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                        {mobileFiltersOpen ? 'Ocultar Filtros' : 'Ver Filtros'}
                    </button>
                </div>

                {/* Panel Lateral de Filtros (Responsivo) */}
                <aside className={`w-full md:w-64 flex-shrink-0 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit md:sticky md:top-28 transition-all ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
                    <div>
                        <h3 className="font-black text-gray-900 mb-4 uppercase tracking-wider text-sm">Categorías</h3>
                        <ul className="space-y-3">
                            {categoriesList.map((cat) => (
                                <li key={cat}>
                                    <label className="flex items-center gap-3 text-gray-600 hover:text-blue-600 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => toggleCategory(cat)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 transition"
                                        />
                                        <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">{cat}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="font-black text-gray-900 mb-4 uppercase tracking-wider text-sm">Rango de Precio ($)</h3>
                        <div className="flex gap-3 items-center">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => { setSelectedCategories([]); setMinPrice(""); setMaxPrice(""); setSearchTerm(""); setSortOrder("relevancia"); }}
                        className="w-full bg-gray-50 text-gray-700 font-bold py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition"
                    >
                        Limpiar Filtros
                    </button>
                </aside>

                {/* Área de Catálogo */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200 gap-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Catálogo de Productos</h2>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">Mostrando {filteredProducts.length} resultados</p>
                        </div>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full sm:w-auto border-gray-200 bg-white rounded-xl text-xs sm:text-sm font-medium focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer py-2"
                        >
                            <option value="relevancia">Relevancia</option>
                            <option value="nuevos">Lo más nuevo</option>
                            <option value="menor_precio">Menor a mayor precio</option>
                            <option value="mayor_precio">Mayor a menor precio</option>
                        </select>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {filteredProducts.map((product, index) => (
                                <ProductCard
                                    key={`${product.id}-${sortOrder}`}
                                    name={product.name}
                                    category={product.category}
                                    price={product.price}
                                    isNew={product.isNew}
                                    delay={index * 75}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in-up">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
                            <p className="text-gray-500 text-sm">Prueba ajustando los filtros de categoría o búsqueda.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
