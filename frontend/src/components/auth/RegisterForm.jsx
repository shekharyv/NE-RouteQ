import React, { useState } from 'react';
import { User, Mail, Phone, Building2, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';
import RoleSelector from './RoleSelector';

const RegisterForm = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        organization: '',
        role: 'operator', // Default to operator
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRoleChange = (roleId) => {
        setFormData(prev => ({ ...prev, role: roleId }));
        if (fieldErrors.role) {
            setFieldErrors(prev => ({ ...prev, role: '' }));
        }
    };

    const validate = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Full Name is required';
        if (!formData.email.trim()) {
            errors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Invalid email address format';
        }

        if (!formData.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
        } else if (!/^[0-9+\s-]{10,14}$/.test(formData.mobile)) {
            errors.mobile = 'Enter a valid 10-digit mobile number';
        }

        if (!formData.organization.trim()) {
            errors.organization = 'Organization or Department is required';
        }

        if (!formData.role) errors.role = 'Please select your role';

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
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
            // Attempt API registration endpoint or fallback mock
            let res;
            try {
                res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } catch (err) {
                // Network fallback
            }

            if (res && res.ok) {
                const data = await res.json();
                onRegisterSuccess(data.user);
            } else {
                // Mock registration handler
                setTimeout(() => {
                    const newUser = {
                        id: 'USER-' + Math.floor(1000 + Math.random() * 9000),
                        name: formData.name,
                        email: formData.email,
                        mobile: formData.mobile,
                        organization: formData.organization,
                        role: formData.role
                    };
                    onRegisterSuccess(newUser);
                    setLoading(false);
                }, 800);
            }
        } catch (err) {
            setErrorMsg('Unable to complete registration. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto py-2">
            {/* HEADER */}
            <div className="mb-5">
                <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">Create your account</h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                    Join the AI-powered logistics & accessibility network for North-East India.
                </p>
            </div>

            {/* ERROR BANNER */}
            {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* REGISTER FORM */}
            <form onSubmit={handleSubmit} noValidate>
                <InputField
                    id="register-name"
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Shekhar Kumar"
                    error={fieldErrors.name}
                    icon={User}
                    required
                    autoComplete="name"
                    disabled={loading}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                    <InputField
                        id="register-email"
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@org.in"
                        error={fieldErrors.email}
                        icon={Mail}
                        required
                        autoComplete="email"
                        disabled={loading}
                    />

                    <InputField
                        id="register-mobile"
                        label="Mobile Number"
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="9876543210"
                        error={fieldErrors.mobile}
                        icon={Phone}
                        required
                        autoComplete="tel"
                        disabled={loading}
                    />
                </div>

                <InputField
                    id="register-organization"
                    label="Organization / Department"
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="e.g. Assam State Disaster Management"
                    error={fieldErrors.organization}
                    icon={Building2}
                    required
                    disabled={loading}
                />

                {/* ROLE SELECTION COMPONENT */}
                <RoleSelector
                    selectedRole={formData.role}
                    onChange={handleRoleChange}
                    error={fieldErrors.role}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                    <PasswordField
                        id="register-password"
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        error={fieldErrors.password}
                        required
                        showStrengthMeter
                        autoComplete="new-password"
                        disabled={loading}
                    />

                    <PasswordField
                        id="register-confirm-password"
                        label="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        error={fieldErrors.confirmPassword}
                        required
                        autoComplete="new-password"
                        disabled={loading}
                    />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm py-3 px-4 rounded-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-emerald-500/30 active:scale-[0.99]"
                    style={{ minHeight: '44px' }}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        <>
                            <span>Create Account</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            {/* SWITCH TO LOGIN */}
            <div className="mt-6 text-center text-xs text-slate-400 pt-4 border-t border-slate-800">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-sky-400 hover:text-sky-300 font-bold ml-1 transition-colors underline-offset-4 hover:underline"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default RegisterForm;
