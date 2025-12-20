/**
 * Energy Price Prediction Engine (EvaPrice)
 * Predicts electricity pricing based on supply/demand dynamics,
 * fuel costs, infrastructure, and market factors
 */

class EnergyPricePredictor {
    constructor() {
        // Average US electricity prices by state (cents/kWh)
        this.baselinePrices = {
            'CA': 19.9, 'TX': 11.8, 'FL': 11.4, 'NY': 18.2, 'PA': 12.7,
            'IL': 12.3, 'OH': 12.5, 'NC': 10.9, 'MI': 15.3, 'GA': 11.9,
            'NJ': 15.6, 'VA': 11.5, 'WA': 9.7, 'AZ': 12.3, 'MA': 21.1,
            'TN': 10.6, 'IN': 12.0, 'MO': 10.7, 'MD': 13.0, 'WI': 13.5
        };

        this.defaultPrice = 13.0; // US average
    }

    /**
     * Calculate EvaPrice for a county
     * Factors: deficit, fuel mix, infrastructure, market dynamics
     */
    calculatePrice(county, supply, demand, month) {
        const state = county.state;
        let basePrice = this.baselinePrices[state] || this.defaultPrice;

        // Factor 1: Supply/Demand Balance
        const deficit = demand - supply;
        const deficitRatio = deficit / demand;

        let supplyDemandMultiplier = 1.0;
        if (deficitRatio > 0.2) {
            // Severe shortage: prices spike
            supplyDemandMultiplier = 1.5;
        } else if (deficitRatio > 0.1) {
            // Moderate shortage
            supplyDemandMultiplier = 1.25;
        } else if (deficitRatio > 0) {
            // Slight shortage
            supplyDemandMultiplier = 1.1;
        } else if (deficitRatio < -0.1) {
            // Surplus: prices drop
            supplyDemandMultiplier = 0.9;
        }

        // Factor 2: Fuel Mix (renewables are cheaper long-term)
        const renewableRatio = (supply.renewable || 0) / (supply.total || 1);
        let fuelMixMultiplier = 1.0;

        if (renewableRatio > 0.5) {
            // High renewable penetration → lower prices
            fuelMixMultiplier = 0.85;
        } else if (renewableRatio > 0.3) {
            fuelMixMultiplier = 0.95;
        } else if (renewableRatio < 0.1) {
            // Heavy fossil fuel dependence → higher prices
            fuelMixMultiplier = 1.15;
        }

        // Factor 3: Seasonal variation
        const monthNum = parseInt(month.split('-')[1]);
        const seasonalMultiplier = this.getSeasonalPriceMultiplier(monthNum, state);

        // Factor 4: Infrastructure & transmission costs
        const infrastructureMultiplier = this.getInfrastructureMultiplier(county);

        // Calculate final price
        const price = basePrice *
                     supplyDemandMultiplier *
                     fuelMixMultiplier *
                     seasonalMultiplier *
                     infrastructureMultiplier;

        return {
            price: price,
            basePrice: basePrice,
            factors: {
                supplyDemand: supplyDemandMultiplier,
                fuelMix: fuelMixMultiplier,
                seasonal: seasonalMultiplier,
                infrastructure: infrastructureMultiplier
            }
        };
    }

    /**
     * Seasonal price variation
     */
    getSeasonalPriceMultiplier(month, state) {
        const hotStates = ['AZ', 'TX', 'FL', 'NV', 'LA'];
        const coldStates = ['ME', 'VT', 'NH', 'MN', 'ND'];

        const isSummer = [6, 7, 8].includes(month);
        const isWinter = [12, 1, 2].includes(month);

        if (hotStates.includes(state)) {
            if (isSummer) return 1.3; // Peak summer pricing
            return 1.0;
        }

        if (coldStates.includes(state)) {
            if (isWinter) return 1.25; // Peak winter pricing
            return 1.0;
        }

        // Moderate climates
        if (isSummer || isWinter) return 1.1;
        return 1.0;
    }

    /**
     * Infrastructure quality affects transmission costs
     */
    getInfrastructureMultiplier(county) {
        // Rural counties have higher transmission costs
        if (county.population < 50000) return 1.15;

        // Large urban areas benefit from economies of scale
        if (county.population > 1000000) return 0.95;

        return 1.0;
    }

    /**
     * Predict future prices
     */
    predictFuturePrice(currentPrice, yearsAhead, scenario = 'baseline') {
        // Scenarios:
        // - baseline: Gradual increase (2% annually)
        // - renewable_growth: Decreasing as renewables expand (-1% annually)
        // - fossil_dependence: Increasing due to fuel costs (+4% annually)

        const growthRates = {
            'baseline': 0.02,
            'renewable_growth': -0.01,
            'fossil_dependence': 0.04
        };

        const rate = growthRates[scenario] || growthRates['baseline'];
        return currentPrice * Math.pow(1 + rate, yearsAhead);
    }
}

/**
 * County Energy Recommendation Engine
 * Analyzes deficit and suggests optimal energy sources
 */
class EnergyRecommendationEngine {
    constructor() {
        this.evapCalc = new EvaporationCalculator();
    }

    /**
     * Generate recommendations for a county
     */
    generateRecommendations(county, supply, demand, deficit) {
        const recommendations = [];
        const deficitPercentage = (deficit / demand) * 100;

        if (deficit <= 0) {
            return [{
                type: 'surplus',
                priority: 'low',
                message: `✅ Energy surplus of ${Math.abs(deficit).toFixed(0)} MWh/month. Consider exporting to neighboring counties.`,
                icon: '✅'
            }];
        }

        // Severe deficit: Immediate action needed
        if (deficitPercentage > 20) {
            recommendations.push({
                type: 'critical',
                priority: 'high',
                message: `⚠️ CRITICAL DEFICIT: ${deficitPercentage.toFixed(1)}% shortfall. Immediate capacity expansion required.`,
                icon: '⚠️'
            });
        }

        // Analyze optimal sources based on county characteristics
        const solarPotential = this.assessSolarPotential(county);
        const windPotential = this.assessWindPotential(county);
        const nuclearViability = this.assessNuclearViability(county);
        const geothermalPotential = this.assessGeothermalPotential(county);
        const evaporationPotential = this.assessEvaporationPotential(county);

        // Rank recommendations
        const options = [
            { type: 'solar', score: solarPotential, capacity: deficit * 0.3 },
            { type: 'wind', score: windPotential, capacity: deficit * 0.25 },
            { type: 'nuclear', score: nuclearViability, capacity: deficit * 0.4 },
            { type: 'geothermal', score: geothermalPotential, capacity: deficit * 0.15 },
            { type: 'evaporation', score: evaporationPotential, capacity: deficit * 0.1 },
            { type: 'gas', score: 0.6, capacity: deficit * 0.3 } // Always viable but not preferred
        ];

        // Sort by score
        options.sort((a, b) => b.score - a.score);

        // Add top 3 recommendations
        for (let i = 0; i < Math.min(3, options.length); i++) {
            const option = options[i];

            if (option.score > 0.5) { // Only recommend if score > 50%
                const rec = this.formatRecommendation(option.type, option.capacity, option.score, county);
                recommendations.push(rec);
            }
        }

        // If deficit is large, recommend mix
        if (deficitPercentage > 15) {
            recommendations.push({
                type: 'mix',
                priority: 'medium',
                message: `💡 Recommend diversified approach: Combine ${options[0].type}, ${options[1].type}, and ${options[2].type} for grid stability.`,
                icon: '💡'
            });
        }

        return recommendations;
    }

    /**
     * Assess solar potential (0-1 score)
     */
    assessSolarPotential(county) {
        // High solar potential in Southwest
        const highSolarStates = ['AZ', 'NM', 'NV', 'CA', 'TX'];
        const moderateSolarStates = ['CO', 'UT', 'FL', 'GA', 'NC'];

        if (highSolarStates.includes(county.state)) return 0.9;
        if (moderateSolarStates.includes(county.state)) return 0.7;
        return 0.5;
    }

    /**
     * Assess wind potential
     */
    assessWindPotential(county) {
        // High wind potential in Great Plains and offshore
        const highWindStates = ['TX', 'IA', 'OK', 'KS', 'ND', 'SD'];
        const moderateWindStates = ['MN', 'NE', 'WY', 'MT'];

        if (highWindStates.includes(county.state)) return 0.85;
        if (moderateWindStates.includes(county.state)) return 0.7;
        return 0.4;
    }

    /**
     * Assess nuclear viability
     */
    assessNuclearViability(county) {
        // Nuclear requires:
        // - Large water source for cooling
        // - Large population center (demand)
        // - Grid infrastructure
        // - Political/regulatory support

        let score = 0.3; // Base score

        if (county.population > 500000) score += 0.3; // Large demand
        if (county.hasWaterAccess) score += 0.2; // Cooling water
        if (county.existingNuclear) score += 0.2; // Existing nuclear infrastructure

        // States with nuclear-friendly regulations
        const nuclearStates = ['IL', 'PA', 'SC', 'NC', 'AL'];
        if (nuclearStates.includes(county.state)) score += 0.2;

        return Math.min(score, 1.0);
    }

    /**
     * Assess geothermal potential
     */
    assessGeothermalPotential(county) {
        // Geothermal requires volcanic/tectonic activity
        const geothermalStates = ['CA', 'NV', 'OR', 'ID', 'UT', 'AK', 'HI'];

        if (geothermalStates.includes(county.state)) {
            return 0.8;
        }

        return 0.1; // Very limited outside these areas
    }

    /**
     * Assess evaporation engine potential
     */
    assessEvaporationPotential(county) {
        // Use existing evaporation calculator
        if (!county.climate) return 0.3;

        const power = this.evapCalc.estimatePowerFromClimateaverages(county.climate);

        // Score based on power potential
        if (power > 200) return 0.9; // Excellent
        if (power > 150) return 0.7; // Good
        if (power > 100) return 0.5; // Moderate
        return 0.3; // Low
    }

    /**
     * Format recommendation message
     */
    formatRecommendation(type, capacity, score, county) {
        const messages = {
            'solar': {
                icon: '☀️',
                name: 'Solar PV',
                message: `Strong solar potential (${(score * 100).toFixed(0)}%). Add ${capacity.toFixed(0)} MWh/month solar capacity.`
            },
            'wind': {
                icon: '💨',
                name: 'Wind Turbines',
                message: `Good wind resources (${(score * 100).toFixed(0)}%). Install ${capacity.toFixed(0)} MWh/month wind capacity.`
            },
            'nuclear': {
                icon: '⚛️',
                name: 'Nuclear',
                message: `Nuclear viable (${(score * 100).toFixed(0)}%). Consider ${capacity.toFixed(0)} MWh/month baseload nuclear.`
            },
            'geothermal': {
                icon: '🌋',
                name: 'Geothermal',
                message: `Geothermal potential (${(score * 100).toFixed(0)}%). Develop ${capacity.toFixed(0)} MWh/month geothermal.`
            },
            'evaporation': {
                icon: '💧',
                name: 'Evaporation Engine',
                message: `Evaporation engine viable (${(score * 100).toFixed(0)}%). Deploy ${capacity.toFixed(0)} MWh/month capacity.`
            },
            'gas': {
                icon: '🔥',
                name: 'Natural Gas',
                message: `Natural gas option (${(score * 100).toFixed(0)}%). Add ${capacity.toFixed(0)} MWh/month gas capacity (transition fuel).`
            }
        };

        const config = messages[type] || messages['gas'];

        return {
            type: type,
            priority: score > 0.7 ? 'high' : 'medium',
            message: `${config.icon} ${config.name}: ${config.message}`,
            icon: config.icon,
            capacity: capacity
        };
    }
}

// Global instances
const pricePredictor = new EnergyPricePredictor();
const recommendationEngine = new EnergyRecommendationEngine();
