import React, { useState } from 'react';
import { Navigation } from 'lucide-react';
import AuthBrandPanel from './AuthBrandPanel';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthLayout = ({ onLoginSuccess, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);

    return (
        <div className="auth-page-wrapper">
            <div className="auth-main-container">
                {/* DESKTOP LEFT SIDE VISUAL BRAND PANEL */}
                <div className="auth-brand-panel-wrapper">
                    <AuthBrandPanel />
                </div>

                {/* MOBILE / TABLET HEADER BRANDING (Visible on small screens) */}
                <div className="auth-mobile-header">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '8px 16px', borderRadius: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                            <Navigation size={16} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF', margin: 0, lineHeight: 1 }}>NE-RouteIQ</h2>
                            <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', margin: 0, lineHeight: 1, marginTop: '2px' }}>
                                Logistics Intelligence
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE AUTHENTICATION CARD */}
                <div className="auth-card-wrapper">
                    <div className="auth-card">
                        <div className="auth-card-top-accent" />

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
