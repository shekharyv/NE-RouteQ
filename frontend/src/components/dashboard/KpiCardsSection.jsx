import React from 'react';
import { Truck, AlertTriangle, ShieldCheck, Clock, Radio } from 'lucide-react';

const KpiCardsSection = ({ summary }) => {
    const kpis = [
        {
            id: 'active-missions',
            title: 'ACTIVE MISSIONS',
            value: summary?.activeMissionsCount || '12',
            sub: summary?.activeMissionsChange || '+8% from yesterday',
            subClass: 'text-emerald-400',
            icon: Truck,
            badgeBg: 'rgba(37, 99, 235, 0.15)',
            iconColor: '#38BDF8',
            border: 'rgba(56, 189, 248, 0.2)'
        },
        {
            id: 'at-risk-missions',
            title: 'AT-RISK MISSIONS',
            value: summary?.atRiskMissionsCount ? `0${summary.atRiskMissionsCount}` : '03',
            sub: summary?.atRiskStatus || 'Needs attention',
            subClass: 'text-red-400 font-bold',
            icon: AlertTriangle,
            badgeBg: 'rgba(239, 68, 68, 0.15)',
            iconColor: '#EF4444',
            border: 'rgba(239, 68, 68, 0.3)'
        },
        {
            id: 'avg-accessibility',
            title: 'AVG ACCESSIBILITY',
            value: summary?.avgAccessibilityScore || '84/100',
            sub: summary?.avgAccessibilityDesc || 'Across active routes',
            subClass: 'text-slate-400',
            icon: ShieldCheck,
            badgeBg: 'rgba(16, 185, 129, 0.15)',
            iconColor: '#34D399',
            border: 'rgba(52, 211, 153, 0.2)'
        },
        {
            id: 'on-time-delivery',
            title: 'ON-TIME DELIVERY',
            value: summary?.onTimeDeliveryRate || '94%',
            sub: summary?.onTimePeriod || 'Last 30 days',
            subClass: 'text-slate-400',
            icon: Clock,
            badgeBg: 'rgba(245, 158, 11, 0.15)',
            iconColor: '#FBBF24',
            border: 'rgba(251, 191, 36, 0.2)'
        },
        {
            id: 'active-vehicles',
            title: 'ACTIVE VEHICLES',
            value: summary?.activeVehiclesCount || '18',
            sub: summary?.activeVehiclesDesc || 'Currently tracking',
            subClass: 'text-emerald-400',
            icon: Radio,
            badgeBg: 'rgba(147, 51, 234, 0.15)',
            iconColor: '#C084FC',
            border: 'rgba(192, 132, 252, 0.2)'
        }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <div
                        key={kpi.id}
                        style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.85)',
                            border: `1px solid ${kpi.border}`,
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            position: 'relative',
                            overflow: 'hidden',
                            backdropFilter: 'blur(8px)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.5px' }}>
                                {kpi.title}
                            </span>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: kpi.badgeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.iconColor }}>
                                <Icon size={16} />
                            </div>
                        </div>

                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, marginBottom: '4px' }}>
                            {kpi.value}
                        </div>

                        <div style={{ fontSize: '0.72rem' }} className={kpi.subClass}>
                            {kpi.sub}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default KpiCardsSection;
