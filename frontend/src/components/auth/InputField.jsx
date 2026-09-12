import React from 'react';

const InputField = ({
    id,
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    error,
    icon: Icon,
    required = true,
    autoComplete,
    disabled = false
}) => {
    return (
        <div className="form-group mb-4">
            <label htmlFor={id} className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>
                    {label} {required && <span className="text-red-400">*</span>}
                </span>
                {error && <span className="text-red-400 font-normal text-[11px] animate-fade-in">{error}</span>}
            </label>
            <div className="relative rounded-lg shadow-sm">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className={`w-full bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm rounded-lg block py-2.5 transition-all duration-200 ${
                        Icon ? 'pl-10' : 'pl-3.5'
                    } pr-3.5 ${
                        error
                            ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                            : 'border-slate-700/80 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 hover:border-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={{ minHeight: '44px' }}
                />
            </div>
        </div>
    );
};

export default InputField;
