/**
 * Enhanced Map with Monthly Data and Time Slider
 * - Monthly historical data (past 5 years)
 * - AI predictions (future 5 years)
 * - Interactive time slider
 * - Country heatmaps
 */

let map;
let citiesWithMonthlyData = [];
let currentTimeIndex = 0;
let timelineMonths = [];
let markers = [];
let heatmapLayer = null;
let currentPopup = null;

/**
 * Initialize the enhanced map
 */
async function initEnhancedMap() {
    // Initialize MapLibre
    map = new maplibregl.Map({
        container: 'map',
        style: 'https://demotiles.maplibre.org/style.json',
        center: [20, 20],
        zoom: 2,
        maxZoom: 18,
        minZoom: 1
    });

    map.on('load', async () => {
        console.log('Map loaded, starting data collection...');
        await loadEnhancedCitiesData();
    });
}

/**
 * Load cities data with monthly historical + predicted data
 */
async function loadEnhancedCitiesData() {
    const loadingEl = document.getElementById('loading');
    loadingEl.style.display = 'flex';

    try {
        // Step 1: Select top 5 cities per country
        loadingEl.querySelector('p').textContent = 'Selecting top cities per country...';
        const selectedCities = selectTopCitiesPerCountry(capitalCities, 5);

        console.log(`Selected ${selectedCities.length} cities`);

        // Step 2: Fetch historical monthly data for all cities
        loadingEl.querySelector('p').textContent = 'Fetching historical weather data (this may take a few minutes)...';

        const citiesWithHistory = await weatherFetcher.fetchBatchData(
            selectedCities,
            (current, total, cityName) => {
                loadingEl.querySelector('p').textContent =
                    `Fetching weather data: ${cityName} (${current}/${total})...`;
            }
        );

        console.log(`Fetched historical data for ${citiesWithHistory.length} cities`);

        // Step 3: Generate AI predictions for future 5 years
        loadingEl.querySelector('p').textContent = 'Generating AI predictions for future climate...';

        for (let i = 0; i < citiesWithHistory.length; i++) {
            const city = citiesWithHistory[i];

            if (city.monthlyData) {
                // Predict future 60 months (5 years)
                const predictions = predictionEngine.predictFutureMonths(city.monthlyData, 60);

                // Combine historical and predicted
                city.monthlyData = { ...city.monthlyData, ...predictions };

                // Calculate monthly power for all months
                city.monthlyPower = predictionEngine.calculateMonthlyPower(city.monthlyData);
            }

            if (i % 10 === 0) {
                loadingEl.querySelector('p').textContent =
                    `Generating predictions: ${i + 1}/${citiesWithHistory.length}...`;
            }
        }

        citiesWithMonthlyData = citiesWithHistory;

        // Step 4: Build timeline
        buildTimeline();

        // Step 5: Initialize visualization at current month
        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        currentTimeIndex = timelineMonths.findIndex(m => m.key === currentMonthKey);

        if (currentTimeIndex === -1) {
            currentTimeIndex = Math.floor(timelineMonths.length / 2); // Middle of timeline
        }

        // Step 6: Render initial visualization
        loadingEl.style.display = 'none';
        renderMapForMonth(currentTimeIndex);
        updateTimeSlider();
        updateStatistics();

    } catch (error) {
        console.error('Error loading enhanced data:', error);
        loadingEl.querySelector('p').textContent = 'Error loading data. Please refresh the page.';
    }
}

/**
 * Build timeline array with all months (past 5 years + future 5 years)
 */
function buildTimeline() {
    const monthSet = new Set();

    // Collect all unique months from all cities
    for (const city of citiesWithMonthlyData) {
        if (city.monthlyPower) {
            for (const monthKey of Object.keys(city.monthlyPower)) {
                monthSet.add(monthKey);
            }
        }
    }

    // Sort chronologically
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

    console.log(`Timeline: ${timelineMonths.length} months (${sortedMonths[0]} to ${sortedMonths[sortedMonths.length - 1]})`);
}

/**
 * Render map visualization for a specific month
 */
function renderMapForMonth(monthIndex) {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];

    if (currentPopup) {
        currentPopup.remove();
        currentPopup = null;
    }

    const monthData = timelineMonths[monthIndex];
    const monthKey = monthData.key;

    // Collect power data for this month
    const citiesThisMonth = [];

    for (const city of citiesWithMonthlyData) {
        if (city.monthlyPower && city.monthlyPower[monthKey]) {
            const powerData = city.monthlyPower[monthKey];

            citiesThisMonth.push({
                ...city,
                power: powerData.power,
                climate: powerData.climate,
                isPredicted: powerData.isPredicted,
                category: evapCalc.getPowerCategory(powerData.power)
            });
        }
    }

    // Sort by power
    citiesThisMonth.sort((a, b) => b.power - a.power);

    // Add markers for each city
    for (const city of citiesThisMonth) {
        addCityMarker(city);
    }

    // Update heatmap
    updateHeatmap(citiesThisMonth, monthKey);

    // Update info panel
    updateInfoPanel(citiesThisMonth, monthData);
}

/**
 * Add marker for a city
 */
function addCityMarker(city) {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundColor = city.category.color;
    el.style.width = '12px';
    el.style.height = '12px';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
    el.style.transition = 'all 0.2s ease';

    if (city.isPredicted) {
        el.style.borderStyle = 'dashed';
        el.style.opacity = '0.8';
    }

    // Create popup
    const popupContent = createPopupContent(city);

    const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: '350px'
    }).setHTML(popupContent);

    // Hover interactions
    let hoverTimeout;

    el.addEventListener('mouseenter', () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }

        el.style.transform = 'scale(1.8)';
        el.style.zIndex = '1000';
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.6)';

        popup.setLngLat([city.lon, city.lat]).addTo(map);
        currentPopup = popup;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '';
        el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';

        hoverTimeout = setTimeout(() => {
            if (currentPopup === popup) {
                popup.remove();
                currentPopup = null;
            }
        }, 300);
    });

    const marker = new maplibregl.Marker({ element: el })
        .setLngLat([city.lon, city.lat])
        .addTo(map);

    markers.push(marker);
}

/**
 * Create popup content HTML
 */
function createPopupContent(city) {
    const predictionBadge = city.isPredicted ? `
        <div style="background: rgba(255, 165, 0, 0.2); padding: 6px; border-radius: 4px; margin-bottom: 8px; border: 1px solid rgba(255, 165, 0, 0.5);">
            <p style="margin: 0; font-size: 11px; color: #ffa500; font-weight: bold;">🔮 AI Predicted Data</p>
        </div>
    ` : '';

    const measuredDataSection = city.measuredData ? `
        <div style="background: rgba(255, 215, 0, 0.1); padding: 8px; border-radius: 6px; margin-bottom: 8px; border: 1px solid rgba(255, 215, 0, 0.3);">
            <p style="margin: 3px 0; font-size: 11px; color: #ffd700; font-weight: bold;">📊 ${city.measuredData.source}</p>
        </div>
    ` : '';

    return `
        <div style="min-width: 280px;">
            <h3 style="margin-bottom: 10px; font-size: 16px; border-bottom: 2px solid ${city.category.color}; padding-bottom: 6px;">
                ${city.name}, ${city.country}
            </h3>
            ${predictionBadge}
            ${measuredDataSection}
            <div style="background: rgba(102, 126, 234, 0.1); padding: 8px; border-radius: 6px; margin-bottom: 8px;">
                <p style="margin: 4px 0; font-size: 14px;"><strong>Power:</strong> <span style="color: ${city.category.color}; font-weight: bold;">${city.power.toFixed(1)} W/m²</span></p>
                <p style="margin: 4px 0; font-size: 12px;"><strong>Rating:</strong> ${city.category.label}</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
                <p>🌡️ ${city.climate.avgTemp.toFixed(1)}°C</p>
                <p>💧 ${(city.climate.avgHumidity * 100).toFixed(0)}%</p>
                <p>💨 ${city.climate.avgWindSpeed.toFixed(1)} m/s</p>
                <p>☀️ ${city.climate.avgSolarRadiation.toFixed(0)} W/m²</p>
            </div>
        </div>
    `;
}

/**
 * Update heatmap layer
 */
function updateHeatmap(cities, monthKey) {
    // Create GeoJSON for heatmap
    const features = cities.map(city => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [city.lon, city.lat]
        },
        properties: {
            power: city.power,
            name: city.name
        }
    }));

    const geojson = {
        type: 'FeatureCollection',
        features: features
    };

    // Remove existing heatmap layer
    if (map.getLayer('heatmap-layer')) {
        map.removeLayer('heatmap-layer');
    }

    if (map.getSource('heatmap-data')) {
        map.removeSource('heatmap-data');
    }

    // Add new heatmap
    map.addSource('heatmap-data', {
        type: 'geojson',
        data: geojson
    });

    map.addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: 'heatmap-data',
        paint: {
            'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'power'],
                0, 0,
                300, 1
            ],
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 0.5,
                9, 1
            ],
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(33,102,172,0)',
                0.2, 'rgb(103,169,207)',
                0.4, 'rgb(209,229,240)',
                0.6, 'rgb(253,219,199)',
                0.8, 'rgb(239,138,98)',
                1, 'rgb(178,24,43)'
            ],
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 20,
                9, 40
            ],
            'heatmap-opacity': 0.7
        }
    }, 'waterway');
}

/**
 * Update info panel statistics
 */
function updateInfoPanel(cities, monthData) {
    const avgPower = cities.reduce((sum, c) => sum + c.power, 0) / cities.length;
    const bestCity = cities[0];

    document.getElementById('cityCount').textContent = cities.length;
    document.getElementById('avgPower').textContent = avgPower.toFixed(1);
    document.getElementById('bestCity').textContent = `${bestCity.name} (${bestCity.power.toFixed(1)} W/m²)`;

    // Update month label
    const monthLabel = document.getElementById('currentMonthLabel');
    if (monthLabel) {
        monthLabel.textContent = monthData.label + (monthData.isPredicted ? ' (Predicted)' : '');
        monthLabel.style.color = monthData.isPredicted ? '#ffa500' : '#667eea';
    }
}

/**
 * Update time slider position
 */
function updateTimeSlider() {
    const slider = document.getElementById('timeSlider');
    if (slider) {
        slider.value = currentTimeIndex;
        slider.max = timelineMonths.length - 1;
    }
}

/**
 * Handle time slider change
 */
function onTimeSliderChange(value) {
    currentTimeIndex = parseInt(value);
    renderMapForMonth(currentTimeIndex);
}

/**
 * Navigate timeline
 */
function previousMonth() {
    if (currentTimeIndex > 0) {
        currentTimeIndex--;
        renderMapForMonth(currentTimeIndex);
        updateTimeSlider();
    }
}

function nextMonth() {
    if (currentTimeIndex < timelineMonths.length - 1) {
        currentTimeIndex++;
        renderMapForMonth(currentTimeIndex);
        updateTimeSlider();
    }
}

function jumpToNow() {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const index = timelineMonths.findIndex(m => m.key === currentMonthKey);

    if (index !== -1) {
        currentTimeIndex = index;
        renderMapForMonth(currentTimeIndex);
        updateTimeSlider();
    }
}

/**
 * Update global statistics
 */
function updateStatistics() {
    // Calculate overall statistics across all time periods
    console.log('Statistics updated');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initEnhancedMap();
});
