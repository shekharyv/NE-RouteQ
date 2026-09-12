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
        <div className="auth-form-group">
            <label htmlFor={id} className="auth-label">
                <span>
                    {label} {required && <span className="auth-label-required">*</span>}
                </span>
                {error && <span className="auth-label-error">{error}</span>}
            </label>
            <div className="auth-input-wrapper">
                {Icon && (
                    <div className="auth-input-icon">
                        <Icon size={16} />
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
                    className={`auth-input ${error ? 'has-error' : ''}`}
                    style={!Icon ? { paddingLeft: '14px' } : {}}
                />
            </div>
        </div>
    );
};

export default InputField;
