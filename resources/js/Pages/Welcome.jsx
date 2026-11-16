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

const categoriesList = [
    { name: 'Laptops Gamer', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Procesadores', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
    { name: 'Tarjetas Gráficas', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { name: 'Monitores', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Periféricos', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
    { name: 'Almacenamiento', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' }
];

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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title="Catálogo de Hardware - Siscomputec" />

            {/* Navbar 100% Responsivo */}
            <header className="bg-white/95 backdrop-blur-md shadow-xs sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-3">

                    {/* Fila Superior en Móvil / Izquierda en Escritorio: Logo y Botones Auth */}
                    <div className="w-full sm:w-auto flex items-center justify-between gap-2">
                        <Link href="/" className="text-lg sm:text-2xl font-black text-blue-700 tracking-tight flex items-center gap-2">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            <span className="tracking-tighter">SISCOMPUTEC</span>
                        </Link>

                        {/* Botones de Autenticación para Móvil (Compactos) */}
                        <div className="flex items-center gap-2 sm:hidden">
                            {auth?.user ? (
                                <Link href={route('dashboard')} className="font-bold text-xs text-slate-700 hover:text-blue-600">Panel</Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="font-bold text-xs text-slate-700 hover:text-blue-600 px-1 py-1">Ingresar</Link>
                                    <Link href={route('register')} className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-full text-xs hover:bg-blue-700 shadow-xs whitespace-nowrap">Crear Cuenta</Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Buscador Integrado (Ancho completo en móvil, flexible en escritorio) */}
                    <div className="w-full sm:flex-1 sm:max-w-md sm:mx-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Buscar hardware, procesadores, gráficas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-full py-2 pl-4 pr-10 text-xs sm:text-sm transition-all shadow-inner"
                            />
                            <svg className="w-4 h-4 absolute right-3.5 top-2.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Botones de Autenticación para Escritorio (Ocultos en móvil) */}
                    <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="font-bold text-sm text-slate-700 hover:text-blue-600 transition">Mi Panel</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="font-bold text-sm text-slate-700 hover:text-blue-600 px-2 py-1 transition">Ingresar</Link>
                                <Link href={route('register')} className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-blue-700 transition shadow-md shadow-blue-500/20 whitespace-nowrap">Crear Cuenta</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Banner Hero Responsivo */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
                <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10 max-w-xl">
                        <span className="bg-blue-500/30 text-blue-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30 uppercase tracking-wider">Alto Rendimiento</span>
                        <h1 className="text-xl sm:text-3xl font-black mt-2 tracking-tight leading-snug">Hardware y Componentes Especializados</h1>
                        <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">Equipamiento tecnológico y componentes con soporte directo en Cancún.</p>
                    </div>
                </div>
            </div>

            {/* Contenedor Principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">

                {/* Botón Desplegable de Filtros para Móvil / Tablet */}
                <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
                    <span className="font-bold text-xs sm:text-sm text-slate-700">Filtrar Catálogo</span>
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                        </svg>
                        {mobileFiltersOpen ? 'Ocultar Filtros' : 'Ver Filtros'}
                    </button>
                </div>

                {/* Panel Lateral de Filtros (Responsivo) */}
                <aside className={`w-full lg:w-72 flex-shrink-0 space-y-5 bg-white p-5 rounded-2xl sm:rounded-3xl shadow-xs border border-slate-200 h-fit lg:sticky lg:top-28 transition-all ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                    <div>
                        <h3 className="font-extrabold text-slate-900 mb-3 uppercase tracking-wider text-xs flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
                            Categorías
                        </h3>
                        <ul className="space-y-1.5">
                            {categoriesList.map((cat) => (
                                <li key={cat.name}>
                                    <label className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition ${selectedCategories.includes(cat.name) ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat.name)}
                                            onChange={() => toggleCategory(cat.name)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                                        />
                                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cat.icon} />
                                        </svg>
                                        <span className="text-xs sm:text-sm">{cat.name}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="font-extrabold text-slate-900 mb-3 uppercase tracking-wider text-xs">Rango de Precio ($)</h3>
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
                        onClick={() => { setSelectedCategories([]); setMinPrice(""); setMaxPrice(""); setSearchTerm(""); setSortOrder("relevancia"); }}
                        className="w-full bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-200 transition cursor-pointer"
                    >
                        Limpiar Filtros
                    </button>
                </aside>

                {/* Área de Catálogo y Productos */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-200 gap-4">
                        <div>
                            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Catálogo Disponible</h2>
                            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Mostrando {filteredProducts.length} resultados</p>
                        </div>
                        <div className="w-full sm:w-auto">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full sm:w-auto border-slate-200 bg-white rounded-xl text-xs sm:text-sm font-medium focus:ring-blue-500 focus:border-blue-500 shadow-xs cursor-pointer py-2.5 px-4"
                            >
                                <option value="relevancia">Ordenar por: Relevancia</option>
                                <option value="nuevos">Lo más nuevo</option>
                                <option value="menor_precio">Menor a mayor precio</option>
                                <option value="mayor_precio">Mayor a menor precio</option>
                            </select>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            {filteredProducts.map((product, index) => (
                                <ProductCard
                                    key={`${product.id}-${sortOrder}`}
                                    name={product.name}
                                    category={product.category}
                                    price={product.price}
                                    isNew={product.isNew}
                                    delay={index * 40}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
                            <svg className="w-14 h-14 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-sm sm:text-base font-bold text-slate-800">No se encontraron productos</h3>
                            <p className="text-slate-400 text-xs mt-1">Prueba ajustando los filtros de categoría o búsqueda.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
