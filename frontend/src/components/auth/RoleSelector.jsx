import React from 'react';
import { Shield, Truck, HeartHandshake, Siren, Compass } from 'lucide-react';

const ROLES = [
    {
        id: 'admin',
        title: 'Government / Admin',
        badge: 'Admin Dashboard',
        desc: 'State planning, policy & high-level infrastructure monitoring.',
        icon: Shield,
        color: 'text-sky-400',
        bg: 'bg-sky-500/10 border-sky-500/30'
    },
    {
        id: 'operator',
        title: 'Logistics Operator',
        badge: 'Operator Command',
        desc: 'Fleet optimization, manifest routing & dispatch operations.',
        icon: Truck,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
        id: 'ngo',
        title: 'NGO / Relief Operator',
        badge: 'Relief Logistics',
        desc: 'Humanitarian supply lines, food & medical aid distribution.',
        icon: HeartHandshake,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30'
    },
    {
        id: 'emergency',
        title: 'Emergency Response',
        badge: 'Emergency Dispatch',
        desc: 'Landslide hazard priority dispatch & rapid evacuation routing.',
        icon: Siren,
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30'
    },
    {
        id: 'driver',
        title: 'Driver / Field Operator',
        badge: 'Driver Navigation',
        desc: 'Turn-by-turn GIS navigation & real-time road hazard alerts.',
        icon: Compass,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10 border-purple-500/30'
    }
];

const RoleSelector = ({ selectedRole, onChange, error }) => {
    return (
        <div className="form-group mb-5">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>
                    Select your role <span className="text-red-400">*</span>
                </span>
                {error && <span className="text-red-400 font-normal text-[11px]">{error}</span>}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ROLES.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                        <div
                            key={role.id}
                            onClick={() => onChange(role.id)}
                            className={`cursor-pointer p-3 rounded-lg border transition-all duration-200 flex items-start gap-3 relative overflow-hidden ${
                                isSelected
                                    ? `${role.bg} ring-1 ring-sky-500 shadow-md`
                                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                            }`}
                            style={{ minHeight: '64px' }}
                        >
                            <div className={`p-2 rounded-md bg-slate-800/80 ${role.color} shrink-0 mt-0.5`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="text-xs font-bold text-slate-100 truncate">{role.title}</h4>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                                    {role.desc}
                                </p>
                            </div>
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoleSelector;
export { ROLES };
