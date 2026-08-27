import React, { useState, useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const missionRouteCoords = {
    'MED-1024': [
        [91.7362, 26.1158], // Guwahati
        [91.9540, 26.1680],
        [92.2030, 26.1950], // Jagiroad
        [92.5180, 26.2300], // Raha
        [92.6840, 26.3480], // Nagaon
        [92.8750, 26.1300], // Doboka
        [93.4300, 25.8400], // Diphu
        [93.7266, 25.9089], // Dimapur
        [94.1086, 25.6751], // Kohima
        [94.1300, 25.4000], // Mao
        [94.1700, 25.2600], // Senapati
        [93.9800, 25.1500], // Kangpokpi
        [93.9368, 24.8170]  // Imphal
    ],
    'FD-2048': [
        [92.7789, 24.8333], // Silchar
        [92.7200, 24.5000],
        [92.6780, 24.2250], // Kolasib
        [92.7000, 24.0500], // Kawnpui
        [92.7176, 23.7307]  // Aizawl
    ],
    'DR-3056': [
        [94.2026, 26.7509], // Jorhat
        [93.6000, 26.6500],
        [92.9900, 26.5800], // Jakhlabandha
        [92.7926, 26.6528]  // Tezpur
    ],
    'AG-4091': [
        [93.7266, 25.9089], // Dimapur
        [93.7700, 25.8200], // Chumukedima
        [93.9000, 25.7500], // Medziphema
        [94.1086, 25.6751]  // Kohima
    ],
    'CN-5012': [
        [91.8833, 25.5689], // Shillong
        [91.5500, 25.5500],
        [91.2700, 25.5200], // Nongstoin
        [90.6200, 25.5000], // Williamnagar
        [90.2201, 25.5149]  // Tura
    ],
    'GC-6023': [
        [91.2868, 23.8315], // Agartala
        [91.5000, 23.9000],
        [91.8500, 23.9800], // Ambassa
        [92.0300, 24.2700], // Kumarghat
        [92.0008, 24.3224]  // Kailashahar
    ]
};

const alternativeRouteCoords = [
    [91.7362, 26.1158], // Guwahati
    [92.2030, 26.1950],
    [92.6840, 26.3480], // Nagaon
    [92.9500, 25.9100], // Lanka
    [93.0200, 25.1800], // Haflong
    [92.7789, 24.8333], // Silchar
    [93.1300, 24.8000], // Jiribam
    [93.6100, 24.8200], // Noney
    [93.9368, 24.8170]  // Imphal
];

const getCoordinatesAtProgress = (coords, progress) => {
    if (!coords || coords.length === 0) return [0, 0];
    const totalSegments = coords.length - 1;
    const currentProgress = progress * totalSegments;
    const segmentIndex = Math.floor(currentProgress);
    const segmentProgress = currentProgress - segmentIndex;
    
    if (segmentIndex >= totalSegments) {
        return coords[totalSegments];
    }
    
    const start = coords[segmentIndex];
    const end = coords[segmentIndex + 1];
    
    const lng = start[0] + (end[0] - start[0]) * segmentProgress;
    const lat = start[1] + (end[1] - start[1]) * segmentProgress;
    return [lng, lat];
};

const getBearing = (start, end) => {
    if (!start || !end) return 0;
    const lat1 = start[1] * Math.PI / 180;
    const lat2 = end[1] * Math.PI / 180;
    const dLon = (end[0] - start[0]) * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const brng = Math.atan2(y, x) * 180 / Math.PI;
    return (brng + 360) % 360;
};

const osmStyle = {
    version: 8,
    sources: {
        'osm-tiles': {
            type: 'raster',
            tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
        }
    },
    layers: [
        {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
        }
    ]
};

import {
    LayoutDashboard, Briefcase, MapPin, Map, Navigation, AlertTriangle, 
    BarChart3, FileText, Settings, ChevronDown, Menu, X, CloudRain, 
    Bell, HelpCircle, Plus, Activity, CheckCircle2, AlertOctagon, 
    ShieldCheck, Clock, Layers, CloudLightning, ShieldAlert, ShoppingBag, 
    Flame, Leaf, Milestone, Gauge, ArrowRight, Search, PlusCircle, Info, Zap,
    Download, Sliders, MoreHorizontal, Wrench, Box, Trash2
} from 'lucide-react';

const fallbackMissions = [
    {
        id: 'MED-1024',
        category: 'Medicine',
        icon: 'shield-alert',
        route: 'Guwahati → Imphal',
        origin: 'Guwahati',
        destination: 'Imphal',
        vehicle: 'AS-01-BC-1234',
        cargo: 'Medical Supplies',
        priority: 'CRITICAL',
        risk: 'LOW RISK',
        progress: 65,
        eta: '2h 18m',
        distance: '147 km left',
        speed: 42,
        accessibility: '86/100',
        svgPath: 'M 230,270 Q 280,285 360,310 T 480,345 Q 520,335 550,342 L 600,350',
        hazards: [
            { type: 'rain', x: 515, y: 315 },
            { type: 'landslide', x: 568, y: 328 }
        ]
    },
    {
        id: 'FD-2048',
        category: 'Food Supplies',
        icon: 'shopping-bag',
        route: 'Silchar → Aizawl',
        origin: 'Silchar',
        destination: 'Aizawl',
        vehicle: 'MZ-01-D-5678',
        cargo: 'Rice & Dal Rations',
        priority: 'HIGH',
        risk: 'MEDIUM RISK',
        progress: 55,
        eta: '3h 45m',
        distance: '198 km left',
        speed: 32,
        accessibility: '72/100',
        svgPath: 'M 480,345 Q 510,375 550,405',
        hazards: [
            { type: 'rain', x: 515, y: 375 }
        ]
    },
    {
        id: 'DR-3056',
        category: 'Disaster Relief',
        icon: 'flame',
        route: 'Jorhat → Tezpur',
        origin: 'Jorhat',
        destination: 'Tezpur',
        vehicle: 'AS-03-TR-8821',
        cargo: 'Inflatable Rafts',
        priority: 'CRITICAL',
        risk: 'LOW RISK',
        progress: 30,
        eta: '1h 05m',
        distance: '43 km left',
        speed: 38,
        accessibility: '90/100',
        svgPath: 'M 490,225 L 380,210',
        hazards: []
    },
    {
        id: 'AG-4091',
        category: 'Agriculture',
        icon: 'leaf',
        route: 'Dimapur → Kohima',
        origin: 'Dimapur',
        destination: 'Kohima',
        vehicle: 'NL-01-A-4432',
        cargo: 'Organic Fertilizers',
        priority: 'MEDIUM',
        risk: 'LOW RISK',
        progress: 10,
        eta: 'Tomorrow 10:00 AM',
        distance: '74 km left',
        speed: 28,
        accessibility: '68/100',
        svgPath: 'M 490,225 L 615,300',
        hazards: []
    },
    {
        id: 'CN-5012',
        category: 'Construction',
        icon: 'wrench',
        route: 'Shillong → Tura',
        origin: 'Shillong',
        destination: 'Tura',
        vehicle: 'ML-01-C-8812',
        cargo: 'Steel Beams & Cement',
        priority: 'MEDIUM',
        risk: 'MEDIUM RISK',
        progress: 0,
        eta: 'May 31, 09:00 AM',
        distance: '220 km left',
        speed: 0,
        accessibility: '64/100',
        svgPath: 'M 260,305 L 230,350',
        hazards: []
    },
    {
        id: 'GC-6023',
        category: 'General Cargo',
        icon: 'box',
        route: 'Agartala → Kailashahar',
        origin: 'Agartala',
        destination: 'Kailashahar',
        vehicle: 'TR-01-G-3310',
        cargo: 'Postal Packages & Electronics',
        priority: 'LOW',
        risk: 'LOW RISK',
        progress: 100,
        eta: 'Delivered',
        distance: '0 km left',
        speed: 0,
        accessibility: '88/100',
        svgPath: 'M 230,350 L 260,355',
        hazards: []
    }
];

const fallbackAlerts = [
    {
        id: 1,
        level: 'HIGH RISK',
        levelClass: 'high-risk',
        time: '12 mins ago',
        desc: 'Landslide risk detected on NH-102A (Guwahati-Imphal Highway segment). Rerouting recommended.'
    },
    {
        id: 2,
        level: 'MEDIUM RISK',
        levelClass: 'medium-risk',
        time: '45 mins ago',
        desc: 'Heavy rainfall expected in next 3 hours along Silchar corridor. Expect speed drops.'
    },
    {
        id: 3,
        level: 'WARNING SOLVED',
        levelClass: 'resolved',
        time: '2 hours ago',
        desc: 'Road blockage cleared on Route B (Guwahati-Tezpur Bypass). Regular transit speeds restored.'
    },
    {
        id: 4,
        level: 'INFO',
        levelClass: 'info',
        time: '4 hours ago',
        desc: 'Weather conditions normal across central Assam and Shillong Plateau.'
    }
];

export default function App() {
    // Application state
    const [missions, setMissions] = useState([]);
    const [activeMissionId, setActiveMissionId] = useState('MED-1024');
    const [alerts, setAlerts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState('home'); // 'home' or 'missions'
    const [searchTerm, setSearchTerm] = useState('');
    
    // Missions Page Filters State
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    
    // Mobile Overlay States (APK-Style)
    const [showMobileFiltersSheet, setShowMobileFiltersSheet] = useState(false);
    const [showMobileOptionsSheet, setShowMobileOptionsSheet] = useState(null);
    const [selectedMobileMission, setSelectedMobileMission] = useState(null);
    
    // Telemetry display states
    const [speedFluct, setSpeedFluct] = useState(42);
    const [distLeft, setDistLeft] = useState('147 km');
    const [weatherTemp, setWeatherTemp] = useState(24);
    const [weatherLoc, setWeatherLoc] = useState('Guwahati, Assam');

    // Form inputs state
    const [formData, setFormData] = useState({
        id: '',
        category: 'Medicine',
        priority: 'CRITICAL',
        origin: 'Guwahati',
        destination: 'Imphal',
        vehicle: '',
        cargo: ''
    });

    // Refs for map tracking animation
    const animProgressRef = useRef(0.65); // Default start for MED-1024
    
    // MapLibre Refs
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const mapVehicleMarkerRef = useRef(null);
    const mapOriginMarkerRef = useRef(null);
    const mapDestMarkerRef = useRef(null);
    const speedRef = useRef(42);
    
    // MapLibre states
    const [is3D, setIs3D] = useState(true);
    const [isDisrupted, setIsDisrupted] = useState(false);
    const [showAlternativeRoute, setShowAlternativeRoute] = useState(false);
    const [isStyleLoaded, setIsStyleLoaded] = useState(false);
    const [showLayersDropdown, setShowLayersDropdown] = useState(false);
    const [mapLayers, setMapLayers] = useState({
        roads: true,
        terrain: true,
        riskZones: true,
        weather: false,
        traffic: false,
        disruptions: false
    });
    const [mapLoadError, setMapLoadError] = useState(null);

    const handleMapRetry = () => {
        setMapLoadError(null);
        if (mapRef.current) {
            mapRef.current.setStyle('https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json');
        }
    };

    // Active Mission configuration
    const activeMission = missions.find(m => m.id === activeMissionId) || missions[0];

    // Fetch initial data from APIs
    useEffect(() => {
        fetchMissions();
        fetchAlerts();
    }, []);

    // Set up real-time telemetry fluctuations
    useEffect(() => {
        if (!activeMission) return;
        
        setSpeedFluct(activeMission.speed);
        speedRef.current = activeMission.speed;
        setDistLeft(activeMission.distance);
        animProgressRef.current = activeMission.progress / 100;

        const interval = setInterval(() => {
            if (activeMission.progress > 0 && activeMission.progress < 100) {
                const diff = Math.floor(Math.random() * 5) - 2;
                const nextSpeed = Math.max(25, activeMission.speed + diff);
                setSpeedFluct(nextSpeed);
                speedRef.current = nextSpeed;

                setDistLeft(prev => {
                    const parsed = parseFloat(prev);
                    if (!isNaN(parsed) && parsed > 5) {
                        return `${(parsed - 0.1).toFixed(1)} km left`;
                    }
                    return prev;
                });
            } else {
                setSpeedFluct(activeMission.speed);
                speedRef.current = activeMission.speed;
                setDistLeft(activeMission.distance);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [activeMissionId, missions]);

    // Update marker helper function
    const updateMapMarkers = (coords, mission) => {
        if (!mapRef.current) return;
        
        // Update or create Origin Marker
        const originLngLat = coords[0];
        if (mapOriginMarkerRef.current) {
            mapOriginMarkerRef.current.setLngLat(originLngLat);
            mapOriginMarkerRef.current.getPopup().setHTML(`
                <div style="font-family: sans-serif; padding: 5px; color: #0F172A;">
                    <h4 style="margin: 0 0 4px 0; color: #22C55E; font-size: 0.9rem;">${mission.origin}</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: #64748B;">Mission Origin Node</p>
                </div>
            `);
        } else {
            const el = document.createElement('div');
            el.className = 'origin-marker-pin';
            el.innerHTML = `<div class="pin-marker green"><div class="pin-dot"></div></div>`;
            const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
                <div style="font-family: sans-serif; padding: 5px; color: #0F172A;">
                    <h4 style="margin: 0 0 4px 0; color: #22C55E; font-size: 0.9rem;">${mission.origin}</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: #64748B;">Mission Origin Node</p>
                </div>
            `);
            mapOriginMarkerRef.current = new maplibregl.Marker(el)
                .setLngLat(originLngLat)
                .setPopup(popup)
                .addTo(mapRef.current);
        }

        // Update or create Destination Marker
        const destLngLat = coords[coords.length - 1];
        if (mapDestMarkerRef.current) {
            mapDestMarkerRef.current.setLngLat(destLngLat);
            mapDestMarkerRef.current.getPopup().setHTML(`
                <div style="font-family: sans-serif; padding: 5px; color: #0F172A;">
                    <h4 style="margin: 0 0 4px 0; color: #EF4444; font-size: 0.9rem;">${mission.destination}</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: #64748B;">Mission Destination Node</p>
                </div>
            `);
        } else {
            const el = document.createElement('div');
            el.className = 'dest-marker-pin';
            el.innerHTML = `<div class="pin-marker red"><div class="pin-dot"></div></div>`;
            const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
                <div style="font-family: sans-serif; padding: 5px; color: #0F172A;">
                    <h4 style="margin: 0 0 4px 0; color: #EF4444; font-size: 0.9rem;">${mission.destination}</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: #64748B;">Mission Destination Node</p>
                </div>
            `);
            mapDestMarkerRef.current = new maplibregl.Marker(el)
                .setLngLat(destLngLat)
                .setPopup(popup)
                .addTo(mapRef.current);
        }
    };

    // Initialize MapLibre GL Map with Failover & Navigation Lifecycle
    useEffect(() => {
        if (currentTab !== 'home' || !mapContainerRef.current) return;

        const maptilerKey = import.meta.env.VITE_MAPTILER_KEY || '';
        const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
        
        let styleUrl = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
        if (mapboxToken) {
            maplibregl.accessToken = mapboxToken;
            styleUrl = 'mapbox://styles/mapbox/streets-v11';
        } else if (maptilerKey) {
            styleUrl = `https://api.maptiler.com/maps/hybrid/style.json?key=${maptilerKey}`;
        }

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: styleUrl,
            center: [93.0, 25.5], // Centered in North-East India
            zoom: 6.0,
            pitch: 50, // 3D perspective angle
            bearing: -10, // Slight navigation bearing angle
            antialias: true
        });

        mapRef.current = map;

        // Custom map error handling & logging
        map.on('error', (e) => {
            console.error('MapLibre error encountered:', e.error || e);
            
            // Check if style failed to load
            if (!map.isStyleLoaded()) {
                setMapLoadError('Primary map style failed to load. Loading fallback local OSM tiles...');
                try {
                    map.setStyle(osmStyle);
                } catch (err) {
                    console.error('Fallback style application failed:', err);
                }
            }
        });

        // Failover connection timeout: if style does not load within 5s, switch to OSM
        const styleTimeout = setTimeout(() => {
            if (!map.isStyleLoaded()) {
                console.warn('Style server connection timeout. Initiating local OpenStreetMap raster tiles fallback...');
                setMapLoadError('Basemap style server timed out. Loaded OpenStreetMap fallback.');
                try {
                    map.setStyle(osmStyle);
                } catch (err) {
                    console.error('Timeout fallback style application failed:', err);
                }
            }
        }, 5000);

        map.on('load', () => {
            clearTimeout(styleTimeout);
            console.log('NE-RouteIQ MapLibre basemap style loaded successfully');

            // Add 3D elevation source and terrain mesh
            if (maptilerKey) {
                map.addSource('terrain-source', {
                    type: 'raster-dem',
                    url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${maptilerKey}`,
                    tileSize: 256
                });
                map.setTerrain({ source: 'terrain-source', exaggeration: 1.5 });
            } else if (mapboxToken) {
                map.addSource('terrain-source', {
                    type: 'raster-dem',
                    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                    tileSize: 256
                });
                map.setTerrain({ source: 'terrain-source', exaggeration: 1.5 });
            } else {
                // Free, open-source high-resolution AWS Terrarium RGB-DEM tiles
                map.addSource('terrain-source', {
                    type: 'raster-dem',
                    tiles: [
                        'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
                    ],
                    encoding: 'terrarium',
                    tileSize: 256,
                    maxzoom: 15
                });
                map.setTerrain({ source: 'terrain-source', exaggeration: 2.0 });
                
                // Add natural mountain hillshading layer
                map.addLayer({
                    id: 'hillshade-layer',
                    type: 'hillshade',
                    source: 'terrain-source',
                    paint: {
                        'hillshade-shadow-color': '#0F172A',
                        'hillshade-illumination-direction': 315,
                        'hillshade-exaggeration': 0.45
                    }
                });
            }

            // Safe route segment
            map.addSource('route-safe', {
                type: 'geojson',
                data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } }
            });
            map.addLayer({
                id: 'route-safe-layer',
                type: 'line',
                source: 'route-safe',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#22C55E', 'line-width': 6, 'line-opacity': 0.85 }
            });

            // Medium risk segment
            map.addSource('route-medium', {
                type: 'geojson',
                data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } }
            });
            map.addLayer({
                id: 'route-medium-layer',
                type: 'line',
                source: 'route-medium',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#F59E0B', 'line-width': 6, 'line-opacity': 0.85 }
            });

            // Danger segment
            map.addSource('route-danger', {
                type: 'geojson',
                data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } }
            });
            map.addLayer({
                id: 'route-danger-layer',
                type: 'line',
                source: 'route-danger',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#EF4444', 'line-width': 6, 'line-opacity': 0.85 }
            });

            // Alternative route B
            map.addSource('route-alternative', {
                type: 'geojson',
                data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } }
            });
            map.addLayer({
                id: 'route-alternative-layer',
                type: 'line',
                source: 'route-alternative',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': '#14B8A6',
                    'line-width': 6,
                    'line-opacity': 0.85,
                    'line-dasharray': [2, 2]
                }
            });

            // Landslide danger zone
            map.addSource('danger-zone', {
                type: 'geojson',
                data: { type: 'Feature', geometry: { type: 'Point', coordinates: [94.1086, 25.6751] } }
            });
            map.addLayer({
                id: 'danger-zone-layer',
                type: 'circle',
                source: 'danger-zone',
                paint: {
                    'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 20, 10, 80],
                    'circle-color': '#EF4444',
                    'circle-opacity': 0,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#EF4444',
                    'circle-stroke-opacity': 0
                }
            });

            // Weather rain radar zone
            map.addSource('weather-zone', {
                type: 'geojson',
                data: { type: 'Feature', geometry: { type: 'Point', coordinates: [92.7789, 24.8333] } }
            });
            map.addLayer({
                id: 'weather-zone-layer',
                type: 'circle',
                source: 'weather-zone',
                paint: {
                    'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 30, 10, 120],
                    'circle-color': '#3B82F6',
                    'circle-opacity': 0,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#3B82F6',
                    'circle-stroke-opacity': 0
                }
            });

            setIsStyleLoaded(true);
            
            // Resize handler immediately on mount to ensure proper dimension mapping
            setTimeout(() => {
                if (mapRef.current) mapRef.current.resize();
            }, 100);
        });

        return () => {
            clearTimeout(styleTimeout);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            setIsStyleLoaded(false);
            mapVehicleMarkerRef.current = null;
            mapOriginMarkerRef.current = null;
            mapDestMarkerRef.current = null;
        };
    }, [currentTab]);

    // Trigger map resize when sidebar toggles or tab shifts
    useEffect(() => {
        if (mapRef.current) {
            const timer = setTimeout(() => {
                if (mapRef.current) mapRef.current.resize();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isSidebarOpen, currentTab]);

    // 2D / 3D Toggle
    const toggle2D3D = () => {
        if (!mapRef.current) return;
        const next3D = !is3D;
        setIs3D(next3D);
        if (next3D) {
            mapRef.current.easeTo({ pitch: 50, bearing: -10, duration: 1000 });
            if (mapRef.current.getSource('terrain-source')) {
                mapRef.current.setTerrain({ source: 'terrain-source', exaggeration: 2.0 });
            }
        } else {
            mapRef.current.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
            mapRef.current.setTerrain(null); // Disable 3D terrain mesh
        }
    };

    // Recenter map using smooth bounds fitting
    const recenterMap = () => {
        if (!mapRef.current || !activeMission) return;
        const coords = isDisrupted && activeMissionId === 'MED-1024' 
            ? alternativeRouteCoords 
            : (missionRouteCoords[activeMissionId] || missionRouteCoords['MED-1024']);
            
        const bounds = coords.reduce((acc, coord) => {
            return acc.extend(coord);
        }, new maplibregl.LngLatBounds(coords[0], coords[0]));
        
        mapRef.current.fitBounds(bounds, {
            padding: { top: 80, bottom: 80, left: 60, right: 60 },
            maxZoom: 9.5,
            duration: 1500,
            pitch: is3D ? 50 : 0,
            bearing: is3D ? -10 : 0
        });
    };

    // Layer selection handler
    const handleLayerToggle = (layerKey) => {
        setMapLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
    };

    // Simulation triggers
    const toggleDisruptionSimulation = () => {
        if (!isDisrupted) {
            setIsDisrupted(true);
            setShowAlternativeRoute(true);
            const newAlert = {
                id: Date.now(),
                level: 'CRITICAL ALERT',
                levelClass: 'high-risk',
                time: 'Just now',
                desc: '⚠️ LANDSLIDE RISK detected on NH-2 (Kohima-Mao segment). Road blocked. AI alternative Route B recommended!'
            };
            setAlerts(prev => [newAlert, ...prev]);
            setDistLeft('284 km left');
            setWeatherLoc('Silchar Corridor');
        } else {
            setIsDisrupted(false);
            setShowAlternativeRoute(false);
            const newAlert = {
                id: Date.now(),
                level: 'RESOLVED',
                levelClass: 'resolved',
                time: 'Just now',
                desc: '✅ NH-2 route cleared. Landslide warnings resolved. Normal route active.'
            };
            setAlerts(prev => [newAlert, ...prev]);
            setDistLeft(activeMission ? activeMission.distance : '147 km');
            setWeatherLoc('Guwahati, Assam');
        }
    };

    // Update map geojson paths and overlays when active mission or layers change
    useEffect(() => {
        if (!mapRef.current || !isStyleLoaded || !activeMission) return;

        const coords = missionRouteCoords[activeMissionId] || missionRouteCoords['MED-1024'];
        updateMapMarkers(coords, activeMission);

        // Fit map camera bounds on initial style load or mission switch
        if (mapRef.current && isStyleLoaded) {
            const currentRouteCoords = isDisrupted && activeMissionId === 'MED-1024' 
                ? alternativeRouteCoords 
                : coords;
                
            const bounds = currentRouteCoords.reduce((acc, coord) => {
                return acc.extend(coord);
            }, new maplibregl.LngLatBounds(currentRouteCoords[0], currentRouteCoords[0]));
            
            mapRef.current.fitBounds(bounds, {
                padding: { top: 80, bottom: 80, left: 60, right: 60 },
                maxZoom: 9.5,
                duration: 1500,
                pitch: is3D ? 50 : 0,
                bearing: is3D ? -10 : 0
            });
        }

        // Update layers visibility based on checkbox selection
        if (mapRef.current.getLayer('route-safe-layer')) {
            mapRef.current.setLayoutProperty('route-safe-layer', 'visibility', mapLayers.roads ? 'visible' : 'none');
            mapRef.current.setLayoutProperty('route-medium-layer', 'visibility', mapLayers.roads ? 'visible' : 'none');
            mapRef.current.setLayoutProperty('route-danger-layer', 'visibility', mapLayers.roads ? 'visible' : 'none');
        }

        if (activeMissionId === 'MED-1024') {
            if (isDisrupted) {
                mapRef.current.getSource('route-safe').setData({
                    type: 'Feature', geometry: { type: 'LineString', coordinates: coords.slice(0, 7) }
                });
                mapRef.current.getSource('route-medium').setData({
                    type: 'Feature', geometry: { type: 'LineString', coordinates: [] }
                });
                mapRef.current.getSource('route-danger').setData({
                    type: 'Feature', geometry: { type: 'LineString', coordinates: coords.slice(6, 13) }
                });
                mapRef.current.getSource('route-alternative').setData({
                    type: 'Feature', geometry: { type: 'LineString', coordinates: alternativeRouteCoords }
                });
                mapRef.current.setPaintProperty('route-alternative-layer', 'line-dasharray', null);
                mapRef.current.setPaintProperty('route-alternative-layer', 'line-color', '#22C55E');
            } else {
                mapRef.current.getSource('route-safe').setData({
                    type: 'Feature', geometry: { type: 'LineString', coordinates: coords.slice(0, 7) }
                });
                mapRef.current.getSource('route-medium').setData({
                    type: 'Feature', geometry: { type: 'LineString', coordinates: coords.slice(6, 9) }
                });
                mapRef.current.getSource('route-danger').setData({
                    type: 'Feature', geometry: { type: 'LineString', coordinates: coords.slice(8, 13) }
                });
                mapRef.current.getSource('route-alternative').setData({
                    type: 'Feature', geometry: { type: 'LineString', coordinates: [] }
                });
            }
        } else {
            mapRef.current.getSource('route-safe').setData({
                type: 'Feature', geometry: { type: 'LineString', coordinates: coords }
            });
            mapRef.current.getSource('route-medium').setData({
                type: 'Feature', geometry: { type: 'LineString', coordinates: [] }
            });
            mapRef.current.getSource('route-danger').setData({
                type: 'Feature', geometry: { type: 'LineString', coordinates: [] }
            });
            mapRef.current.getSource('route-alternative').setData({
                type: 'Feature', geometry: { type: 'LineString', coordinates: [] }
            });
        }

        // Apply style opacities
        mapRef.current.setPaintProperty('danger-zone-layer', 'circle-opacity', (mapLayers.riskZones || isDisrupted) ? 0.25 : 0);
        mapRef.current.setPaintProperty('danger-zone-layer', 'circle-stroke-opacity', (mapLayers.riskZones || isDisrupted) ? 0.8 : 0);
        
        mapRef.current.setPaintProperty('weather-zone-layer', 'circle-opacity', (mapLayers.weather || isDisrupted) ? 0.2 : 0);
        mapRef.current.setPaintProperty('weather-zone-layer', 'circle-stroke-opacity', (mapLayers.weather || isDisrupted) ? 0.5 : 0);

        recenterMap();
    }, [activeMissionId, isStyleLoaded, isDisrupted, showAlternativeRoute, mapLayers, missions]);

    // Live Map Vehicle Path Animation loop
    useEffect(() => {
        if (!mapRef.current || !isStyleLoaded || !activeMission) return;

        let animFrameId;
        const coords = isDisrupted && activeMissionId === 'MED-1024' 
            ? alternativeRouteCoords 
            : (missionRouteCoords[activeMissionId] || missionRouteCoords['MED-1024']);

        const animate = () => {
            if (activeMission.progress > 0 && activeMission.progress < 100) {
                animProgressRef.current += 0.0003;
                if (animProgressRef.current > 0.98) {
                    animProgressRef.current = 0.02;
                }
            } else {
                animProgressRef.current = activeMission.progress / 100;
            }

            const vehicleLngLat = getCoordinatesAtProgress(coords, animProgressRef.current);

            // Update Vehicle Marker position & details
            if (mapVehicleMarkerRef.current) {
                mapVehicleMarkerRef.current.setLngLat(vehicleLngLat);
                
                const nextIndex = Math.min(coords.length - 1, Math.floor(animProgressRef.current * (coords.length - 1)) + 1);
                const currIndex = Math.max(0, nextIndex - 1);
                const bearing = getBearing(coords[currIndex], coords[nextIndex]);
                
                const el = mapVehicleMarkerRef.current.getElement();
                
                // Rotate truck SVG inside the circle
                const svg = el.querySelector('.premium-truck-svg');
                if (svg) {
                    svg.style.transform = `rotate(${bearing - 90}deg)`;
                }
                
                // Update live speed display on the marker badge
                const speedText = el.querySelector('.badge-speed');
                if (speedText) {
                    speedText.textContent = `${speedRef.current} km/h`;
                }
            } else {
                const el = document.createElement('div');
                el.className = 'vehicle-marker-truck-premium';
                el.innerHTML = `
                    <div class="premium-truck-badge">
                        <span class="badge-header">${activeMission.id}</span>
                        <span class="badge-speed">${speedRef.current} km/h</span>
                    </div>
                    <div class="premium-truck-circle">
                        <div class="live-dot-indicator"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="premium-truck-svg" style="transform: rotate(0deg); width:16px; height:16px; color:#FFFFFF;">
                            <rect x="1" y="3" width="15" height="13" rx="2" ry="2" fill="white"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" fill="white"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5" fill="#2563EB" stroke="white" stroke-width="1.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5" fill="#2563EB" stroke="white" stroke-width="1.5"></circle>
                        </svg>
                    </div>
                `;
                const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
                    <div style="font-family: sans-serif; padding: 5px; color: #0F172A;">
                        <h4 style="margin: 0 0 4px 0; color: #2563EB; font-size: 0.9rem;">${activeMission.id}</h4>
                        <p style="margin: 0 0 2px 0; font-size: 0.8rem;"><strong>Manifest:</strong> ${activeMission.cargo}</p>
                        <p style="margin: 0; font-size: 0.8rem; color: #22C55E;"><strong>Status:</strong> In Transit</p>
                    </div>
                `);
                mapVehicleMarkerRef.current = new maplibregl.Marker(el)
                    .setLngLat(vehicleLngLat)
                    .setPopup(popup)
                    .addTo(mapRef.current);
            }

            animFrameId = requestAnimationFrame(animate);
        };

        animFrameId = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(animFrameId);
            if (mapVehicleMarkerRef.current) {
                mapVehicleMarkerRef.current.remove();
                mapVehicleMarkerRef.current = null;
            }
        };
    }, [activeMissionId, isStyleLoaded, isDisrupted, missions]);

    const fetchMissions = async () => {
        try {
            const res = await fetch('/api/missions');
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setMissions(data);
            if (data.length > 0) {
                const initialActive = data.find(m => m.id === 'MED-1024');
                setActiveMissionId(initialActive ? initialActive.id : data[0].id);
            }
        } catch (err) {
            console.warn('Backend API `/api/missions` unreachable. Falling back to local frontend seed data:', err.message);
            setMissions(fallbackMissions);
            setActiveMissionId('MED-1024');
        }
    };

    const fetchAlerts = async () => {
        try {
            const res = await fetch('/api/alerts');
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setAlerts(data);
        } catch (err) {
            console.warn('Backend API `/api/alerts` unreachable. Falling back to local frontend alerts:', err.message);
            setAlerts(fallbackAlerts);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/missions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const newMission = await res.json();

            if (res.ok) {
                setMissions(prev => [newMission, ...prev]);
                setActiveMissionId(newMission.id);
                setIsModalOpen(false);
                setFormData({
                    id: '',
                    category: 'Medicine',
                    priority: 'CRITICAL',
                    origin: 'Guwahati',
                    destination: 'Imphal',
                    vehicle: '',
                    cargo: ''
                });
            } else {
                alert(newMission.error || 'Failed to create mission');
            }
        } catch (err) {
            console.error('Error creating mission:', err);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Medicine': return <ShieldAlert className="category-icon text-primary" />;
            case 'Food Supplies': return <ShoppingBag className="category-icon text-primary" />;
            case 'Disaster Relief': return <Flame className="category-icon text-primary" />;
            case 'Agriculture': return <Leaf className="category-icon text-primary" />;
            case 'Construction': return <Wrench className="category-icon text-primary" />;
            case 'General Cargo': return <Box className="category-icon text-primary" />;
            default: return <Briefcase className="category-icon text-primary" />;
        }
    };

    const getPriorityBadge = (priority) => {
        let dotColor = 'bg-success';
        if (priority === 'CRITICAL') dotColor = 'bg-danger';
        else if (priority === 'HIGH') dotColor = 'bg-warning';
        else if (priority === 'MEDIUM') dotColor = 'bg-warning'; // yellow-orange

        return (
            <span className="priority-indicator">
                <span className={`priority-dot ${dotColor}`}></span>
                <span className="priority-text">{priority}</span>
            </span>
        );
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'CRITICAL': return 'badge-danger';
            case 'HIGH': return 'badge-warning';
            case 'MEDIUM': return 'badge-warning';
            case 'LOW': return 'badge-success';
            default: return 'badge-success';
        }
    };

    const getStatusBadge = (status, progress) => {
        // Compute status string if backend stores numeric progress
        let statusStr = status || 'In Transit';
        if (progress === 100) statusStr = 'Completed';
        else if (progress === 0) statusStr = 'Planning';
        
        let badgeClass = 'badge-success-light';
        if (statusStr === 'Planning') badgeClass = 'badge-info-light';
        else if (statusStr === 'Delayed') badgeClass = 'badge-warning-light';
        else if (statusStr === 'Completed') badgeClass = 'badge-success-light';
        else if (statusStr === 'Cancelled') badgeClass = 'badge-danger-light';

        return (
            <span className={`badge ${badgeClass}`}>
                <span className="dot"></span>
                {statusStr}
            </span>
        );
    };

    const getScoreIndicator = (score) => {
        const scoreValue = parseInt(score);
        const radius = 15;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (scoreValue / 100) * circumference;
        const colorClass = scoreValue >= 85 ? 'text-success' : 'text-warning';

        return (
            <div className="accessibility-ring-wrapper">
                <svg className="accessibility-ring-svg" width="38" height="38" viewBox="0 0 38 38">
                    <circle className="ring-bg" cx="19" cy="19" r={radius} stroke="#E2E8F0" strokeWidth="3" fill="transparent" />
                    <circle className={`ring-fill ${colorClass}`} cx="19" cy="19" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 19 19)"
                    />
                    <text x="19" y="23" className="ring-text" textAnchor="middle">{scoreValue}</text>
                </svg>
            </div>
        );
    };

    const clearFilters = () => {
        setFilterStatus('All');
        setFilterType('All');
        setFilterPriority('All');
        setSearchTerm('');
    };

    // Filter logic
    const filteredMissions = missions.filter(m => {
        const matchesSearch = m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              m.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              m.cargo.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Status matching helper
        let mStatus = 'In Transit';
        if (m.progress === 100) mStatus = 'Completed';
        else if (m.progress === 0) mStatus = 'Planning';
        else if (m.id === 'DR-3056') mStatus = 'Delayed'; // Match specific delayed status
        
        const matchesStatus = filterStatus === 'All' || mStatus === filterStatus;
        const matchesType = filterType === 'All' || m.category === filterType;
        const matchesPriority = filterPriority === 'All' || m.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });

    return (
        <div className="app-container">
            {/* 1. LEFT SIDEBAR */}
            <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`} id="sidebar">
                <div className="sidebar-brand">
                    <div className="brand-logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="7" r="2" fill="#14B8A6"/>
                        </svg>
                    </div>
                    <div className="brand-text">
                        <h1>NE-RouteIQ</h1>
                        <span>Smart Logistics for NER</span>
                    </div>
                    <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
                        <X />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <a href="#" className={`nav-item ${currentTab === 'home' ? 'active' : ''}`} onClick={() => { setCurrentTab('home'); setIsSidebarOpen(false); }}>
                        <LayoutDashboard />
                        <span>Home</span>
                    </a>
                    <a href="#" className={`nav-item ${currentTab === 'missions' ? 'active' : ''}`} onClick={() => { setCurrentTab('missions'); setIsSidebarOpen(false); }}>
                        <Briefcase />
                        <span>Missions</span>
                    </a>
                    <a href="#" className="nav-item">
                        <MapPin />
                        <span>Routes</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Map />
                        <span>Live Map</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Navigation />
                        <span>Tracking</span>
                    </a>
                    <a href="#" className="nav-item">
                        <AlertTriangle />
                        <span>Alerts</span>
                        <span className="nav-badge">{alerts.length}</span>
                    </a>
                    <a href="#" className="nav-item">
                        <BarChart3 />
                        <span>Analytics</span>
                    </a>
                    <a href="#" className="nav-item">
                        <FileText />
                        <span>Reports</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Settings />
                        <span>Settings</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    {/* Shekhar Kumar User Profile */}
                    <div className="user-profile-card">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" alt="User Avatar" className="user-avatar-img" />
                        <div className="user-info">
                            <h4>Shekhar Kumar</h4>
                            <p>Logistics Operator</p>
                        </div>
                        <ChevronDown className="user-dropdown-icon" />
                    </div>

                    {/* Subtle AI Intelligence Card */}
                    <div className="ai-intelligence-card">
                        <span className="ai-badge">AI Intelligence</span>
                        <h4>Smarter decisions.</h4>
                        <h4>Safer deliveries.</h4>
                        <h4>Stronger North-East.</h4>
                        <svg className="ai-network-svg" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="15" r="3" fill="#14B8A6" />
                            <circle cx="50" cy="10" r="4" fill="#2563EB" />
                            <circle cx="80" cy="20" r="3" fill="#14B8A6" />
                            <circle cx="35" cy="35" r="3" fill="#2563EB" />
                            <circle cx="65" cy="40" r="3" fill="#22C55E" />
                            <line x1="20" y1="15" x2="50" y2="10" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                            <line x1="50" y1="10" x2="80" y2="20" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                            <line x1="20" y1="15" x2="35" y2="35" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                            <line x1="35" y1="35" x2="50" y2="10" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                            <line x1="50" y1="10" x2="65" y2="40" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                            <line x1="35" y1="35" x2="65" y2="40" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                            <line x1="65" y1="40" x2="80" y2="20" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                        </svg>
                    </div>
                </div>
            </aside>

            {/* Sidebar backdrop overlay (mobile menu support) */}
            <div className={`drawer-backdrop ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

            {/* MAIN CONTENT WRAPPER */}
            <div className="main-wrapper">
                {/* 2. TOP HEADER */}
                <header className="top-header">
                    <div className="header-left">
                        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
                            <Menu />
                        </button>
                        <div className="mobile-logo-title">
                            <span className="logo-title">NE-RouteIQ</span>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="header-widget weather-widget">
                            <CloudRain className="weather-icon" />
                            <div className="weather-text">
                                <span className="weather-temp">{weatherTemp}°C • Light Rain</span>
                                <span className="weather-loc">{weatherLoc}</span>
                            </div>
                        </div>
                        <div className="header-action-btn notification-btn">
                            <Bell />
                            <span className="badge-count">{alerts.length}</span>
                        </div>
                        <div className="header-action-btn help-btn">
                            <HelpCircle />
                        </div>
                        <div className="header-profile">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" alt="User Avatar" className="header-avatar" />
                        </div>
                    </div>
                </header>

                {/* DYNAMIC TAB CONTROLLERS */}
                {currentTab === 'home' && (
                    <main className="main-content">
                        {/* 3. HERO SECTION */}
                        <section className="hero-section">
                            <div className="hero-left">
                                <h2 className="hero-title">Hello, Shekhar 👋</h2>
                                <p className="hero-subtitle">Logistics intelligence & accessibility insights for North-East India</p>
                            </div>
                            <div className="hero-right">
                                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                                    <Plus />
                                    <span>Create New Mission</span>
                                </button>
                            </div>
                        </section>

                        {/* CORE PRODUCT MESSAGE */}
                        <div className="product-banner">
                            <div className="banner-badge">AI + GIS Intelligence</div>
                            <p className="banner-text">“We don’t just find the shortest route. We find the smartest route for the mission.”</p>
                        </div>

                        {/* 4. KPI CARDS */}
                        <section className="kpi-grid">
                            <div className="kpi-card">
                                <div className="kpi-header">
                                    <span className="kpi-title">Active Missions</span>
                                    <div className="kpi-icon-wrapper primary">
                                        <Activity />
                                    </div>
                                </div>
                                <div className="kpi-body">
                                    <span className="kpi-value">
                                        {String(missions.filter(m => m.progress > 0 && m.progress < 100).length).padStart(2, '0')}
                                    </span>
                                    <div className="kpi-indicator success">
                                        <Zap />
                                        <span>Optimal telemetry</span>
                                    </div>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-header">
                                    <span className="kpi-title">Completed Missions</span>
                                    <div className="kpi-icon-wrapper secondary">
                                        <CheckCircle2 />
                                    </div>
                                </div>
                                <div className="kpi-body">
                                    <span className="kpi-value">
                                        {String(missions.filter(m => m.progress === 100).length + 124).padStart(2, '0')}
                                    </span>
                                    <div className="kpi-indicator neutral">
                                        <span>This Quarter</span>
                                    </div>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-header">
                                    <span className="kpi-title">Active Alerts</span>
                                    <div className="kpi-icon-wrapper danger">
                                        <AlertTriangle />
                                    </div>
                                </div>
                                <div className="kpi-body">
                                    <span className="kpi-value text-danger">{String(alerts.length).padStart(2, '0')}</span>
                                    <div className="kpi-indicator danger">
                                        <AlertOctagon />
                                        <span>1 Critical Landslide</span>
                                    </div>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-header">
                                    <span className="kpi-title">Avg. Accessibility</span>
                                    <div className="kpi-icon-wrapper warning">
                                        <ShieldCheck />
                                    </div>
                                </div>
                                <div className="kpi-body">
                                    <span className="kpi-value">86/100</span>
                                    <div className="kpi-indicator warning">
                                        <Activity />
                                        <span>-2% Monsoon impact</span>
                                    </div>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-header">
                                    <span className="kpi-title">On-Time Delivery</span>
                                    <div className="kpi-icon-wrapper info">
                                        <Clock />
                                    </div>
                                </div>
                                <div className="kpi-body">
                                    <span className="kpi-value">92%</span>
                                    <div className="kpi-indicator success">
                                        <Zap />
                                        <span>+1.4% AI Rerouting</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* MAP & ACTIVE DETAIL LAYOUT */}
                        <section className="map-detail-layout">
                            <div className="map-container card">
                                <div className="map-header">
                                    <div className="map-title-wrap">
                                        <h3>GIS Live Operations Center</h3>
                                        <span className="map-subtitle">Real-time accessibility layers & active mission pathing</span>
                                    </div>
                                    <div className="map-controls">
                                        {activeMissionId === 'MED-1024' && (
                                            <button 
                                                className={`btn btn-sm ${isDisrupted ? 'btn-danger' : 'btn-primary'} pulse-ring`}
                                                onClick={toggleDisruptionSimulation}
                                            >
                                                <AlertTriangle style={{ width: 14, height: 14 }} /> 
                                                <span>{isDisrupted ? 'Resolve Landslide' : 'Simulate Landslide'}</span>
                                            </button>
                                        )}
                                        <button className="btn btn-sm btn-secondary" onClick={() => handleLayerToggle('weather')}>
                                            <CloudLightning style={{ width: 14, height: 14 }} /> 
                                            <span>Weather {mapLayers.weather ? 'ON' : 'OFF'}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="tactical-map-viewport" style={{ padding: 0, height: '480px' }}>
                                    {/* Map container element for MapLibre */}
                                    <div ref={mapContainerRef} className="maplibre-map-container" style={{ width: '100%', height: '100%', position: 'relative' }}></div>
                                    
                                    {/* Map Connection Failure Failover Overlay */}
                                    {mapLoadError && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            zIndex: 50,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            padding: '24px',
                                            textAlign: 'center',
                                            backdropFilter: 'blur(4px)'
                                        }}>
                                            <AlertTriangle style={{ width: 44, height: 44, color: '#F59E0B', marginBottom: '16px' }} />
                                            <h4 style={{ color: '#F8FAFC', marginBottom: '8px', fontSize: '1.05rem', fontWeight: 600 }}>Map Server Connection Weak</h4>
                                            <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginBottom: '16px', maxWidth: '320px', lineHeight: '1.4' }}>{mapLoadError}</p>
                                            <button 
                                                className="btn btn-sm btn-primary" 
                                                onClick={handleMapRetry}
                                                style={{ padding: '6px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500 }}
                                            >
                                                Retry Connection
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* Tactical scan-line overlay for GIS styling */}
                                    <div className="map-scan-line"></div>

                                    {/* Overlay custom GIS controls panel */}
                                    <div className="map-overlay-controls-panel">
                                        <div className="map-overlay-dropdown">
                                            <button className="btn btn-xs btn-secondary" onClick={() => setShowLayersDropdown(!showLayersDropdown)}>
                                                <Layers style={{ width: 12, height: 12 }} />
                                                <span>Layers</span>
                                            </button>
                                            {showLayersDropdown && (
                                                <div className="map-layers-popover">
                                                    <div className="popover-title">Map Layers</div>
                                                    <label className="layer-option">
                                                        <input type="checkbox" checked={mapLayers.roads} onChange={() => handleLayerToggle('roads')} />
                                                        <span>Roads</span>
                                                    </label>
                                                    <label className="layer-option">
                                                        <input type="checkbox" checked={mapLayers.terrain} onChange={() => handleLayerToggle('terrain')} />
                                                        <span>Terrain</span>
                                                    </label>
                                                    <label className="layer-option">
                                                        <input type="checkbox" checked={mapLayers.riskZones} onChange={() => handleLayerToggle('riskZones')} />
                                                        <span>Risk Zones</span>
                                                    </label>
                                                    <label className="layer-option">
                                                        <input type="checkbox" checked={mapLayers.weather} onChange={() => handleLayerToggle('weather')} />
                                                        <span>Weather Radar</span>
                                                    </label>
                                                    <label className="layer-option">
                                                        <input type="checkbox" checked={mapLayers.traffic} onChange={() => handleLayerToggle('traffic')} />
                                                        <span>Traffic Density</span>
                                                    </label>
                                                    <label className="layer-option">
                                                        <input type="checkbox" checked={mapLayers.disruptions} onChange={() => handleLayerToggle('disruptions')} />
                                                        <span>Disruptions</span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        <button className="btn btn-xs btn-secondary" onClick={toggle2D3D}>
                                            <Navigation style={{ width: 12, height: 12, transform: is3D ? 'rotate(45deg)' : 'none' }} />
                                            <span>{is3D ? '2D View' : '3D View'}</span>
                                        </button>

                                        <button className="btn btn-xs btn-secondary" onClick={recenterMap}>
                                            <MapPin style={{ width: 12, height: 12 }} />
                                            <span>Recenter</span>
                                        </button>
                                    </div>

                                    {/* Map Legend Overlay */}
                                    <div className="map-legend" style={{ zIndex: 20 }}>
                                        <div className="legend-title">Routing Intelligence</div>
                                        <div className="legend-grid">
                                            <div className="legend-item"><span className="legend-color green"></span><span className="legend-label">Safe Route</span></div>
                                            <div className="legend-item"><span className="legend-color orange"></span><span className="legend-label">Medium Risk</span></div>
                                            <div className="legend-item"><span className="legend-color red"></span><span className="legend-label">High Risk</span></div>
                                            <div className="legend-item">
                                                <CloudRain className="text-warning" style={{ width: 12, height: 12 }} />
                                                <span className="legend-label">Weather Impact</span>
                                            </div>
                                            <div className="legend-item">
                                                <AlertTriangle className="text-danger" style={{ width: 12, height: 12 }} />
                                                <span className="legend-label">Landslide Block</span>
                                            </div>
                                            <div className="legend-item"><span className="legend-vehicle-dot"></span><span className="legend-label">Vehicle</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {activeMission && (
                                <div className="active-mission-card card">
                                    <div className="card-header border-b">
                                        <div className="mission-header-info">
                                            <span className="mission-tag">ACTIVE TELEMETRY</span>
                                            <h3>Mission {activeMission.id}</h3>
                                        </div>
                                        <span className={`badge ${activeMission.progress === 100 ? 'badge-neutral' : activeMission.progress === 0 ? 'badge-info' : activeMissionId === 'FD-2048' ? 'badge-warning pulse-ring' : 'badge-success pulse-ring'}`}>
                                            <span className="dot"></span>
                                            {activeMission.progress === 100 ? 'Completed' : activeMission.progress === 0 ? 'Planning' : activeMissionId === 'FD-2048' ? 'Delay Risk' : 'In Transit'}
                                        </span>
                                    </div>
                                    <div className="card-body mission-panel-body">
                                        <div className="mission-meta-grid">
                                            <div className="meta-item">
                                                <span className="meta-label">Route</span>
                                                <span className="meta-value font-semibold text-primary">{activeMission.route}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-label">Mission Category</span>
                                                <span className="badge-category">
                                                    {getCategoryIcon(activeMission.category)}
                                                    {activeMission.category}
                                                </span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-label">Vehicle Registration</span>
                                                <span className="meta-value font-mono">{activeMission.vehicle}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-label">Cargo Manifest</span>
                                                <span className="meta-value">{activeMission.cargo}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-label">Priority Level</span>
                                                <span className={getPriorityBadgeClass(activeMission.priority)}>{activeMission.priority}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-label">Risk Profile</span>
                                                <span className={`badge ${activeMission.id === 'FD-2048' ? 'badge-warning' : activeMission.priority === 'CRITICAL' ? 'badge-danger' : 'badge-success'}`}>
                                                    {activeMission.id === 'FD-2048' ? 'MEDIUM RISK' : 'LOW RISK'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="telemetry-bar-section">
                                            <div className="telemetry-label-row">
                                                <span>Transit Progress</span>
                                                <span className="progress-percent">
                                                    {activeMission.progress > 0 && activeMission.progress < 100 
                                                        ? `${Math.round(animProgressRef.current * 100)}%` 
                                                        : `${activeMission.progress}%`
                                                    }
                                                </span>
                                            </div>
                                            <div className="progress-bar-bg">
                                                <div 
                                                    className="progress-bar-fill" 
                                                    style={{ 
                                                        width: activeMission.progress > 0 && activeMission.progress < 100 
                                                            ? `${animProgressRef.current * 100}%` 
                                                            : `${activeMission.progress}%` 
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="telemetry-metrics">
                                            <div className="metric-box">
                                                <Clock />
                                                <div className="metric-text">
                                                    <span className="metric-label">ETA</span>
                                                    <span className="metric-val">{activeMission.eta}</span>
                                                </div>
                                            </div>
                                            <div className="metric-box">
                                                <Milestone />
                                                <div className="metric-text">
                                                    <span className="metric-label">Distance Left</span>
                                                    <span className="metric-val">{distLeft}</span>
                                                </div>
                                            </div>
                                            <div className="metric-box">
                                                <Gauge />
                                                <div className="metric-text">
                                                    <span className="metric-label">Current Speed</span>
                                                    <span className="metric-val">{speedFluct > 0 ? `${speedFluct} km/h` : '--'}</span>
                                                </div>
                                            </div>
                                            <div className="metric-box highlighted">
                                                <ShieldCheck className="text-secondary" />
                                                <div className="metric-text">
                                                    <span className="metric-label">Accessibility</span>
                                                    <span className="metric-val text-secondary">{activeMission.accessibility}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="btn btn-primary btn-full mt-auto">
                                            <span>View Live Tracking</span>
                                            <ArrowRight />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* BELOW MAP: MISSIONS TABLE & CHART */}
                        <section className="table-chart-layout">
                            <div className="missions-table-card card">
                                <div className="card-header border-b">
                                    <h3>My Active Missions</h3>
                                    <div className="card-actions">
                                        <div className="search-box">
                                            <Search />
                                            <input 
                                                type="text" 
                                                placeholder="Search missions..." 
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="missions-table">
                                        <thead>
                                            <tr>
                                                <th>Mission ID</th>
                                                <th>Category</th>
                                                <th>Route Path</th>
                                                <th>Status</th>
                                                <th>ETA</th>
                                                <th>Accessibility</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMissions.slice(0, 4).map((mission) => (
                                                <tr 
                                                    key={mission.id} 
                                                    className={`mission-row ${activeMissionId === mission.id ? 'selected' : ''}`}
                                                    onClick={() => setActiveMissionId(mission.id)}
                                                >
                                                    <td className="font-bold text-primary">{mission.id}</td>
                                                    <td>
                                                        <span className="badge-category">
                                                            {getCategoryIcon(mission.category)}
                                                            {mission.category}
                                                        </span>
                                                    </td>
                                                    <td className="font-semibold">{mission.route}</td>
                                                    <td>{getStatusBadge(null, mission.progress)}</td>
                                                    <td>{mission.eta}</td>
                                                    <td>{getScoreIndicator(mission.accessibility)}</td>
                                                    <td>
                                                        <button className="btn btn-icon btn-sm btn-ghost">
                                                            <Navigation style={{ width: 14, height: 14 }} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="accessibility-card card">
                                <div className="card-header border-b">
                                    <div className="chart-header-info">
                                        <h3>Accessibility Overview</h3>
                                        <span className="chart-subtitle">Regional road network integrity index</span>
                                    </div>
                                    <div className="chart-filters">
                                        <span className="btn btn-xs btn-secondary active">7D</span>
                                        <span className="btn btn-xs btn-secondary">30D</span>
                                    </div>
                                </div>
                                <div className="card-body flex-col">
                                    <div className="trend-chart-container">
                                        <svg className="trend-svg-chart" viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
                                            <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
                                            <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
                                            <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
                                            <path d="M 10,120 L 70,110 L 130,85 L 190,95 L 250,55 L 310,70 L 390,40" fill="none" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="6" strokeLinecap="round" />
                                            <path d="M 10,120 L 70,110 L 130,85 L 190,95 L 250,55 L 310,70 L 390,40" fill="none" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" />
                                            <circle cx="10" cy="120" r="4" fill="#14B8A6" stroke="#FFF" strokeWidth="1.5" />
                                            <circle cx="70" cy="110" r="4" fill="#14B8A6" stroke="#FFF" strokeWidth="1.5" />
                                            <circle cx="130" cy="85" r="4" fill="#14B8A6" stroke="#FFF" strokeWidth="1.5" />
                                            <circle cx="190" cy="95" r="4" fill="#14B8A6" stroke="#FFF" strokeWidth="1.5" />
                                            <circle cx="250" cy="55" r="4" fill="#14B8A6" stroke="#FFF" strokeWidth="1.5" />
                                            <circle cx="310" cy="70" r="4" fill="#14B8A6" stroke="#FFF" strokeWidth="1.5" />
                                            <circle cx="390" cy="40" r="4" fill="#14B8A6" stroke="#FFF" strokeWidth="1.5" />
                                        </svg>
                                        <div className="chart-labels">
                                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                        </div>
                                    </div>

                                    <div className="accessibility-summary">
                                        <div className="summary-metric">
                                            <span className="sm-label">Best Route</span>
                                            <span className="sm-val text-success">92/100</span>
                                        </div>
                                        <div className="summary-metric">
                                            <span className="sm-label">Average</span>
                                            <span className="sm-val text-primary">86/100</span>
                                        </div>
                                        <div className="summary-metric">
                                            <span className="sm-label">Lowest</span>
                                            <span className="sm-val text-danger">58/100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* LOWER GRID: ACTIONS & ALERTS */}
                        <section className="actions-alerts-layout">
                            <div className="quick-actions-card card">
                                <div className="card-header border-b">
                                    <h3>Quick Action Console</h3>
                                </div>
                                <div className="quick-actions-grid">
                                    <button className="action-btn" onClick={() => setIsModalOpen(true)}>
                                        <div className="action-icon-wrap primary">
                                            <PlusCircle />
                                        </div>
                                        <span>Create Mission</span>
                                    </button>
                                    <button className="action-btn" onClick={() => setCurrentTab('missions')}>
                                        <div className="action-icon-wrap secondary">
                                            <Briefcase />
                                        </div>
                                        <span>Manage Missions</span>
                                    </button>
                                    <button className="action-btn">
                                        <div className="action-icon-wrap success">
                                            <Navigation />
                                        </div>
                                        <span>Live Tracking</span>
                                    </button>
                                    <button className="action-btn">
                                        <div className="action-icon-wrap danger">
                                            <AlertOctagon />
                                        </div>
                                        <span>Risk Alerts</span>
                                    </button>
                                    <button className="action-btn">
                                        <div className="action-icon-wrap warning">
                                            <BarChart3 />
                                        </div>
                                        <span>Analytics</span>
                                    </button>
                                    <button className="action-btn">
                                        <div className="action-icon-wrap info">
                                            <FileText />
                                        </div>
                                        <span>Reports</span>
                                    </button>
                                </div>
                            </div>

                            <div className="alerts-card card">
                                <div className="card-header border-b">
                                    <h3>Recent Operations Alerts</h3>
                                    <button className="btn btn-xs btn-ghost text-primary" onClick={() => setAlerts([])}>Clear All</button>
                                </div>
                                <div className="alerts-list">
                                    {alerts.map((alert) => (
                                        <div key={alert.id} className={`alert-item ${alert.levelClass}`}>
                                            <div className="alert-icon-box">
                                                {alert.levelClass === 'high-risk' ? <AlertTriangle /> : alert.levelClass === 'medium-risk' ? <CloudRain /> : alert.levelClass === 'resolved' ? <CheckCircle2 /> : <Info />}
                                            </div>
                                            <div className="alert-content">
                                                <div className="alert-meta">
                                                    <span className={`alert-level ${alert.levelClass === 'high-risk' ? 'badge-danger-light' : alert.levelClass === 'medium-risk' ? 'badge-warning-light' : alert.levelClass === 'resolved' ? 'badge-success-light' : 'badge-info-light'}`}>
                                                        {alert.level}
                                                    </span>
                                                    <span className="alert-time">{alert.time}</span>
                                                </div>
                                                <p className="alert-desc">{alert.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </main>
                )}

                {currentTab === 'missions' && (
                    <main className="main-content">
                        {/* MISSIONS HEADER */}
                        <section className="hero-section">
                            <div className="hero-left">
                                <h2 className="hero-title">Missions</h2>
                                <p className="hero-subtitle">Create, monitor and manage all logistics missions</p>
                            </div>
                            <div className="hero-right flex-row gap-sm">
                                <button className="btn btn-secondary">
                                    <Download style={{ width: 16, height: 16 }} />
                                    <span>Export</span>
                                </button>
                                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                                    <Plus />
                                    <span>Create New Mission</span>
                                </button>
                            </div>
                        </section>

                        {/* KPI SUMMARY CARDS */}
                        <section className="kpi-grid missions-kpis">
                            <div className="kpi-card">
                                <div className="kpi-header">
                                    <span className="kpi-title">Total Missions</span>
                                    <div className="kpi-icon-wrapper primary">
                                        <Layers />
                                    </div>
                                </div>
                                <div className="kpi-body">
                                    <span className="kpi-value">{missions.length + 150}</span>
                                    <div className="kpi-indicator neutral">
                                        <span>All Time</span>
                                    </div>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-header">
                                    <span className="kpi-title">Active Missions</span>
                                    <div className="kpi-icon-wrapper primary">
                                        <Activity />
                                    </div>
                                </div>
                                <div className="kpi-body">
                                    <span className="kpi-value text-primary">
                                        {String(missions.filter(m => m.progress > 0 && m.progress < 100).length).padStart(2, '0')}
                                    </span>
                                    <div className="kpi-indicator success">
                                        <span className="dot"></span>
                                        <span>In Progress</span>
                                    </div>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-header">
                                    <span className="kpi-title">Completed</span>
                                    <div className="kpi-icon-wrapper secondary">
                                        <CheckCircle2 />
                                    </div>
                                </div>
                                <div className="kpi-body">
                                    <span className="kpi-value text-secondary">
                                        {missions.filter(m => m.progress === 100).length + 124}
                                    </span>
                                    <div className="kpi-indicator success">
                                        <span>Successfully Delivered</span>
                                    </div>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-header">
                                    <span className="kpi-title">Delayed</span>
                                    <div className="kpi-icon-wrapper danger">
                                        <AlertTriangle />
                                    </div>
                                </div>
                                <div className="kpi-body">
                                    <span className="kpi-value text-danger">
                                        {String(missions.filter(m => m.id === 'DR-3056').length + 6).padStart(2, '0')}
                                    </span>
                                    <div className="kpi-indicator danger">
                                        <span>Require Attention</span>
                                    </div>
                                </div>
                            </div>

                            <div className="kpi-card">
                                <div className="kpi-header">
                                    <span className="kpi-title">Cancelled</span>
                                    <div className="kpi-icon-wrapper danger">
                                        <AlertOctagon />
                                    </div>
                                </div>
                                <div className="kpi-body">
                                    <span className="kpi-value">17</span>
                                    <div className="kpi-indicator neutral">
                                        <span>All Time</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* MOBILE FILTERS BAR */}
                        <div className="mobile-search-filter-row">
                            <div className="search-box mobile-search-box">
                                <Search />
                                <input 
                                    type="text" 
                                    placeholder="Search missions..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className={`btn btn-secondary mobile-filter-toggle-btn ${showMobileFiltersSheet ? 'active' : ''}`} onClick={() => setShowMobileFiltersSheet(true)}>
                                <Sliders style={{ width: 14, height: 14 }} />
                            </button>
                        </div>

                        {/* MISSION FILTER TOOLBAR */}
                        <section className={`filter-toolbar card ${showMobileFiltersSheet ? 'mobile-active' : ''}`}>
                            <div className="filter-inputs-grid">
                                <div className="search-box">
                                    <Search />
                                    <input 
                                        type="text" 
                                        placeholder="Search missions..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <select 
                                        className="form-select"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="All">All Status</option>
                                        <option value="In Transit">In Transit</option>
                                        <option value="Planning">Planning</option>
                                        <option value="Delayed">Delayed</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select 
                                        className="form-select"
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                    >
                                        <option value="All">All Types</option>
                                        <option value="Medicine">Medicine</option>
                                        <option value="Food Supplies">Food Supplies</option>
                                        <option value="Disaster Relief">Disaster Relief</option>
                                        <option value="Agriculture">Agriculture</option>
                                        <option value="Construction">Construction</option>
                                        <option value="General Cargo">General Cargo</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select 
                                        className="form-select"
                                        value={filterPriority}
                                        onChange={(e) => setFilterPriority(e.target.value)}
                                    >
                                        <option value="All">All Priority</option>
                                        <option value="CRITICAL">Critical</option>
                                        <option value="HIGH">High</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="LOW">Low</option>
                                    </select>
                                </div>
                                <div className="form-group date-picker-group">
                                    <input type="text" placeholder="From — To" className="form-input mock-date-picker" readOnly />
                                </div>
                                <button className="btn btn-secondary filter-btn-compact">
                                    <Sliders style={{ width: 14, height: 14 }} />
                                    <span>Filters</span>
                                </button>
                            </div>
                            {(searchTerm || filterStatus !== 'All' || filterType !== 'All' || filterPriority !== 'All') && (
                                <div className="clear-filters-container">
                                    <button className="clear-filters-btn" onClick={clearFilters}>
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* MOBILE CHIPS NAVIGATION */}
                        <div className="mobile-filter-chips">
                            {['All', 'In Transit', 'Completed', 'Delayed', 'Medicine', 'Food Supplies', 'Disaster Relief'].map((chip) => {
                                let isActive = false;
                                if (chip === 'All' && filterStatus === 'All' && filterType === 'All') isActive = true;
                                else if (['In Transit', 'Completed', 'Delayed'].includes(chip) && filterStatus === chip) isActive = true;
                                else if (['Medicine', 'Food Supplies', 'Disaster Relief'].includes(chip) && filterType === chip) isActive = true;

                                return (
                                    <button 
                                        key={chip} 
                                        className={`chip-item ${isActive ? 'active' : ''}`}
                                        onClick={() => {
                                            if (['In Transit', 'Completed', 'Delayed'].includes(chip)) {
                                                setFilterStatus(chip);
                                                setFilterType('All');
                                            } else if (['Medicine', 'Food Supplies', 'Disaster Relief'].includes(chip)) {
                                                setFilterType(chip);
                                                setFilterStatus('All');
                                            } else {
                                                clearFilters();
                                            }
                                        }}
                                    >
                                        {chip}
                                    </button>
                                );
                            })}
                        </div>

                        {/* DESKTOP MISSION TABLE */}
                        <div className="missions-table-card card missions-table-desktop">
                            <div className="table-responsive">
                                <table className="missions-table">
                                    <thead>
                                        <tr>
                                            <th>Mission ID</th>
                                            <th>Type</th>
                                            <th>Route Path</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>ETA / Progress</th>
                                            <th>Accessibility</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMissions.map((mission) => {
                                            let statusStr = 'In Transit';
                                            if (mission.progress === 100) statusStr = 'Completed';
                                            else if (mission.progress === 0) statusStr = 'Planning';
                                            else if (mission.id === 'DR-3056') statusStr = 'Delayed';

                                            return (
                                                <tr key={mission.id} className="mission-row">
                                                    <td className="font-bold text-primary">{mission.id}</td>
                                                    <td>
                                                        <span className="badge-category">
                                                            {getCategoryIcon(mission.category)}
                                                            {mission.category}
                                                        </span>
                                                    </td>
                                                    <td className="font-semibold">{mission.route}</td>
                                                    <td>{getPriorityBadge(mission.priority)}</td>
                                                    <td>{getStatusBadge(statusStr, mission.progress)}</td>
                                                    <td>
                                                        <div className="table-progress-cell">
                                                            <div className="progress-label-row">
                                                                <span className="prog-eta">{mission.progress === 100 ? 'Delivered' : mission.eta}</span>
                                                                {mission.progress > 0 && mission.progress < 100 && (
                                                                    <span className="prog-dist">{mission.distance}</span>
                                                                )}
                                                            </div>
                                                            <div className="progress-bar-bg">
                                                                <div className="progress-bar-fill" style={{ width: `${mission.progress}%` }}></div>
                                                            </div>
                                                            <span className="progress-percentage-label">{mission.progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td>{getScoreIndicator(mission.accessibility)}</td>
                                                    <td>
                                                        <div className="table-actions">
                                                            <button 
                                                                className="btn btn-icon btn-sm btn-ghost" 
                                                                title="View details"
                                                                onClick={() => {
                                                                    setActiveMissionId(mission.id);
                                                                    setCurrentTab('home');
                                                                }}
                                                            >
                                                                <Navigation style={{ width: 14, height: 14 }} />
                                                            </button>
                                                            <button 
                                                                className="btn btn-icon btn-sm btn-ghost" 
                                                                title="View route map"
                                                                onClick={() => {
                                                                    setActiveMissionId(mission.id);
                                                                    setCurrentTab('home');
                                                                }}
                                                            >
                                                                <Map style={{ width: 14, height: 14 }} />
                                                            </button>
                                                            <button className="btn btn-icon btn-sm btn-ghost" title="More options">
                                                                <MoreHorizontal style={{ width: 14, height: 14 }} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredMissions.length === 0 && (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                                                    <div className="empty-state-container">
                                                        <AlertTriangle className="empty-icon text-warning" style={{ width: 36, height: 36, margin: '0 auto 12px auto' }} />
                                                        <h4>No missions found</h4>
                                                        <p>Try changing your filters or create a new mission.</p>
                                                        <button className="btn btn-primary mt-sm" onClick={() => setIsModalOpen(true)}>Create New Mission</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAGINATION */}
                            {filteredMissions.length > 0 && (
                                <div className="table-pagination">
                                    <div className="pagination-info">
                                        Showing 1 to {filteredMissions.length} of {missions.length + 150} missions
                                    </div>
                                    <div className="pagination-controls">
                                        <button className="page-btn disabled">←</button>
                                        <button className="page-btn active">1</button>
                                        <button className="page-btn">2</button>
                                        <button className="page-btn">3</button>
                                        <span className="page-dots">...</span>
                                        <button className="page-btn">26</button>
                                        <button className="page-btn">→</button>
                                    </div>
                                    <div className="pagination-pagesize">
                                        <select className="form-select page-size-select" defaultValue="10">
                                            <option value="5">5 / page</option>
                                            <option value="10">10 / page</option>
                                            <option value="25">25 / page</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* MOBILE MISSION CARDS STACK */}
                        <div className="missions-grid-mobile">
                            {filteredMissions.map((mission) => {
                                let statusStr = 'In Transit';
                                if (mission.progress === 100) statusStr = 'Completed';
                                else if (mission.progress === 0) statusStr = 'Planning';
                                else if (mission.id === 'DR-3056') statusStr = 'Delayed';

                                return (
                                    <div key={mission.id} className="mobile-mission-card card" onClick={() => setSelectedMobileMission(mission)}>
                                        <div className="card-top-row">
                                            <span className="m-id font-bold text-primary">{mission.id}</span>
                                            <div className="card-top-right-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {getStatusBadge(statusStr, mission.progress)}
                                                <button className="btn btn-icon btn-sm btn-ghost" style={{ width: '32px', height: '32px', padding: 0 }} onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowMobileOptionsSheet(mission);
                                                }}>
                                                    <MoreHorizontal style={{ width: 14, height: 14 }} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-meta-row">
                                            <span className="badge-category">
                                                {getCategoryIcon(mission.category)}
                                                {mission.category}
                                            </span>
                                            {getPriorityBadge(mission.priority)}
                                        </div>
                                        <div className="card-route-row font-semibold">
                                            <span>{mission.origin}</span>
                                            <ArrowRight style={{ width: 14, height: 14 }} />
                                            <span>{mission.destination}</span>
                                        </div>

                                        <div className="card-telemetry-row">
                                            <div className="telemetry-item">
                                                <span className="telemetry-label">ETA</span>
                                                <span className="telemetry-val font-semibold">{mission.progress === 100 ? 'Delivered' : mission.eta}</span>
                                            </div>
                                            <div className="telemetry-item">
                                                <span className="telemetry-label">Distance</span>
                                                <span className="telemetry-val font-semibold">{mission.distance}</span>
                                            </div>
                                        </div>

                                        <div className="card-progress-section">
                                            <div className="progress-label-row">
                                                <span>Progress</span>
                                                <span className="font-bold">{mission.progress}%</span>
                                            </div>
                                            <div className="progress-bar-bg">
                                                <div className="progress-bar-fill" style={{ width: `${mission.progress}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="card-bottom-row">
                                            <div className="accessibility-score-block">
                                                <span className="score-label">Accessibility</span>
                                                {getScoreIndicator(mission.accessibility)}
                                            </div>
                                            <div className="card-action-buttons">
                                                <button 
                                                    className="btn btn-secondary btn-sm"
                                                    style={{ height: '36px', minWidth: '60px' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedMobileMission(mission);
                                                    }}
                                                >
                                                    <span>View</span>
                                                </button>
                                                <button 
                                                    className="btn btn-primary btn-sm"
                                                    style={{ height: '36px', minWidth: '60px' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMissionId(mission.id);
                                                        setCurrentTab('home');
                                                    }}
                                                >
                                                    <Map style={{ width: 12, height: 12 }} />
                                                    <span>Map</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredMissions.length === 0 && (
                                <div className="empty-state-container card" style={{ padding: '36px', textAlign: 'center' }}>
                                    <AlertTriangle className="empty-icon text-warning" style={{ width: 36, height: 36, margin: '0 auto 12px auto' }} />
                                    <h4>No missions found</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Try changing your filters or create a new mission.</p>
                                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Create New Mission</button>
                                </div>
                            )}
                            {filteredMissions.length > 0 && (
                                <div className="mobile-pagination-controls">
                                    <button className="btn btn-secondary" onClick={() => alert('Previous Page')} style={{ minHeight: '44px', minWidth: '44px' }}>←</button>
                                    <span className="mobile-page-indicator font-semibold">1 / 26</span>
                                    <button className="btn btn-secondary" onClick={() => alert('Next Page')} style={{ minHeight: '44px', minWidth: '44px' }}>→</button>
                                </div>
                            )}
                        </div>
                    </main>
                )}

                {/* FOOTER */}
                <footer className="main-footer">
                    <p>&copy; 2026 NE-RouteIQ. All rights reserved.</p>
                    <div className="footer-meta">
                        <span>AI-Powered Access Intelligence for NER</span>
                        <span className="bullet">•</span>
                        <span>Made for North-East India</span>
                    </div>
                </footer>
            </div>

            {/* MOBILE BOTTOM NAVIGATION */}
            <div className="mobile-bottom-nav">
                <a href="#" className={`mobile-nav-item ${currentTab === 'home' ? 'active' : ''}`} onClick={() => { setCurrentTab('home'); setSelectedMobileMission(null); }}>
                    <LayoutDashboard />
                    <span>Home</span>
                </a>
                <a href="#" className={`mobile-nav-item ${currentTab === 'missions' ? 'active' : ''}`} onClick={() => { setCurrentTab('missions'); setSelectedMobileMission(null); }}>
                    <Briefcase />
                    <span>Missions</span>
                </a>
                <a href="#" className="mobile-nav-item" onClick={() => { setCurrentTab('home'); setSelectedMobileMission(null); setTimeout(() => { window.scrollTo(0, 300); }, 100); }}>
                    <Map />
                    <span>Map</span>
                </a>
                <a href="#" className="mobile-nav-item">
                    <Bell />
                    <span>Alerts</span>
                    {alerts.length > 0 && <span className="mobile-badge">{alerts.length}</span>}
                </a>
                <a href="#" className="mobile-nav-item">
                    <Settings />
                    <span>Profile</span>
                </a>
            </div>

            {/* POPUP MODAL: CREATE NEW MISSION */}
            <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`}>
                <div className="modal-card">
                    <div className="modal-header">
                        <h3>Create New AI-Routed Mission</h3>
                        <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                            <X />
                        </button>
                    </div>
                    <form onSubmit={handleFormSubmit} className="modal-form">
                        <div className="form-group">
                            <label htmlFor="missionId">Mission Code (ID)</label>
                            <input 
                                type="text" 
                                id="missionId" 
                                placeholder="e.g. MED-1025" 
                                required 
                                className="form-input"
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="missionCategory">Mission Type / Category</label>
                                <select 
                                    id="missionCategory" 
                                    className="form-select"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Medicine">Medicine</option>
                                    <option value="Food Supplies">Food Supplies</option>
                                    <option value="Disaster Relief">Disaster Relief</option>
                                    <option value="Agriculture">Agriculture</option>
                                    <option value="Construction">Construction</option>
                                    <option value="General Cargo">General Cargo</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="missionPriority">Priority Level</label>
                                <select 
                                    id="missionPriority" 
                                    className="form-select"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="CRITICAL">Critical</option>
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="startLocation">Origin Location</label>
                                <select 
                                    id="startLocation" 
                                    className="form-select"
                                    value={formData.origin}
                                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                >
                                    <option value="Guwahati">Guwahati (Assam)</option>
                                    <option value="Silchar">Silchar (Assam)</option>
                                    <option value="Jorhat">Jorhat (Assam)</option>
                                    <option value="Dimapur">Dimapur (Nagaland)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="endLocation">Destination</label>
                                <select 
                                    id="endLocation" 
                                    className="form-select"
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                >
                                    <option value="Imphal">Imphal (Manipur)</option>
                                    <option value="Aizawl">Aizawl (Mizoram)</option>
                                    <option value="Kohima">Kohima (Nagaland)</option>
                                    <option value="Tezpur">Tezpur (Assam)</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="vehicleReg">Vehicle Registration Number</label>
                                <input 
                                    type="text" 
                                    id="vehicleReg" 
                                    placeholder="e.g. AS-01-XX-9999" 
                                    required 
                                    className="form-input"
                                    value={formData.vehicle}
                                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cargoManifest">Cargo Details</label>
                                <input 
                                    type="text" 
                                    id="cargoManifest" 
                                    placeholder="e.g. COVID Vaccines" 
                                    required 
                                    className="form-input"
                                    value={formData.cargo}
                                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">
                                <Zap />
                                <span>AI Calculate Route & Start</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MOBILE FILTERS BOTTOM SHEET */}
            <div className={`bottom-sheet-overlay ${showMobileFiltersSheet ? 'active' : ''}`} onClick={() => setShowMobileFiltersSheet(false)}>
                <div className="bottom-sheet-card" onClick={(e) => e.stopPropagation()}>
                    <div className="bottom-sheet-drag-handle"></div>
                    <div className="bottom-sheet-header">
                        <h3>Filters</h3>
                        <button className="bottom-sheet-close-btn" onClick={() => setShowMobileFiltersSheet(false)}><X /></button>
                    </div>
                    <div className="bottom-sheet-body">
                        {/* Status Filter */}
                        <div className="bottom-sheet-filter-section">
                            <h4>Status</h4>
                            <div className="radio-group">
                                {['All', 'In Transit', 'Planning', 'Delayed', 'Completed'].map(status => (
                                    <label key={status} className="radio-label">
                                        <input 
                                            type="radio" 
                                            name="mobileStatus" 
                                            value={status} 
                                            checked={filterStatus === status}
                                            onChange={() => setFilterStatus(status)}
                                        />
                                        <span>{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Mission Type Filter */}
                        <div className="bottom-sheet-filter-section">
                            <h4>Mission Type</h4>
                            <div className="radio-group">
                                {['All', 'Medicine', 'Food Supplies', 'Disaster Relief', 'Agriculture', 'Construction', 'General Cargo'].map(type => (
                                    <label key={type} className="radio-label">
                                        <input 
                                            type="radio" 
                                            name="mobileType" 
                                            value={type} 
                                            checked={filterType === type}
                                            onChange={() => setFilterType(type)}
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Priority Filter */}
                        <div className="bottom-sheet-filter-section">
                            <h4>Priority</h4>
                            <div className="radio-group">
                                {['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(priority => (
                                    <label key={priority} className="radio-label">
                                        <input 
                                            type="radio" 
                                            name="mobilePriority" 
                                            value={priority} 
                                            checked={filterPriority === priority}
                                            onChange={() => setFilterPriority(priority)}
                                        />
                                        <span>{priority}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="bottom-sheet-footer">
                        <button className="btn btn-secondary btn-full" onClick={() => { clearFilters(); setShowMobileFiltersSheet(false); }}>Clear All</button>
                        <button className="btn btn-primary btn-full" onClick={() => setShowMobileFiltersSheet(false)}>Apply Filters</button>
                    </div>
                </div>
            </div>

            {/* MOBILE OPTIONS BOTTOM SHEET */}
            <div className={`bottom-sheet-overlay ${showMobileOptionsSheet ? 'active' : ''}`} onClick={() => setShowMobileOptionsSheet(null)}>
                <div className="bottom-sheet-card" onClick={(e) => e.stopPropagation()}>
                    <div className="bottom-sheet-drag-handle"></div>
                    <div className="bottom-sheet-header">
                        <h3>Mission Options - {showMobileOptionsSheet?.id}</h3>
                        <button className="bottom-sheet-close-btn" onClick={() => setShowMobileOptionsSheet(null)}><X /></button>
                    </div>
                    <div className="bottom-sheet-body menu-sheet-body">
                        <button className="menu-item-btn" onClick={() => { alert('Edit Mission workflow opened!'); setShowMobileOptionsSheet(null); }}>
                            <Wrench />
                            <span>Edit Mission Details</span>
                        </button>
                        <button className="menu-item-btn" onClick={() => { alert('Mission duplicated!'); setShowMobileOptionsSheet(null); }}>
                            <Box />
                            <span>Duplicate Mission</span>
                        </button>
                        <button className="menu-item-btn" onClick={() => { 
                            if (showMobileOptionsSheet) {
                                setActiveMissionId(showMobileOptionsSheet.id);
                                setCurrentTab('home');
                                setShowMobileOptionsSheet(null);
                            }
                        }}>
                            <Map />
                            <span>View on Tactical Map</span>
                        </button>
                        <button className="menu-item-btn cancel-btn" onClick={() => { 
                            if (showMobileOptionsSheet) {
                                setMissions(prev => prev.filter(m => m.id !== showMobileOptionsSheet.id));
                                setShowMobileOptionsSheet(null);
                                alert(`Mission ${showMobileOptionsSheet.id} cancelled successfully.`);
                            }
                        }}>
                            <Trash2 />
                            <span>Cancel Mission</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* DEDICATED MOBILE DETAILS SCREEN OVERLAY */}
            {selectedMobileMission && (
                <div className="mobile-detail-screen">
                    <header className="detail-screen-header">
                        <button className="back-btn" onClick={() => setSelectedMobileMission(null)}>
                            ← Back
                        </button>
                        <div className="detail-header-title">
                            <h3>Mission Details</h3>
                            <span>{selectedMobileMission.id}</span>
                        </div>
                        <span className={`badge ${selectedMobileMission.progress === 100 ? 'badge-neutral' : selectedMobileMission.progress === 0 ? 'badge-info' : 'badge-success'}`}>
                            {selectedMobileMission.progress === 100 ? 'Completed' : selectedMobileMission.progress === 0 ? 'Planning' : 'In Transit'}
                        </span>
                    </header>
                    <div className="detail-screen-body">
                        <div className="detail-status-card card">
                            <div className="detail-status-row">
                                <span className="detail-label">Status</span>
                                <span className="detail-val font-semibold text-primary">
                                    {selectedMobileMission.progress === 100 ? 'DELIVERED' : selectedMobileMission.progress === 0 ? 'PLANNING' : 'IN TRANSIT'}
                                </span>
                            </div>
                            <div className="detail-status-row">
                                <span className="detail-label">Category</span>
                                <span className="badge-category">
                                    {getCategoryIcon(selectedMobileMission.category)}
                                    {selectedMobileMission.category}
                                </span>
                            </div>
                            <div className="detail-status-row">
                                <span className="detail-label">Priority</span>
                                {getPriorityBadge(selectedMobileMission.priority)}
                            </div>
                        </div>

                        <div className="detail-route-card card">
                            <span className="detail-section-title">Route Telemetry</span>
                            <div className="route-flow-diagram">
                                <div className="route-flow-point">
                                    <div className="point-dot bg-primary"></div>
                                    <div className="point-text">
                                        <span className="pt-title">Origin</span>
                                        <span className="pt-val font-semibold">{selectedMobileMission.origin}</span>
                                    </div>
                                </div>
                                <div className="route-flow-line"></div>
                                <div className="route-flow-point">
                                    <div className="point-dot bg-secondary"></div>
                                    <div className="point-text">
                                        <span className="pt-title">Destination</span>
                                        <span className="pt-val font-semibold">{selectedMobileMission.destination}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="detail-metrics-grid">
                            <div className="metric-box">
                                <Clock />
                                <div className="metric-text">
                                    <span className="metric-label">ETA</span>
                                    <span className="metric-val">{selectedMobileMission.progress === 100 ? 'Delivered' : selectedMobileMission.eta}</span>
                                </div>
                            </div>
                            <div className="metric-box">
                                <Milestone />
                                <div className="metric-text">
                                    <span className="metric-label">Distance</span>
                                    <span className="metric-val">{selectedMobileMission.distance}</span>
                                </div>
                            </div>
                            <div className="metric-box">
                                <Gauge />
                                <div className="metric-text">
                                    <span className="metric-label">Speed</span>
                                    <span className="metric-val">{selectedMobileMission.speed > 0 ? `${selectedMobileMission.speed} km/h` : '--'}</span>
                                </div>
                            </div>
                            <div className="metric-box highlighted">
                                <ShieldCheck className="text-secondary" />
                                <div className="metric-text">
                                    <span className="metric-label">Accessibility</span>
                                    <span className="metric-val text-secondary">{selectedMobileMission.accessibility}</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-progress-card card">
                            <div className="progress-label-row">
                                <span>Transit Progress</span>
                                <span className="font-bold">{selectedMobileMission.progress}%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${selectedMobileMission.progress}%` }}></div>
                            </div>
                        </div>

                        <div className="detail-action-buttons">
                            <button className="btn btn-secondary btn-full" onClick={() => {
                                setActiveMissionId(selectedMobileMission.id);
                                setCurrentTab('home');
                                setSelectedMobileMission(null);
                            }}>
                                View Route
                            </button>
                            <button className="btn btn-primary btn-full" onClick={() => {
                                setActiveMissionId(selectedMobileMission.id);
                                setCurrentTab('home');
                                setSelectedMobileMission(null);
                            }}>
                                Live Tracking
                            </button>
                            <button className="btn btn-secondary btn-full outline-danger" onClick={() => alert('Calculating alternate smarter paths...')}>
                                Re-route
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
