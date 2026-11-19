import { useForm } from "@inertiajs/react";

export default function CustomerProfileTab({ user, onBack }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("customer.profile.update"), {
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100">
                <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Información de tu perfil
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Actualiza tus datos personales y teléfono de contacto.
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

            <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                            Nombre(s)
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                            required
                        />
                        {errors.name && (
                            <span className="text-xs font-bold text-rose-500 mt-1 block">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                            Apellido(s)
                        </label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData("last_name", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        />
                        {errors.last_name && (
                            <span className="text-xs font-bold text-rose-500 mt-1 block">
                                {errors.last_name}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            disabled
                            value={user.email || ""}
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                            Teléfono de Contacto
                        </label>
                        <input
                            type="text"
                            placeholder="Ej. 9981234567"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        />
                        {errors.phone && (
                            <span className="text-xs font-bold text-rose-500 mt-1 block">
                                {errors.phone}
                            </span>
                        )}
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}
