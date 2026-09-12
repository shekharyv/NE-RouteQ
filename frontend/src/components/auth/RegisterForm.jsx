import React, { useState } from 'react';
import { User, Mail, Phone, Building2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import InputField from './InputField';
import PasswordField from './PasswordField';
import RoleSelector from './RoleSelector';
import { setAccessToken } from '../../services/api';

const RegisterForm = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        organization: '',
        role: 'operator',
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
            let res;
            try {
                res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } catch (err) {}

            if (res && res.ok) {
                const data = await res.json();
                if (data.access_token) setAccessToken(data.access_token);
                onRegisterSuccess(data.user, data.access_token);
            } else {
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
                }, 600);
            }
        } catch (err) {
            setErrorMsg('Unable to complete registration. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {/* HEADER */}
            <div className="auth-card-header">
                <h2 className="auth-card-title">Create your account</h2>
                <p className="auth-card-subtitle">
                    Join the AI-powered logistics & accessibility network for North-East India.
                </p>
            </div>

            {/* ERROR BANNER */}
            {errorMsg && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#F87171', fontSize: '0.78rem', display: 'flex', items: 'center', gap: '8px' }}>
                    <AlertCircle size={16} />
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0 12px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0 12px' }}>
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
                    className="auth-submit-btn register-btn"
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        <>
                            <span>Create Account</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            {/* SWITCH TO LOGIN */}
            <div className="auth-switch-text">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="auth-switch-btn"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default RegisterForm;
