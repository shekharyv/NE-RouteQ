import React, { useState } from 'react';
import { Navigation } from 'lucide-react';
import AuthBrandPanel from './AuthBrandPanel';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthLayout = ({ onLoginSuccess, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'

    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-3 sm:p-6 md:p-8 font-sans overflow-x-hidden">
            {/* CONTAINER WITH SPLIT SCREEN GRID */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* DESKTOP LEFT SIDE VISUAL BRAND PANEL (LG: 6 cols or 7 cols) */}
                <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-full">
                    <AuthBrandPanel />
                </div>

                {/* MOBILE / TABLET HEADER BRANDING (Visible < 1024px) */}
                <div className="block lg:hidden w-full text-center pt-2 pb-1">
                    <div className="inline-flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-full shadow-lg">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white">
                            <Navigation className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-sm font-black text-white leading-none">NE-RouteIQ</h2>
                            <p className="text-[9px] font-bold text-sky-400 uppercase leading-none mt-0.5">
                                Logistics Intelligence
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE AUTHENTICATION CARD (LG: 6 cols or 5 cols) */}
                <div className="w-full lg:col-span-6 xl:col-span-5">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
                        {/* DECORATIVE TOP ACCENT LINE */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-500" />

                        {mode === 'login' ? (
                            <LoginForm
                                onLoginSuccess={onLoginSuccess}
                                onSwitchToRegister={() => setMode('register')}
                            />
                        ) : (
                            <RegisterForm
                                onRegisterSuccess={onLoginSuccess}
                                onSwitchToLogin={() => setMode('login')}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
