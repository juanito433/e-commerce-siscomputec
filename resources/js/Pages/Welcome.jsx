import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import ProductCard from '../Components/ProductCard';

// Catálogo simulado ampliado para probar los filtros
const mockProducts = [
    { id: 1, name: "Laptop ASUS ROG Strix G16", category: "Laptops Gamer", price: 1850.00, isNew: true },
    { id: 2, name: "Procesador AMD Ryzen 9 7900X", category: "Procesadores", price: 549.99, isNew: false },
    { id: 3, name: "Tarjeta Gráfica NVIDIA RTX 4070", category: "Tarjetas Gráficas", price: 799.00, isNew: true },
    { id: 4, name: "Monitor Curvo Samsung Odyssey G7", category: "Monitores", price: 650.00, isNew: false },
    { id: 5, name: "Teclado Mecánico Razer BlackWidow", category: "Periféricos", price: 129.50, isNew: false },
    { id: 6, name: "SSD NVMe WD Black 2TB", category: "Almacenamiento", price: 189.99, isNew: true },
    { id: 7, name: "Laptop Lenovo Legion Pro 5i", category: "Laptops Gamer", price: 1450.00, isNew: false },
    { id: 8, name: "Procesador Intel Core i5-13600K", category: "Procesadores", price: 319.00, isNew: false },
];

const categoriesList = ['Laptops Gamer', 'Procesadores', 'Tarjetas Gráficas', 'Monitores', 'Periféricos', 'Almacenamiento'];

export default function Welcome({ auth }) {
    // Estados interactivos
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOrder, setSortOrder] = useState("relevancia");

    // Manejador de selección múltiple de categorías
    const toggleCategory = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category) 
                : [...prev, category]
        );
    };

    // Lógica principal de filtrado y ordenamiento en tiempo real
    const filteredProducts = useMemo(() => {
        let result = mockProducts.filter(product => {
            // Filtro por texto
            const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            // Filtro por categorías (si hay alguna seleccionada)
            const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            // Filtro por precio
            const matchMinPrice = minPrice === "" || product.price >= parseFloat(minPrice);
            const matchMaxPrice = maxPrice === "" || product.price <= parseFloat(maxPrice);

            return matchSearch && matchCategory && matchMinPrice && matchMaxPrice;
        });

        // Ordenamiento
        switch (sortOrder) {
            case "menor_precio":
                return result.sort((a, b) => a.price - b.price);
            case "mayor_precio":
                return result.sort((a, b) => b.price - a.price);
            case "nuevos":
                return result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
            default:
                return result; // Relevancia / Default
        }
    }, [searchTerm, selectedCategories, minPrice, maxPrice, sortOrder]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head title="Catálogo - Siscomputec" />

            {/* Menú Superior */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-3xl font-black text-blue-700 tracking-tighter hover:text-blue-800 transition">
                            SISCOMPUTEC
                        </Link>
                        <div className="hidden lg:block relative w-96">
                            <input 
                                type="text" 
                                placeholder="Buscar procesadores, laptops..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full py-2.5 pl-5 pr-10 text-sm transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="font-bold text-gray-600 hover:text-blue-600">Mi Panel</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="font-bold text-gray-600 hover:text-blue-600">Ingresar</Link>
                                <Link href={route('register')} className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-blue-700 transition transform hover:-translate-y-0.5">Crear Cuenta</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
                
                {/* Panel Lateral de Filtros */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-28">
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
                        <h3 className="font-black text-gray-900 mb-4 uppercase tracking-wider text-sm">Precio ($)</h3>
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
                            <h2 className="text-2xl font-black text-gray-900">Resultados</h2>
                            <p className="text-gray-500 text-sm mt-1">Mostrando {filteredProducts.length} productos</p>
                        </div>
                        <select 
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="border-gray-200 bg-white rounded-xl text-sm font-medium focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer"
                        >
                            <option value="relevancia">Relevancia</option>
                            <option value="nuevos">Lo más nuevo</option>
                            <option value="menor_precio">Menor a mayor precio</option>
                            <option value="mayor_precio">Mayor a menor precio</option>
                        </select>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, index) => (
                                <ProductCard 
                                    key={`${product.id}-${sortOrder}`} // Clave dinámica para forzar la re-animación al ordenar
                                    name={product.name} 
                                    category={product.category} 
                                    price={product.price}
                                    isNew={product.isNew}
                                    delay={index * 75} // Cascada de 75ms por tarjeta
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in-up">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
                            <p className="text-gray-500">Intenta ajustando los filtros de categoría o el rango de precios.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}