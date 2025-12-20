# US County Energy Analysis - Data Sources & Limitations

## 📊 DATA AVAILABILITY REPORT

### ✅ **AVAILABLE PUBLIC DATA**

#### 1. **EIA (Energy Information Administration)**

**State-Level Energy Generation** (Monthly, 5+ years historical)
- Source: https://www.eia.gov/electricity/data.php
- API: https://www.eia.gov/opendata/
- Granularity: **STATE-LEVEL** (not county)
- Coverage: All 50 states
- Fuel Types: Coal, Natural Gas, Nuclear, Petroleum, Solar, Wind, Hydro, Geothermal, Other
- Format: JSON/CSV via API
- **Cost: FREE** (API key required for high-volume)

**Nuclear Generation Data**
- Source: https://www.eia.gov/nuclear/generation/
- Granularity: **PLANT-LEVEL** (can map to counties)
- Data: Monthly generation by nuclear plant
- **Cost: FREE**

**Renewable Energy Data**
- Source: https://www.eia.gov/renewable/
- Granularity: **STATE/FACILITY-LEVEL**
- Coverage: Solar, wind, hydro, geothermal, biomass
- **Cost: FREE**

**Electricity Prices**
- Source: https://www.eia.gov/electricity/monthly/
- Granularity: **STATE/UTILITY-LEVEL**
- Data: Average retail prices by sector (residential, commercial, industrial)
- **Cost: FREE**

#### 2. **US Census Bureau**

**Population Data**
- Source: https://www.census.gov/data/developers/data-sets/popest-popproj.html
- Granularity: **COUNTY-LEVEL**
- Data: Annual population estimates and projections
- **Cost: FREE** (API available)

**Economic Indicators**
- Source: https://www.census.gov/data/developers/data-sets/cbp-nonemp-zbp.html
- Granularity: **COUNTY/ZIP CODE**
- Data: GDP, employment, industry sectors
- **Cost: FREE**

#### 3. **NREL (National Renewable Energy Laboratory)**

**Solar Resource Data**
- Source: https://nsrdb.nrel.gov/
- Granularity: **4km grid** (can aggregate to counties)
- Data: Solar radiation, temperature, wind speed
- **Cost: FREE** (registration required)

**Wind Resource Data**
- Source: https://www.nrel.gov/gis/wind.html
- Granularity: **State/region**
- Data: Wind potential maps
- **Cost: FREE**

#### 4. **USGS (US Geological Survey)**

**Geothermal Resource Data**
- Source: https://www.usgs.gov/centers/gggsc
- Granularity: **Site-specific**
- Data: Geothermal potential assessments
- **Cost: FREE**

**Hydro Resource Data**
- Source: https://www.usgs.gov/mission-areas/water-resources
- Granularity: **Watershed/river basin**
- Data: Streamflow, reservoir levels
- **Cost: FREE**

---

### ❌ **NOT PUBLICLY AVAILABLE**

#### 1. **County-Level Generation by Fuel Type**
- **Why**: EIA only publishes state-level aggregates
- **Workaround**: Disaggregate state data using:
  - Population weights
  - Known power plant locations (EIA-860 form)
  - Economic activity indicators
  - Land use patterns

#### 2. **Monthly County-Level Demand**
- **Why**: Utilities report at service territory level (not county boundaries)
- **Workaround**: Model demand using:
  - Population
  - Economic indicators (GDP, employment)
  - Climate data (heating/cooling degree days)
  - Historical state-level consumption patterns

#### 3. **Real-Time County Energy Prices**
- **Why**: Pricing is set by utilities/ISOs, not publicly disaggregated to counties
- **Workaround**: Use state average + apply factors:
  - Supply/demand balance
  - Fuel mix
  - Transmission costs
  - Market dynamics

#### 4. **Proprietary Utility Data**
- **Examples**: Load profiles, outage data, grid topology
- **Why**: Commercially sensitive information
- **Cost**: $10,000-$100,000+ per year from vendors like Ventyx, ABB, S&P Global

---

## 🔧 **IMPLEMENTATION APPROACH**

### Current System Uses:

1. **State-Level Data + Disaggregation**
   - Fetch state generation from EIA API
   - Distribute to counties using population/economic weights
   - Adjust for known power plant locations

2. **Demand Modeling**
   - Base: Population × per-capita consumption (11,000 kWh/year US average)
   - Adjust for:
     - Economic activity (industrial counties use more)
     - Climate (heating/cooling needs)
     - Seasonal variation

3. **Price Prediction**
   - Base: State average retail price
   - Apply multipliers:
     - Supply/demand balance (deficit → higher prices)
     - Fuel mix (renewables → lower long-term)
     - Seasonal variation
     - Infrastructure costs

4. **Evaporation Engine Potential**
   - Use existing climate estimation from global analysis
   - Calculate county-level potential based on:
     - Climate data (temp, humidity, wind, solar)
     - Penman Equation for evaporation rates
     - Thermodynamic power calculations

---

## 📈 **DATA ACCURACY ESTIMATES**

| Metric | Granularity | Accuracy | Method |
|--------|-------------|----------|---------|
| **Energy Generation** | County | ±30% | State disaggregation |
| **Energy Demand** | County | ±25% | Population modeling |
| **Energy Price** | County | ±20% | State average + factors |
| **Renewable Potential** | County | ±15% | NREL resource maps |
| **Nuclear Capacity** | County | ±5% | EIA plant-level data |

---

## 🚀 **FUTURE ENHANCEMENTS** (Requires Budget)

### Commercial Data Sources:

1. **Ventyx Velocity Suite** ($20,000+/year)
   - County-level demand
   - Utility-level pricing
   - Grid infrastructure data

2. **ABB GridView** ($30,000+/year)
   - Real-time generation
   - Load forecasting
   - Transmission congestion

3. **S&P Global Platts** ($15,000+/year)
   - Energy market prices
   - Fuel cost indices
   - Forward curves

4. **ISO/RTO Data** (varies by region)
   - CAISO, ERCOT, PJM, NYISO, etc.
   - Real-time prices (LMP)
   - Load data
   - **Cost**: Free to $5,000/year depending on access level

---

## 📝 **DATA CITATION**

When using this analysis, cite:

```
Energy generation data: U.S. Energy Information Administration (EIA)
Population data: U.S. Census Bureau
Solar/wind resources: National Renewable Energy Laboratory (NREL)
Evaporation potential: Penman Equation-based climate modeling
Demand/price estimates: Modeled from public data sources
```

---

## ⚠️ **LIMITATIONS & DISCLAIMERS**

1. **County-level estimates** are modeled from state data and may not reflect actual county-specific conditions
2. **Demand projections** assume historical growth patterns and do not account for major policy changes (e.g., electrification mandates)
3. **Price predictions** are simplified and do not capture full market complexity (congestion, ancillary services, etc.)
4. **Future predictions (5 years)** use linear trends and may not capture non-linear events (technology breakthroughs, policy shifts, extreme weather)
5. **Evaporation engine potential** is theoretical maximum; actual deployment would face water availability, land use, and infrastructure constraints

---

## 📧 **QUESTIONS?**

For questions about data sources or methodology:
- GitHub: https://github.com/aranyoray/EvapoScore
- Contact: Ameya Meattle, WSS 2025 Scholar
