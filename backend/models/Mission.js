const mongoose = require('mongoose');

const HazardSchema = new mongoose.Schema({
    type: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true }
});

const MissionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    icon: { type: String, required: true },
    route: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    vehicle: { type: String, required: true },
    cargo: { type: String, required: true },
    priority: { type: String, required: true },
    risk: { type: String, required: true },
    progress: { type: Number, required: true, default: 0 },
    eta: { type: String, required: true },
    distance: { type: String, required: true },
    speed: { type: Number, required: true, default: 0 },
    accessibility: { type: String, required: true },
    svgPath: { type: String, required: true },
    hazards: [HazardSchema]
}, { timestamps: true });

module.exports = mongoose.model('Mission', MissionSchema);
