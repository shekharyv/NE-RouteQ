// NE-RouteIQ Service Layer for FastAPI / Backend Integration

export const getDashboardSummary = async () => {
    return {
        activeMissionsCount: 12,
        activeMissionsChange: '+8% from yesterday',
        atRiskMissionsCount: 3,
        atRiskStatus: 'Needs attention',
        avgAccessibilityScore: '84/100',
        avgAccessibilityDesc: 'Across active routes',
        onTimeDeliveryRate: '94%',
        onTimePeriod: 'Last 30 days',
        activeVehiclesCount: 18,
        activeVehiclesDesc: 'Currently tracking'
    };
};

export const getActiveMissions = async () => {
    return [
        {
            id: 'MED-1024',
            type: 'Medicine',
            category: 'Medicine',
            origin: 'Guwahati',
            destination: 'Imphal',
            route: 'Guwahati → Imphal',
            vehicle: 'AS-01-BC-1234 (Truck)',
            driver: 'Rajesh Gogoi',
            status: 'In Transit',
            statusClass: 'in-transit',
            risk: 'Low Risk',
            riskLevel: 'LOW',
            accessibility: '86/100',
            eta: '8h 40m',
            progress: 65,
            recommendedRoute: 'Route B — AI Recommended'
        },
        {
            id: 'FD-2048',
            type: 'Food Supply',
            category: 'Food Supplies',
            origin: 'Silchar',
            destination: 'Aizawl',
            route: 'Silchar → Aizawl',
            vehicle: 'MZ-01-D-5678 (Truck)',
            driver: 'Lalthan Hmar',
            status: 'In Transit',
            statusClass: 'in-transit',
            risk: 'Moderate Risk',
            riskLevel: 'MEDIUM',
            accessibility: '78/100',
            eta: '3h 45m',
            progress: 55,
            recommendedRoute: 'Route A — NH-54 Corridor'
        },
        {
            id: 'DR-3056',
            type: 'Disaster Relief',
            category: 'Disaster Relief',
            origin: 'Guwahati',
            destination: 'Itanagar',
            route: 'Guwahati → Itanagar',
            vehicle: 'AR-01-TR-9921 (Truck)',
            driver: 'Tashi Tsering',
            status: 'Delayed',
            statusClass: 'delayed',
            risk: 'High Risk',
            riskLevel: 'HIGH',
            accessibility: '61/100',
            eta: '12h 10m',
            progress: 30,
            recommendedRoute: 'Route C — Tezpur Bypass'
        },
        {
            id: 'AG-4091',
            type: 'Agriculture',
            category: 'Agriculture',
            origin: 'Dimapur',
            destination: 'Kohima',
            route: 'Dimapur → Kohima',
            vehicle: 'NL-01-A-4432 (Mini Van)',
            driver: 'Kipgen Konyak',
            status: 'Scheduled',
            statusClass: 'scheduled',
            risk: 'Low Risk',
            riskLevel: 'LOW',
            accessibility: '90/100',
            eta: 'Tomorrow 09:00 AM',
            progress: 0,
            recommendedRoute: 'Route A — Express Highway'
        },
        {
            id: 'CN-5012',
            type: 'Construction',
            category: 'Construction',
            origin: 'Shillong',
            destination: 'Tura',
            route: 'Shillong → Tura',
            vehicle: 'ML-01-C-8812 (Heavy Loader)',
            driver: 'Dominic Marak',
            status: 'In Transit',
            statusClass: 'in-transit',
            risk: 'Moderate Risk',
            riskLevel: 'MEDIUM',
            accessibility: '74/100',
            eta: '5h 20m',
            progress: 40,
            recommendedRoute: 'Route B — West Garo Corridor'
        }
    ];
};

export const getAlerts = async () => {
    return [
        {
            id: 'ALT-1',
            level: 'HIGH',
            badgeClass: 'badge-danger',
            title: 'Landslide risk detected',
            location: 'NH corridor near Imphal (Kohima-Mao section)',
            time: '8 min ago',
            type: 'landslide'
        },
        {
            id: 'ALT-2',
            level: 'WARNING',
            badgeClass: 'badge-warning',
            title: 'Heavy rainfall expected',
            location: 'Manipur & Barail Range region',
            time: '24 min ago',
            type: 'rain'
        },
        {
            id: 'ALT-3',
            level: 'RESOLVED',
            badgeClass: 'badge-success',
            title: 'Traffic disruption cleared',
            location: 'Guwahati-Tezpur Bypass corridor',
            time: '1 hour ago',
            type: 'clear'
        }
    ];
};

export const getAccessibilitySummary = async () => {
    return {
        score: '84/100',
        trend: '↑ 6% this week',
        breakdown: [
            { region: 'Assam Valley', score: 92, status: 'Safe' },
            { region: 'Shillong Plateau', score: 86, status: 'Optimal' },
            { region: 'Barail / Silchar Corridor', score: 72, status: 'Moderate' },
            { region: 'Nagaland / Manipur Hills', score: 64, status: 'At Risk' }
        ]
    };
};

export const getWeatherSummary = async () => {
    return {
        temp: 24,
        condition: 'Moderate Rain',
        location: 'Guwahati, Assam',
        monsoonActive: true
    };
};
