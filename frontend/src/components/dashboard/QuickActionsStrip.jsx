import React from 'react';
import { Plus, Map, Bell, BarChart3, FileText } from 'lucide-react';

const QuickActionsStrip = ({ onCreateMission, onNavTab }) => {
    const actions = [
        { id: 'create', label: '+ Create Mission', icon: Plus, isPrimary: true, onClick: onCreateMission },
        { id: 'map', label: 'View Live Map', icon: Map, onClick: () => onNavTab('map') },
        { id: 'alerts', label: 'View Alerts', icon: Bell, onClick: () => onNavTab('alerts') },
        { id: 'analytics', label: 'View Analytics', icon: BarChart3, onClick: () => onNavTab('analytics') },
        { id: 'reports', label: 'Mission Reports', icon: FileText, onClick: () => onNavTab('reports') }
    ];

    return (
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                QUICK ACTIONS
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {actions.map((act) => {
                    const Icon = act.icon;
                    return (
                        <button
                            key={act.id}
                            onClick={act.onClick}
                            style={{
                                backgroundColor: act.isPrimary ? '#2563EB' : 'rgba(30, 41, 59, 0.8)',
                                border: act.isPrimary ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                                color: act.isPrimary ? '#FFFFFF' : '#E2E8F0',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease',
                                minHeight: '38px',
                                boxShadow: act.isPrimary ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                            }}
                        >
                            <Icon size={14} />
                            <span>{act.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActionsStrip;
