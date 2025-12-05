# 🌍 EvapoScore - Global Evaporation Engine Feasibility Visualization

An interactive MapLibre GL JS visualization showing the potential power output of evaporation-driven engines across world capital cities.

## 📋 Project Overview

This project analyzes the feasibility of evaporation-driven engines worldwide using climate data and the **Penman Equation** to calculate theoretical power output. Evaporation-driven engines are novel energy harvesting devices that convert the chemical potential difference of water during evaporation into mechanical work.

Based on the WSS Competition Project, this visualization helps identify optimal locations for deploying evaporation-driven engines by analyzing:
- Temperature
- Relative Humidity
- Wind Speed
- Solar Radiation

## 🎯 Features

- **Interactive Map**: Explore 100+ capital cities worldwide
- **Real-time Calculations**: Power potential calculated using the Penman Equation
- **Color-coded Markers**: Visual indication of power potential
  - 🔴 Red: Excellent (>200 W/m²)
  - 🟠 Orange: Very Good (150-200 W/m²)
  - 🟡 Yellow: Good (100-150 W/m²)
  - 🔵 Light Blue: Moderate (50-100 W/m²)
  - 🟦 Dark Blue: Low (<50 W/m²)
- **Detailed Popups**: Click markers for climate data and analysis
- **Top Cities View**: Quickly identify the best locations
- **Heatmap Mode**: Alternative visualization of power distribution
- **Global Statistics**: Average power, city count, and best location

## 🚀 Getting Started

### Quick Start

Simply open `index.html` in a modern web browser. No build process or server required!

```bash
# Clone or download the repository
cd EvapoScore

# Open in browser (choose one):
open index.html                    # macOS
xdg-open index.html               # Linux
start index.html                   # Windows
```

### Files Structure

```
EvapoScore/
├── index.html              # Main HTML file
├── capitals-data.js        # Capital cities dataset (100+ cities)
├── evaporation-calc.js     # Penman equation implementation
├── map.js                  # MapLibre visualization logic
└── README.md              # This file
```

## 🧮 Science Behind It

### The Penman Equation

The evaporation rate is calculated using the Penman Equation:

```
E_pr = (Δ · R_n + 2.6 · c_t · L_v · ρ_w · γ · (1 + 0.54 · u_a) · D_a) / (Δ + γ)
```

Where:
- `E_pr`: Evaporation rate (mm/day)
- `Δ`: Rate of change of saturation vapor pressure with temperature
- `R_n`: Net radiation (W/m²)
- `γ`: Psychrometric constant (0.067 kPa/K)
- `u_a`: Wind speed (m/s)
- `D_a`: Vapor pressure deficit (kPa)
- `L_v`: Latent heat of vaporization (2448 MJ/Mg)
- `ρ_w`: Density of water (1 Mg/m³)

### Maximum Engine Power

The theoretical maximum power output is calculated as:

```
P/A = c_e · E_pr · R · T_air · ln(RH_wet / RH_air)
```

Where:
- `P/A`: Power per area (W/m²)
- `R`: Ideal gas constant (8.314 J/(mol·K))
- `T_air`: Air temperature (K)
- `RH_wet`: Relative humidity at water surface (~97.5%)
- `RH_air`: Ambient relative humidity

## 🗺️ How to Use

1. **Explore the Map**: Pan and zoom to explore different regions
2. **Click Markers**: View detailed climate data and power calculations for each city
3. **Use Controls**:
   - 🏆 **Top 10 Cities**: Highlights and zooms to the best locations
   - 🌐 **Reset View**: Returns to global view
   - 🗺️ **Toggle Heatmap**: Switch between marker and heatmap visualization

## 📊 Key Findings

Based on the analysis, cities with the highest evaporation engine potential typically have:
- **Low relative humidity** (dry climates)
- **High solar radiation** (sunny regions)
- **Moderate to high temperatures**
- **Good wind speeds**

Optimal regions include:
- Middle Eastern deserts (UAE, Saudi Arabia, Qatar)
- North African cities (Egypt, Algeria)
- Parts of Australia
- Southwestern United States

## 🔬 Technical Details

### Climate Data

Currently uses **simplified climate estimation** based on geographical location. For production use, the system can be enhanced to fetch real data from the Open-Meteo API:

```javascript
// Example API call structure (included in code)
const url = `https://archive-api.open-meteo.com/v1/archive?
    latitude=${lat}&longitude=${lon}&
    start_date=2023-01-01&end_date=2023-12-31&
    daily=temperature_2m_mean,relative_humidity_2m_mean,
    wind_speed_10m_mean,shortwave_radiation_sum`;
```

### MapLibre GL JS

Uses MapLibre GL JS for:
- Vector and raster tile rendering
- Interactive markers with custom styling
- Heatmap visualization
- Smooth animations and transitions

## 🎓 Educational Use

This project is based on the WSS Competition Project and demonstrates:
- Application of thermodynamic principles
- Climate data analysis
- Geographic visualization
- Renewable energy feasibility studies
- Systems thinking and interdisciplinary analysis

## 🌟 Future Enhancements

- [ ] Integration with live Open-Meteo API data
- [ ] Historical trend analysis (multi-year data)
- [ ] Seasonal variation charts
- [ ] Water body availability overlay
- [ ] Economic feasibility calculator
- [ ] Export analysis reports
- [ ] Comparison tool for multiple locations
- [ ] Mobile-responsive design improvements

## 📚 References

1. **Park, Y., & Chen, X. (2020).** Water-responsive materials for sustainable energy applications. *Journal of Materials Chemistry A*, 8(31), 15227–15244.

2. **Penman, H.L. (1948).** Natural evaporation from open water, bare soil and grass. *Proceedings of the Royal Society of London. Series A*, 193(1032), 120-145.

3. **Open-Meteo API**: Historical weather data archive - https://open-meteo.com

## 📝 License

This project is created for educational purposes as part of the WSS Competition Project.

## 👥 Contributing

Contributions are welcome! Areas for improvement:
- Add more cities to the dataset
- Improve climate estimation algorithms
- Integrate real-time weather data
- Add more visualization options
- Enhance mobile responsiveness

## 🐛 Known Limitations

- Climate data is currently estimated, not from real weather stations
- Does not account for water body availability in each location
- Simplified net radiation calculation
- Does not include seasonal variations in detail
- Engine efficiency assumptions may vary from real-world performance

## 📧 Contact

For questions about evaporation-driven engines or this visualization, please refer to the WSS Competition Project materials.

---

**Made with 🌊 for understanding renewable energy potential worldwide**
