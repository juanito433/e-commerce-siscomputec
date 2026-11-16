import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProductCard({ id, name, category, price, sku, imageUrl, isNew, delay }) {
    return (
        <div
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Contenedor de Imagen */}
            <div className="relative h-48 sm:h-56 bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                    src={imageUrl || 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80'}
                    alt={name}
                    className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />

                {isNew && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-lg z-10 tracking-wider">
                        NUEVO
                    </div>
                )}
            </div>

            {/* Información del Producto */}
            <div className="p-4 sm:p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <p className="text-blue-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{category}</p>
                    <span className="font-mono text-[10px] sm:text-xs font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 tracking-wide">
                        SKU: {sku || 'N/D'}
                    </span>
                </div>

                <h3 className="font-extrabold text-gray-900 text-base sm:text-lg mb-3 line-clamp-2 leading-tight">{name}</h3>

                <div className="flex justify-between items-center mt-auto pt-3 sm:pt-4 border-t border-gray-50 gap-2">
                    <span className="font-black text-xl sm:text-2xl text-gray-900">${Number(price).toFixed(2)}</span>

                    {/* ENLACE A DETALLES */}
                    <Link
                        href={`/products/${id}`}
                        className="bg-gray-900 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-600 transition-colors duration-300 shadow-md cursor-pointer"
                    >
                        Ver Detalles
                    </Link>
                </div>
            </div>
        </div>
    );
}
