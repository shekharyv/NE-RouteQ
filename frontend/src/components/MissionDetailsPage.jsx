import React, { useEffect, useMemo, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
    AlertTriangle, ArrowLeft, Check, Gauge, Map, Navigation, Route, ShieldCheck,
    Truck, UserRound, Zap
} from 'lucide-react';

const routeCoordinates = {
    'MED-1024': [[91.7362, 26.1158], [92.684, 26.348], [93.7266, 25.9089], [94.1086, 25.6751], [93.9368, 24.817]],
    'FD-2048': [[92.7789, 24.8333], [92.678, 24.225], [92.7, 24.05], [92.7176, 23.7307]],
    'DR-3056': [[91.7362, 26.1158], [92.7926, 26.6528], [93.2, 27.1], [94.1167, 27.1]],
};

const surface = { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, boxShadow: '0 10px 24px rgba(15, 23, 42, .08)' };
const button = (primary = false) => ({ minHeight: 44, borderRadius: 9, border: `1px solid ${primary ? '#2563EB' : '#CBD5E1'}`, background: primary ? '#2563EB' : '#FFFFFF', color: primary ? '#FFFFFF' : '#0F172A', padding: '0 15px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 800, cursor: 'pointer' });
const DetailCard = ({ label, value, tone = '#0F172A' }) => <div className="mission-detail-stat"><span>{label}</span><strong style={{ color: tone }}>{value}</strong></div>;

export default function MissionDetailsPage({ mission, onNavigate }) {
    const mapContainer = useRef(null);
    const missionId = mission?.id || mission?.mission_id;
    const coordinates = useMemo(() => routeCoordinates[missionId] || [[91.7362, 26.1158], [93.9368, 24.817]], [missionId]);
    const accessibility = mission?.accessibility || `${mission?.accessibility_score || 86}/100`;
    const risk = String(mission?.riskLevel || mission?.risk || mission?.risk_level || 'LOW').replace(' RISK', '').toUpperCase();
    const status = mission?.status || (mission?.progress === 100 ? 'Completed' : 'In Transit');
    const progress = Number(mission?.progress ?? (status === 'Completed' ? 100 : 65));
    const isCompleted = status.toLowerCase() === 'completed' || progress === 100;
    const isAtRisk = risk === 'HIGH' || status.toLowerCase() === 'delayed' || status.toLowerCase() === 'at risk';

    useEffect(() => {
        if (!mapContainer.current) return undefined;
        const instance = new maplibregl.Map({
            container: mapContainer.current,
            style: { version: 8, sources: { route: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates } } } }, layers: [{ id: 'route-line', type: 'line', source: 'route', paint: { 'line-color': '#2563EB', 'line-width': 5 } }] },
            center: coordinates[0],
            zoom: 6
        });
        instance.addControl(new maplibregl.NavigationControl(), 'top-right');
        instance.on('load', () => {
            const bounds = coordinates.reduce((result, point) => result.extend(point), new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
            instance.fitBounds(bounds, { padding: 55, maxZoom: 8 });
            new maplibregl.Marker({ color: '#16A34A' }).setLngLat(coordinates[0]).setPopup(new maplibregl.Popup().setText(mission?.origin || 'Origin')).addTo(instance);
            new maplibregl.Marker({ color: '#DC2626' }).setLngLat(coordinates[coordinates.length - 1]).setPopup(new maplibregl.Popup().setText(mission?.destination || 'Destination')).addTo(instance);
            new maplibregl.Marker({ color: '#2563EB' }).setLngLat(coordinates[Math.max(0, Math.floor((coordinates.length - 1) * progress / 100))]).setPopup(new maplibregl.Popup().setText(`🚚 ${missionId} · LIVE`)).addTo(instance);
        });
        return () => instance.remove();
    }, [coordinates, mission?.destination, mission?.origin, missionId, progress]);

    if (!mission) return <main className="mission-details-page"><button style={button()} onClick={() => onNavigate('missions')}><ArrowLeft size={16} /> Back to Missions</button><section style={{ ...surface, padding: 28, marginTop: 20 }}><h2>Mission not found</h2><p>The mission may have been removed or is not available to this account.</p></section></main>;

    const goToSelected = tab => onNavigate(tab, missionId);
    return <main className="mission-details-page">
        <button style={button()} onClick={() => onNavigate('missions')}><ArrowLeft size={16} /> Back to Missions</button>
        <header className="mission-details-header"><div><span className="mission-eyebrow">Mission</span><h1>{missionId}</h1><p>{mission?.type || mission?.category || 'Logistics'} · {mission?.route || `${mission?.origin || mission?.source} → ${mission?.destination}`}</p></div><span className={`mission-status ${isCompleted ? 'completed' : isAtRisk ? 'risk' : ''}`}>● {status}</span></header>
        <section className="mission-detail-grid"><DetailCard label="ETA" value={mission?.eta || '8h 40m'} /><DetailCard label="Distance" value={mission?.distance || '143.2 km left'} /><DetailCard label="Speed" value={`${mission?.speed || 40} km/h`} /><DetailCard label="Accessibility" value={accessibility} tone="#15803D" /><DetailCard label="Risk" value={risk} tone={risk === 'HIGH' ? '#DC2626' : risk === 'MEDIUM' ? '#B45309' : '#15803D'} /><DetailCard label="Priority" value={mission?.priority || 'CRITICAL'} /><DetailCard label="Vehicle" value={String(mission?.vehicle || mission?.vehicle_id || 'AS-01-BC-1234').replace(' (Truck)', '')} /><DetailCard label="Driver" value={mission?.driver || 'Assigned Driver'} /><DetailCard label="Cargo" value={mission?.cargo || 'Medical Supplies'} /></section>
        <section className="mission-details-columns"><div>
            <section style={{ ...surface, overflow: 'hidden' }}><div className="mission-section-heading"><div><span className="mission-eyebrow">Live Map</span><h2>{mission?.origin || 'Origin'} → {mission?.destination || 'Destination'}</h2></div><span className="live-map-label">● LIVE</span></div><div ref={mapContainer} className="mission-map" /></section>
            <section style={{ ...surface, padding: 22, marginTop: 18 }}><div className="mission-section-heading"><h2>Mission Progress</h2><strong>{progress}% Completed</strong></div><div className="mission-progress-track"><span style={{ width: `${progress}%` }} /></div><div className="mission-timeline">{['Mission Created', 'Route Generated', 'Route Selected', 'Driver Assigned', 'Journey Started', 'In Transit', 'Delivery Completed'].map((item, index) => <div key={item} className={(index < 5 && progress > 0) || (isCompleted && index === 6) ? 'done' : index === 5 && !isCompleted ? 'current' : ''}><span>{(index < 5 && progress > 0) || (isCompleted && index === 6) ? <Check size={13} /> : index === 5 && !isCompleted ? '●' : '○'}</span>{item}</div>)}</div></section>
        </div><aside>
            <section style={{ ...surface, padding: 22 }}><div className="mission-section-heading"><h2>Current Route Condition</h2><ShieldCheck size={20} color="#15803D" /></div><div className="condition-list"><DetailCard label="Road Quality" value="Good" tone="#15803D" /><DetailCard label="Weather" value="Light Rain" tone="#B45309" /><DetailCard label="Terrain" value="Difficult" tone="#B45309" /><DetailCard label="Disruption" value={isAtRisk ? 'High' : 'Low'} tone={isAtRisk ? '#DC2626' : '#15803D'} /><DetailCard label="Accessibility" value={accessibility} tone="#15803D" /></div></section>
            <section style={{ ...surface, padding: 22, marginTop: 18, borderTop: '3px solid #2563EB' }}><div className="mission-eyebrow">AI Route Insight</div><h2>Route B — AI Recommended</h2><p className="ai-score">AI Score: <strong>91/100</strong></p><ul className="insight-list"><li>Lower disruption risk</li><li>Better road reliability</li><li>Higher accessibility</li><li>Alternate corridor available</li></ul><button style={{ ...button(true), width: '100%' }} onClick={() => goToSelected('routes')}><Route size={16} /> View Route Analysis</button></section>
            <section style={{ ...surface, padding: 22, marginTop: 18 }}><div className="mission-section-heading"><h2>Driver / Vehicle</h2><Truck size={20} color="#2563EB" /></div><div className="driver-detail-list"><p><UserRound size={16} /> <span>Driver<strong>{mission?.driver || 'Assigned Driver'}</strong></span></p><p><Truck size={16} /> <span>Vehicle<strong>{mission?.vehicle || mission?.vehicle_id || 'AS-01-BC-1234'}</strong></span></p><p><Gauge size={16} /> <span>Current Speed<strong>{mission?.speed || 40} km/h · Strong (4G)</strong></span></p></div><button style={{ ...button(), width: '100%' }} onClick={() => goToSelected('map')}><Navigation size={16} /> View Live Tracking</button></section>
            <section style={{ ...surface, padding: 22, marginTop: 18 }}><div className="mission-section-heading"><h2>Alerts / Disruptions</h2><AlertTriangle size={20} color={isAtRisk ? '#DC2626' : '#B45309'} /></div>{isAtRisk || missionId === 'MED-1024' ? <div className="mission-alert"><strong>⚠ Heavy rainfall detected</strong><span>Manipur corridor · Moderate impact · 24 min ago</span></div> : <p>No active disruptions for this mission.</p>}</section>
        </aside></section>
        <section style={{ ...surface, padding: 22, marginTop: 18 }}><div className="mission-section-heading"><h2>Mission Actions</h2><Zap size={20} color="#2563EB" /></div><div className="mission-actions"><button style={button(true)} onClick={() => goToSelected(isCompleted ? 'reports' : 'map')}><Map size={16} /> {isCompleted ? 'View Report' : 'View Live Map'}</button><button style={button()} onClick={() => goToSelected('routes')}><Route size={16} /> View Route</button>{!isCompleted && <button style={button()} onClick={() => window.alert(`Contacting ${mission?.driver || 'assigned driver'}`)}><UserRound size={16} /> Contact Driver</button>}{isAtRisk && <button style={button()} onClick={() => goToSelected('routes')}><Route size={16} /> Recalculate Route</button>}</div></section>
        {isAtRisk && <section className="mission-risk-panel"><strong><AlertTriangle size={17} /> Route Risk Increased</strong><span>Current Risk: HIGH · Accessibility: {accessibility}</span><p>Safer alternative route available.</p><button style={button(true)} onClick={() => goToSelected('routes')}>View Alternative Route</button></section>}
    </main>;
}