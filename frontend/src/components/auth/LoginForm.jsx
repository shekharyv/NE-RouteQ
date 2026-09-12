import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, AlertCircle, Shield, Truck, HeartHandshake, Siren, Compass } from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';

const DEMO_ACCOUNTS = [
    { role: 'admin', label: 'Admin', email: 'admin@nerouteiq.in', pass: 'Admin123!', icon: Shield, color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
    { role: 'operator', label: 'Operator', email: 'operator@nerouteiq.in', pass: 'Operator123!', icon: Truck, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { role: 'ngo', label: 'Relief', email: 'relief@nerouteiq.in', pass: 'Relief123!', icon: HeartHandshake, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { role: 'emergency', label: 'Emergency', email: 'emergency@nerouteiq.in', pass: 'Emergency123!', icon: Siren, color: 'text-red-400 border-red-500/30 bg-red-500/10' },
    { role: 'driver', label: 'Driver', email: 'driver@nerouteiq.in', pass: 'Driver123!', icon: Compass, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' }
];

const LoginForm = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    // Quick demo fill
    const fillDemo = (acc) => {
        setIdentifier(acc.email);
        setPassword(acc.pass);
        setErrorMsg('');
        setFieldErrors({});
    };

    const validate = () => {
        const errors = {};
        if (!identifier.trim()) {
            errors.identifier = 'Email or mobile number is required';
        }
        if (!password) {
            errors.password = 'Password is required';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!validate()) return;

        setLoading(true);

        try {
            // Attempt API authentication call or mock fallback
            let res;
            try {
                res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identifier, password })
                });
            } catch (err) {
                // Ignore network error if backend API isn't running directly, fallback to mock auth below
            }

            if (res && res.ok) {
                const data = await res.json();
                onLoginSuccess(data.user);
            } else {
                // Mock Authentication Logic
                setTimeout(() => {
                    // Match demo email or default test credentials
                    const matchedDemo = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === identifier.toLowerCase());
                    const role = matchedDemo ? matchedDemo.role : 'operator';
                    const name = matchedDemo 
                        ? (matchedDemo.role === 'admin' ? 'Dr. Himanta Sharma (State Admin)' : `${matchedDemo.label} Operator`)
                        : 'Democratized User';

                    if (password.length < 4) {
                        setErrorMsg('Unable to sign in. Please check your password credentials.');
                        setLoading(false);
                        return;
                    }

                    const mockUser = {
                        id: 'USER-' + Math.floor(1000 + Math.random() * 9000),
                        name,
                        email: identifier.includes('@') ? identifier : `${identifier}@nerouteiq.in`,
                        mobile: identifier.includes('@') ? '9876543210' : identifier,
                        role,
                        organization: 'NE-RouteIQ Operations Center'
                    };

                    onLoginSuccess(mockUser);
                    setLoading(false);
                }, 800);
            }
        } catch (err) {
            setErrorMsg('Unable to connect to authentication server. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto py-2">
            {/* HEADER */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">Welcome back</h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                    Sign in to continue to your logistics command center.
                </p>
            </div>

            {/* ERROR BANNER */}
            {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-shake">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* DEMO ACCOUNTS QUICK-FILL STRIP */}
            <div className="mb-5 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Quick Demo Sign-In</span>
                    <span className="text-[10px] text-slate-500 font-normal">Click role to fill</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                    {DEMO_ACCOUNTS.map((acc) => {
                        const Icon = acc.icon;
                        return (
                            <button
                                key={acc.role}
                                type="button"
                                onClick={() => fillDemo(acc)}
                                className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium border flex items-center gap-1.5 transition-all hover:scale-105 ${acc.color}`}
                                title={`Fill ${acc.label} credentials (${acc.email})`}
                            >
                                <Icon className="w-3 h-3" />
                                <span>{acc.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} noValidate>
                <InputField
                    id="login-identifier"
                    label="Email or Mobile Number"
                    type="text"
                    name="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="operator@nerouteiq.in or 9876543210"
                    error={fieldErrors.identifier}
                    icon={Mail}
                    required
                    autoComplete="username"
                    disabled={loading}
                />

                <PasswordField
                    id="login-password"
                    label="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    error={fieldErrors.password}
                    required
                    autoComplete="current-password"
                    disabled={loading}
                />

                {/* REMEMBER ME & FORGOT PASSWORD */}
                <div className="flex items-center justify-between mb-6 text-xs">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer user-select-none">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500/20"
                        />
                        <span>Remember me</span>
                    </label>

                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            alert('Password reset link has been dispatched to your registered email address.');
                        }}
                        className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                    >
                        Forgot password?
                    </a>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-sm py-3 px-4 rounded-lg shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sky-500/30 active:scale-[0.99]"
                    style={{ minHeight: '44px' }}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Authenticating...</span>
                        </>
                    ) : (
                        <>
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            {/* SWITCH TO REGISTER */}
            <div className="mt-6 text-center text-xs text-slate-400 pt-4 border-t border-slate-800">
                Don't have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-sky-400 hover:text-sky-300 font-bold ml-1 transition-colors underline-offset-4 hover:underline"
                >
                    Create account
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
