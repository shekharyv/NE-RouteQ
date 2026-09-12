import React from 'react';
import { ShieldCheck, TrendingUp } from 'lucide-react';

const RegionalAccessibilityWidget = ({ accessibility }) => {
    const data = accessibility || {
        score: '84/100',
        trend: '↑ 6% this week',
        breakdown: [
            { region: 'Assam Valley', score: 92 },
            { region: 'Shillong Plateau', score: 86 },
            { region: 'Barail / Silchar Corridor', score: 72 },
            { region: 'Nagaland / Manipur Hills', score: 64 }
        ]
    };

    return (
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', height: '100%' }}>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} style={{ color: '#34D399' }} />
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Regional Accessibility</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#4ADE80', fontWeight: 700 }}>
                    <TrendingUp size={12} />
                    <span>{data.trend}</span>
                </div>
            </div>

            {/* SCORE */}
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38BDF8', lineHeight: 1, marginBottom: '14px' }}>
                {data.score}
            </div>

            {/* REGIONAL BREAKDOWN GAUGE BARS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.breakdown.map((item) => (
                    <div key={item.region}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#CBD5E1', marginBottom: '3px' }}>
                            <span>{item.region}</span>
                            <span style={{ fontWeight: 700, color: item.score >= 85 ? '#4ADE80' : item.score >= 70 ? '#FBBF24' : '#F87171' }}>{item.score}/100</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div
                                style={{
                                    height: '100%',
                                    width: `${item.score}%`,
                                    backgroundColor: item.score >= 85 ? '#22C55E' : item.score >= 70 ? '#F59E0B' : '#EF4444',
                                    borderRadius: '2px',
                                    transition: 'width 0.5s ease'
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegionalAccessibilityWidget;
