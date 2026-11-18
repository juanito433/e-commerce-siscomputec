import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Iniciar Sesión - Siscomputec" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
                {/* LOGO MEJORADO CON CONTENEDOR Y EFECTO */}
                <Link href="/" className="inline-block mb-4 group">
                    <div className=" p-3 inline-block transition-transform duration-300 group-hover:scale-105">
                        <img
                            src="/images/logo.svg" /* <--- Cambia esta ruta por la ubicación real de tu logo en public/ */
                            alt="Logo de la empresa"
                            className="h-10 sm:h-12 w-auto mx-auto object-contain"
                        />
                    </div>
                </Link>
                <h2 className="text-xl font-extrabold text-slate-800">Accede a tu cuenta</h2>
                <p className="text-xs text-slate-500 mt-1">Gestiona tus pedidos y soporte técnico en taller</p>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md p-4">
                <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-3xl sm:px-10">

                    {status && (
                        <div className="mb-4 text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Correo Electrónico</label>
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
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Contraseña</label>
                            <input
                                type="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                                required
                            />
                            {errors.password && <span className="text-xs font-bold text-rose-500 mt-1 block">{errors.password}</span>}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                />
                                Recordarme
                            </label>

                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-blue-600 font-bold hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-2xl shadow-md transition cursor-pointer text-sm"
                        >
                            Iniciar Sesión
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500">
                            ¿Aún no tienes una cuenta?{' '}
                            <Link href={route('register')} className="text-blue-600 font-extrabold hover:underline">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
