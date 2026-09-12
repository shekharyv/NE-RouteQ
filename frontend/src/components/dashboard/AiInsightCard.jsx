import React from 'react';
import { Cpu, CheckCircle2, HelpCircle } from 'lucide-react';

const AiInsightCard = ({ onWhyClick }) => {
    return (
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px', padding: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
            {/* TOP ACCENT LINE */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #38BDF8 0%, #22C55E 100%)' }} />

            {/* CARD TITLE */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#38BDF8' }}>
                        <Cpu size={16} />
                    </div>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>AI LOGISTICS INSIGHT</h3>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    Explainable AI
                </span>
            </div>

            {/* RECOMMENDATION BANNER */}
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '12px', lineHeight: 1.4 }}>
                "Route B is currently the best option for MED-1024."
            </p>

            {/* BULLET POINTS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#CBD5E1' }}>
                    <CheckCircle2 size={14} style={{ color: '#4ADE80', shrink: 0 }} />
                    <span>Lower disruption risk</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#CBD5E1' }}>
                    <CheckCircle2 size={14} style={{ color: '#4ADE80', shrink: 0 }} />
                    <span>Better road reliability</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#CBD5E1' }}>
                    <CheckCircle2 size={14} style={{ color: '#4ADE80', shrink: 0 }} />
                    <span>Accessibility 86/100</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#CBD5E1' }}>
                    <CheckCircle2 size={14} style={{ color: '#4ADE80', shrink: 0 }} />
                    <span>Alternate corridor available</span>
                </div>
            </div>

            {/* WHY THIS ROUTE BUTTON */}
            <button
                onClick={onWhyClick}
                style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#38BDF8', borderRadius: '8px', padding: '8px 14px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease' }}
            >
                <HelpCircle size={14} />
                <span>Why this route?</span>
            </button>
        </div>
    );
};

export default AiInsightCard;
