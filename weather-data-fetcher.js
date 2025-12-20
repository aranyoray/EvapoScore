/**
 * Weather Data Fetcher using Open-Meteo API
 * Fetches monthly historical data (past 5 years) for all cities
 * Open-Meteo provides free historical weather data
 */

class WeatherDataFetcher {
    constructor() {
        this.baseURL = 'https://archive-api.open-meteo.com/v1/archive';
        this.forecastURL = 'https://api.open-meteo.com/v1/forecast';
        this.cache = new Map();
    }

    /**
     * Get date range for past 5 years up to current month
     */
    getHistoricalDateRange() {
        const now = new Date();
        const endDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
        const startDate = new Date(endDate);
        startDate.setFullYear(startDate.getFullYear() - 5); // 5 years ago

        return {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        };
    }

    /**
     * Fetch historical monthly weather data for a city
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @param {string} cityName - City name for caching
     * @returns {Promise<Object>} Monthly aggregated weather data
     */
    async fetchHistoricalData(lat, lon, cityName) {
        const cacheKey = `${cityName}_${lat}_${lon}`;

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const dateRange = this.getHistoricalDateRange();

        const params = new URLSearchParams({
            latitude: lat.toFixed(4),
            longitude: lon.toFixed(4),
            start_date: dateRange.start,
            end_date: dateRange.end,
            daily: [
                'temperature_2m_mean',
                'temperature_2m_max',
                'temperature_2m_min',
                'relative_humidity_2m_mean',
                'wind_speed_10m_mean',
                'shortwave_radiation_sum'
            ].join(','),
            timezone: 'auto'
        });

        try {
            const response = await fetch(`${this.baseURL}?${params}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const monthlyData = this.aggregateToMonthly(data);

            this.cache.set(cacheKey, monthlyData);
            return monthlyData;
        } catch (error) {
            console.error(`Error fetching data for ${cityName}:`, error);
            return null;
        }
    }

    /**
     * Aggregate daily data to monthly averages
     */
    aggregateToMonthly(dailyData) {
        const monthly = {};

        const dates = dailyData.daily.time;
        const temps = dailyData.daily.temperature_2m_mean;
        const humidity = dailyData.daily.relative_humidity_2m_mean;
        const windSpeed = dailyData.daily.wind_speed_10m_mean;
        const solarRadiation = dailyData.daily.shortwave_radiation_sum;

        for (let i = 0; i < dates.length; i++) {
            const date = new Date(dates[i]);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthly[monthKey]) {
                monthly[monthKey] = {
                    temps: [],
                    humidity: [],
                    windSpeed: [],
                    solarRadiation: []
                };
            }

            if (temps[i] !== null) monthly[monthKey].temps.push(temps[i]);
            if (humidity[i] !== null) monthly[monthKey].humidity.push(humidity[i]);
            if (windSpeed[i] !== null) monthly[monthKey].windSpeed.push(windSpeed[i]);
            if (solarRadiation[i] !== null) monthly[monthKey].solarRadiation.push(solarRadiation[i]);
        }

        // Calculate averages
        const result = {};
        for (const [monthKey, values] of Object.entries(monthly)) {
            result[monthKey] = {
                avgTemp: this.average(values.temps),
                avgHumidity: this.average(values.humidity) / 100, // Convert to 0-1
                avgWindSpeed: this.average(values.windSpeed),
                avgSolarRadiation: this.average(values.solarRadiation) / 24 // Convert to W/m² (from Wh/m²/day)
            };
        }

        return result;
    }

    /**
     * Calculate array average
     */
    average(arr) {
        if (arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    /**
     * Batch fetch data for multiple cities with rate limiting
     */
    async fetchBatchData(cities, onProgress) {
        const results = [];
        const delay = 200; // 200ms delay between requests (5 req/sec to respect API limits)

        for (let i = 0; i < cities.length; i++) {
            const city = cities[i];

            if (onProgress) {
                onProgress(i + 1, cities.length, city.name);
            }

            const monthlyData = await this.fetchHistoricalData(
                city.lat,
                city.lon,
                city.name
            );

            if (monthlyData) {
                results.push({
                    ...city,
                    monthlyData: monthlyData
                });
            }

            // Rate limiting
            if (i < cities.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        return results;
    }
}

/**
 * AI Prediction Engine using simple time series forecasting
 * Uses seasonal decomposition and trend analysis
 */
class PowerPredictionEngine {
    constructor() {
        this.evapCalc = new EvaporationCalculator();
    }

    /**
     * Predict future monthly climate data using historical patterns
     * Uses seasonal averaging and linear trend extrapolation
     */
    predictFutureMonths(historicalMonthlyData, monthsAhead = 60) {
        const predictions = {};
        const months = Object.keys(historicalMonthlyData).sort();

        if (months.length < 12) {
            console.warn('Not enough historical data for accurate predictions');
            return predictions;
        }

        // Extract seasonal patterns (average for each month across years)
        const seasonalPatterns = this.extractSeasonalPatterns(historicalMonthlyData);

        // Calculate trends
        const trends = this.calculateTrends(historicalMonthlyData);

        // Generate future predictions
        const lastDate = new Date(months[months.length - 1] + '-01');

        for (let i = 1; i <= monthsAhead; i++) {
            const futureDate = new Date(lastDate);
            futureDate.setMonth(futureDate.getMonth() + i);

            const monthKey = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`;
            const monthOfYear = futureDate.getMonth(); // 0-11

            // Combine seasonal pattern with trend
            predictions[monthKey] = {
                avgTemp: seasonalPatterns.temp[monthOfYear] + (trends.temp * i),
                avgHumidity: Math.max(0.1, Math.min(0.95,
                    seasonalPatterns.humidity[monthOfYear] + (trends.humidity * i)
                )),
                avgWindSpeed: Math.max(0, seasonalPatterns.windSpeed[monthOfYear] + (trends.windSpeed * i)),
                avgSolarRadiation: Math.max(0, seasonalPatterns.solarRadiation[monthOfYear] + (trends.solarRadiation * i)),
                isPredicted: true
            };
        }

        return predictions;
    }

    /**
     * Extract seasonal patterns (average for each month)
     */
    extractSeasonalPatterns(monthlyData) {
        const patterns = {
            temp: new Array(12).fill(0).map(() => []),
            humidity: new Array(12).fill(0).map(() => []),
            windSpeed: new Array(12).fill(0).map(() => []),
            solarRadiation: new Array(12).fill(0).map(() => [])
        };

        for (const [monthKey, data] of Object.entries(monthlyData)) {
            const month = parseInt(monthKey.split('-')[1]) - 1; // 0-11

            patterns.temp[month].push(data.avgTemp);
            patterns.humidity[month].push(data.avgHumidity);
            patterns.windSpeed[month].push(data.avgWindSpeed);
            patterns.solarRadiation[month].push(data.avgSolarRadiation);
        }

        // Average each month
        return {
            temp: patterns.temp.map(arr => arr.reduce((a, b) => a + b, 0) / arr.length),
            humidity: patterns.humidity.map(arr => arr.reduce((a, b) => a + b, 0) / arr.length),
            windSpeed: patterns.windSpeed.map(arr => arr.reduce((a, b) => a + b, 0) / arr.length),
            solarRadiation: patterns.solarRadiation.map(arr => arr.reduce((a, b) => a + b, 0) / arr.length)
        };
    }

    /**
     * Calculate linear trends
     */
    calculateTrends(monthlyData) {
        const months = Object.keys(monthlyData).sort();
        const values = months.map(key => monthlyData[key]);

        return {
            temp: this.linearTrend(values.map(v => v.avgTemp)),
            humidity: this.linearTrend(values.map(v => v.avgHumidity)),
            windSpeed: this.linearTrend(values.map(v => v.avgWindSpeed)),
            solarRadiation: this.linearTrend(values.map(v => v.avgSolarRadiation))
        };
    }

    /**
     * Simple linear regression trend
     */
    linearTrend(values) {
        const n = values.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += values[i];
            sumXY += i * values[i];
            sumXX += i * i;
        }

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    }

    /**
     * Calculate monthly power output from climate data
     */
    calculateMonthlyPower(monthlyClimateData) {
        const monthlyPower = {};

        for (const [monthKey, climate] of Object.entries(monthlyClimateData)) {
            const power = this.evapCalc.estimatePowerFromClimateaverages(climate);
            monthlyPower[monthKey] = {
                power: power,
                climate: climate,
                isPredicted: climate.isPredicted || false
            };
        }

        return monthlyPower;
    }
}

// Global instances
const weatherFetcher = new WeatherDataFetcher();
const predictionEngine = new PowerPredictionEngine();
