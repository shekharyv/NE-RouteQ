import React from 'react';
import { AlertTriangle, Bell, ArrowRight } from 'lucide-react';

const AlertsWidget = ({ alerts, onViewAllAlerts }) => {
    const list = alerts && alerts.length > 0 ? alerts : [
        { id: 'ALT-1', level: 'HIGH', badgeClass: 'badge-danger', title: 'Landslide risk detected', location: 'NH corridor near Imphal', time: '8 min ago' },
        { id: 'ALT-2', level: 'WARNING', badgeClass: 'badge-warning', title: 'Heavy rainfall expected', location: 'Manipur region', time: '24 min ago' },
        { id: 'ALT-3', level: 'RESOLVED', badgeClass: 'badge-success', title: 'Traffic disruption cleared', location: 'Guwahati corridor', time: '1 hour ago' }
    ];

    return (
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', height: '100%', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
            <div>
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bell size={16} style={{ color: '#EF4444' }} />
                        <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Recent Alerts</h3>
                    </div>
                    <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '8px' }}>
                        {list.length} New
                    </span>
                </div>

                {/* ALERTS FEED */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                    {list.map((alert) => (
                        <div
                            key={alert.id}
                            style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}
                        >
                            <div style={{ marginTop: '2px', shrink: 0 }}>
                                <span
                                    style={{
                                        fontSize: '0.6rem',
                                        fontWeight: 800,
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: alert.level === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : alert.level === 'WARNING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                        color: alert.level === 'HIGH' ? '#F87171' : alert.level === 'WARNING' ? '#FBBF24' : '#4ADE80'
                                    }}
                                >
                                    {alert.level}
                                </span>
                            </div>

                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F8FAFC', margin: '0 0 2px 0' }}>{alert.title}</h4>
                                <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: 0 }}>{alert.location}</p>
                            </div>

                            <span style={{ fontSize: '0.65rem', color: '#64748B', shrink: 0 }}>{alert.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* BUTTON */}
            <button
                onClick={onViewAllAlerts}
                style={{ width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#38BDF8', padding: '8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: '6px' }}
            >
                <span>View All Alerts</span>
                <ArrowRight size={12} />
            </button>
        </div>
    );
};

export default AlertsWidget;
