import React from 'react';

export default function ProductCard({ name, category, price, imageUrl }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="object-cover h-full w-full" />
                ) : (
                    <span>[Imagen]</span>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg">{name}</h3>
                <p className="text-gray-500 text-sm mb-4">{category}</p>
                <div className="flex justify-between items-center">
                    <span className="font-black text-xl text-blue-600">${price}</span>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    );
}