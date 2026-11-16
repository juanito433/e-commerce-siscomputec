import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import ProductTable from './Partials/ProductTable';
import ProductModal from './Partials/ProductModal';

export default function AdminDashboard({ auth, products = [], categories = [], ordersCount = 0, totalSales = 0 }) {
    const [activeTab, setActiveTab] = useState('products');
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Estados de modales
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    // Estados para edición de categorías
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Formularios
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

    const categoryForm = useForm({
        name: '',
    });

    const editCategoryForm = useForm({
        name: '',
    });

    const openCreateProduct = () => {
        setIsEditingProduct(false);
        setCurrentProductId(null);
        productForm.reset();
        setIsProductModalOpen(true);
    };

    const openEditProduct = (product) => {
        setIsEditingProduct(true);
        setCurrentProductId(product.id);
        productForm.setData({
            name: product.name,
            category_id: product.category_id,
            sku: product.sku || '',
            price: product.price,
            stock: product.stock,
            description: product.description || '',
            image: null,
            is_new: Boolean(product.is_new),
            is_active: Boolean(product.is_active),
        });
        setIsProductModalOpen(true);
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        if (isEditingProduct) {
            productForm.transform((data) => ({
                ...data,
                _method: 'put',
            }));

            productForm.post(route('admin.products.update', currentProductId), {
                forceFormData: true,
                onSuccess: () => {
                    productForm.reset();
                    setIsProductModalOpen(false);
                },
            });
        } else {
            productForm.post(route('admin.products.store'), {
                forceFormData: true,
                onSuccess: () => {
                    productForm.reset();
                    setIsProductModalOpen(false);
                },
            });
        }
    };

    const handleDeleteProduct = (productId) => {
        if (confirm('¿Estás seguro de eliminar este producto o servicio del sistema?')) {
            router.delete(route('admin.products.destroy', productId));
        }
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row selection:bg-blue-600 selection:text-white">
            <Head title="Panel de Administración - Siscomputec" />

            {/* Barra Móvil */}
            <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <span className="font-black text-blue-700 tracking-tight">SISCOMPUTEC</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer">
                    {mobileMenuOpen ? 'Cerrar Menú' : 'Menú Admin'}
                </button>
            </header>

            {/* Sidebar */}
            <aside className={`w-full md:w-72 bg-slate-900 text-white flex-shrink-0 flex-col md:flex ${mobileMenuOpen ? 'flex' : 'hidden'} md:sticky md:top-0 md:h-screen border-r border-slate-800`}>
                <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
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
                        Inventario y Productos
                    </button>
                    <button
                        onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${activeTab === 'categories' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        Gestión de Categorías
                    </button>
                    <button
                        onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        Órdenes de Clientes
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition py-2 px-3 rounded-xl hover:bg-slate-800">
                        Volver a la Tienda
                    </Link>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 flex flex-col min-w-0">
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
                    {activeTab === 'products' && (
                        <ProductTable
                            products={products}
                            categories={categories}
                            onEdit={openEditProduct}
                            onDelete={handleDeleteProduct}
                            onOpenCreate={openCreateProduct}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    )}

                    {/* PESTAÑA DE CATEGORÍAS RESTAURADA CON ICONOS Y ACCIONES */}
                    {activeTab === 'categories' && (
                        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Listado de Categorías</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Rubros activos con asignación de iconos automáticos para taller y tienda</p>
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

                    {activeTab === 'orders' && (
                        <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200 text-center py-24">
                            <h3 className="text-base sm:text-lg font-bold text-slate-800">Control de Órdenes</h3>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal de Productos */}
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                form={productForm}
                onSubmit={handleProductSubmit}
                categories={categories}
                isEditing={isEditingProduct}
            />

            {/* Modal para Crear Categoría */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <h2 className="text-base font-black text-slate-900 mb-4">Nueva Categoría (Autodetección)</h2>
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <input
                                type="text"
                                value={categoryForm.data.name}
                                onChange={e => categoryForm.setData('name', e.target.value)}
                                placeholder="Ej. Adaptadores, PC, CCTV..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">Cancelar</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para Editar Categoría */}
            {isEditCategoryModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <h2 className="text-base font-black text-slate-900 mb-4">Editar Nombre de Categoría</h2>
                        <form onSubmit={handleEditCategorySubmit} className="space-y-4">
                            <input
                                type="text"
                                value={editCategoryForm.data.name}
                                onChange={e => editCategoryForm.setData('name', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsEditCategoryModalOpen(false)} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">Cancelar</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
