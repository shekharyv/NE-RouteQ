import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';

const PasswordField = ({
    id,
    label = 'Password',
    name = 'password',
    value,
    onChange,
    placeholder = '••••••••',
    error,
    required = true,
    showStrengthMeter = false,
    autoComplete = 'current-password',
    disabled = false
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const getStrength = (pass) => {
        if (!pass) return { score: 0, label: '', color: '#334155', textColor: '#94A3B8' };
        let score = 0;
        if (pass.length >= 6) score += 1;
        if (pass.length >= 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score <= 2) return { score: 33, label: 'Weak', color: '#EF4444', textColor: '#F87171' };
        if (score <= 4) return { score: 66, label: 'Medium', color: '#F59E0B', textColor: '#FBBF24' };
        return { score: 100, label: 'Strong', color: '#22C55E', textColor: '#4ADE80' };
    };

    const strength = getStrength(value);

    return (
        <div className="auth-form-group">
            <label htmlFor={id} className="auth-label">
                <span>
                    {label} {required && <span className="auth-label-required">*</span>}
                </span>
                {error && <span className="auth-label-error">{error}</span>}
            </label>
            <div className="auth-input-wrapper">
                <div className="auth-input-icon">
                    <Lock size={16} />
                </div>
                <input
                    id={id}
                    name={name}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className={`auth-input ${error ? 'has-error' : ''}`}
                    style={{ paddingRight: '40px' }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    className="auth-password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            {showStrengthMeter && value.length > 0 && (
                <div className="auth-strength-meter">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ color: '#94A3B8' }}>Password Strength:</span>
                        <span style={{ color: strength.textColor, fontWeight: 700 }}>{strength.label}</span>
                    </div>
                    <div className="auth-strength-bar-bg">
                        <div
                            className="auth-strength-bar-fill"
                            style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordField;
