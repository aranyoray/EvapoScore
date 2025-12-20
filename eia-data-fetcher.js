/**
 * EIA Data Fetcher - US Energy Information Administration API
 * Fetches state-level energy generation, consumption, and pricing data
 * Disaggregates to county level using population/economic weights
 */

class EIADataFetcher {
    constructor() {
        // EIA Open Data API v2
        this.baseURL = 'https://api.eia.gov/v2';
        this.apiKey = 'gylPkKfodUGvd0cq4Lgf1yivJYIfKH6093IAks4A';
        // Use real API data
        this.useLocalData = false;
        this.cache = new Map();
    }

    /**
     * Fetch state-level electricity generation by source using real EIA API
     * @param {string} state - State abbreviation (e.g., 'CA', 'TX')
     * @param {string} startDate - Start date (YYYY-MM)
     * @param {string} endDate - End date (YYYY-MM)
     */
    async fetchStateGeneration(state, startDate, endDate) {
        // Check cache first
        const cacheKey = `${state}_${startDate}_${endDate}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        if (this.useLocalData) {
            // Fallback to estimates if API is unavailable
            return this.estimateStateGeneration(state, startDate, endDate);
        }

        try {
            // Fetch real EIA data
            const data = await this.fetchRealEIAData(state, startDate, endDate);
            this.cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.warn(`EIA API error for ${state}, using estimates:`, error.message);
            // Fallback to estimates
            return this.estimateStateGeneration(state, startDate, endDate);
        }
    }

    /**
     * Fetch real data from EIA API v2
     */
    async fetchRealEIAData(state, startDate, endDate) {
        // EIA API endpoint for electricity generation by state and fuel source
        // Endpoint: /electricity/electric-power-operational-data/data/
        const endpoint = `${this.baseURL}/electricity/electric-power-operational-data/data/`;

        const params = new URLSearchParams({
            'api_key': this.apiKey,
            'frequency': 'monthly',
            'data[0]': 'generation',
            'facets[location][]': state,
            'start': startDate,
            'end': endDate,
            'sort[0][column]': 'period',
            'sort[0][direction]': 'asc',
            'offset': 0,
            'length': 5000
        });

        const response = await fetch(`${endpoint}?${params}`);

        if (!response.ok) {
            throw new Error(`EIA API HTTP ${response.status}`);
        }

        const jsonData = await response.json();

        if (!jsonData.response || !jsonData.response.data) {
            throw new Error('Invalid EIA API response format');
        }

        // Parse EIA response and organize by month and fuel type
        return this.parseEIAResponse(jsonData.response.data);
    }

    /**
     * Parse EIA API response into our format
     */
    parseEIAResponse(apiData) {
        const monthlyData = {};

        // Group by period (month) and fueltype
        for (const record of apiData) {
            const month = record.period; // Format: YYYY-MM
            const fuelType = record.fueltype;
            const generation = parseFloat(record.generation) || 0; // In thousand MWh

            if (!monthlyData[month]) {
                monthlyData[month] = {
                    coal: 0,
                    gas: 0,
                    nuclear: 0,
                    solar: 0,
                    wind: 0,
                    hydro: 0,
                    geothermal: 0,
                    oil: 0
                };
            }

            // Map EIA fuel types to our categories
            const fuelMap = {
                'COW': 'coal',
                'NG': 'gas',
                'NUC': 'nuclear',
                'SUN': 'solar',
                'WND': 'wind',
                'WAT': 'hydro',
                'GEO': 'geothermal',
                'PEL': 'oil',
                'DFO': 'oil',
                'RFO': 'oil'
            };

            const ourFuelType = fuelMap[fuelType];
            if (ourFuelType) {
                monthlyData[month][ourFuelType] += generation;
            }
        }

        // Calculate renewable and non-renewable totals
        for (const month in monthlyData) {
            const data = monthlyData[month];
            data.renewable = data.solar + data.wind + data.hydro + data.geothermal;
            data.nonRenewable = data.coal + data.gas + data.nuclear + data.oil;
            data.total = data.renewable + data.nonRenewable;
        }

        return monthlyData;
    }

    /**
     * Estimate state generation based on known patterns
     * This is a fallback when API is unavailable
     */
    estimateStateGeneration(state, startDate, endDate) {
        // State energy profiles (GWh/month averages)
        const stateProfiles = {
            'TX': { coal: 8500, gas: 21000, nuclear: 3200, solar: 1800, wind: 9500, hydro: 50, geo: 0, oil: 20 },
            'CA': { coal: 0, gas: 9500, nuclear: 1500, solar: 4200, wind: 3800, hydro: 2100, geo: 1200, oil: 10 },
            'FL': { coal: 900, gas: 18500, nuclear: 2100, solar: 1300, wind: 0, hydro: 5, geo: 0, oil: 400 },
            'NY': { coal: 20, gas: 10500, nuclear: 2700, solar: 800, wind: 1400, hydro: 2200, geo: 0, oil: 150 },
            'PA': { coal: 2800, gas: 9200, nuclear: 6500, solar: 300, wind: 800, hydro: 700, geo: 0, oil: 50 },
            'IL': { coal: 2000, gas: 4800, nuclear: 8200, solar: 200, wind: 1900, hydro: 10, geo: 0, oil: 10 },
            'OH': { coal: 3100, gas: 5200, nuclear: 1200, solar: 150, wind: 450, hydro: 80, geo: 0, oil: 15 },
            'NC': { coal: 1200, gas: 8600, nuclear: 2800, solar: 1100, wind: 0, hydro: 350, geo: 0, oil: 20 },
            'MI': { coal: 2700, gas: 6100, nuclear: 2200, solar: 180, wind: 950, hydro: 150, geo: 0, oil: 80 },
            'GA': { coal: 1800, gas: 9800, nuclear: 2900, solar: 950, wind: 0, hydro: 280, geo: 0, oil: 35 }
        };

        const profile = stateProfiles[state] || {
            coal: 1000, gas: 5000, nuclear: 500, solar: 200, wind: 300, hydro: 100, geo: 0, oil: 50
        };

        // Generate monthly data with seasonal variation
        const months = this.getMonthsBetween(startDate, endDate);
        const monthlyData = {};

        for (const month of months) {
            const monthNum = parseInt(month.split('-')[1]);

            // Summer peak (June-Aug), winter secondary peak (Dec-Feb)
            const seasonalMultiplier = this.getSeasonalMultiplier(monthNum);

            monthlyData[month] = {
                coal: profile.coal * seasonalMultiplier,
                gas: profile.gas * seasonalMultiplier,
                nuclear: profile.nuclear, // Nuclear runs constant
                solar: profile.solar * this.getSolarMultiplier(monthNum),
                wind: profile.wind * this.getWindMultiplier(monthNum),
                hydro: profile.hydro * this.getHydroMultiplier(monthNum),
                geothermal: profile.geo,
                oil: profile.oil * seasonalMultiplier,

                // Categorized totals
                renewable: (profile.solar * this.getSolarMultiplier(monthNum) +
                           profile.wind * this.getWindMultiplier(monthNum) +
                           profile.hydro * this.getHydroMultiplier(monthNum) +
                           profile.geo),
                nonRenewable: (profile.coal + profile.gas + profile.nuclear + profile.oil) * seasonalMultiplier,
                total: 0
            };

            monthlyData[month].total = monthlyData[month].renewable + monthlyData[month].nonRenewable;
        }

        return monthlyData;
    }

    /**
     * Get seasonal demand multiplier
     */
    getSeasonalMultiplier(month) {
        // 1=Jan, 12=Dec
        const summer = [6, 7, 8]; // High AC demand
        const winter = [12, 1, 2]; // High heating demand
        const shoulder = [3, 4, 5, 9, 10, 11]; // Moderate

        if (summer.includes(month)) return 1.25; // 25% above baseline
        if (winter.includes(month)) return 1.15; // 15% above baseline
        return 0.95; // Slightly below baseline
    }

    getSolarMultiplier(month) {
        // Solar peaks in summer
        const solarPeak = [5, 6, 7]; // May-July
        if (solarPeak.includes(month)) return 1.4;
        if ([12, 1, 2].includes(month)) return 0.6; // Winter low
        return 1.0;
    }

    getWindMultiplier(month) {
        // Wind peaks in spring and fall
        const windPeak = [3, 4, 10, 11]; // Spring and fall
        if (windPeak.includes(month)) return 1.3;
        if ([7, 8].includes(month)) return 0.7; // Summer low
        return 1.0;
    }

    getHydroMultiplier(month) {
        // Hydro peaks in spring (snowmelt)
        const hydroPeak = [4, 5, 6]; // April-June
        if (hydroPeak.includes(month)) return 1.5;
        if ([8, 9, 10].includes(month)) return 0.6; // Late summer/fall low
        return 1.0;
    }

    /**
     * Generate array of months between start and end
     */
    getMonthsBetween(start, end) {
        const months = [];
        const startDate = new Date(start + '-01');
        const endDate = new Date(end + '-01');

        let current = new Date(startDate);
        while (current <= endDate) {
            const year = current.getFullYear();
            const month = String(current.getMonth() + 1).padStart(2, '0');
            months.push(`${year}-${month}`);
            current.setMonth(current.getMonth() + 1);
        }

        return months;
    }

    /**
     * Disaggregate state data to county level
     * Uses population weights and known power plant locations
     */
    disaggregateToCounties(stateData, counties, powerPlants) {
        const countyData = {};

        // Calculate total state population
        const totalPopulation = counties.reduce((sum, c) => sum + c.population, 0);

        for (const county of counties) {
            const populationWeight = county.population / totalPopulation;

            // Check if county has power plants
            const localPlants = powerPlants.filter(p => p.county === county.name);
            const hasNuclear = localPlants.some(p => p.type === 'nuclear');
            const hasCoal = localPlants.some(p => p.type === 'coal');
            const hasSolar = localPlants.some(p => p.type === 'solar');

            countyData[county.fips] = {};

            for (const [month, data] of Object.entries(stateData)) {
                // Base distribution by population
                let countyGeneration = {
                    coal: data.coal * populationWeight,
                    gas: data.gas * populationWeight,
                    nuclear: data.nuclear * populationWeight,
                    solar: data.solar * populationWeight,
                    wind: data.wind * populationWeight,
                    hydro: data.hydro * populationWeight,
                    geothermal: data.geothermal * populationWeight,
                    oil: data.oil * populationWeight
                };

                // Boost if county has actual power plants
                if (hasNuclear) countyGeneration.nuclear *= 5; // Nuclear counties generate more
                if (hasCoal) countyGeneration.coal *= 3;
                if (hasSolar) countyGeneration.solar *= 2;

                countyData[county.fips][month] = {
                    ...countyGeneration,
                    renewable: countyGeneration.solar + countyGeneration.wind +
                              countyGeneration.hydro + countyGeneration.geothermal,
                    nonRenewable: countyGeneration.coal + countyGeneration.gas +
                                 countyGeneration.nuclear + countyGeneration.oil,
                    total: Object.values(countyGeneration).reduce((a, b) => a + b, 0)
                };
            }
        }

        return countyData;
    }
}

/**
 * Energy Demand Estimator
 * Estimates county-level electricity demand based on multiple factors
 */
class EnergyDemandEstimator {
    constructor() {
        this.baselineDemandPerCapita = 11000; // kWh/person/year (US average)
    }

    /**
     * Estimate county monthly demand (EvaDemand)
     */
    estimateCountyDemand(county, month) {
        const population = county.population;
        const monthNum = parseInt(month.split('-')[1]);

        // Base demand from population
        let annualDemand = population * this.baselineDemandPerCapita;

        // Adjust for economic activity
        const economicMultiplier = this.getEconomicMultiplier(county);
        annualDemand *= economicMultiplier;

        // Adjust for climate (heating/cooling needs)
        const climateMultiplier = this.getClimateMultiplier(county, monthNum);

        // Convert to monthly (MWh)
        const monthlyDemand = (annualDemand / 12) * climateMultiplier / 1000; // Convert kWh to MWh

        return monthlyDemand;
    }

    /**
     * Economic activity multiplier
     */
    getEconomicMultiplier(county) {
        // Counties with data centers, manufacturing, etc. use more
        const industrialCounties = ['Santa Clara', 'King', 'Cook', 'Harris'];
        if (industrialCounties.includes(county.name)) return 1.5;

        // Rural counties use less
        if (county.population < 50000) return 0.8;

        return 1.0; // Average
    }

    /**
     * Climate-based demand multiplier
     */
    getClimateMultiplier(county, month) {
        // Hot states peak in summer (AC)
        const hotStates = ['AZ', 'TX', 'FL', 'NV', 'LA'];
        // Cold states peak in winter (heating)
        const coldStates = ['ME', 'VT', 'NH', 'MN', 'ND', 'SD', 'WI'];

        const isSummer = [6, 7, 8].includes(month);
        const isWinter = [12, 1, 2].includes(month);

        if (hotStates.includes(county.state)) {
            if (isSummer) return 1.4; // High AC load
            if (isWinter) return 0.9;
            return 1.0;
        }

        if (coldStates.includes(county.state)) {
            if (isWinter) return 1.3; // High heating load
            if (isSummer) return 0.9;
            return 1.0;
        }

        // Moderate climates
        if (isSummer || isWinter) return 1.15;
        return 0.95;
    }

    /**
     * Predict future demand with growth
     */
    predictFutureDemand(historicalDemand, yearsAhead) {
        // Average 1.5% annual growth in US electricity demand
        const annualGrowthRate = 0.015;
        const growthMultiplier = Math.pow(1 + annualGrowthRate, yearsAhead);

        const predictions = {};
        for (const [month, demand] of Object.entries(historicalDemand)) {
            const [year, monthNum] = month.split('-').map(Number);
            const futureYear = year + yearsAhead;
            const futureMonth = `${futureYear}-${String(monthNum).padStart(2, '0')}`;

            predictions[futureMonth] = demand * growthMultiplier;
        }

        return predictions;
    }
}

// Global instances
const eiaFetcher = new EIADataFetcher();
const demandEstimator = new EnergyDemandEstimator();
