import { useForm } from "@inertiajs/react";

export default function CustomerSecurityTab({ onBack }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100">
                <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Seguridad de la cuenta
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Cambia tu contraseña periódicamente para mantener tu cuenta protegida.
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

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Contraseña Actual
                    </label>
                    <input
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData("current_password", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        required
                    />
                    {errors.current_password && (
                        <span className="text-xs font-bold text-rose-500 mt-1 block">
                            {errors.current_password}
                        </span>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Nueva Contraseña
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        required
                    />
                    {errors.password && (
                        <span className="text-xs font-bold text-rose-500 mt-1 block">
                            {errors.password}
                        </span>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Confirmar Nueva Contraseña
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
                    >
                        Actualizar Contraseña
                    </button>
                </div>
            </form>
        </div>
    );
}
