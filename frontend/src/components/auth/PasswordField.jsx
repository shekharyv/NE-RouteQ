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

    // Calculate password strength
    const getStrength = (pass) => {
        if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
        let score = 0;
        if (pass.length >= 6) score += 1;
        if (pass.length >= 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-400' };
        if (score <= 4) return { score: 66, label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-400' };
        return { score: 100, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
    };

    const strength = getStrength(value);

    return (
        <div className="form-group mb-4">
            <label htmlFor={id} className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>
                    {label} {required && <span className="text-red-400">*</span>}
                </span>
                {error && <span className="text-red-400 font-normal text-[11px] animate-fade-in">{error}</span>}
            </label>
            <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
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
                    className={`w-full bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm rounded-lg block py-2.5 pl-10 pr-11 transition-all duration-200 ${
                        error
                            ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                            : 'border-slate-700/80 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 hover:border-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={{ minHeight: '44px' }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>

            {/* PASSWORD STRENGTH METER (Shown in Registration) */}
            {showStrengthMeter && value.length > 0 && (
                <div className="mt-2 text-xs space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Password Strength:</span>
                        <span className={`font-semibold ${strength.textColor}`}>{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${strength.color}`}
                            style={{ width: `${strength.score}%` }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-1">
                        <div className={`flex items-center gap-1 ${value.length >= 8 ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {value.length >= 8 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            Min 8 characters
                        </div>
                        <div className={`flex items-center gap-1 ${/[0-9]/.test(value) ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {/[0-9]/.test(value) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            At least 1 number
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordField;
