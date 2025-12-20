/**
 * US County Energy Map
 * Features:
 * - County-level percentile-based green gradient
 * - Three modes: All, Renewable, Non-Renewable
 * - EvaDemand, EvaSupply, EvaDeficit, EvaPrice metrics
 * - 10-year timeline (5 past + 5 future)
 * - Recommendations per county
 */

let map;
let currentMode = 'all'; // 'all', 'renewable', 'nonrenewable'
let currentTimeIndex = 0;
let timelineMonths = [];
let countyData = {};
let countiesGeoJSON = null;

/**
 * Initialize US County Map
 */
async function initUSCountyMap() {
    // Initialize MapLibre with professional Carto Positron style
    map = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            sources: {
                'carto-light': {
                    type: 'raster',
                    tiles: [
                        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                        'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
                    ],
                    tileSize: 256,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                }
            },
            layers: [
                {
                    id: 'carto-light-layer',
                    type: 'raster',
                    source: 'carto-light',
                    minzoom: 0,
                    maxzoom: 22
                }
            ]
        },
        center: [-98.5795, 39.8283], // Geographic center of US
        zoom: 4,
        maxZoom: 10,
        minZoom: 3
    });

    map.on('load', async () => {
        console.log('Map loaded, loading county data...');
        await loadUSCountyData();
    });
}

/**
 * Load US county data and energy analysis
 */
async function loadUSCountyData() {
    const loadingEl = document.getElementById('loading');
    loadingEl.style.display = 'flex';

    try {
        // Step 1: Load county boundaries GeoJSON
        loadingEl.querySelector('p').textContent = 'Loading US county boundaries...';
        countiesGeoJSON = await fetch('https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json')
            .then(res => res.json());

        console.log(`Loaded ${countiesGeoJSON.features.length} counties`);

        // Step 2: Load sample county data (in production: fetch from census API)
        loadingEl.querySelector('p').textContent = 'Loading county demographics...';
        const counties = await loadCountyDemographics();

        // Step 3: Fetch state-level energy data and disaggregate
        loadingEl.querySelector('p').textContent = 'Fetching energy generation data...';
        const dateRange = getDateRange();

        // For demo: Process top 100 most populous counties
        const topCounties = counties.sort((a, b) => b.population - a.population).slice(0, 100);

        // Step 4: Calculate energy metrics for each county
        loadingEl.querySelector('p').textContent = 'Calculating energy metrics...';

        for (let i = 0; i < topCounties.length; i++) {
            const county = topCounties[i];

            loadingEl.querySelector('p').textContent = `Analyzing ${county.name} (${i + 1}/${topCounties.length})...`;

            // Get state-level generation data
            const stateGeneration = await eiaFetcher.fetchStateGeneration(
                county.state,
                dateRange.start,
                dateRange.end
            );

            // Calculate county-specific metrics for each month
            county.monthlyMetrics = {};

            for (const [month, stateData] of Object.entries(stateGeneration)) {
                // EvaDemand: Estimate county demand
                const demand = demandEstimator.estimateCountyDemand(county, month);

                // EvaSupply: Distribute state supply to county (population-weighted)
                const populationWeight = county.population / county.statePopulation;
                const supply = {
                    coal: stateData.coal * populationWeight,
                    gas: stateData.gas * populationWeight,
                    nuclear: stateData.nuclear * populationWeight,
                    solar: stateData.solar * populationWeight,
                    wind: stateData.wind * populationWeight,
                    hydro: stateData.hydro * populationWeight,
                    geothermal: stateData.geothermal * populationWeight,
                    oil: stateData.oil * populationWeight,
                    renewable: stateData.renewable * populationWeight,
                    nonRenewable: stateData.nonRenewable * populationWeight,
                    total: stateData.total * populationWeight
                };

                // Add evaporation engine potential
                if (county.climate) {
                    const evapPower = evapCalc.estimatePowerFromClimateaverages(county.climate);
                    // Convert to MWh/month (assume 10% efficiency, 1000 km² deployment)
                    const evapSupply = (evapPower * 1000 * 1000 * 24 * 30 * 0.1) / 1000000; // MWh
                    supply.evaporation = evapSupply;
                    supply.renewable += evapSupply;
                    supply.total += evapSupply;
                }

                // EvaDeficit: Calculate shortfall
                const deficit = demand - supply.total;

                // EvaPrice: Calculate pricing
                const pricing = pricePredictor.calculatePrice(county, supply, demand, month);

                // Recommendations
                const recommendations = recommendationEngine.generateRecommendations(
                    county,
                    supply,
                    demand,
                    deficit
                );

                county.monthlyMetrics[month] = {
                    demand: demand,
                    supply: supply,
                    deficit: deficit,
                    price: pricing.price,
                    pricingFactors: pricing.factors,
                    recommendations: recommendations
                };
            }

            countyData[county.fips] = county;
        }

        // Step 5: Build timeline
        buildTimeline();

        // Step 6: Set initial view to current month
        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        currentTimeIndex = timelineMonths.findIndex(m => m.key === currentMonthKey);

        if (currentTimeIndex === -1) {
            currentTimeIndex = Math.floor(timelineMonths.length / 2);
        }

        // Step 7: Render map
        loadingEl.style.display = 'none';
        renderCountyMap();
        updateModeButtons();
        updateTimeSlider();

    } catch (error) {
        console.error('Error loading county data:', error);
        loadingEl.querySelector('p').textContent = 'Error loading data. Please refresh.';
    }
}

/**
 * Load county demographics from usCounties dataset
 */
async function loadCountyDemographics() {
    // Use the comprehensive US counties dataset
    // Add climate estimates for each county
    return usCounties.map(county => ({
        fips: county.fips,
        name: county.county,
        city: county.city,
        state: county.stateAbbr,
        statePopulation: county.statePopulation,
        population: county.countyPop,
        cityPopulation: county.population,
        lat: county.lat,
        lon: county.lon,
        climate: estimateClimateForCounty(county)
    }));
}

/**
 * Estimate climate parameters for a county based on location
 */
function estimateClimateForCounty(county) {
    const lat = county.lat;
    const lon = county.lon;

    // Base estimates by latitude
    let avgTemp = 15 - (Math.abs(lat) - 35) * 0.6; // Cooler at higher latitudes
    let avgHumidity = 0.65;
    let avgWindSpeed = 3.5;
    let avgSolarRadiation = 200;

    // Regional adjustments
    // Southwest (AZ, NM, NV, southern CA)
    if (['AZ', 'NM', 'NV'].includes(county.state) ||
        (county.state === 'CA' && lat < 36)) {
        avgTemp += 5;
        avgHumidity -= 0.25;
        avgSolarRadiation += 60;
    }

    // Southeast (humid subtropical)
    if (['FL', 'GA', 'SC', 'AL', 'MS', 'LA'].includes(county.state)) {
        avgTemp += 8;
        avgHumidity += 0.15;
        avgSolarRadiation += 20;
    }

    // Great Plains (high solar, moderate wind)
    if (['ND', 'SD', 'NE', 'KS', 'OK'].includes(county.state)) {
        avgTemp -= 2;
        avgHumidity -= 0.10;
        avgWindSpeed += 1.5;
        avgSolarRadiation += 30;
    }

    // Texas (varies)
    if (county.state === 'TX') {
        if (lat < 31) { // South Texas
            avgTemp += 6;
            avgHumidity += 0.05;
        }
        avgSolarRadiation += 25;
    }

    // Pacific Northwest (cloudy, mild)
    if (['WA', 'OR'].includes(county.state)) {
        avgTemp -= 3;
        avgHumidity += 0.10;
        avgSolarRadiation -= 60;
        avgWindSpeed += 0.5;
    }

    // Mountain states (high elevation, low humidity)
    if (['CO', 'UT', 'WY', 'MT', 'ID'].includes(county.state)) {
        avgTemp -= 5;
        avgHumidity -= 0.15;
        avgSolarRadiation += 40;
    }

    // Northeast (four seasons)
    if (['NY', 'PA', 'NJ', 'MA', 'CT', 'RI', 'VT', 'NH', 'ME'].includes(county.state)) {
        avgTemp -= 5;
        avgWindSpeed += 0.8;
        avgSolarRadiation -= 30;
    }

    // Coastal adjustments
    if (Math.abs(lon) > 80 && (lon < -70 || lon > -125)) { // Near coasts
        avgHumidity += 0.08;
        avgWindSpeed += 1.2;
    }

    return {
        avgTemp: Math.max(-10, Math.min(35, avgTemp)),
        avgHumidity: Math.max(0.2, Math.min(0.9, avgHumidity)),
        avgWindSpeed: Math.max(1, Math.min(8, avgWindSpeed)),
        avgSolarRadiation: Math.max(100, Math.min(320, avgSolarRadiation))
    };
}

/**
 * Get date range (5 years past to 5 years future)
 */
function getDateRange() {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setFullYear(startDate.getFullYear() - 5);

    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 5);

    return {
        start: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`,
        end: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`
    };
}

/**
 * Build timeline from all months
 */
function buildTimeline() {
    const monthSet = new Set();

    for (const county of Object.values(countyData)) {
        if (county.monthlyMetrics) {
            for (const month of Object.keys(county.monthlyMetrics)) {
                monthSet.add(month);
            }
        }
    }

    const sortedMonths = Array.from(monthSet).sort();

    timelineMonths = sortedMonths.map(key => {
        const [year, month] = key.split('-').map(Number);
        const date = new Date(year, month - 1, 1);

        return {
            key: key,
            date: date,
            label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            isPredicted: date > new Date()
        };
    });

    console.log(`Timeline: ${timelineMonths.length} months`);
}

/**
 * Render county choropleth map
 */
function renderCountyMap() {
    const monthData = timelineMonths[currentTimeIndex];
    const monthKey = monthData.key;

    // Calculate percentiles for current month and mode
    const values = [];
    for (const county of Object.values(countyData)) {
        if (county.monthlyMetrics && county.monthlyMetrics[monthKey]) {
            const metrics = county.monthlyMetrics[monthKey];
            let value;

            if (currentMode === 'renewable') {
                value = metrics.supply.renewable;
            } else if (currentMode === 'nonrenewable') {
                value = metrics.supply.nonRenewable;
            } else {
                value = metrics.supply.total;
            }

            values.push(value);
        }
    }

    // Calculate percentiles for color mapping
    values.sort((a, b) => a - b);
    const percentiles = {
        p10: values[Math.floor(values.length * 0.1)] || 0,
        p25: values[Math.floor(values.length * 0.25)] || 0,
        p50: values[Math.floor(values.length * 0.5)] || 0,
        p75: values[Math.floor(values.length * 0.75)] || 0,
        p90: values[Math.floor(values.length * 0.9)] || 0,
        max: values[values.length - 1] || 1000
    };

    // Add county data to GeoJSON features
    const enhancedGeoJSON = {
        ...countiesGeoJSON,
        features: countiesGeoJSON.features.map(feature => {
            const fips = feature.id;
            const county = countyData[fips];

            let supplyValue = 0;
            if (county && county.monthlyMetrics && county.monthlyMetrics[monthKey]) {
                const metrics = county.monthlyMetrics[monthKey];

                if (currentMode === 'renewable') {
                    supplyValue = metrics.supply.renewable;
                } else if (currentMode === 'nonrenewable') {
                    supplyValue = metrics.supply.nonRenewable;
                } else {
                    supplyValue = metrics.supply.total;
                }
            }

            return {
                ...feature,
                properties: {
                    ...feature.properties,
                    supply: supplyValue,
                    countyData: county
                }
            };
        })
    };

    // Remove existing layers
    if (map.getLayer('county-fill')) {
        map.removeLayer('county-fill');
    }
    if (map.getLayer('county-outline')) {
        map.removeLayer('county-outline');
    }
    if (map.getSource('counties')) {
        map.removeSource('counties');
    }

    // Add county source
    map.addSource('counties', {
        type: 'geojson',
        data: enhancedGeoJSON
    });

    // Add county fill layer with green gradient
    map.addLayer({
        id: 'county-fill',
        type: 'fill',
        source: 'counties',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'supply'],
                0, '#f7fcf5',              // Very light green (0-10th percentile)
                percentiles.p10, '#e5f5e0', // Light green
                percentiles.p25, '#c7e9c0', // Light-medium green
                percentiles.p50, '#a1d99b', // Medium green
                percentiles.p75, '#74c476', // Medium-dark green
                percentiles.p90, '#41ab5d', // Dark green
                percentiles.max, '#006d2c'  // Very dark green (90-100th percentile)
            ],
            'fill-opacity': 0.8
        }
    });

    // Add county outline
    map.addLayer({
        id: 'county-outline',
        type: 'line',
        source: 'counties',
        paint: {
            'line-color': '#555',
            'line-width': 0.5,
            'line-opacity': 0.3
        }
    });

    // Add click handler for county popups
    map.on('click', 'county-fill', (e) => {
        if (e.features.length > 0) {
            const feature = e.features[0];
            const county = feature.properties.countyData;

            if (county) {
                showCountyPopup(county, monthKey, e.lngLat);
            }
        }
    });

    // Change cursor on hover
    map.on('mouseenter', 'county-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'county-fill', () => {
        map.getCanvas().style.cursor = '';
    });

    updateInfoPanel(monthData);
}

/**
 * Show detailed county popup
 */
function showCountyPopup(county, monthKey, lngLat) {
    const metrics = county.monthlyMetrics[monthKey];

    if (!metrics) return;

    // Calculate per capita values (MWh to kWh conversion: × 1000)
    const perCapitaDemand = (metrics.demand * 1000 / county.population).toFixed(1);
    const perCapitaSupply = (metrics.supply.total * 1000 / county.population).toFixed(1);
    const perCapitaDeficit = (metrics.deficit * 1000 / county.population).toFixed(1);

    const popupHTML = `
        <div style="min-width: 350px; max-width: 450px;">
            <h3 style="margin-bottom: 12px; font-size: 18px; color: #006d2c; border-bottom: 2px solid #006d2c; padding-bottom: 8px;">
                ${county.name} County, ${county.state}
            </h3>
            <p style="font-size: 11px; color: #666; margin-bottom: 10px;">Population: ${county.population.toLocaleString()}</p>

            <div style="background: rgba(0, 109, 44, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">Energy Metrics (Per Capita)</h4>
                <p style="margin: 4px 0; font-size: 13px;"><strong>EvaDemand:</strong> ${metrics.demand.toFixed(0)} MWh/month <span style="color: #666;">(${perCapitaDemand} kWh/person/mo)</span></p>
                <p style="margin: 4px 0; font-size: 13px;"><strong>EvaSupply:</strong> ${metrics.supply.total.toFixed(0)} MWh/month <span style="color: #666;">(${perCapitaSupply} kWh/person/mo)</span></p>
                <p style="margin: 4px 0; font-size: 13px;"><strong>EvaDeficit:</strong> <span style="color: ${metrics.deficit > 0 ? '#d73027' : '#1a9850'};">${metrics.deficit > 0 ? '+' : ''}${metrics.deficit.toFixed(0)} MWh/month</span> <span style="color: #666;">(${perCapitaDeficit > 0 ? '+' : ''}${perCapitaDeficit} kWh/person/mo)</span></p>
                <p style="margin: 4px 0; font-size: 13px;"><strong>EvaPrice:</strong> $${metrics.price.toFixed(2)}/kWh</p>
            </div>

            <div style="background: rgba(102, 126, 234, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">Current Capacity</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px;">
                    <p>☀️ Solar: ${metrics.supply.solar.toFixed(0)} MWh</p>
                    <p>💨 Wind: ${metrics.supply.wind.toFixed(0)} MWh</p>
                    <p>⚛️ Nuclear: ${metrics.supply.nuclear.toFixed(0)} MWh</p>
                    <p>🔥 Gas: ${metrics.supply.gas.toFixed(0)} MWh</p>
                    <p>💧 Hydro: ${metrics.supply.hydro.toFixed(0)} MWh</p>
                    <p>🌋 Geo: ${metrics.supply.geothermal.toFixed(0)} MWh</p>
                </div>
            </div>

            <div style="background: rgba(255, 165, 0, 0.1); padding: 12px; border-radius: 8px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">💡 Recommendations</h4>
                ${metrics.recommendations.map(rec => `
                    <p style="margin: 6px 0; font-size: 12px; line-height: 1.4;">${rec.message}</p>
                `).join('')}
            </div>
        </div>
    `;

    new maplibregl.Popup()
        .setLngLat(lngLat)
        .setHTML(popupHTML)
        .addTo(map);
}

/**
 * Update info panel
 */
function updateInfoPanel(monthData) {
    document.getElementById('currentMonthLabel').textContent = monthData.label + (monthData.isPredicted ? ' (Predicted)' : '');
    document.getElementById('currentMode').textContent = currentMode.toUpperCase();
}

/**
 * Switch visualization mode
 */
function switchMode(mode) {
    currentMode = mode;
    renderCountyMap();
    updateModeButtons();
}

/**
 * Update mode button styles
 */
function updateModeButtons() {
    ['all', 'renewable', 'nonrenewable'].forEach(mode => {
        const btn = document.getElementById(`mode-${mode}`);
        if (btn) {
            if (mode === currentMode) {
                btn.style.background = '#006d2c';
                btn.style.color = 'white';
            } else {
                btn.style.background = 'rgba(0, 109, 44, 0.2)';
                btn.style.color = '#006d2c';
            }
        }
    });
}

/**
 * Time navigation
 */
function onTimeSliderChange(value) {
    currentTimeIndex = parseInt(value);
    renderCountyMap();
}

function previousMonth() {
    if (currentTimeIndex > 0) {
        currentTimeIndex--;
        renderCountyMap();
        updateTimeSlider();
    }
}

function nextMonth() {
    if (currentTimeIndex < timelineMonths.length - 1) {
        currentTimeIndex++;
        renderCountyMap();
        updateTimeSlider();
    }
}

function jumpToNow() {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const index = timelineMonths.findIndex(m => m.key === currentMonthKey);

    if (index !== -1) {
        currentTimeIndex = index;
        renderCountyMap();
        updateTimeSlider();
    }
}

function updateTimeSlider() {
    const slider = document.getElementById('timeSlider');
    if (slider) {
        slider.value = currentTimeIndex;
        slider.max = timelineMonths.length - 1;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initUSCountyMap();
});
