import { create } from 'zustand';
import {
    getDashboardSummary,
    getActiveMissions,
    getAlerts,
    getAccessibilitySummary,
    getWeatherSummary
} from '../services/dashboardService';

export const useDashboardStore = create((set, get) => ({
    // State
    summary: null,
    missions: [],
    alerts: [],
    accessibility: null,
    weather: null,
    loading: false,

    selectedMissionId: 'MED-1024',
    selectedVehicleId: 'AS-01-BC-1234',
    mapMode: '3D', // '3D' or '2D'
    mapLayers: {
        activeRoutes: true,
        vehicles: true,
        riskZones: true,
        weather: true,
        disruptions: true
    },

    whyRouteModalOpen: false,

    // Actions
    setMapMode: (mode) => set({ mapMode: mode }),
    setSelectedMissionId: (id) => set({ selectedMissionId: id }),
    setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
    setWhyRouteModalOpen: (isOpen) => set({ whyRouteModalOpen: isOpen }),

    toggleLayer: (layerKey) => set((state) => ({
        mapLayers: {
            ...state.mapLayers,
            [layerKey]: !state.mapLayers[layerKey]
        }
    })),

    fetchDashboardData: async () => {
        set({ loading: true });
        try {
            const [summary, missions, alerts, accessibility, weather] = await Promise.all([
                getDashboardSummary(),
                getActiveMissions(),
                getAlerts(),
                getAccessibilitySummary(),
                getWeatherSummary()
            ]);
            set({ summary, missions, alerts, accessibility, weather, loading: false });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            set({ loading: false });
        }
    }
}));
