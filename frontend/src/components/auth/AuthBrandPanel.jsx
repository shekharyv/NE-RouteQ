import React from 'react';
import { ShieldCheck, Cpu, Zap, Navigation, CloudRain, Activity } from 'lucide-react';

const AuthBrandPanel = () => {
    return (
        <div className="auth-brand-panel">
            <div className="auth-brand-panel-grid-bg" />

            {/* NE INDIA GIS MAP GRAPHIC OVERLAY */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.35 }}>
                <svg viewBox="0 0 600 400" fill="none" style={{ width: '100%', height: '100%', maxWidth: '500px' }}>
                    <path d="M100,180 Q180,120 280,140 T420,100 T520,160" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M140,240 Q220,180 320,210 T460,190 T540,260" stroke="#0369a1" strokeWidth="1" />
                    <path d="M150,220 Q 240,250 360,280 T 480,240" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M360,280 Q 420,330 500,310" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />
                    <circle cx="150" cy="220" r="6" fill="#22c55e" />
                    <circle cx="360" cy="280" r="7" fill="#f59e0b" />
                    <circle cx="480" cy="240" r="6" fill="#38bdf8" />
                    <circle cx="500" cy="310" r="6" fill="#ef4444" />
                </svg>
            </div>

            {/* TOP BRAND HEADER */}
            <div className="auth-brand-header">
                <div className="auth-brand-icon">
                    <Navigation size={22} />
                </div>
                <div>
                    <h2 className="auth-brand-title">NE-RouteIQ</h2>
                    <p className="auth-brand-subtitle">Smart Logistics for NER</p>
                </div>
            </div>

            {/* LIVE GIS STATS BADGES */}
            <div className="auth-badges-row">
                <div className="auth-pill-badge">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
                    <span style={{ color: '#4ADE80', fontWeight: 700 }}>MED-1024 Live</span>
                </div>
                <div className="auth-pill-badge">
                    <CloudRain size={14} style={{ color: '#38BDF8' }} />
                    <span>Monsoon Impact Layer</span>
                </div>
                <div className="auth-pill-badge">
                    <Activity size={14} style={{ color: '#FBBF24' }} />
                    <span>Accessibility 86/100</span>
                </div>
            </div>

            {/* MIDDLE HERO HEADLINE */}
            <div className="auth-brand-hero">
                <h1 className="auth-hero-title">
                    Smarter Logistics for <br />
                    <span className="auth-hero-title-highlight">North-East India</span>
                </h1>
                <p className="auth-hero-desc">
                    AI-powered route intelligence that helps you plan, monitor and optimize critical journeys across complex terrain.
                </p>
            </div>

            {/* BOTTOM FEATURE HIGHLIGHTS */}
            <div className="auth-features-list">
                <div className="auth-feature-item">
                    <div className="auth-feature-icon-wrapper">
                        <Cpu size={14} />
                    </div>
                    <span>AI Route Intelligence</span>
                </div>

                <div className="auth-feature-item">
                    <div className="auth-feature-icon-wrapper">
                        <ShieldCheck size={14} />
                    </div>
                    <span>Real-Time Risk & Accessibility Scoring</span>
                </div>

                <div className="auth-feature-item">
                    <div className="auth-feature-icon-wrapper">
                        <Zap size={14} />
                    </div>
                    <span>Dynamic Landslide Re-routing</span>
                </div>
            </div>
        </div>
    );
};

export default AuthBrandPanel;
