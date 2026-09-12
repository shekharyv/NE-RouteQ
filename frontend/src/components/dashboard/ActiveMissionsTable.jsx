import React from 'react';
import { Truck, Navigation, ChevronRight } from 'lucide-react';

const ActiveMissionsTable = ({ missions, onViewMission }) => {
    const list = missions && missions.length > 0 ? missions : [
        { id: 'MED-1024', type: 'Medicine', route: 'Guwahati → Imphal', vehicle: 'AS-01-BC-1234', status: 'In Transit', riskLevel: 'LOW', accessibility: '86/100', eta: '8h 40m' },
        { id: 'FD-2048', type: 'Food Supply', route: 'Silchar → Aizawl', vehicle: 'MZ-01-D-5678', status: 'In Transit', riskLevel: 'MEDIUM', accessibility: '78/100', eta: '3h 45m' },
        { id: 'DR-3056', type: 'Disaster Relief', route: 'Guwahati → Itanagar', vehicle: 'AR-01-TR-9921', status: 'Delayed', riskLevel: 'HIGH', accessibility: '61/100', eta: '12h 10m' }
    ];

    return (
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', marginBottom: '20px' }}>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={18} style={{ color: '#38BDF8' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Active Missions</h3>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>
                    {list.length} Missions in progress
                </span>
            </div>

            {/* DESKTOP TABLE VIEW (Visible >= 768px) */}
            <div className="hidden md:block overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '10px 12px' }}>Mission ID</th>
                            <th style={{ padding: '10px 12px' }}>Category</th>
                            <th style={{ padding: '10px 12px' }}>Route</th>
                            <th style={{ padding: '10px 12px' }}>Vehicle</th>
                            <th style={{ padding: '10px 12px' }}>Status</th>
                            <th style={{ padding: '10px 12px' }}>Risk</th>
                            <th style={{ padding: '10px 12px' }}>Accessibility</th>
                            <th style={{ padding: '10px 12px' }}>ETA</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((m) => (
                            <tr key={m.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#F8FAFC' }}>
                                <td style={{ padding: '12px', fontWeight: 800, color: '#38BDF8' }}>{m.id}</td>
                                <td style={{ padding: '12px', color: '#CBD5E1' }}>{m.type || m.category}</td>
                                <td style={{ padding: '12px', fontWeight: 600 }}>{m.route}</td>
                                <td style={{ padding: '12px', color: '#94A3B8', fontSize: '0.78rem' }}>{m.vehicle}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ backgroundColor: m.status === 'Delayed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', color: m.status === 'Delayed' ? '#F87171' : '#4ADE80', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                                        {m.status}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ fontWeight: 800, color: m.riskLevel === 'HIGH' ? '#EF4444' : m.riskLevel === 'MEDIUM' ? '#F59E0B' : '#4ADE80' }}>
                                        {m.riskLevel || m.risk || 'LOW'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontWeight: 700, color: '#38BDF8' }}>{m.accessibility}</td>
                                <td style={{ padding: '12px', color: '#94A3B8' }}>{m.eta}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => onViewMission && onViewMission(m)}
                                        style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MOBILE CARDS VIEW (Visible < 768px — ZERO horizontal overflow) */}
            <div className="block md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {list.map((m) => (
                    <div
                        key={m.id}
                        style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38BDF8' }}>{m.id}</span>
                            <span style={{ backgroundColor: m.status === 'Delayed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', color: m.status === 'Delayed' ? '#F87171' : '#4ADE80', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                                {m.status}
                            </span>
                        </div>

                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                            {m.route}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '10px' }}>
                            <div>Category: <strong style={{ color: '#F8FAFC' }}>{m.type || m.category}</strong></div>
                            <div>Vehicle: <strong style={{ color: '#F8FAFC' }}>{m.vehicle}</strong></div>
                            <div>Accessibility: <strong style={{ color: '#38BDF8' }}>{m.accessibility}</strong></div>
                            <div>Risk: <strong style={{ color: m.riskLevel === 'HIGH' ? '#EF4444' : m.riskLevel === 'MEDIUM' ? '#F59E0B' : '#4ADE80' }}>{m.riskLevel || m.risk || 'LOW'}</strong></div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>ETA: {m.eta}</span>
                            <button
                                onClick={() => onViewMission && onViewMission(m)}
                                style={{ backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <span>View Details</span>
                                <ChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveMissionsTable;
