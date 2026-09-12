import React from 'react';
import { ShieldCheck, Cpu, Zap, Navigation, MapPin, Truck, CloudRain, Activity } from 'lucide-react';

const AuthBrandPanel = () => {
    return (
        <div className="relative w-full h-full min-h-[580px] bg-slate-950 p-8 lg:p-12 flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 shadow-2xl">
            {/* BACKGROUND DECORATIVE GRADIENTS & MAP GRID */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/30 via-slate-950 to-slate-950 pointer-events-none" />
            <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* NE INDIA GIS MAP GRAPHIC OVERLAY */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-30">
                <svg className="w-full h-full max-w-lg max-h-96" viewBox="0 0 600 400" fill="none">
                    {/* Simulated NE India Topo Contours */}
                    <path d="M100,180 Q180,120 280,140 T420,100 T520,160" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                    <path d="M140,240 Q220,180 320,210 T460,190 T540,260" stroke="#0369a1" strokeWidth="1" />
                    
                    {/* Active Route Line A */}
                    <path d="M150,220 Q 240,250 360,280 T 480,240" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
                    {/* Disrupted Hazard Path B */}
                    <path d="M360,280 Q 420,330 500,310" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />

                    {/* Nodes */}
                    <circle cx="150" cy="220" r="5" fill="#22c55e" />
                    <circle cx="360" cy="280" r="6" fill="#f59e0b" />
                    <circle cx="480" cy="240" r="5" fill="#38bdf8" />
                    <circle cx="500" cy="310" r="5" fill="#ef4444" />
                </svg>
            </div>

            {/* TOP BRAND HEADER */}
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                        <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-white m-0">NE-RouteIQ</h2>
                        <p className="text-[11px] font-semibold tracking-wider text-sky-400 uppercase m-0">
                            Smart Logistics for NER
                        </p>
                    </div>
                </div>

                {/* LIVE GIS STATS BADGES */}
                <div className="flex items-center gap-2 flex-wrap mb-8">
                    <div className="bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-emerald-400 font-bold">MED-1024 Live</span>
                    </div>
                    <div className="bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-slate-300">
                        <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                        <span>Monsoon Impact Layer</span>
                    </div>
                    <div className="bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-slate-300">
                        <Activity className="w-3.5 h-3.5 text-amber-400" />
                        <span>Accessibility 86/100</span>
                    </div>
                </div>
            </div>

            {/* MIDDLE HERO HEADLINE */}
            <div className="relative z-10 my-auto py-6">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                    Smarter Logistics for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
                        North-East India
                    </span>
                </h1>
                <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                    AI-powered route intelligence that helps you plan, monitor and optimize critical journeys across complex terrain.
                </p>
            </div>

            {/* BOTTOM FEATURE HIGHLIGHTS */}
            <div className="relative z-10 pt-6 border-t border-slate-800/80">
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 text-xs text-slate-200">
                        <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                            <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold">AI Route Intelligence</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-200">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold">Real-Time Risk & Accessibility Scoring</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-200">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                            <Zap className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold">Dynamic Landslide Re-routing</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthBrandPanel;
