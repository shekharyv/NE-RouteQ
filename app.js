// NE-RouteIQ - Core Simulation & Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Mission database containing telemetry configurations
    const missionsDb = {
        'MED-1024': {
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
            riskClass: 'badge-warning', // low risk is represented as yellow/orange alert, let's keep it clean
            progress: 65,
            eta: '2h 18m',
            distance: '147 km',
            speed: 42,
            accessibility: '86/100',
            svgPath: 'M 230,270 Q 280,285 360,310 T 480,345 Q 520,335 550,342 L 600,350', // Guwahati to Imphal
            hazards: [
                { type: 'rain', x: 515, y: 315 },
                { type: 'landslide', x: 568, y: 328 }
            ]
        },
        'FD-2048': {
            id: 'FD-2048',
            category: 'Food',
            icon: 'shopping-bag',
            route: 'Silchar → Aizawl',
            origin: 'Silchar',
            destination: 'Aizawl',
            vehicle: 'MZ-01-D-5678',
            cargo: 'Rice & Dal Rations',
            priority: 'HIGH',
            risk: 'MEDIUM RISK',
            riskClass: 'badge-warning',
            progress: 38,
            eta: '5h 45m',
            distance: '180 km',
            speed: 32,
            accessibility: '78/100',
            svgPath: 'M 480,345 Q 510,375 550,405', // Silchar to Aizawl
            hazards: [
                { type: 'rain', x: 515, y: 375 }
            ]
        },
        'DR-3056': {
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
            riskClass: 'badge-success',
            progress: 100,
            eta: 'Arrived',
            distance: '0 km',
            speed: 0,
            accessibility: '95/100',
            svgPath: 'M 490,225 L 380,210', // Jorhat to Tezpur
            hazards: []
        },
        'AG-4091': {
            id: 'AG-4091',
            category: 'Agriculture',
            icon: 'leaf',
            route: 'Dimapur → Kohima',
            origin: 'Dimapur',
            destination: 'Kohima',
            vehicle: 'NL-01-A-4432',
            cargo: 'Organic Fertilizers',
            priority: 'LOW',
            risk: 'LOW RISK',
            riskClass: 'badge-success',
            progress: 0,
            eta: '1d 2h',
            distance: '74 km',
            speed: 0,
            accessibility: '90/100',
            svgPath: 'M 490,225 L 615,300', // Dimapur/Jorhat hub area to Kohima
            hazards: []
        }
    };

    // Tracking state
    let activeMissionId = 'MED-1024';
    let animationFrameId = null;
    let animationProgress = 0.65; // Matches the 65% initial progress of MED-1024
    let speedFluctuationInterval = null;

    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const missionModal = document.getElementById('missionModal');
    const openMissionModalBtn = document.getElementById('openMissionModalBtn');
    const closeMissionModalBtn = document.getElementById('closeMissionModalBtn');
    const cancelMissionFormBtn = document.getElementById('cancelMissionFormBtn');
    const createMissionForm = document.getElementById('createMissionForm');
    const qaCreateMission = document.getElementById('qa-create-mission');
    const missionsTableBody = document.getElementById('missionsTableBody');

    // Telemetry display bindings
    const detTitle = document.querySelector('.active-mission-card h3');
    const detStatusBadge = document.getElementById('det-status-badge');
    const detRoute = document.getElementById('det-route');
    const detBadge = document.getElementById('det-badge');
    const detVehicle = document.getElementById('det-vehicle');
    const detCargo = document.getElementById('det-cargo');
    const detPriority = document.getElementById('det-priority');
    const detRisk = document.getElementById('det-risk');
    const detProgressPercent = document.getElementById('det-progress-percent');
    const detProgressBar = document.getElementById('det-progress-bar');
    const detEta = document.getElementById('det-eta');
    const detDistance = document.getElementById('det-distance');
    const detSpeed = document.getElementById('det-speed');
    const detAccessibility = document.getElementById('det-accessibility');

    // Map bindings
    const vehicleMarker = document.getElementById('vehicle-marker');
    const vehicleArrow = document.getElementById('vehicle-arrow');
    const vehicleTrack = document.getElementById('vehicle-track');
    const mapHazardsContainer = document.querySelector('.map-hazard-markers');

    /* ==========================================================================
       SIDEBAR INTERACTION
       ========================================================================== */
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (sidebarCloseBtn && sidebar) {
        sidebarCloseBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Close sidebar clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && e.target !== sidebarToggleBtn && !sidebarToggleBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    /* ==========================================================================
       MISSION DETAIL UPDATER & PATH ANIMATION
       ========================================================================== */
    function selectMission(missionId) {
        if (!missionsDb[missionId]) return;
        
        activeMissionId = missionId;
        const mission = missionsDb[missionId];

        // Update active class in table
        document.querySelectorAll('.mission-row').forEach(row => {
            if (row.getAttribute('data-mission-id') === missionId) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        });

        // 1. Update Telemetry Panel Details
        detTitle.textContent = `Mission ${mission.id}`;
        
        // Status Badge
        if (mission.progress === 100) {
            detStatusBadge.className = 'badge badge-neutral';
            detStatusBadge.innerHTML = `<span class="dot"></span>Completed`;
        } else if (mission.progress === 0) {
            detStatusBadge.className = 'badge badge-info';
            detStatusBadge.innerHTML = `<span class="dot"></span>Scheduled`;
        } else if (mission.id === 'FD-2048') {
            detStatusBadge.className = 'badge badge-warning pulse-ring';
            detStatusBadge.innerHTML = `<span class="dot"></span>Delay Risk`;
        } else {
            detStatusBadge.className = 'badge badge-success pulse-ring';
            detStatusBadge.innerHTML = `<span class="dot"></span>In Transit`;
        }

        detRoute.textContent = mission.route;
        detBadge.innerHTML = `<i data-lucide="${mission.icon}" class="category-icon text-primary"></i>${mission.category}`;
        detVehicle.textContent = mission.vehicle;
        detCargo.textContent = mission.cargo;
        
        // Priority
        detPriority.textContent = mission.priority;
        if (mission.priority === 'CRITICAL' || mission.priority === 'HIGH') {
            detPriority.className = 'badge badge-danger';
        } else if (mission.priority === 'MEDIUM') {
            detPriority.className = 'badge badge-warning';
        } else {
            detPriority.className = 'badge badge-info';
        }

        // Risk Profile
        detRisk.textContent = mission.risk;
        if (mission.risk.includes('HIGH')) {
            detRisk.className = 'badge badge-danger';
        } else if (mission.risk.includes('MEDIUM')) {
            detRisk.className = 'badge badge-warning';
        } else {
            detRisk.className = 'badge badge-success';
        }

        // Telemetry metrics
        detProgressPercent.textContent = `${mission.progress}%`;
        detProgressBar.style.width = `${mission.progress}%`;
        detEta.textContent = mission.eta;
        detDistance.textContent = mission.distance;
        detSpeed.textContent = mission.speed > 0 ? `${mission.speed} km/h` : '--';
        detAccessibility.textContent = mission.accessibility;

        // Recreate icons in details panel
        lucide.createIcons();

        // 2. Update Map Route Path & Hazards
        // Set path coordinates to the tracking path
        vehicleTrack.setAttribute('d', mission.svgPath);
        
        // Toggle neon glow segments depending on active route
        document.querySelectorAll('.route-segment').forEach(seg => {
            if (missionId === 'MED-1024') {
                seg.style.display = 'block';
            } else {
                seg.style.display = 'none'; // Only show segments for MED-1024, or toggle custom ones
            }
        });

        // Toggle custom route displays on the map
        document.querySelectorAll('.inactive-route-paths').forEach(pathGroup => {
            const pathId = pathGroup.getAttribute('id');
            if (pathId === `route-${missionId.toLowerCase()}`) {
                pathGroup.style.display = 'block';
            } else {
                pathGroup.style.display = 'none';
            }
        });

        // Dynamically place hazard markers on map
        renderMapHazards(mission.hazards);

        // Reset tracking animation progress to match mission progress
        animationProgress = mission.progress / 100;
        
        // If completed or scheduled, stop animating vehicle movement
        if (mission.progress === 100 || mission.progress === 0) {
            updateVehiclePosition(animationProgress);
        }
    }

    function renderMapHazards(hazards) {
        if (!mapHazardsContainer) return;
        mapHazardsContainer.innerHTML = '';
        
        hazards.forEach(hazard => {
            let svgMarkup = '';
            if (hazard.type === 'rain') {
                svgMarkup = `
                    <g transform="translate(${hazard.x - 10}, ${hazard.y - 10})" class="map-icon-marker warning">
                        <circle cx="10" cy="10" r="12" class="marker-bg" />
                        <path d="M6 11 C4.5 11 3.5 10 3.5 8.5 C3.5 7 4.7 6.2 6 6.2 C6.5 4.5 8 3.5 10 3.5 C12.5 3.5 14 5.5 13.5 7.5 C14.5 7.5 15.5 8.5 15.5 9.8 C15.5 11 14.5 11 13.5 11 Z" fill="#F59E0B" />
                        <line x1="7" y1="13" x2="6" y2="15" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
                        <line x1="10" y1="13" x2="9" y2="15" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
                        <line x1="13" y1="13" x2="12" y2="15" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
                    </g>
                `;
            } else if (hazard.type === 'landslide') {
                svgMarkup = `
                    <g transform="translate(${hazard.x - 10}, ${hazard.y - 10})" class="map-icon-marker danger pulse-fast">
                        <circle cx="10" cy="10" r="12" class="marker-bg" />
                        <polygon points="10,2 19,17 1,17" fill="#EF4444" />
                        <rect x="9" y="7" width="2" height="5" fill="#FFF" />
                        <circle cx="10" cy="15" r="1" fill="#FFF" />
                    </g>
                `;
            }
            mapHazardsContainer.insertAdjacentHTML('beforeend', svgMarkup);
        });
    }

    /* ==========================================================================
       VEHICLE ROUTE ANIMATION FRAME LOOP
       ========================================================================== */
    function updateVehiclePosition(t) {
        if (!vehicleTrack || !vehicleMarker) return;
        
        try {
            const pathLength = vehicleTrack.getTotalLength();
            // Clamp t between 0 and 1
            const clampedT = Math.max(0, Math.min(1, t));
            
            const point = vehicleTrack.getPointAtLength(clampedT * pathLength);
            vehicleMarker.setAttribute('transform', `translate(${point.x}, ${point.y})`);

            // Compute angle of vehicle movement direction
            const pointAhead = vehicleTrack.getPointAtLength(Math.min(pathLength, (clampedT + 0.005) * pathLength));
            const angle = Math.atan2(pointAhead.y - point.y, pointAhead.x - point.x) * 180 / Math.PI;
            if (vehicleArrow) {
                vehicleArrow.setAttribute('transform', `rotate(${angle})`);
            }
        } catch (e) {
            // Path might not be fully loaded or rendered initially
        }
    }

    function animateVehicleMovement() {
        const mission = missionsDb[activeMissionId];
        
        // If transit is running, continue incrementing coordinates in a loop
        if (mission && mission.progress > 0 && mission.progress < 100) {
            animationProgress += 0.0004; // Animation speed along the route
            if (animationProgress > 0.98) {
                animationProgress = 0.1; // Loop back for mock demonstration
            }
            updateVehiclePosition(animationProgress);
            
            // Sync progress bar slightly with animation position
            const displayProg = Math.round(animationProgress * 100);
            detProgressPercent.textContent = `${displayProg}%`;
            detProgressBar.style.width = `${displayProg}%`;
        }
        
        animationFrameId = requestAnimationFrame(animateVehicleMovement);
    }

    // Start Animation Loop
    animateVehicleMovement();

    // Row selection event hook
    missionsTableBody.addEventListener('click', (e) => {
        const row = e.target.closest('.mission-row');
        if (row) {
            const missionId = row.getAttribute('data-mission-id');
            selectMission(missionId);
        }
    });

    /* ==========================================================================
       MODAL TRIGGERS
       ========================================================================== */
    function toggleModal(open) {
        if (open) {
            missionModal.classList.add('active');
        } else {
            missionModal.classList.remove('active');
            createMissionForm.reset();
        }
    }

    if (openMissionModalBtn) openMissionModalBtn.addEventListener('click', () => toggleModal(true));
    if (closeMissionModalBtn) closeMissionModalBtn.addEventListener('click', () => toggleModal(false));
    if (cancelMissionFormBtn) cancelMissionFormBtn.addEventListener('click', () => toggleModal(false));
    if (qaCreateMission) qaCreateMission.addEventListener('click', () => toggleModal(true));

    // Close on click overlay background
    missionModal.addEventListener('click', (e) => {
        if (e.target === missionModal) toggleModal(false);
    });

    /* ==========================================================================
       AI ROUTE CREATION FORM SUBMISSION
       ========================================================================== */
    if (createMissionForm) {
        createMissionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const mId = document.getElementById('missionId').value.toUpperCase().trim();
            const category = document.getElementById('missionCategory').value;
            const priority = document.getElementById('missionPriority').value;
            const origin = document.getElementById('startLocation').value;
            const dest = document.getElementById('endLocation').value;
            const vehicle = document.getElementById('vehicleReg').value.toUpperCase().trim();
            const cargo = document.getElementById('cargoManifest').value;

            // Generate icons mapping
            const iconMap = {
                'Medicine': 'shield-alert',
                'Food': 'shopping-bag',
                'Disaster Relief': 'flame',
                'Agriculture': 'leaf'
            };

            // Custom coordinates pathing based on routes
            let pathString = 'M 230,270 L 600,350'; // Fallback Guwahati to Imphal
            let routeHazards = [];

            if (origin === 'Guwahati' && dest === 'Imphal') {
                pathString = 'M 230,270 Q 280,285 360,310 T 480,345 Q 520,335 550,342 L 600,350';
                routeHazards = [{ type: 'rain', x: 515, y: 315 }, { type: 'landslide', x: 568, y: 328 }];
            } else if (origin === 'Silchar' && dest === 'Aizawl') {
                pathString = 'M 480,345 Q 510,375 550,405';
                routeHazards = [{ type: 'rain', x: 515, y: 375 }];
            } else if (origin === 'Jorhat' && dest === 'Tezpur') {
                pathString = 'M 490,225 L 380,210';
            } else if (origin === 'Dimapur' && dest === 'Kohima') {
                pathString = 'M 490,225 L 615,300';
            }

            // Create new record in db
            missionsDb[mId] = {
                id: mId,
                category: category,
                icon: iconMap[category] || 'briefcase',
                route: `${origin} → ${dest}`,
                origin: origin,
                destination: dest,
                vehicle: vehicle,
                cargo: cargo,
                priority: priority,
                risk: 'LOW RISK',
                riskClass: 'badge-success',
                progress: 10, // starts at 10%
                eta: '3h 15m',
                distance: '185 km',
                speed: 48,
                accessibility: '88/100',
                svgPath: pathString,
                hazards: routeHazards
            };

            // Append row to the table
            const tr = document.createElement('tr');
            tr.className = 'mission-row';
            tr.setAttribute('data-mission-id', mId);
            tr.innerHTML = `
                <td class="font-bold text-primary">${mId}</td>
                <td><span class="badge-category"><i data-lucide="${iconMap[category]}" class="category-icon"></i>${category}</span></td>
                <td class="font-semibold">${origin} → ${dest}</td>
                <td><span class="badge badge-success"><span class="dot"></span>In Transit</span></td>
                <td>3h 15m</td>
                <td><span class="score-indicator green">88/100</span></td>
                <td><button class="btn btn-icon btn-sm btn-ghost select-mission"><i data-lucide="eye"></i></button></td>
            `;

            // Insert new mission at top of list
            missionsTableBody.insertBefore(tr, missionsTableBody.firstChild);

            // Re-render Icons
            lucide.createIcons();

            // Toggle modal closed
            toggleModal(false);

            // Automatically focus/select the newly created route!
            selectMission(mId);

            // Update Active Missions Count KPI
            const activeKpi = document.getElementById('kpi-active-missions');
            if (activeKpi) {
                const currentCount = parseInt(activeKpi.textContent);
                activeKpi.textContent = String(currentCount + 1).padStart(2, '0');
            }
        });
    }

    /* ==========================================================================
       SIMULATE DYNAMIC SPEED FLUX
       ========================================================================== */
    speedFluctuationInterval = setInterval(() => {
        const activeMission = missionsDb[activeMissionId];
        if (activeMission && activeMission.progress > 0 && activeMission.progress < 100) {
            // Speed fluctuation
            const speedDiff = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const currentSpeedVal = activeMission.speed + speedDiff;
            detSpeed.textContent = `${Math.max(25, currentSpeedVal)} km/h`;

            // Distance decreases
            let currentDist = parseFloat(activeMission.distance);
            if (currentDist > 5) {
                currentDist = (currentDist - 0.1).toFixed(1);
                activeMission.distance = `${currentDist} km`;
                detDistance.textContent = activeMission.distance;
            }
        }
    }, 3000);

    /* ==========================================================================
       SIMULATE ACCESSIBILITY CHART ENHANCEMENT
       ========================================================================== */
    // SVG chart path drawing support (can animate stroke-dashoffset for a scan sweep)
    const trendLine = document.getElementById('trend-line-path');
    if (trendLine) {
        const length = trendLine.getTotalLength();
        trendLine.style.strokeDasharray = length;
        trendLine.style.strokeDashoffset = length;
        // Trigger reflow to initiate smooth CSS path reveal
        trendLine.getBoundingClientRect();
        trendLine.style.transition = 'stroke-dashoffset 2s ease-in-out';
        trendLine.style.strokeDashoffset = '0';
    }

    // Set tab listeners (Simulates switching modules)
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(tabItem => {
        tabItem.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tabItem.getAttribute('data-tab');
            
            // Remove active state
            document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el => el.classList.remove('active'));
            
            // Add active state to matching elements
            document.querySelectorAll(`[data-tab="${tabName}"]`).forEach(el => el.classList.add('active'));

            if (tabName !== 'home') {
                console.log(`Switched to module: ${tabName}`);
                // In a production app, we would load new views here
            }
        });
    });
});
