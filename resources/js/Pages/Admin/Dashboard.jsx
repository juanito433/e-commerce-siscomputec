import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function AdminDashboard({ auth, products = [], categories = [], ordersCount = 0, totalSales = 0 }) {
    const [activeTab, setActiveTab] = useState('products');
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Estados para edición de categorías
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Formulario para Productos
    const productForm = useForm({
        name: '',
        category_id: (categories && categories.length > 0) ? categories[0].id : '',
        sku: '',
        price: '',
        stock: '',
        description: '',
        image: null,
        is_new: true,
        is_active: true,
    });

    // Formulario para Crear Categoría
    const categoryForm = useForm({
        name: '',
    });

    // Formulario para Editar Categoría
    const editCategoryForm = useForm({
        name: '',
    });

    const handleProductSubmit = (e) => {
        e.preventDefault();
        productForm.post(route('admin.products.store'), {
            forceFormData: true,
            onSuccess: () => {
                productForm.reset();
                setIsProductModalOpen(false);
            },
        });
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        categoryForm.post(route('admin.categories.store'), {
            onSuccess: () => {
                categoryForm.reset();
                setIsCategoryModalOpen(false);
            },
        });
    };

    const openEditCategory = (cat) => {
        setEditingCategory(cat);
        editCategoryForm.setData('name', cat.name);
        setIsEditCategoryModalOpen(true);
    };

    const handleEditCategorySubmit = (e) => {
        e.preventDefault();
        editCategoryForm.put(route('admin.categories.update', editingCategory.id), {
            onSuccess: () => {
                setIsEditCategoryModalOpen(false);
                editCategoryForm.reset();
            },
        });
    };

    const handleDeleteCategory = (catId) => {
        if (confirm('¿Estás seguro de eliminar esta categoría? Esta acción no se puede deshacer.')) {
            router.delete(route('admin.categories.destroy', catId));
        }
    };

    const filteredProducts = (products || []).filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row selection:bg-blue-600 selection:text-white">
            <Head title="Panel de Administración - Siscomputec" />

            {/* Barra Móvil */}
            <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <span className="font-black text-blue-700 tracking-tight">SISCOMPUTEC</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer">
                    {mobileMenuOpen ? 'Cerrar Menú' : 'Menú Admin'}
                </button>
            </header>

            {/* Sidebar de Navegación (Fijo en Escritorio) */}
            <aside className={`w-full md:w-72 bg-slate-900 text-white flex-shrink-0 flex-col md:flex ${mobileMenuOpen ? 'flex' : 'hidden'} md:sticky md:top-0 md:h-screen border-r border-slate-800`}>
                <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
                    <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <div>
                        <span className="text-lg font-black text-blue-400 tracking-tight block leading-none">SISCOMPUTEC</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Gestión de Taller</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1.5">
                    <button
                        onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        Inventario y Productos
                    </button>
                    <button
                        onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${activeTab === 'categories' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        Gestión de Categorías
                    </button>
                    <button
                        onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        Órdenes de Clientes
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition py-2 px-3 rounded-xl hover:bg-slate-800">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Volver a la Tienda
                    </Link>
                </div>
            </aside>

            {/* Contenedor Principal */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header Superior protegido con key={activeTab} contra extensiones de traducción */}
                <header className="hidden md:flex bg-white border-b border-slate-200 h-20 px-8 items-center justify-between sticky top-0 z-30">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">
                        <span key={activeTab}>
                            {activeTab === 'products' && 'Inventario General y Servicios'}
                            {activeTab === 'categories' && 'Clasificación de Rubros y Servicios'}
                            {activeTab === 'orders' && 'Control de Órdenes'}
                        </span>
                    </h1>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100">
                        Admin: {auth?.user?.name || 'Sistemas'}
                    </span>
                </header>

                <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">

                    {/* PESTAÑA: PRODUCTOS */}
                    {activeTab === 'products' && (
                        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
                            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o SKU..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-80 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 rounded-xl py-2.5 px-4 text-xs sm:text-sm"
                                />
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => setIsCategoryModalOpen(true)}
                                        className="w-full sm:w-auto bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-slate-200 transition cursor-pointer whitespace-nowrap"
                                    >
                                        + Nueva Categoría
                                    </button>
                                    <button
                                        onClick={() => setIsProductModalOpen(true)}
                                        className="w-full sm:w-auto bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-blue-700 transition shadow-md shadow-blue-500/20 cursor-pointer whitespace-nowrap"
                                    >
                                        + Nuevo Producto / Servicio
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-200">
                                            <th className="p-4">SKU / Ítem</th>
                                            <th className="p-4">Categoría</th>
                                            <th className="p-4">Precio ($)</th>
                                            <th className="p-4">Stock</th>
                                            <th className="p-4">Estado</th>
                                            <th className="p-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map((product) => {
                                                const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url;
                                                return (
                                                    <tr key={product.id} className="hover:bg-slate-50 transition">
                                                        <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                                                            <img
                                                                src={primaryImage || 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=100&q=80'}
                                                                alt=""
                                                                className="w-10 h-10 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                                                            />
                                                            <div>
                                                                <p className="line-clamp-1">{product.name}</p>
                                                                <span className="text-[10px] text-slate-400 font-mono">SKU: {product.sku || 'N/D'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-blue-600 font-semibold">{product.category?.name || 'General'}</td>
                                                        <td className="p-4 font-black">${Number(product.price).toFixed(2)}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${product.stock > 3 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                                                {product.stock} un.
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${product.is_active ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                                                {product.is_active ? 'Activo' : 'Oculto'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                                            <button className="text-slate-600 font-bold text-xs bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition cursor-pointer">Editar</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-16 text-slate-400">
                                                    {(categories || []).length === 0 ? (
                                                        <span>⚠️ Aún no hay categorías registradas. Crea una categoría primero.</span>
                                                    ) : (
                                                        <span>No hay productos registrados en este filtro.</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* PESTAÑA: CATEGORÍAS */}
                    {activeTab === 'categories' && (
                        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Listado de Categorías</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Rubros activos para cómputo, redes, CCTV, impresoras y servicios de taller</p>
                                </div>
                                <button
                                    onClick={() => setIsCategoryModalOpen(true)}
                                    className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-blue-700 transition shadow-md shadow-blue-500/20 cursor-pointer"
                                >
                                    + Agregar Categoría
                                </button>
                            </div>

                            {(categories || []).length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(categories || []).map(cat => (
                                        <div key={cat.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cat.icon_url || 'M4 6h16M4 12h16M4 18h16'} />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-extrabold text-slate-800 text-sm">{cat.name}</h3>
                                                        <span className="text-[10px] text-slate-400 font-mono">Slug: {cat.slug}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                                <button
                                                    onClick={() => openEditCategory(cat)}
                                                    className="bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                                                >
                                                    Editar Nombre
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-sm font-bold text-slate-600">No hay categorías registradas todavía.</p>
                                    <p className="text-xs text-slate-400 mt-1">Haz clic en "+ Agregar Categoría" para dar de alta tu primer rubro.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PESTAÑA: ÓRDENES */}
                    {activeTab === 'orders' && (
                        <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200 text-center py-24">
                            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            <h3 className="text-base sm:text-lg font-bold text-slate-800">Control de Órdenes</h3>
                            <p className="text-slate-400 text-xs sm:text-sm mt-1">Sección en desarrollo para seguimiento logístico de servicios y ventas.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL PARA CREAR NUEVA CATEGORÍA */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                            <h2 className="text-base font-black text-slate-900">Nueva Categoría (Autodetección de Icono)</h2>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer">✕</button>
                        </div>

                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre del Rubro / Servicio</label>
                                <input
                                    type="text"
                                    value={categoryForm.data.name}
                                    onChange={e => categoryForm.setData('name', e.target.value)}
                                    placeholder="Ej. Redes y CCTV, Renta de Impresoras..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <span className="text-[10px] text-slate-400 mt-1 block">El sistema asignará el icono correspondiente automáticamente.</span>
                                {categoryForm.errors.name && <span className="text-rose-500 text-xs mt-1 block">{categoryForm.errors.name}</span>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={categoryForm.processing}
                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                                >
                                    Guardar Categoría
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL PARA EDITAR CATEGORÍA */}
            {isEditCategoryModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                            <h2 className="text-base font-black text-slate-900">Editar Nombre de Categoría</h2>
                            <button onClick={() => setIsEditCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer">✕</button>
                        </div>

                        <form onSubmit={handleEditCategorySubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nuevo Nombre</label>
                                <input
                                    type="text"
                                    value={editCategoryForm.data.name}
                                    onChange={e => editCategoryForm.setData('name', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {editCategoryForm.errors.name && <span className="text-rose-500 text-xs mt-1 block">{editCategoryForm.errors.name}</span>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditCategoryModalOpen(false)}
                                    className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={editCategoryForm.processing}
                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                                >
                                    Actualizar Categoría
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL PARA CREAR NUEVO PRODUCTO / SERVICIO */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                            <h2 className="text-lg font-black text-slate-900">Registrar Producto o Servicio</h2>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer">✕</button>
                        </div>

                        <form onSubmit={handleProductSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Comercial</label>
                                    <input
                                        type="text"
                                        value={productForm.data.name}
                                        onChange={e => productForm.setData('name', e.target.value)}
                                        placeholder="Ej. Kit Cámaras Hikvision o Renta Impresora"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {productForm.errors.name && <span className="text-rose-500 text-xs mt-1 block">{productForm.errors.name}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoría</label>
                                    <select
                                        value={productForm.data.category_id}
                                        onChange={e => productForm.setData('category_id', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                        required
                                    >
                                        {(categories || []).length > 0 ? (
                                            categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))
                                        ) : (
                                            <option value="">Crea una categoría primero</option>
                                        )}
                                    </select>
                                    {productForm.errors.category_id && <span className="text-rose-500 text-xs mt-1 block">{productForm.errors.category_id}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">SKU / Código</label>
                                    <input
                                        type="text"
                                        value={productForm.data.sku}
                                        onChange={e => productForm.setData('sku', e.target.value)}
                                        placeholder="SRV-001"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Precio ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={productForm.data.price}
                                        onChange={e => productForm.setData('price', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stock / Unidades</label>
                                    <input
                                        type="number"
                                        value={productForm.data.stock}
                                        onChange={e => productForm.setData('stock', e.target.value)}
                                        placeholder="10"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fotografía del Ítem</label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={e => productForm.setData('image', e.target.files[0])}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer bg-slate-50 border border-slate-200 rounded-xl"
                                />
                                {productForm.errors.image && <span className="text-rose-500 text-xs mt-1 block">{productForm.errors.image}</span>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descripción</label>
                                <textarea
                                    rows="3"
                                    value={productForm.data.description}
                                    onChange={e => productForm.setData('description', e.target.value)}
                                    placeholder="Especificaciones o condiciones del servicio..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                                    <input
                                        type="checkbox"
                                        checked={productForm.data.is_new}
                                        onChange={e => productForm.setData('is_new', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 w-4 h-4"
                                    />
                                    Marcar como Novedad
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                                    <input
                                        type="checkbox"
                                        checked={productForm.data.is_active}
                                        onChange={e => productForm.setData('is_active', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 w-4 h-4"
                                    />
                                    Visible en Tienda
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={productForm.processing || (categories || []).length === 0}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                                >
                                    Guardar Ítem
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
