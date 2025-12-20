/**
 * US Counties Dataset
 * One largest city per county (by population)
 * Comprehensive coverage of all 50 states
 */

const usCounties = [
    // ALABAMA
    { fips: '01073', county: 'Jefferson', state: 'AL', city: 'Birmingham', lat: 33.5207, lon: -86.8025, population: 212237, countyPop: 658573, stateAbbr: 'AL' },
    { fips: '01097', county: 'Mobile', state: 'AL', city: 'Mobile', lat: 30.6954, lon: -88.0399, population: 195111, countyPop: 414809, stateAbbr: 'AL' },
    { fips: '01081', county: 'Lee', state: 'AL', city: 'Auburn', lat: 32.6099, lon: -85.4808, population: 76143, countyPop: 174241, stateAbbr: 'AL' },
    { fips: '01089', county: 'Madison', state: 'AL', city: 'Huntsville', lat: 34.7304, lon: -86.5861, population: 215006, countyPop: 388153, stateAbbr: 'AL' },
    { fips: '01117', county: 'Tuscaloosa', state: 'AL', city: 'Tuscaloosa', lat: 33.2098, lon: -87.5692, population: 101129, countyPop: 227036, stateAbbr: 'AL' },

    // ALASKA
    { fips: '02020', county: 'Anchorage', state: 'AK', city: 'Anchorage', lat: 61.2181, lon: -149.9003, population: 291247, countyPop: 291247, stateAbbr: 'AK' },
    { fips: '02090', county: 'Fairbanks North Star', state: 'AK', city: 'Fairbanks', lat: 64.8378, lon: -147.7164, population: 32515, countyPop: 95665, stateAbbr: 'AK' },
    { fips: '02110', county: 'Juneau', state: 'AK', city: 'Juneau', lat: 58.3019, lon: -134.4197, population: 32255, countyPop: 32255, stateAbbr: 'AK' },

    // ARIZONA
    { fips: '04013', county: 'Maricopa', state: 'AZ', city: 'Phoenix', lat: 33.4484, lon: -112.0740, population: 1680992, countyPop: 4485414, stateAbbr: 'AZ' },
    { fips: '04019', county: 'Pima', state: 'AZ', city: 'Tucson', lat: 32.2217, lon: -110.9265, population: 542629, countyPop: 1043433, stateAbbr: 'AZ' },
    { fips: '04015', county: 'Mohave', state: 'AZ', city: 'Lake Havasu City', lat: 34.4839, lon: -114.3224, population: 57144, countyPop: 213267, stateAbbr: 'AZ' },
    { fips: '04021', county: 'Pinal', state: 'AZ', city: 'Casa Grande', lat: 32.8795, lon: -111.7574, population: 55477, countyPop: 462463, stateAbbr: 'AZ' },
    { fips: '04025', county: 'Yavapai', state: 'AZ', city: 'Prescott', lat: 34.5400, lon: -112.4685, population: 45827, countyPop: 239748, stateAbbr: 'AZ' },

    // ARKANSAS
    { fips: '05119', county: 'Pulaski', state: 'AR', city: 'Little Rock', lat: 34.7465, lon: -92.2896, population: 202591, countyPop: 399125, stateAbbr: 'AR' },
    { fips: '05143', county: 'Washington', state: 'AR', city: 'Fayetteville', lat: 36.0626, lon: -94.1574, population: 93949, countyPop: 245871, stateAbbr: 'AR' },
    { fips: '05007', county: 'Benton', state: 'AR', city: 'Bentonville', lat: 36.3729, lon: -94.2088, population: 54909, countyPop: 284333, stateAbbr: 'AR' },

    // CALIFORNIA
    { fips: '06037', county: 'Los Angeles', state: 'CA', city: 'Los Angeles', lat: 34.0522, lon: -118.2437, population: 3898747, countyPop: 10014009, stateAbbr: 'CA' },
    { fips: '06073', county: 'San Diego', state: 'CA', city: 'San Diego', lat: 32.7157, lon: -117.1611, population: 1386932, countyPop: 3286069, stateAbbr: 'CA' },
    { fips: '06085', county: 'Santa Clara', state: 'CA', city: 'San Jose', lat: 37.3382, lon: -121.8863, population: 1013240, countyPop: 1936259, stateAbbr: 'CA' },
    { fips: '06075', county: 'San Francisco', state: 'CA', city: 'San Francisco', lat: 37.7749, lon: -122.4194, population: 873965, countyPop: 873965, stateAbbr: 'CA' },
    { fips: '06059', county: 'Orange', state: 'CA', city: 'Anaheim', lat: 33.8366, lon: -117.9143, population: 346824, countyPop: 3186989, stateAbbr: 'CA' },
    { fips: '06065', county: 'Riverside', state: 'CA', city: 'Riverside', lat: 33.9533, lon: -117.3962, population: 330063, countyPop: 2470546, stateAbbr: 'CA' },
    { fips: '06071', county: 'San Bernardino', state: 'CA', city: 'San Bernardino', lat: 34.1083, lon: -117.2898, population: 222101, countyPop: 2194710, stateAbbr: 'CA' },
    { fips: '06067', county: 'Sacramento', state: 'CA', city: 'Sacramento', lat: 38.5816, lon: -121.4944, population: 524943, countyPop: 1585055, stateAbbr: 'CA' },
    { fips: '06001', county: 'Alameda', state: 'CA', city: 'Oakland', lat: 37.8044, lon: -122.2712, population: 440646, countyPop: 1671329, stateAbbr: 'CA' },
    { fips: '06013', county: 'Contra Costa', state: 'CA', city: 'Concord', lat: 37.9780, lon: -122.0311, population: 129295, countyPop: 1161413, stateAbbr: 'CA' },

    // COLORADO
    { fips: '08031', county: 'Denver', state: 'CO', city: 'Denver', lat: 39.7392, lon: -104.9903, population: 715522, countyPop: 715522, stateAbbr: 'CO' },
    { fips: '08041', county: 'El Paso', state: 'CO', city: 'Colorado Springs', lat: 38.8339, lon: -104.8214, population: 478221, countyPop: 730395, stateAbbr: 'CO' },
    { fips: '08123', county: 'Weld', state: 'CO', city: 'Greeley', lat: 40.4233, lon: -104.7091, population: 108649, countyPop: 328981, stateAbbr: 'CO' },
    { fips: '08069', county: 'Larimer', state: 'CO', city: 'Fort Collins', lat: 40.5853, lon: -105.0844, population: 169810, countyPop: 359066, stateAbbr: 'CO' },
    { fips: '08001', county: 'Adams', state: 'CO', city: 'Thornton', lat: 39.8681, lon: -104.9719, population: 141867, countyPop: 519572, stateAbbr: 'CO' },

    // CONNECTICUT
    { fips: '09003', county: 'Hartford', state: 'CT', city: 'Hartford', lat: 41.7658, lon: -72.6734, population: 121054, countyPop: 895841, stateAbbr: 'CT' },
    { fips: '09009', county: 'New Haven', state: 'CT', city: 'New Haven', lat: 41.3083, lon: -72.9279, population: 134023, countyPop: 864835, stateAbbr: 'CT' },
    { fips: '09001', county: 'Fairfield', state: 'CT', city: 'Bridgeport', lat: 41.1865, lon: -73.1952, population: 148654, countyPop: 957419, stateAbbr: 'CT' },

    // DELAWARE
    { fips: '10003', county: 'New Castle', state: 'DE', city: 'Wilmington', lat: 39.7391, lon: -75.5398, population: 70898, countyPop: 570719, stateAbbr: 'DE' },
    { fips: '10005', county: 'Sussex', state: 'DE', city: 'Georgetown', lat: 38.6901, lon: -75.3855, population: 7436, countyPop: 237378, stateAbbr: 'DE' },

    // FLORIDA
    { fips: '12086', county: 'Miami-Dade', state: 'FL', city: 'Miami', lat: 25.7617, lon: -80.1918, population: 467963, countyPop: 2716940, stateAbbr: 'FL' },
    { fips: '12011', county: 'Broward', state: 'FL', city: 'Fort Lauderdale', lat: 26.1224, lon: -80.1373, population: 182760, countyPop: 1944375, stateAbbr: 'FL' },
    { fips: '12099', county: 'Palm Beach', state: 'FL', city: 'West Palm Beach', lat: 26.7153, lon: -80.0534, population: 117415, countyPop: 1496770, stateAbbr: 'FL' },
    { fips: '12031', county: 'Duval', state: 'FL', city: 'Jacksonville', lat: 30.3322, lon: -81.6557, population: 949611, countyPop: 995567, stateAbbr: 'FL' },
    { fips: '12103', county: 'Pinellas', state: 'FL', city: 'St. Petersburg', lat: 27.7676, lon: -82.6403, population: 265351, countyPop: 959107, stateAbbr: 'FL' },
    { fips: '12057', county: 'Hillsborough', state: 'FL', city: 'Tampa', lat: 27.9506, lon: -82.4572, population: 399700, countyPop: 1459762, stateAbbr: 'FL' },
    { fips: '12095', county: 'Orange', state: 'FL', city: 'Orlando', lat: 28.5383, lon: -81.3792, population: 307573, countyPop: 1429908, stateAbbr: 'FL' },

    // GEORGIA
    { fips: '13121', county: 'Fulton', state: 'GA', city: 'Atlanta', lat: 33.7490, lon: -84.3880, population: 498715, countyPop: 1066710, stateAbbr: 'GA' },
    { fips: '13089', county: 'DeKalb', state: 'GA', city: 'Decatur', lat: 33.7748, lon: -84.2963, population: 24928, countyPop: 759297, stateAbbr: 'GA' },
    { fips: '13067', county: 'Cobb', state: 'GA', city: 'Marietta', lat: 33.9526, lon: -84.5499, population: 60972, countyPop: 766149, stateAbbr: 'GA' },
    { fips: '13135', county: 'Gwinnett', state: 'GA', city: 'Lawrenceville', lat: 33.9562, lon: -83.9880, population: 30629, countyPop: 957062, stateAbbr: 'GA' },
    { fips: '13051', county: 'Chatham', state: 'GA', city: 'Savannah', lat: 32.0809, lon: -81.0912, population: 147780, countyPop: 295291, stateAbbr: 'GA' },

    // HAWAII
    { fips: '15003', county: 'Honolulu', state: 'HI', city: 'Honolulu', lat: 21.3099, lon: -157.8581, population: 345064, countyPop: 1016508, stateAbbr: 'HI' },
    { fips: '15009', county: 'Maui', state: 'HI', city: 'Kahului', lat: 20.8893, lon: -156.4729, population: 26337, countyPop: 167417, stateAbbr: 'HI' },

    // IDAHO
    { fips: '16001', county: 'Ada', state: 'ID', city: 'Boise', lat: 43.6150, lon: -116.2023, population: 235684, countyPop: 494967, stateAbbr: 'ID' },
    { fips: '16019', county: 'Bonneville', state: 'ID', city: 'Idaho Falls', lat: 43.4917, lon: -112.0339, population: 64818, countyPop: 123964, stateAbbr: 'ID' },

    // ILLINOIS
    { fips: '17031', county: 'Cook', state: 'IL', city: 'Chicago', lat: 41.8781, lon: -87.6298, population: 2746388, countyPop: 5275541, stateAbbr: 'IL' },
    { fips: '17043', county: 'DuPage', state: 'IL', city: 'Naperville', lat: 41.7508, lon: -88.1535, population: 149540, countyPop: 932877, stateAbbr: 'IL' },
    { fips: '17097', county: 'Lake', state: 'IL', city: 'Waukegan', lat: 42.3636, lon: -87.8448, population: 89078, countyPop: 714342, stateAbbr: 'IL' },
    { fips: '17113', county: 'McLean', state: 'IL', city: 'Bloomington', lat: 40.4842, lon: -88.9937, population: 78680, countyPop: 172891, stateAbbr: 'IL' },
    { fips: '17167', county: 'Sangamon', state: 'IL', city: 'Springfield', lat: 39.7817, lon: -89.6501, population: 114394, countyPop: 196343, stateAbbr: 'IL' },

    // INDIANA
    { fips: '18097', county: 'Marion', state: 'IN', city: 'Indianapolis', lat: 39.7684, lon: -86.1581, population: 887642, countyPop: 977203, stateAbbr: 'IN' },
    { fips: '18003', county: 'Allen', state: 'IN', city: 'Fort Wayne', lat: 41.0793, lon: -85.1394, population: 270402, countyPop: 385410, stateAbbr: 'IN' },
    { fips: '18141', county: 'St. Joseph', state: 'IN', city: 'South Bend', lat: 41.6764, lon: -86.2520, population: 103453, countyPop: 272912, stateAbbr: 'IN' },
    { fips: '18089', county: 'Lake', state: 'IN', city: 'Hammond', lat: 41.5834, lon: -87.5001, population: 77879, countyPop: 498700, stateAbbr: 'IN' },

    // IOWA
    { fips: '19153', county: 'Polk', state: 'IA', city: 'Des Moines', lat: 41.5868, lon: -93.6250, population: 214133, countyPop: 492401, stateAbbr: 'IA' },
    { fips: '19113', county: 'Linn', state: 'IA', city: 'Cedar Rapids', lat: 42.0080, lon: -91.6447, population: 137710, countyPop: 230299, stateAbbr: 'IA' },
    { fips: '19163', county: 'Scott', state: 'IA', city: 'Davenport', lat: 41.5236, lon: -90.5776, population: 101724, countyPop: 174669, stateAbbr: 'IA' },

    // KANSAS
    { fips: '20173', county: 'Sedgwick', state: 'KS', city: 'Wichita', lat: 37.6872, lon: -97.3301, population: 397532, countyPop: 523824, stateAbbr: 'KS' },
    { fips: '20091', county: 'Johnson', state: 'KS', city: 'Overland Park', lat: 38.9822, lon: -94.6708, population: 197238, countyPop: 609863, stateAbbr: 'KS' },
    { fips: '20177', county: 'Shawnee', state: 'KS', city: 'Topeka', lat: 39.0558, lon: -95.6890, population: 126587, countyPop: 178909, stateAbbr: 'KS' },

    // KENTUCKY
    { fips: '21111', county: 'Jefferson', state: 'KY', city: 'Louisville', lat: 38.2527, lon: -85.7585, population: 633045, countyPop: 782969, stateAbbr: 'KY' },
    { fips: '21117', county: 'Kenton', state: 'KY', city: 'Covington', lat: 39.0836, lon: -84.5085, population: 40181, countyPop: 169064, stateAbbr: 'KY' },
    { fips: '21059', county: 'Fayette', state: 'KY', city: 'Lexington', lat: 38.0406, lon: -84.5037, population: 322570, countyPop: 322570, stateAbbr: 'KY' },

    // LOUISIANA
    { fips: '22071', county: 'Orleans', state: 'LA', city: 'New Orleans', lat: 29.9511, lon: -90.0715, population: 383997, countyPop: 383997, stateAbbr: 'LA' },
    { fips: '22033', county: 'East Baton Rouge', state: 'LA', city: 'Baton Rouge', lat: 30.4515, lon: -91.1871, population: 227470, countyPop: 456781, stateAbbr: 'LA' },
    { fips: '22051', county: 'Jefferson', state: 'LA', city: 'Metairie', lat: 29.9840, lon: -90.1528, population: 143507, countyPop: 440781, stateAbbr: 'LA' },
    { fips: '22017', county: 'Caddo', state: 'LA', city: 'Shreveport', lat: 32.5252, lon: -93.7502, population: 187593, countyPop: 237848, stateAbbr: 'LA' },

    // MAINE
    { fips: '23005', county: 'Cumberland', state: 'ME', city: 'Portland', lat: 43.6591, lon: -70.2568, population: 68408, countyPop: 303069, stateAbbr: 'ME' },
    { fips: '23019', county: 'Penobscot', state: 'ME', city: 'Bangor', lat: 44.8012, lon: -68.7778, population: 31753, countyPop: 152199, stateAbbr: 'ME' },

    // MARYLAND
    { fips: '24510', county: 'Baltimore City', state: 'MD', city: 'Baltimore', lat: 39.2904, lon: -76.6122, population: 585708, countyPop: 585708, stateAbbr: 'MD' },
    { fips: '24031', county: 'Montgomery', state: 'MD', city: 'Rockville', lat: 39.0840, lon: -77.1528, population: 67117, countyPop: 1062061, stateAbbr: 'MD' },
    { fips: '24003', county: 'Anne Arundel', state: 'MD', city: 'Annapolis', lat: 38.9784, lon: -76.4922, population: 40812, countyPop: 588261, stateAbbr: 'MD' },
    { fips: '24033', county: "Prince George's", state: 'MD', city: 'Bowie', lat: 39.0068, lon: -76.7791, population: 58329, countyPop: 967201, stateAbbr: 'MD' },

    // MASSACHUSETTS
    { fips: '25025', county: 'Suffolk', state: 'MA', city: 'Boston', lat: 42.3601, lon: -71.0589, population: 675647, countyPop: 797936, stateAbbr: 'MA' },
    { fips: '25017', county: 'Middlesex', state: 'MA', city: 'Cambridge', lat: 42.3736, lon: -71.1097, population: 118403, countyPop: 1632002, stateAbbr: 'MA' },
    { fips: '25013', county: 'Hampden', state: 'MA', city: 'Springfield', lat: 42.1015, lon: -72.5898, population: 155929, countyPop: 465825, stateAbbr: 'MA' },
    { fips: '25027', county: 'Worcester', state: 'MA', city: 'Worcester', lat: 42.2626, lon: -71.8023, population: 206518, countyPop: 862111, stateAbbr: 'MA' },

    // MICHIGAN
    { fips: '26163', county: 'Wayne', state: 'MI', city: 'Detroit', lat: 42.3314, lon: -83.0458, population: 639111, countyPop: 1793561, stateAbbr: 'MI' },
    { fips: '26081', county: 'Kent', state: 'MI', city: 'Grand Rapids', lat: 42.9634, lon: -85.6681, population: 198917, countyPop: 657974, stateAbbr: 'MI' },
    { fips: '26125', county: 'Oakland', state: 'MI', city: 'Troy', lat: 42.6064, lon: -83.1498, population: 87294, countyPop: 1274395, stateAbbr: 'MI' },
    { fips: '26099', county: 'Macomb', state: 'MI', city: 'Warren', lat: 42.5144, lon: -83.0277, population: 139387, countyPop: 881217, stateAbbr: 'MI' },
    { fips: '26065', county: 'Ingham', state: 'MI', city: 'Lansing', lat: 42.7325, lon: -84.5555, population: 112644, countyPop: 284900, stateAbbr: 'MI' },

    // MINNESOTA
    { fips: '27053', county: 'Hennepin', state: 'MN', city: 'Minneapolis', lat: 44.9778, lon: -93.2650, population: 429954, countyPop: 1281565, stateAbbr: 'MN' },
    { fips: '27123', county: 'Ramsey', state: 'MN', city: 'St. Paul', lat: 44.9537, lon: -93.0900, population: 311527, countyPop: 552352, stateAbbr: 'MN' },
    { fips: '27037', county: 'Dakota', state: 'MN', city: 'Burnsville', lat: 44.7677, lon: -93.2777, population: 64317, countyPop: 439882, stateAbbr: 'MN' },
    { fips: '27003', county: 'Anoka', state: 'MN', city: 'Blaine', lat: 45.1608, lon: -93.2350, population: 70222, countyPop: 363887, stateAbbr: 'MN' },

    // MISSISSIPPI
    { fips: '28049', county: 'Hinds', state: 'MS', city: 'Jackson', lat: 32.2988, lon: -90.1848, population: 153701, countyPop: 227742, stateAbbr: 'MS' },
    { fips: '28047', county: 'Harrison', state: 'MS', city: 'Gulfport', lat: 30.3674, lon: -89.0928, population: 72926, countyPop: 208621, stateAbbr: 'MS' },

    // MISSOURI
    { fips: '29510', county: 'St. Louis City', state: 'MO', city: 'St. Louis', lat: 38.6270, lon: -90.1994, population: 301578, countyPop: 301578, stateAbbr: 'MO' },
    { fips: '29095', county: 'Jackson', state: 'MO', city: 'Kansas City', lat: 39.0997, lon: -94.5786, population: 508090, countyPop: 717204, stateAbbr: 'MO' },
    { fips: '29189', county: 'St. Louis', state: 'MO', city: 'Chesterfield', lat: 38.6631, lon: -90.5771, population: 49999, countyPop: 1004125, stateAbbr: 'MO' },
    { fips: '29097', county: 'Jasper', state: 'MO', city: 'Joplin', lat: 37.0842, lon: -94.5133, population: 51762, countyPop: 123515, stateAbbr: 'MO' },

    // MONTANA
    { fips: '30111', county: 'Yellowstone', state: 'MT', city: 'Billings', lat: 45.7833, lon: -108.5007, population: 117116, countyPop: 164731, stateAbbr: 'MT' },
    { fips: '30063', county: 'Missoula', state: 'MT', city: 'Missoula', lat: 46.8721, lon: -113.9940, population: 73489, countyPop: 119600, stateAbbr: 'MT' },

    // NEBRASKA
    { fips: '31055', county: 'Douglas', state: 'NE', city: 'Omaha', lat: 41.2565, lon: -95.9345, population: 486051, countyPop: 584526, stateAbbr: 'NE' },
    { fips: '31109', county: 'Lancaster', state: 'NE', city: 'Lincoln', lat: 40.8136, lon: -96.7026, population: 291082, countyPop: 322608, stateAbbr: 'NE' },

    // NEVADA
    { fips: '32003', county: 'Clark', state: 'NV', city: 'Las Vegas', lat: 36.1699, lon: -115.1398, population: 641903, countyPop: 2265461, stateAbbr: 'NV' },
    { fips: '32031', county: 'Washoe', state: 'NV', city: 'Reno', lat: 39.5296, lon: -119.8138, population: 264165, countyPop: 486492, stateAbbr: 'NV' },
    { fips: '32510', county: 'Carson City', state: 'NV', city: 'Carson City', lat: 39.1638, lon: -119.7674, population: 58639, countyPop: 58639, stateAbbr: 'NV' },

    // NEW HAMPSHIRE
    { fips: '33011', county: 'Hillsborough', state: 'NH', city: 'Manchester', lat: 42.9956, lon: -71.4548, population: 115644, countyPop: 422937, stateAbbr: 'NH' },
    { fips: '33015', county: 'Rockingham', state: 'NH', city: 'Nashua', lat: 42.7654, lon: -71.4676, population: 91322, countyPop: 314176, stateAbbr: 'NH' },

    // NEW JERSEY
    { fips: '34013', county: 'Essex', state: 'NJ', city: 'Newark', lat: 40.7357, lon: -74.1724, population: 311549, countyPop: 863728, stateAbbr: 'NJ' },
    { fips: '34003', county: 'Bergen', state: 'NJ', city: 'Hackensack', lat: 40.8859, lon: -74.0435, population: 46030, countyPop: 955732, stateAbbr: 'NJ' },
    { fips: '34017', county: 'Hudson', state: 'NJ', city: 'Jersey City', lat: 40.7178, lon: -74.0431, population: 292449, countyPop: 724854, stateAbbr: 'NJ' },
    { fips: '34023', county: 'Middlesex', state: 'NJ', city: 'New Brunswick', lat: 40.4862, lon: -74.4518, population: 55676, countyPop: 863162, stateAbbr: 'NJ' },

    // NEW MEXICO
    { fips: '35001', county: 'Bernalillo', state: 'NM', city: 'Albuquerque', lat: 35.0844, lon: -106.6504, population: 564559, countyPop: 676685, stateAbbr: 'NM' },
    { fips: '35013', county: 'Doña Ana', state: 'NM', city: 'Las Cruces', lat: 32.3199, lon: -106.7637, population: 111385, countyPop: 219561, stateAbbr: 'NM' },
    { fips: '35045', county: 'San Juan', state: 'NM', city: 'Farmington', lat: 36.7281, lon: -108.2187, population: 46624, countyPop: 121661, stateAbbr: 'NM' },

    // NEW YORK
    { fips: '36061', county: 'New York', state: 'NY', city: 'Manhattan', lat: 40.7831, lon: -73.9712, population: 1694263, countyPop: 1694263, stateAbbr: 'NY' },
    { fips: '36047', county: 'Kings', state: 'NY', city: 'Brooklyn', lat: 40.6782, lon: -73.9442, population: 2736074, countyPop: 2736074, stateAbbr: 'NY' },
    { fips: '36081', county: 'Queens', state: 'NY', city: 'Queens', lat: 40.7282, lon: -73.7949, population: 2405464, countyPop: 2405464, stateAbbr: 'NY' },
    { fips: '36005', county: 'Bronx', state: 'NY', city: 'Bronx', lat: 40.8448, lon: -73.8648, population: 1472654, countyPop: 1472654, stateAbbr: 'NY' },
    { fips: '36029', county: 'Erie', state: 'NY', city: 'Buffalo', lat: 42.8864, lon: -78.8784, population: 278349, countyPop: 954236, stateAbbr: 'NY' },
    { fips: '36055', county: 'Monroe', state: 'NY', city: 'Rochester', lat: 43.1566, lon: -77.6088, population: 211328, countyPop: 759443, stateAbbr: 'NY' },
    { fips: '36063', county: 'Niagara', state: 'NY', city: 'Niagara Falls', lat: 43.0945, lon: -79.0377, population: 48671, countyPop: 212666, stateAbbr: 'NY' },
    { fips: '36001', county: 'Albany', state: 'NY', city: 'Albany', lat: 42.6526, lon: -73.7562, population: 99224, countyPop: 314848, stateAbbr: 'NY' },

    // NORTH CAROLINA
    { fips: '37119', county: 'Mecklenburg', state: 'NC', city: 'Charlotte', lat: 35.2271, lon: -80.8431, population: 879709, countyPop: 1115482, stateAbbr: 'NC' },
    { fips: '37183', county: 'Wake', state: 'NC', city: 'Raleigh', lat: 35.7796, lon: -78.6382, population: 474069, countyPop: 1129410, stateAbbr: 'NC' },
    { fips: '37081', county: 'Guilford', state: 'NC', city: 'Greensboro', lat: 36.0726, lon: -79.7920, population: 299035, countyPop: 541299, stateAbbr: 'NC' },
    { fips: '37067', county: 'Forsyth', state: 'NC', city: 'Winston-Salem', lat: 36.0999, lon: -80.2442, population: 247945, countyPop: 382590, stateAbbr: 'NC' },
    { fips: '37129', county: 'New Hanover', state: 'NC', city: 'Wilmington', lat: 34.2257, lon: -77.9447, population: 115451, countyPop: 234473, stateAbbr: 'NC' },

    // NORTH DAKOTA
    { fips: '38015', county: 'Burleigh', state: 'ND', city: 'Bismarck', lat: 46.8083, lon: -100.7837, population: 73622, countyPop: 98458, stateAbbr: 'ND' },
    { fips: '38017', county: 'Cass', state: 'ND', city: 'Fargo', lat: 46.8772, lon: -96.7898, population: 125990, countyPop: 184525, stateAbbr: 'ND' },

    // OHIO
    { fips: '39035', county: 'Cuyahoga', state: 'OH', city: 'Cleveland', lat: 41.4993, lon: -81.6944, population: 372624, countyPop: 1264817, stateAbbr: 'OH' },
    { fips: '39049', county: 'Franklin', state: 'OH', city: 'Columbus', lat: 39.9612, lon: -82.9988, population: 905748, countyPop: 1326063, stateAbbr: 'OH' },
    { fips: '39061', county: 'Hamilton', state: 'OH', city: 'Cincinnati', lat: 39.1031, lon: -84.5120, population: 309317, countyPop: 830639, stateAbbr: 'OH' },
    { fips: '39113', county: 'Montgomery', state: 'OH', city: 'Dayton', lat: 39.7589, lon: -84.1916, population: 137644, countyPop: 537309, stateAbbr: 'OH' },
    { fips: '39095', county: 'Lucas', state: 'OH', city: 'Toledo', lat: 41.6528, lon: -83.5379, population: 270871, countyPop: 431279, stateAbbr: 'OH' },
    { fips: '39153', county: 'Summit', state: 'OH', city: 'Akron', lat: 41.0814, lon: -81.5190, population: 190469, countyPop: 540428, stateAbbr: 'OH' },

    // OKLAHOMA
    { fips: '40109', county: 'Oklahoma', state: 'OK', city: 'Oklahoma City', lat: 35.4676, lon: -97.5164, population: 687725, countyPop: 797434, stateAbbr: 'OK' },
    { fips: '40143', county: 'Tulsa', state: 'OK', city: 'Tulsa', lat: 36.1540, lon: -95.9928, population: 413066, countyPop: 669279, stateAbbr: 'OK' },
    { fips: '40027', county: 'Cleveland', state: 'OK', city: 'Norman', lat: 35.2226, lon: -97.4395, population: 128026, countyPop: 295528, stateAbbr: 'OK' },

    // OREGON
    { fips: '41051', county: 'Multnomah', state: 'OR', city: 'Portland', lat: 45.5152, lon: -122.6784, population: 652503, countyPop: 815428, stateAbbr: 'OR' },
    { fips: '41039', county: 'Lane', state: 'OR', city: 'Eugene', lat: 44.0521, lon: -123.0868, population: 176654, countyPop: 382971, stateAbbr: 'OR' },
    { fips: '41047', county: 'Marion', state: 'OR', city: 'Salem', lat: 44.9429, lon: -123.0351, population: 175535, countyPop: 345920, stateAbbr: 'OR' },
    { fips: '41017', county: 'Deschutes', state: 'OR', city: 'Bend', lat: 44.0582, lon: -121.3153, population: 99178, countyPop: 198253, stateAbbr: 'OR' },

    // PENNSYLVANIA
    { fips: '42101', county: 'Philadelphia', state: 'PA', city: 'Philadelphia', lat: 39.9526, lon: -75.1652, population: 1603797, countyPop: 1603797, stateAbbr: 'PA' },
    { fips: '42003', county: 'Allegheny', state: 'PA', city: 'Pittsburgh', lat: 40.4406, lon: -79.9959, population: 302971, countyPop: 1250578, stateAbbr: 'PA' },
    { fips: '42017', county: 'Bucks', state: 'PA', city: 'Bensalem', lat: 40.1043, lon: -74.9510, population: 60427, countyPop: 646538, stateAbbr: 'PA' },
    { fips: '42091', county: 'Montgomery', state: 'PA', city: 'Norristown', lat: 40.1215, lon: -75.3399, population: 35748, countyPop: 856553, stateAbbr: 'PA' },
    { fips: '42041', county: 'Cumberland', state: 'PA', city: 'Carlisle', lat: 40.2015, lon: -77.1889, population: 20118, countyPop: 259469, stateAbbr: 'PA' },

    // RHODE ISLAND
    { fips: '44007', county: 'Providence', state: 'RI', city: 'Providence', lat: 41.8240, lon: -71.4128, population: 190934, countyPop: 660741, stateAbbr: 'RI' },
    { fips: '44003', county: 'Kent', state: 'RI', city: 'Warwick', lat: 41.7001, lon: -71.4162, population: 82823, countyPop: 170363, stateAbbr: 'RI' },

    // SOUTH CAROLINA
    { fips: '45045', county: 'Greenville', state: 'SC', city: 'Greenville', lat: 34.8526, lon: -82.3940, population: 70720, countyPop: 525534, stateAbbr: 'SC' },
    { fips: '45019', county: 'Charleston', state: 'SC', city: 'Charleston', lat: 32.7765, lon: -79.9311, population: 150227, countyPop: 408235, stateAbbr: 'SC' },
    { fips: '45079', county: 'Richland', state: 'SC', city: 'Columbia', lat: 34.0007, lon: -81.0348, population: 136632, countyPop: 416147, stateAbbr: 'SC' },

    // SOUTH DAKOTA
    { fips: '46099', county: 'Minnehaha', state: 'SD', city: 'Sioux Falls', lat: 43.5460, lon: -96.7313, population: 192517, countyPop: 197214, stateAbbr: 'SD' },
    { fips: '46103', county: 'Pennington', state: 'SD', city: 'Rapid City', lat: 44.0805, lon: -103.2310, population: 74703, countyPop: 116721, stateAbbr: 'SD' },

    // TENNESSEE
    { fips: '47037', county: 'Davidson', state: 'TN', city: 'Nashville', lat: 36.1627, lon: -86.7816, population: 689447, countyPop: 715884, stateAbbr: 'TN' },
    { fips: '47157', county: 'Shelby', state: 'TN', city: 'Memphis', lat: 35.1495, lon: -90.0490, population: 633104, countyPop: 927644, stateAbbr: 'TN' },
    { fips: '47093', county: 'Knox', state: 'TN', city: 'Knoxville', lat: 35.9606, lon: -83.9207, population: 190740, countyPop: 478971, stateAbbr: 'TN' },
    { fips: '47065', county: 'Hamilton', state: 'TN', city: 'Chattanooga', lat: 35.0456, lon: -85.3097, population: 181099, countyPop: 366207, stateAbbr: 'TN' },

    // TEXAS
    { fips: '48201', county: 'Harris', state: 'TX', city: 'Houston', lat: 29.7604, lon: -95.3698, population: 2304580, countyPop: 4731145, stateAbbr: 'TX' },
    { fips: '48113', county: 'Dallas', state: 'TX', city: 'Dallas', lat: 32.7767, lon: -96.7970, population: 1343573, countyPop: 2647787, stateAbbr: 'TX' },
    { fips: '48029', county: 'Bexar', state: 'TX', city: 'San Antonio', lat: 29.4241, lon: -98.4936, population: 1547253, countyPop: 2009324, stateAbbr: 'TX' },
    { fips: '48439', county: 'Tarrant', state: 'TX', city: 'Fort Worth', lat: 32.7555, lon: -97.3308, population: 935508, countyPop: 2110640, stateAbbr: 'TX' },
    { fips: '48453', county: 'Travis', state: 'TX', city: 'Austin', lat: 30.2672, lon: -97.7431, population: 978908, countyPop: 1290188, stateAbbr: 'TX' },
    { fips: '48141', county: 'El Paso', state: 'TX', city: 'El Paso', lat: 31.7619, lon: -106.4850, population: 678815, countyPop: 865657, stateAbbr: 'TX' },
    { fips: '48085', county: 'Collin', state: 'TX', city: 'Plano', lat: 33.0198, lon: -96.6989, population: 285494, countyPop: 1064465, stateAbbr: 'TX' },
    { fips: '48061', county: 'Cameron', state: 'TX', city: 'Brownsville', lat: 25.9017, lon: -97.4975, population: 186738, countyPop: 421017, stateAbbr: 'TX' },
    { fips: '48215', county: 'Hidalgo', state: 'TX', city: 'McAllen', lat: 26.2034, lon: -98.2300, population: 142210, countyPop: 870781, stateAbbr: 'TX' },

    // UTAH
    { fips: '49035', county: 'Salt Lake', state: 'UT', city: 'Salt Lake City', lat: 40.7608, lon: -111.8910, population: 200567, countyPop: 1185238, stateAbbr: 'UT' },
    { fips: '49049', county: 'Utah', state: 'UT', city: 'Provo', lat: 40.2338, lon: -111.6585, population: 115162, countyPop: 665665, stateAbbr: 'UT' },
    { fips: '49011', county: 'Davis', state: 'UT', city: 'Layton', lat: 41.0602, lon: -111.9711, population: 81773, countyPop: 362679, stateAbbr: 'UT' },

    // VERMONT
    { fips: '50007', county: 'Chittenden', state: 'VT', city: 'Burlington', lat: 44.4759, lon: -73.2121, population: 44743, countyPop: 169555, stateAbbr: 'VT' },
    { fips: '50027', county: 'Windsor', state: 'VT', city: 'Hartford', lat: 43.6564, lon: -72.3481, population: 10686, countyPop: 57753, stateAbbr: 'VT' },

    // VIRGINIA
    { fips: '51760', county: 'Richmond City', state: 'VA', city: 'Richmond', lat: 37.5407, lon: -77.4360, population: 230436, countyPop: 230436, stateAbbr: 'VA' },
    { fips: '51059', county: 'Fairfax', state: 'VA', city: 'Fairfax', lat: 38.8462, lon: -77.3064, population: 24019, countyPop: 1150309, stateAbbr: 'VA' },
    { fips: '51810', county: 'Virginia Beach City', state: 'VA', city: 'Virginia Beach', lat: 36.8529, lon: -75.9780, population: 459470, countyPop: 459470, stateAbbr: 'VA' },
    { fips: '51650', county: 'Hampton City', state: 'VA', city: 'Hampton', lat: 37.0299, lon: -76.3452, population: 137148, countyPop: 137148, stateAbbr: 'VA' },
    { fips: '51710', county: 'Norfolk City', state: 'VA', city: 'Norfolk', lat: 36.8508, lon: -76.2859, population: 238005, countyPop: 238005, stateAbbr: 'VA' },

    // WASHINGTON
    { fips: '53033', county: 'King', state: 'WA', city: 'Seattle', lat: 47.6062, lon: -122.3321, population: 753675, countyPop: 2269675, stateAbbr: 'WA' },
    { fips: '53053', county: 'Pierce', state: 'WA', city: 'Tacoma', lat: 47.2529, lon: -122.4443, population: 219346, countyPop: 921130, stateAbbr: 'WA' },
    { fips: '53061', county: 'Snohomish', state: 'WA', city: 'Everett', lat: 47.9790, lon: -122.2021, population: 110629, countyPop: 827957, stateAbbr: 'WA' },
    { fips: '53063', county: 'Spokane', state: 'WA', city: 'Spokane', lat: 47.6588, lon: -117.4260, population: 228989, countyPop: 539339, stateAbbr: 'WA' },
    { fips: '53011', county: 'Clark', state: 'WA', city: 'Vancouver', lat: 45.6387, lon: -122.6615, population: 190915, countyPop: 503311, stateAbbr: 'WA' },

    // WEST VIRGINIA
    { fips: '54039', county: 'Kanawha', state: 'WV', city: 'Charleston', lat: 38.3498, lon: -81.6326, population: 46536, countyPop: 180745, stateAbbr: 'WV' },
    { fips: '54011', county: 'Cabell', state: 'WV', city: 'Huntington', lat: 38.4192, lon: -82.4452, population: 46842, countyPop: 94350, stateAbbr: 'WV' },

    // WISCONSIN
    { fips: '55079', county: 'Milwaukee', state: 'WI', city: 'Milwaukee', lat: 43.0389, lon: -87.9065, population: 577222, countyPop: 945726, stateAbbr: 'WI' },
    { fips: '55025', county: 'Dane', state: 'WI', city: 'Madison', lat: 43.0731, lon: -89.4012, population: 269840, countyPop: 561504, stateAbbr: 'WI' },
    { fips: '55009', county: 'Brown', state: 'WI', city: 'Green Bay', lat: 44.5133, lon: -88.0133, population: 105207, countyPop: 268740, stateAbbr: 'WI' },
    { fips: '55133', county: 'Waukesha', state: 'WI', city: 'Waukesha', lat: 43.0117, lon: -88.2315, population: 72419, countyPop: 406978, stateAbbr: 'WI' },

    // WYOMING
    { fips: '56025', county: 'Natrona', state: 'WY', city: 'Casper', lat: 42.8501, lon: -106.3252, population: 59038, countyPop: 79955, stateAbbr: 'WY' },
    { fips: '56021', county: 'Laramie', state: 'WY', city: 'Cheyenne', lat: 41.1400, lon: -104.8202, population: 65132, countyPop: 100512, stateAbbr: 'WY' }
];

// Calculate state populations for disaggregation
const statePopulations = {
    'AL': 5074296, 'AK': 733583, 'AZ': 7151502, 'AR': 3011524,
    'CA': 39538223, 'CO': 5773714, 'CT': 3605944, 'DE': 989948,
    'FL': 21538187, 'GA': 10711908, 'HI': 1455271, 'ID': 1839106,
    'IL': 12812508, 'IN': 6785528, 'IA': 3190369, 'KS': 2937880,
    'KY': 4505836, 'LA': 4657757, 'ME': 1362359, 'MD': 6177224,
    'MA': 7029917, 'MI': 10077331, 'MN': 5706494, 'MS': 2961279,
    'MO': 6154913, 'MT': 1084225, 'NE': 1961504, 'NV': 3104614,
    'NH': 1377529, 'NJ': 9288994, 'NM': 2117522, 'NY': 20201249,
    'NC': 10439388, 'ND': 779094, 'OH': 11799448, 'OK': 3959353,
    'OR': 4237256, 'PA': 13002700, 'RI': 1097379, 'SC': 5118425,
    'SD': 886667, 'TN': 6910840, 'TX': 29145505, 'UT': 3271616,
    'VT': 643077, 'VA': 8631393, 'WA': 7705281, 'WV': 1793716,
    'WI': 5893718, 'WY': 576851
};

// Add state population to each county
usCounties.forEach(county => {
    county.statePopulation = statePopulations[county.stateAbbr] || 1000000;
});
