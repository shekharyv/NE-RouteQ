import React from 'react';
import { Shield, Truck, HeartHandshake, Siren, Compass } from 'lucide-react';

const ROLES = [
    {
        id: 'admin',
        title: 'Government / Admin',
        badge: 'Admin Dashboard',
        desc: 'State planning, policy & high-level infrastructure monitoring.',
        icon: Shield,
        color: '#38BDF8'
    },
    {
        id: 'operator',
        title: 'Logistics Operator',
        badge: 'Operator Command',
        desc: 'Fleet optimization, manifest routing & dispatch operations.',
        icon: Truck,
        color: '#34D399'
    },
    {
        id: 'ngo',
        title: 'NGO / Relief Operator',
        badge: 'Relief Logistics',
        desc: 'Humanitarian supply lines, food & medical aid distribution.',
        icon: HeartHandshake,
        color: '#FBBF24'
    },
    {
        id: 'emergency',
        title: 'Emergency Response',
        badge: 'Emergency Dispatch',
        desc: 'Landslide hazard priority dispatch & rapid evacuation routing.',
        icon: Siren,
        color: '#F87171'
    },
    {
        id: 'driver',
        title: 'Driver / Field Operator',
        badge: 'Driver Navigation',
        desc: 'Turn-by-turn GIS navigation & real-time road hazard alerts.',
        icon: Compass,
        color: '#C084FC'
    }
];

const RoleSelector = ({ selectedRole, onChange, error }) => {
    return (
        <div className="auth-form-group">
            <label className="auth-label">
                <span>
                    Select your role <span className="auth-label-required">*</span>
                </span>
                {error && <span className="auth-label-error">{error}</span>}
            </label>

            <div className="auth-role-grid">
                {ROLES.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                        <div
                            key={role.id}
                            onClick={() => onChange(role.id)}
                            className={`auth-role-card ${isSelected ? 'selected' : ''}`}
                        >
                            <div className="auth-role-icon" style={{ color: role.color }}>
                                <Icon size={16} />
                            </div>
                            <div className="auth-role-info">
                                <h4>{role.title}</h4>
                                <p>{role.desc}</p>
                            </div>
                            {isSelected && <div className="auth-role-dot" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoleSelector;
export { ROLES };
