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
    // Initialize MapLibre
    map = new maplibregl.Map({
        container: 'map',
        style: 'https://demotiles.maplibre.org/style.json',
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
 * Load county demographics (simplified - in production: use Census API)
 */
async function loadCountyDemographics() {
    // Sample data for major counties
    // In production: fetch from census.gov API
    const sampleCounties = [
        { fips: '06037', name: 'Los Angeles', state: 'CA', statePopulation: 39500000, population: 10040000, climate: { avgTemp: 18, avgHumidity: 0.65, avgWindSpeed: 3.5, avgSolarRadiation: 220 } },
        { fips: '17031', name: 'Cook', state: 'IL', statePopulation: 12700000, population: 5150000, climate: { avgTemp: 10, avgHumidity: 0.7, avgWindSpeed: 4.2, avgSolarRadiation: 160 } },
        { fips: '48201', name: 'Harris', state: 'TX', statePopulation: 29000000, population: 4700000, climate: { avgTemp: 21, avgHumidity: 0.72, avgWindSpeed: 3.8, avgSolarRadiation: 210 } },
        { fips: '04013', name: 'Maricopa', state: 'AZ', statePopulation: 7279000, population: 4485000, climate: { avgTemp: 23, avgHumidity: 0.35, avgWindSpeed: 3.2, avgSolarRadiation: 280 } },
        { fips: '06073', name: 'San Diego', state: 'CA', statePopulation: 39500000, population: 3338000, climate: { avgTemp: 17, avgHumidity: 0.68, avgWindSpeed: 3.1, avgSolarRadiation: 230 } },
        { fips: '12086', name: 'Miami-Dade', state: 'FL', statePopulation: 21500000, population: 2717000, climate: { avgTemp: 25, avgHumidity: 0.75, avgWindSpeed: 4.5, avgSolarRadiation: 240 } },
        { fips: '36047', name: 'Kings', state: 'NY', statePopulation: 19500000, population: 2560000, climate: { avgTemp: 13, avgHumidity: 0.68, avgWindSpeed: 4.8, avgSolarRadiation: 165 } },
        { fips: '36061', name: 'New York', state: 'NY', statePopulation: 19500000, population: 1630000, climate: { avgTemp: 13, avgHumidity: 0.68, avgWindSpeed: 5.1, avgSolarRadiation: 165 } },
        { fips: '06059', name: 'Orange', state: 'CA', statePopulation: 39500000, population: 3170000, climate: { avgTemp: 18, avgHumidity: 0.67, avgWindSpeed: 3.3, avgSolarRadiation: 225 } },
        { fips: '48113', name: 'Dallas', state: 'TX', statePopulation: 29000000, population: 2620000, climate: { avgTemp: 19, avgHumidity: 0.64, avgWindSpeed: 4.1, avgSolarRadiation: 205 } }
    ];

    return sampleCounties;
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

    const popupHTML = `
        <div style="min-width: 350px; max-width: 450px;">
            <h3 style="margin-bottom: 12px; font-size: 18px; color: #006d2c; border-bottom: 2px solid #006d2c; padding-bottom: 8px;">
                ${county.name} County, ${county.state}
            </h3>

            <div style="background: rgba(0, 109, 44, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">Energy Metrics</h4>
                <p style="margin: 4px 0; font-size: 13px;"><strong>EvaDemand:</strong> ${metrics.demand.toFixed(0)} MWh/month</p>
                <p style="margin: 4px 0; font-size: 13px;"><strong>EvaSupply:</strong> ${metrics.supply.total.toFixed(0)} MWh/month</p>
                <p style="margin: 4px 0; font-size: 13px;"><strong>EvaDeficit:</strong> <span style="color: ${metrics.deficit > 0 ? '#d73027' : '#1a9850'};">${metrics.deficit > 0 ? '+' : ''}${metrics.deficit.toFixed(0)} MWh/month</span></p>
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
