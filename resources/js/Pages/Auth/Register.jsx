import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        last_name: '', // <--- Añadido campo de apellido
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Crear Cuenta - Siscomputec" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
                <Link href="/" className="inline-block mb-4 group">
                    <div className=" p-3 inline-block transition-transform duration-300 group-hover:scale-105">
                        <img
                            src="/images/logo.svg"
                            alt="Logo de la empresa"
                            className="h-10 sm:h-12 w-auto mx-auto object-contain"
                        />
                    </div>
                </Link>
                <h2 className="text-xl font-extrabold text-slate-800">Crea tu cuenta de cliente</h2>
                <p className="text-xs text-slate-500 mt-1">Disfruta de compras y seguimiento rápido en Siscomputec</p>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-3xl sm:px-10">
                    <form onSubmit={submit} className="space-y-4">

                        {/* Campo de Nombre */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre(s)</label>
                            <input
                                type="text"
                                value={data.name}
                                autoComplete="given-name"
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                                required
                            />
                            {errors.name && <span className="text-xs font-bold text-rose-500 mt-1 block">{errors.name}</span>}
                        </div>

                        {/* Campo de Apellido (last_name) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apellido(s)</label>
                            <input
                                type="text"
                                value={data.last_name}
                                autoComplete="family-name"
                                onChange={(e) => setData('last_name', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                                required
                            />
                            {errors.last_name && <span className="text-xs font-bold text-rose-500 mt-1 block">{errors.last_name}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                                required
                            />
                            {errors.email && <span className="text-xs font-bold text-rose-500 mt-1 block">{errors.email}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
                            <input
                                type="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                                required
                            />
                            {errors.password && <span className="text-xs font-bold text-rose-500 mt-1 block">{errors.password}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirmar Contraseña</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                                required
                            />
                            {errors.password_confirmation && <span className="text-xs font-bold text-rose-500 mt-1 block">{errors.password_confirmation}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-2xl shadow-md transition cursor-pointer text-sm mt-2"
                        >
                            Registrarse
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500">
                            ¿Ya tienes una cuenta?{' '}
                            <Link href={route('login')} className="text-blue-600 font-extrabold hover:underline">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
