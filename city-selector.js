/**
 * City Selector - Filter to top 5 largest cities per country
 */

function selectTopCitiesPerCountry(allCities, topN = 5) {
    // Group cities by country
    const citiesByCountry = {};

    for (const city of allCities) {
        if (!citiesByCountry[city.country]) {
            citiesByCountry[city.country] = [];
        }
        citiesByCountry[city.country].push(city);
    }

    // Select top N cities by population for each country
    const selectedCities = [];

    for (const country in citiesByCountry) {
        const cities = citiesByCountry[country];

        // Sort by population descending
        cities.sort((a, b) => b.population - a.population);

        // Take top N
        const topCities = cities.slice(0, topN);
        selectedCities.push(...topCities);
    }

    console.log(`Selected ${selectedCities.length} cities from ${Object.keys(citiesByCountry).length} countries`);
    console.log(`Cities per country: max ${topN}`);

    return selectedCities;
}

/**
 * Get country statistics
 */
function getCountryStatistics(cities) {
    const stats = {};

    for (const city of cities) {
        if (!stats[city.country]) {
            stats[city.country] = {
                country: city.country,
                continent: city.continent,
                cityCount: 0,
                totalPopulation: 0,
                cities: []
            };
        }

        stats[city.country].cityCount++;
        stats[city.country].totalPopulation += city.population;
        stats[city.country].cities.push({
            name: city.name,
            population: city.population,
            lat: city.lat,
            lon: city.lon
        });
    }

    return stats;
}

/**
 * Generate country centroids (approximate geographic center)
 */
function calculateCountryCentroids(cities) {
    const countryCoords = {};

    for (const city of cities) {
        if (!countryCoords[city.country]) {
            countryCoords[city.country] = {
                lats: [],
                lons: [],
                country: city.country,
                continent: city.continent
            };
        }

        countryCoords[city.country].lats.push(city.lat);
        countryCoords[city.country].lons.push(city.lon);
    }

    const centroids = {};

    for (const country in countryCoords) {
        const data = countryCoords[country];
        const avgLat = data.lats.reduce((a, b) => a + b, 0) / data.lats.length;
        const avgLon = data.lons.reduce((a, b) => a + b, 0) / data.lons.length;

        centroids[country] = {
            country: country,
            continent: data.continent,
            lat: avgLat,
            lon: avgLon
        };
    }

    return centroids;
}
