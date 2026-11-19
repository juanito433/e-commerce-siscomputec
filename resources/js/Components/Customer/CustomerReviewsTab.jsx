export default function CustomerReviewsTab({ reviews = [], onBack }) {
    return (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Opiniones y Reseñas
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Tus valoraciones sobre los productos adquiridos.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onBack}
                    className="self-start sm:self-auto text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                    ← Volver a Mi cuenta
                </button>
            </div>

            {reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((rev) => (
                        <div key={rev.id} className="border border-slate-200 rounded-2xl p-4">
                            <p className="text-sm font-bold text-slate-900">{rev.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-amber-500 flex items-center justify-center mx-auto font-black text-lg">
                        ★
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800">
                        No has publicado opiniones todavía
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Después de recibir tus compras podrás calificar los equipos y ayudar a otros clientes.
                    </p>
                </div>
            )}
        </div>
    );
}
