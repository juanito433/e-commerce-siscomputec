import { Head, Link } from '@inertiajs/react';
import ProductCard from '../Components/ProductCard';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Inicio - Siscomputec" />

            {/* Navegación Superior */}
            <header className="bg-white shadow-sm p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-black text-blue-600">SISCOMPUTEC</h1>
                    <div>
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="text-gray-700 font-bold">Mi Panel</Link>
                        ) : (
                            <div className="space-x-4">
                                <Link href={route('login')} className="text-gray-700">Entrar</Link>
                                <Link href={route('register')} className="bg-blue-600 text-white px-4 py-2 rounded">Registro</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="max-w-7xl mx-auto p-4 sm:p-8 mt-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Productos Destacados</h2>
                
                {/* Cuadrícula de Productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <ProductCard name="Procesador Intel i7" category="Componentes" price="350.00" />
                    <ProductCard name="Tarjeta de Video RTX 4060" category="Componentes" price="299.99" />
                    <ProductCard name="Monitor Gamer 144Hz" category="Periféricos" price="199.50" />
                    <ProductCard name="Teclado Mecánico" category="Periféricos" price="85.00" />
                </div>
            </main>
        </div>
    );
}