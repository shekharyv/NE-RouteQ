const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Mission = require('./models/Mission');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Database Fallback Flag
let isUsingMockDB = false;

// Seed Data
const initialMissions = [
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
        svgPath: 'M 260,305 L 230,350', // Shillong to Tripura/Western border representation
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

let mockMissions = [...initialMissions];

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ne_routeiq';
mongoose.connect(mongoURI)
    .then(async () => {
        console.log('MongoDB successfully connected.');
        // Seed initial data if DB is empty
        try {
            // Drop current collection to re-seed fresh SIH data
            await Mission.deleteMany({});
            await Mission.insertMany(initialMissions);
            console.log('Database seeded with fresh SIH missions.');
        } catch (err) {
            console.error('Error seeding database:', err);
        }
    })
    .catch((err) => {
        console.warn('MongoDB connection failed. Falling back to In-Memory DB Mode.');
        console.warn('Reason:', err.message);
        isUsingMockDB = true;
    });

// API Routes

// GET: All Missions
app.get('/api/missions', async (req, res) => {
    try {
        if (isUsingMockDB) {
            return res.json(mockMissions);
        }
        const dbMissions = await Mission.find().sort({ createdAt: -1 });
        res.json(dbMissions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve missions' });
    }
});

// POST: Create New Mission
app.post('/api/missions', async (req, res) => {
    const { id, category, priority, origin, destination, vehicle, cargo } = req.body;

    if (!id || !category || !priority || !origin || !destination || !vehicle || !cargo) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Map icons to categories
    const iconMap = {
        'Medicine': 'shield-alert',
        'Food Supplies': 'shopping-bag',
        'Disaster Relief': 'flame',
        'Agriculture': 'leaf',
        'Construction': 'wrench',
        'General Cargo': 'box'
    };

    // Determine SVG path and mock hazard markers based on selected route
    let svgPath = 'M 230,270 L 600,350'; 
    let hazards = [];

    if (origin === 'Guwahati' && destination === 'Imphal') {
        svgPath = 'M 230,270 Q 280,285 360,310 T 480,345 Q 520,335 550,342 L 600,350';
        hazards = [{ type: 'rain', x: 515, y: 315 }, { type: 'landslide', x: 568, y: 328 }];
    } else if (origin === 'Silchar' && destination === 'Aizawl') {
        svgPath = 'M 480,345 Q 510,375 550,405';
        hazards = [{ type: 'rain', x: 515, y: 375 }];
    } else if (origin === 'Jorhat' && destination === 'Tezpur') {
        svgPath = 'M 490,225 L 380,210';
    } else if (origin === 'Dimapur' && destination === 'Kohima') {
        svgPath = 'M 490,225 L 615,300';
    }

    // Build route object
    const newMissionData = {
        id: id.toUpperCase().trim(),
        category,
        icon: iconMap[category] || 'briefcase',
        route: `${origin} → ${destination}`,
        origin,
        destination,
        vehicle: vehicle.toUpperCase().trim(),
        cargo,
        priority,
        risk: 'LOW RISK',
        progress: 10,
        eta: '3h 15m',
        distance: '185 km',
        speed: 48,
        accessibility: '88/100',
        svgPath,
        hazards
    };

    try {
        if (isUsingMockDB) {
            // Check for duplicate ID
            if (mockMissions.some(m => m.id === newMissionData.id)) {
                return res.status(400).json({ error: `Mission ${newMissionData.id} already exists` });
            }
            mockMissions.unshift(newMissionData);
            return res.json(newMissionData);
        }

        // Mongo Save
        const missionObj = new Mission(newMissionData);
        const saved = await missionObj.save();
        res.json(saved);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: `Mission ${newMissionData.id} already exists` });
        }
        res.status(500).json({ error: 'Failed to create mission' });
    }
});

// GET: Alerts
app.get('/api/alerts', (req, res) => {
    const alerts = [
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
    res.json(alerts);
});

// GET: Server Status & Metadata
app.get('/api/status', (req, res) => {
    res.json({
        dbMode: isUsingMockDB ? 'In-Memory Fallback' : 'MongoDB Connected',
        mongodbURI: isUsingMockDB ? 'N/A' : mongoURI,
        serverTime: new Date()
    });
});

// POST: Client-side Error Logger
app.post('/api/log-error', (req, res) => {
    console.error('\n!!! CLIENT REACT CRASH LOGGED !!!');
    console.error('Message:', req.body.message);
    console.error('File:', req.body.filename);
    console.error('Line:', req.body.lineno);
    console.error('Stack Trace:', req.body.stack);
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`NE-RouteIQ API Server is running on port ${PORT}`);
});
