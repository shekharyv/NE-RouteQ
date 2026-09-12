import React from 'react';
import { Activity, ChevronRight, Truck, ShieldCheck, Clock, Navigation } from 'lucide-react';

const ActiveMissionPanel = ({ activeMission, onViewClick }) => {
    const mission = activeMission || {
        id: 'MED-1024',
        type: 'Medicine',
        origin: 'Guwahati',
        destination: 'Imphal',
        status: 'In Transit',
        eta: '8h 40m',
        distance: '312 km',
        speed: '42 km/h',
        accessibility: '86/100',
        riskLevel: 'LOW',
        recommendedRoute: 'Route B — AI Recommended'
    };

    return (
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', height: '100%', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
            <div>
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', marginBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={16} style={{ color: '#38BDF8' }} />
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>ACTIVE MISSION</h3>
                    </div>
                    <span style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ADE80', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
                        {mission.status}
                    </span>
                </div>

                {/* ID & ROUTE */}
                <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38BDF8' }}>{mission.id}</span>
                        <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: '2px 8px', borderRadius: '4px', color: '#94A3B8' }}>
                            💊 {mission.type}
                        </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{mission.origin}</span>
                        <ChevronRight size={14} style={{ color: '#64748B' }} />
                        <span>{mission.destination}</span>
                    </div>
                </div>

                {/* METRICS GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <span style={{ fontSize: '0.65rem', color: '#94A3B8', display: 'block' }}>ETA</span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF' }}>{mission.eta}</span>
                    </div>

                    <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <span style={{ fontSize: '0.65rem', color: '#94A3B8', display: 'block' }}>Distance</span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF' }}>{mission.distance}</span>
                    </div>

                    <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <span style={{ fontSize: '0.65rem', color: '#94A3B8', display: 'block' }}>Speed</span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#4ADE80' }}>{mission.speed}</span>
                    </div>

                    <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <span style={{ fontSize: '0.65rem', color: '#94A3B8', display: 'block' }}>Accessibility</span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38BDF8' }}>{mission.accessibility}</span>
                    </div>
                </div>

                {/* DETAILS LIST */}
                <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94A3B8' }}>Risk Level:</span>
                        <span style={{ fontWeight: 800, color: mission.riskLevel === 'HIGH' ? '#EF4444' : mission.riskLevel === 'MEDIUM' ? '#F59E0B' : '#4ADE80' }}>
                            {mission.riskLevel || 'LOW'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94A3B8' }}>Route:</span>
                        <span style={{ fontWeight: 700, color: '#38BDF8' }}>{mission.recommendedRoute}</span>
                    </div>
                </div>
            </div>

            {/* ACTION BUTTON */}
            <button
                onClick={() => onViewClick && onViewClick(mission)}
                style={{ width: '100%', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: '6px', transition: 'background-color 0.2s ease' }}
            >
                <Navigation size={14} />
                <span>View Mission</span>
            </button>
        </div>
    );
};

export default ActiveMissionPanel;
