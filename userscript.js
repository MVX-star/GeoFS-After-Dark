// ==UserScript==
// @name         GeoFS City Night Light Pollution
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Adds light pollution to cities at night like in real life
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function waitForGeoFS(callback) {
        if (typeof window.geofs !== "undefined" && geofs.api && geofs.api.viewer) {
            callback();
        } else {
            setTimeout(() => waitForGeoFS(callback), 500);
        }
    }

    waitForGeoFS(() => {
        console.log("✅ GeoFS detected!");
        initNightLights();
    });

    function initNightLights() {


        let currentMode = "manual";

        // ==========================
        // 🌟 ALTITUDE FADE
        // ==========================
        let glowAlphaMultiplier = 1;

        setInterval(() => {
    if (currentMode !== "auto") return;

    cities.forEach(city => {
        if (!city.entity) return;

        const target = isNightAt(city) ? 1 : 0;

        // Smooth fade speed
        const speed = 0.05;

        // Move brightness toward target
        city.brightness += (target - city.brightness) * speed;

        // Apply altitude fade too
        const finalIntensity = city.brightness * glowAlphaMultiplier;

        if (finalIntensity < 0.01) {
            city.entity.show = false;
        } else {
            city.entity.show = true;

            const baseIntensity = Math.min(Math.max(city.pop / 12000000, 0.5), 2.3);

            const color = getRegionColor(city.lat, city.lon);
city.color = color; // ✅ THIS LINE FIXES MOST OF IT

            city.entity.ellipse.material.image = glowCanvas(
                baseIntensity * finalIntensity,
                city.pop,
                color
            );
        }
    });

}, 100);

        // ==========================
// 🌟 GLOW GENERATOR
// ==========================
const glowCache = {};
function getRegionColor(lat, lon) {

    if (lat > 15 && lat < 75 && lon > -170 && lon < -50) {
        return [255, 225, 160]; // North America
    }

    if (lat < 15 && lat > -60 && lon > -90 && lon < -30) {
        return [255, 210, 140]; // South America
    }

    if (lat > 35 && lat < 70 && lon > -10 && lon < 40) {
        return [255, 235, 180]; // Europe
    }

    if (lat > -35 && lat < 35 && lon > -20 && lon < 50) {
        return [255, 200, 120]; // Africa
    }

    if (lat > 10 && lat < 40 && lon > 40 && lon < 65) {
        return [255, 210, 140]; // Middle East
    }

    if (lat > 5 && lat < 35 && lon > 65 && lon < 95) {
        return [255, 220, 150]; // India
    }

    if (lat > 20 && lat < 50 && lon > 100 && lon < 145) {
        return [255, 240, 200]; // East Asia
    }

    if (lat > -10 && lat < 25 && lon > 95 && lon < 140) {
        return [255, 210, 140]; // SE Asia
    }

    if (lat < -10 && lat > -45 && lon > 110 && lon < 155) {
        return [255, 230, 170]; // Australia
    }

    return [255, 235, 160]; // default
}

function glowCanvas(intensity = 1, pop = 1000000, color) {
    if (!color) color = [255,235,160];
    const key = `${Math.round(intensity*10)}_${Math.round(pop/100000)}_${color.join(",")}`;
    if (glowCache[key]) return glowCache[key];

    const size = 256; // bigger canvas for larger glow
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");

    ctx.globalCompositeOperation = "lighter";

    // base radial gradient glow
    const g = ctx.createRadialGradient(size/2, size/2, size*0.04, size/2, size/2, size*0.92);
g.addColorStop(0,   `rgba(${color[0]},${color[1]},${color[2]},${0.72*intensity})`);
g.addColorStop(0.35,`rgba(${color[0]},${color[1]},${color[2]},${0.28*intensity})`);
g.addColorStop(0.7, `rgba(${color[0]},${color[1]},${color[2]},${0.08*intensity})`);
g.addColorStop(1,   `rgba(${color[0]},${color[1]},${color[2]},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,size,size);

    // create lots of small overlapping dots
    const dots = Math.min(Math.max(pop/3000,120),400); // more dots for dense glow
    for (let j=0; j<dots; j++){
        const x = Math.random()*size;
        const y = Math.random()*size;
        const r = Math.random()*1.5 + 0.2; // bigger and more variable radius
        const alpha = Math.random()*0.3 + 0.1; // small transparency variation

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha*intensity})`;
        ctx.fill();
    }

    glowCache[key] = c;
    return c;
}

        // ==========================
        // 🌆 PASTE YOUR CITIES HERE
        // ==========================
        const cities = [
/* =========================
   🌎 AMERICAS (FINAL ~140)
========================= */

/* --- MEGACITIES --- */
{name:"São Paulo, Brazil", lat:-23.5505, lon:-46.6333, pop:23440000, timezone:-3},
{name:"Mexico City, Mexico", lat:19.4326, lon:-99.1332, pop:21800000, timezone:-6},
{name:"New York City, USA", lat:40.7128, lon:-74.0060, pop:19490000, timezone:-5},
{name:"Buenos Aires, Argentina", lat:-34.6037, lon:-58.3816, pop:16360000, timezone:-3},
{name:"Rio de Janeiro, Brazil", lat:-22.9068, lon:-43.1729, pop:13190000, timezone:-3},
{name:"Los Angeles, USA", lat:34.0522, lon:-118.2437, pop:12790000, timezone:-8},
{name:"Bogotá, Colombia", lat:4.7110, lon:-74.0721, pop:12770000, timezone:-5},
{name:"Lima, Peru", lat:-12.0464, lon:-77.0428, pop:11280000, timezone:-5},
{name:"Toronto, Canada", lat:43.6511, lon:-79.3839, pop:9760000, timezone:-5},
{name:"Chicago, USA", lat:41.8781, lon:-87.6298, pop:9290000, timezone:-6},

/* --- USA CORE --- */
{name:"Houston, USA", lat:29.7604, lon:-95.3698, pop:7100000, timezone:-6},
{name:"Dallas, USA", lat:32.7767, lon:-96.7970, pop:6400000, timezone:-6},
{name:"Miami, USA", lat:25.7617, lon:-80.1918, pop:6200000, timezone:-5},
{name:"Philadelphia, USA", lat:39.9526, lon:-75.1652, pop:6100000, timezone:-5},
{name:"Atlanta, USA", lat:33.7490, lon:-84.3880, pop:6000000, timezone:-5},
{name:"Washington DC, USA", lat:38.9072, lon:-77.0369, pop:6300000, timezone:-5},
{name:"Boston, USA", lat:42.3601, lon:-71.0589, pop:4900000, timezone:-5},
{name:"Phoenix, USA", lat:33.4484, lon:-112.0740, pop:5000000, timezone:-7},
{name:"San Francisco, USA", lat:37.7749, lon:-122.4194, pop:4800000, timezone:-8},
{name:"Seattle, USA", lat:47.6062, lon:-122.3321, pop:4000000, timezone:-8},
{name:"San Bernardino, USA", lat:34.0845, lon:-117.2919, pop:230000, timezone:-7},

{name:"Detroit, USA", lat:42.3314, lon:-83.0458, pop:3700000, timezone:-5},
{name:"Minneapolis, USA", lat:44.9778, lon:-93.2650, pop:3600000, timezone:-6},
{name:"Denver, USA", lat:39.7392, lon:-104.9903, pop:3000000, timezone:-7},
{name:"San Diego, USA", lat:32.7157, lon:-117.1611, pop:3300000, timezone:-8},
{name:"Tampa, USA", lat:27.9506, lon:-82.4572, pop:3200000, timezone:-5},
{name:"Orlando, USA", lat:28.5383, lon:-81.3792, pop:2700000, timezone:-5},
{name:"Charlotte, USA", lat:35.2271, lon:-80.8431, pop:2800000, timezone:-5},
{name:"San Antonio, USA", lat:29.4241, lon:-98.4936, pop:2600000, timezone:-6},
{name:"Austin, USA", lat:30.2672, lon:-97.7431, pop:2400000, timezone:-6},
{name:"Las Vegas, USA", lat:36.1699, lon:-115.1398, pop:2400000, timezone:-8},
{name:"Baltimore, USA", lat:39.2905, lon:-76.6104, pop:2300000, timezone:-5},

{name:"Portland, USA", lat:45.5152, lon:-122.6784, pop:2500000, timezone:-8},
{name:"Sacramento, USA", lat:38.5816, lon:-121.4944, pop:2300000, timezone:-8},
{name:"St. Louis, USA", lat:38.6270, lon:-90.1994, pop:2100000, timezone:-6},
{name:"Kansas City, USA", lat:39.0997, lon:-94.5786, pop:2100000, timezone:-6},
{name:"Cleveland, USA", lat:41.4993, lon:-81.6944, pop:2000000, timezone:-5},
{name:"Pittsburgh, USA", lat:40.4406, lon:-79.9959, pop:2300000, timezone:-5},
{name:"Cincinnati, USA", lat:39.1031, lon:-84.5120, pop:2200000, timezone:-5},
{name:"Columbus, USA", lat:39.9612, lon:-82.9988, pop:2100000, timezone:-5},
{name:"Indianapolis, USA", lat:39.7684, lon:-86.1581, pop:2100000, timezone:-5},
{name:"Nashville, USA", lat:36.1627, lon:-86.7816, pop:2000000, timezone:-6},

/* --- CANADA --- */
{name:"Montreal, Canada", lat:45.5017, lon:-73.5673, pop:4300000, timezone:-5},
{name:"Vancouver, Canada", lat:49.2827, lon:-123.1207, pop:2700000, timezone:-8},
{name:"Calgary, Canada", lat:51.0447, lon:-114.0719, pop:1600000, timezone:-7},
{name:"Ottawa, Canada", lat:45.4215, lon:-75.6972, pop:1400000, timezone:-5},
{name:"Edmonton, Canada", lat:53.5461, lon:-113.4938, pop:1400000, timezone:-7},
{name:"Quebec City, Canada", lat:46.8139, lon:-71.2080, pop:800000, timezone:-5},
{name:"Winnipeg, Canada", lat:49.8951, lon:-97.1384, pop:800000, timezone:-6},
{name:"Halifax, Canada", lat:44.6488, lon:-63.5752, pop:450000, timezone:-4},

/* --- MEXICO --- */
{name:"Guadalajara, Mexico", lat:20.6597, lon:-103.3496, pop:5500000, timezone:-6},
{name:"Monterrey, Mexico", lat:25.6866, lon:-100.3161, pop:5400000, timezone:-6},
{name:"Tijuana, Mexico", lat:32.5149, lon:-117.0382, pop:2200000, timezone:-8},
{name:"Puebla, Mexico", lat:19.0414, lon:-98.2063, pop:3200000, timezone:-6},
{name:"Cancún, Mexico", lat:21.1619, lon:-86.8515, pop:900000, timezone:-5},

/* --- CENTRAL AMERICA --- */
{name:"Guatemala City, Guatemala", lat:14.6349, lon:-90.5069, pop:3000000, timezone:-6},
{name:"San Salvador, El Salvador", lat:13.6929, lon:-89.2182, pop:2400000, timezone:-6},
{name:"Tegucigalpa, Honduras", lat:14.0723, lon:-87.1921, pop:1400000, timezone:-6},
{name:"Managua, Nicaragua", lat:12.1140, lon:-86.2362, pop:1400000, timezone:-6},
{name:"San Jose, Costa Rica", lat:9.9281, lon:-84.0907, pop:1500000, timezone:-6},
{name:"Panama City, Panama", lat:8.9824, lon:-79.5199, pop:1800000, timezone:-5},

/* --- CARIBBEAN --- */
{name:"Havana, Cuba", lat:23.1136, lon:-82.3666, pop:2100000, timezone:-5},
{name:"Santo Domingo, Dominican Republic", lat:18.4861, lon:-69.9312, pop:3400000, timezone:-4},
{name:"San Juan, Puerto Rico", lat:18.4655, lon:-66.1057, pop:2200000, timezone:-4},
{name:"Port-au-Prince, Haiti", lat:18.5944, lon:-72.3074, pop:2800000, timezone:-5},
{name:"Kingston, Jamaica", lat:17.9712, lon:-76.7936, pop:600000, timezone:-5},

/* --- SOUTH AMERICA --- */
{name:"Santiago, Chile", lat:-33.4489, lon:-70.6693, pop:7040000, timezone:-4},
{name:"Caracas, Venezuela", lat:10.4806, lon:-66.9036, pop:2900000, timezone:-4},
{name:"Quito, Ecuador", lat:-0.1807, lon:-78.4678, pop:2800000, timezone:-5},
{name:"Guayaquil, Ecuador", lat:-2.1700, lon:-79.9224, pop:3000000, timezone:-5},
{name:"La Paz, Bolivia", lat:-16.4897, lon:-68.1193, pop:2100000, timezone:-4},
{name:"Santa Cruz, Bolivia", lat:-17.7833, lon:-63.1821, pop:2200000, timezone:-4},

{name:"Montevideo, Uruguay", lat:-34.9011, lon:-56.1645, pop:1700000, timezone:-3},
{name:"Asunción, Paraguay", lat:-25.2637, lon:-57.5759, pop:2200000, timezone:-4},

{name:"Brasília, Brazil", lat:-15.8267, lon:-47.9218, pop:4700000, timezone:-3},
{name:"Salvador, Brazil", lat:-12.9777, lon:-38.5016, pop:4000000, timezone:-3},
{name:"Fortaleza, Brazil", lat:-3.7319, lon:-38.5267, pop:3900000, timezone:-3},
{name:"Belo Horizonte, Brazil", lat:-19.9167, lon:-43.9345, pop:6000000, timezone:-3},
{name:"Recife, Brazil", lat:-8.0476, lon:-34.8770, pop:4100000, timezone:-3},
{name:"Porto Alegre, Brazil", lat:-30.0346, lon:-51.2177, pop:4200000, timezone:-3},
{name:"Curitiba, Brazil", lat:-25.4284, lon:-49.2733, pop:3600000, timezone:-3},

{name:"Medellín, Colombia", lat:6.2442, lon:-75.5812, pop:4000000, timezone:-5},
{name:"Fort Worth, USA", lat:32.7555, lon:-97.3308, pop:2300000, timezone:-6},
{name:"El Paso, USA", lat:31.7619, lon:-106.4850, pop:900000, timezone:-7},
{name:"Memphis, USA", lat:35.1495, lon:-90.0490, pop:1300000, timezone:-6},
{name:"Louisville, USA", lat:38.2527, lon:-85.7585, pop:1400000, timezone:-5},
{name:"Milwaukee, USA", lat:43.0389, lon:-87.9065, pop:1600000, timezone:-6},
{name:"Albuquerque, USA", lat:35.0844, lon:-106.6504, pop:900000, timezone:-7},
{name:"Tucson, USA", lat:32.2226, lon:-110.9747, pop:1100000, timezone:-7},
{name:"Fresno, USA", lat:36.7378, lon:-119.7871, pop:1000000, timezone:-8},
{name:"Sacramento, USA", lat:38.5816, lon:-121.4944, pop:2300000, timezone:-8}, // already have, skip if exact dup
{name:"Mesa, USA", lat:33.4152, lon:-111.8315, pop:500000, timezone:-7},
{name:"Kansas City, USA", lat:39.0997, lon:-94.5786, pop:2100000, timezone:-6},
{name:"Atlanta, USA", lat:33.7490, lon:-84.3880, pop:6000000, timezone:-5},
{name:"Raleigh, USA", lat:35.7796, lon:-78.6382, pop:1400000, timezone:-5},
{name:"Virginia Beach, USA", lat:36.8529, lon:-75.9780, pop:450000, timezone:-5},
{name:"Oakland, USA", lat:37.8044, lon:-122.2712, pop:450000, timezone:-8},
{name:"Minneapolis, USA", lat:44.9778, lon:-93.2650, pop:3600000, timezone:-6},
{name:"Tulsa, USA", lat:36.1540, lon:-95.9928, pop:1000000, timezone:-6},
{name:"Arlington, USA", lat:32.7357, lon:-97.1081, pop:400000, timezone:-6},
{name:"New Orleans, USA", lat:29.9511, lon:-90.0715, pop:1300000, timezone:-6},
{name:"Wichita, USA", lat:37.6872, lon:-97.3301, pop:650000, timezone:-6},
{name:"Cleveland, USA", lat:41.4993, lon:-81.6944, pop:2000000, timezone:-5},
{name:"Bakersfield, USA", lat:35.3733, lon:-119.0187, pop:500000, timezone:-8},
{name:"Aurora, USA", lat:39.7294, lon:-104.8319, pop:400000, timezone:-7},
{name:"Anaheim, USA", lat:33.8366, lon:-117.9143, pop:350000, timezone:-8},
{name:"Honolulu, USA", lat:21.3069, lon:-157.8583, pop:1000000, timezone:-10},
{name:"Santa Ana, USA", lat:33.7455, lon:-117.8677, pop:300000, timezone:-8},
{name:"Riverside, USA", lat:33.9806, lon:-117.3755, pop:300000, timezone:-8},
{name:"Corpus Christi, USA", lat:27.8006, lon:-97.3964, pop:350000, timezone:-6},
{name:"Lexington, USA", lat:38.0406, lon:-84.5037, pop:350000, timezone:-5},
{name:"Henderson, USA", lat:36.0395, lon:-114.9817, pop:350000, timezone:-8},
{name:"Stockton, USA", lat:37.9577, lon:-121.2908, pop:300000, timezone:-8},
{name:"Saint Paul, USA", lat:44.9537, lon:-93.0900, pop:300000, timezone:-6},
{name:"Cincinnati, USA", lat:39.1031, lon:-84.5120, pop:2200000, timezone:-5},
{name:"St. Louis, USA", lat:38.6270, lon:-90.1994, pop:2100000, timezone:-6},
{name:"Pittsburgh, USA", lat:40.4406, lon:-79.9959, pop:2300000, timezone:-5},
{name:"Greensboro, USA", lat:36.0726, lon:-79.7920, pop:300000, timezone:-5},
{name:"Lincoln, USA", lat:40.8258, lon:-96.6852, pop:300000, timezone:-6},
{name:"Plano, USA", lat:33.0198, lon:-96.6989, pop:300000, timezone:-6},
{name:"Newark, USA", lat:40.7357, lon:-74.1724, pop:300000, timezone:-5},
{name:"Toledo, USA", lat:41.6528, lon:-83.5379, pop:300000, timezone:-5},
{name:"Orlando, USA", lat:28.5383, lon:-81.3792, pop:2700000, timezone:-5},
{name:"Chula Vista, USA", lat:32.6401, lon:-117.0842, pop:280000, timezone:-8},
{name:"Jersey City, USA", lat:40.7178, lon:-74.0431, pop:300000, timezone:-5},
{name:"Chandler, USA", lat:33.3062, lon:-111.8413, pop:280000, timezone:-7},
{name:"Laredo, USA", lat:27.5306, lon:-99.4803, pop:250000, timezone:-6},
{name:"Madison, USA", lat:43.0731, lon:-89.4012, pop:280000, timezone:-6},
{name:"Durham, USA", lat:35.9940, lon:-78.8986, pop:300000, timezone:-5},
{name:"Lubbock, USA", lat:33.5779, lon:-101.8552, pop:250000, timezone:-6},
{name:"Winston-Salem, USA", lat:36.0999, lon:-80.2442, pop:250000, timezone:-5},
{name:"Garland, USA", lat:32.9126, lon:-96.6389, pop:250000, timezone:-6},
{name:"Glendale, USA", lat:33.5387, lon:-112.1860, pop:250000, timezone:-7},
{name:"Hialeah, USA", lat:25.8576, lon:-80.2781, pop:230000, timezone:-5},
{name:"Reno, USA", lat:39.5296, lon:-119.8138, pop:250000, timezone:-8},
{name:"Baton Rouge, USA", lat:30.4515, lon:-91.1871, pop:450000, timezone:-6},
{name:"Irvine, USA", lat:33.6846, lon:-117.8265, pop:300000, timezone:-8},
{name:"Chesapeake, USA", lat:36.7682, lon:-76.2875, pop:250000, timezone:-5},
{name:"Irving, USA", lat:32.8140, lon:-96.9489, pop:250000, timezone:-6},
{name:"Scottsdale, USA", lat:33.4942, lon:-111.9261, pop:250000, timezone:-7},
{name:"North Las Vegas, USA", lat:36.1989, lon:-115.1175, pop:250000, timezone:-8},
{name:"Fremont, USA", lat:37.5485, lon:-121.9886, pop:230000, timezone:-8},
{name:"Gilbert, USA", lat:33.3528, lon:-111.7890, pop:250000, timezone:-7},
{name:"San Bernardino, USA", lat:34.1083, lon:-117.2898, pop:220000, timezone:-8},
{name:"Boise, USA", lat:43.6150, lon:-116.2023, pop:250000, timezone:-7},
{name:"Birmingham, USA", lat:33.5207, lon:-86.8025, pop:1100000, timezone:-6},
{name:"Rochester, USA", lat:43.1566, lon:-77.6088, pop:1100000, timezone:-5},
{name:"Richmond, USA", lat:37.5407, lon:-77.4360, pop:1300000, timezone:-5},
{name:"Spokane, USA", lat:47.6588, lon:-117.4260, pop:550000, timezone:-8},
{name:"Des Moines, USA", lat:41.5868, lon:-93.6250, pop:700000, timezone:-6},
{name:"Montgomery, USA", lat:32.3668, lon:-86.3000, pop:200000, timezone:-6},
{name:"Little Rock, USA", lat:34.7465, lon:-92.2896, pop:750000, timezone:-6},
{name:"Akron, USA", lat:41.0814, lon:-81.5190, pop:700000, timezone:-5},
{name:"Grand Rapids, USA", lat:42.9634, lon:-85.6681, pop:1100000, timezone:-5},
{name:"Salt Lake City, USA", lat:40.7608, lon:-111.8910, pop:1200000, timezone:-7},
{name:"Tallahassee, USA", lat:30.4383, lon:-84.2807, pop:400000, timezone:-5},
{name:"Worcester, USA", lat:42.2626, lon:-71.8023, pop:200000, timezone:-5},
{name:"Providence, USA", lat:41.8240, lon:-71.4128, pop:1600000, timezone:-5},
{name:"New Haven, USA", lat:41.3083, lon:-72.9279, pop:900000, timezone:-5},
{name:"Bridgeport, USA", lat:41.1865, lon:-73.1952, pop:150000, timezone:-5},
{name:"Hartford, USA", lat:41.7658, lon:-72.6734, pop:1200000, timezone:-5},
{name:"Buffalo, USA", lat:42.8864, lon:-78.8784, pop:1100000, timezone:-5},
{name:"Syracuse, USA", lat:43.0481, lon:-76.1474, pop:650000, timezone:-5},
{name:"Albany, USA", lat:42.6526, lon:-73.7562, pop:900000, timezone:-5},
{name:"Quebec City, Canada", lat:46.8139, lon:-71.2080, pop:800000, timezone:-5},
{name:"Hamilton, Canada", lat:43.2557, lon:-79.8711, pop:800000, timezone:-5},
{name:"Kitchener, Canada", lat:43.4516, lon:-80.4925, pop:600000, timezone:-5},
{name:"London, Canada", lat:42.9849, lon:-81.2453, pop:500000, timezone:-5},
{name:"Victoria, Canada", lat:48.4284, lon:-123.3656, pop:400000, timezone:-8},
{name:"Halifax, Canada", lat:44.6488, lon:-63.5752, pop:450000, timezone:-4},
{name:"Saskatoon, Canada", lat:52.1332, lon:-106.6700, pop:300000, timezone:-6},
{name:"Regina, Canada", lat:50.4452, lon:-104.6189, pop:250000, timezone:-6},
{name:"St. John's, Canada", lat:47.5615, lon:-52.7126, pop:200000, timezone:-3.5},
{name:"León, Mexico", lat:21.1250, lon:-101.6860, pop:1800000, timezone:-6},
{name:"Juárez, Mexico", lat:31.6904, lon:-106.4245, pop:1500000, timezone:-7},
{name:"Zapopan, Mexico", lat:20.7236, lon:-103.3848, pop:1400000, timezone:-6},
{name:"Nezahualcóyotl, Mexico", lat:19.4000, lon:-99.0333, pop:1100000, timezone:-6},
{name:"Chihuahua, Mexico", lat:28.6353, lon:-106.0889, pop:1000000, timezone:-6},
{name:"Mérida, Mexico", lat:20.9674, lon:-89.5926, pop:1200000, timezone:-6},
{name:"San Luis Potosí, Mexico", lat:22.1565, lon:-100.9855, pop:1200000, timezone:-6},
{name:"Aguascalientes, Mexico", lat:21.8853, lon:-102.2916, pop:1000000, timezone:-6},
{name:"Hermosillo, Mexico", lat:29.0729, lon:-110.9559, pop:900000, timezone:-7},
{name:"Saltillo, Mexico", lat:25.4232, lon:-101.0053, pop:900000, timezone:-6},
{name:"Mexicali, Mexico", lat:32.6245, lon:-115.4523, pop:1000000, timezone:-8},
{name:"Culiacán, Mexico", lat:24.8091, lon:-107.3940, pop:900000, timezone:-7},
{name:"Querétaro, Mexico", lat:20.5888, lon:-100.3899, pop:1200000, timezone:-6},
{name:"Morelia, Mexico", lat:19.7008, lon:-101.1844, pop:900000, timezone:-6},
{name:"Toluca, Mexico", lat:19.2826, lon:-99.6557, pop:2000000, timezone:-6},
{name:"Acapulco, Mexico", lat:16.8531, lon:-99.8237, pop:900000, timezone:-6},
{name:"Veracruz, Mexico", lat:19.1738, lon:-96.1342, pop:900000, timezone:-6},
{name:"Xalapa, Mexico", lat:19.5438, lon:-96.9102, pop:700000, timezone:-6},
{name:"Cancún, Mexico", lat:21.1619, lon:-86.8515, pop:900000, timezone:-5},
{name:"Tijuana, Mexico", lat:32.5149, lon:-117.0382, pop:2200000, timezone:-8},
{name:"Guadalajara, Mexico", lat:20.6597, lon:-103.3496, pop:5500000, timezone:-6},
{name:"Monterrey, Mexico", lat:25.6866, lon:-100.3161, pop:5400000, timezone:-6},
{name:"Puebla, Mexico", lat:19.0414, lon:-98.2063, pop:3200000, timezone:-6},
{name:"Maracaibo, Venezuela", lat:10.6427, lon:-71.6125, pop:2500000, timezone:-4},
{name:"Valencia, Venezuela", lat:10.1621, lon:-68.0077, pop:1800000, timezone:-4},
{name:"Barquisimeto, Venezuela", lat:10.0647, lon:-69.3570, pop:1200000, timezone:-4},
{name:"Maracay, Venezuela", lat:10.2469, lon:-67.5958, pop:1200000, timezone:-4},
{name:"Ciudad Guayana, Venezuela", lat:8.3533, lon:-62.6410, pop:1000000, timezone:-4},
{name:"Barranquilla, Colombia", lat:10.9685, lon:-74.7813, pop:2300000, timezone:-5},
{name:"Cartagena, Colombia", lat:10.3910, lon:-75.4794, pop:1100000, timezone:-5},
{name:"Cúcuta, Colombia", lat:7.8891, lon:-72.4967, pop:800000, timezone:-5},
{name:"Bucaramanga, Colombia", lat:7.1254, lon:-73.1198, pop:1300000, timezone:-5},
{name:"Pereira, Colombia", lat:4.8133, lon:-75.6961, pop:700000, timezone:-5},
{name:"Ibagué, Colombia", lat:4.4389, lon:-75.2322, pop:600000, timezone:-5},
{name:"Manizales, Colombia", lat:5.0689, lon:-75.5174, pop:500000, timezone:-5},
{name:"Santa Marta, Colombia", lat:11.2408, lon:-74.1990, pop:500000, timezone:-5},
{name:"Guayaquil, Ecuador", lat:-2.1700, lon:-79.9224, pop:3000000, timezone:-5},
{name:"Cuenca, Ecuador", lat:-2.9001, lon:-79.0059, pop:600000, timezone:-5},
{name:"Santo Domingo, Ecuador", lat:-0.2532, lon:-79.1754, pop:500000, timezone:-5},
{name:"Machala, Ecuador", lat:-3.2581, lon:-79.9554, pop:300000, timezone:-5},
{name:"Trujillo, Peru", lat:-8.1116, lon:-79.0288, pop:1000000, timezone:-5},
{name:"Chiclayo, Peru", lat:-6.7714, lon:-79.8409, pop:800000, timezone:-5},
{name:"Piura, Peru", lat:-5.1945, lon:-80.6328, pop:500000, timezone:-5},
{name:"Iquitos, Peru", lat:-3.7437, lon:-73.2516, pop:500000, timezone:-5},
{name:"Cusco, Peru", lat:-13.5319, lon:-71.9673, pop:500000, timezone:-5},
{name:"Arequipa, Peru", lat:-16.4090, lon:-71.5375, pop:1000000, timezone:-5},
{name:"La Paz, Bolivia", lat:-16.4897, lon:-68.1193, pop:2100000, timezone:-4},
{name:"Santa Cruz, Bolivia", lat:-17.7833, lon:-63.1821, pop:2200000, timezone:-4},
{name:"Cochabamba, Bolivia", lat:-17.3895, lon:-66.1568, pop:1400000, timezone:-4},
{name:"El Alto, Bolivia", lat:-16.5000, lon:-68.1500, pop:1000000, timezone:-4},
{name:"Sucre, Bolivia", lat:-19.0196, lon:-65.2619, pop:300000, timezone:-4},
{name:"Asunción, Paraguay", lat:-25.2637, lon:-57.5759, pop:2200000, timezone:-4},
{name:"Ciudad del Este, Paraguay", lat:-25.5097, lon:-54.6112, pop:300000, timezone:-4},
{name:"Montevideo, Uruguay", lat:-34.9011, lon:-56.1645, pop:1700000, timezone:-3},
{name:"Salto, Uruguay", lat:-31.3833, lon:-57.9667, pop:100000, timezone:-3},
{name:"Rosario, Argentina", lat:-32.9442, lon:-60.6505, pop:1300000, timezone:-3},
{name:"Córdoba, Argentina", lat:-31.4201, lon:-64.1888, pop:1500000, timezone:-3},
{name:"Mendoza, Argentina", lat:-32.8895, lon:-68.8458, pop:1200000, timezone:-3},
{name:"Tucumán, Argentina", lat:-26.8083, lon:-65.2176, pop:900000, timezone:-3},
{name:"La Plata, Argentina", lat:-34.9215, lon:-57.9545, pop:900000, timezone:-3},
{name:"Mar del Plata, Argentina", lat:-38.0055, lon:-57.5426, pop:700000, timezone:-3},
{name:"Salta, Argentina", lat:-24.7821, lon:-65.4232, pop:700000, timezone:-3},
{name:"Santa Fe, Argentina", lat:-31.6333, lon:-60.7000, pop:500000, timezone:-3},
{name:"Santiago, Chile", lat:-33.4489, lon:-70.6693, pop:7040000, timezone:-4},
{name:"Valparaíso, Chile", lat:-33.0472, lon:-71.6127, pop:900000, timezone:-4},
{name:"Concepción, Chile", lat:-36.8201, lon:-73.0444, pop:1000000, timezone:-4},
{name:"Antofagasta, Chile", lat:-23.6509, lon:-70.3975, pop:400000, timezone:-4},
{name:"Viña del Mar, Chile", lat:-33.0245, lon:-71.5518, pop:300000, timezone:-4},
{name:"Temuco, Chile", lat:-38.7359, lon:-72.5904, pop:300000, timezone:-4},
{name:"Iquique, Chile", lat:-20.2307, lon:-70.1356, pop:200000, timezone:-4},
{name:"Puerto Montt, Chile", lat:-41.4693, lon:-72.9424, pop:250000, timezone:-4},
{name:"Brasília, Brazil", lat:-15.8267, lon:-47.9218, pop:4700000, timezone:-3},
{name:"Salvador, Brazil", lat:-12.9777, lon:-38.5016, pop:4000000, timezone:-3},
{name:"Fortaleza, Brazil", lat:-3.7319, lon:-38.5267, pop:3900000, timezone:-3},
{name:"Belo Horizonte, Brazil", lat:-19.9167, lon:-43.9345, pop:6000000, timezone:-3},
{name:"Manaus, Brazil", lat:-3.1190, lon:-60.0217, pop:2200000, timezone:-4},
{name:"Curitiba, Brazil", lat:-25.4284, lon:-49.2733, pop:3600000, timezone:-3},
{name:"Recife, Brazil", lat:-8.0476, lon:-34.8770, pop:4100000, timezone:-3},
{name:"Porto Alegre, Brazil", lat:-30.0346, lon:-51.2177, pop:4200000, timezone:-3},
{name:"Belém, Brazil", lat:-1.4558, lon:-48.4902, pop:2500000, timezone:-3},
{name:"Goiânia, Brazil", lat:-16.6869, lon:-49.2648, pop:2500000, timezone:-3},
{name:"Guarulhos, Brazil", lat:-23.4538, lon:-46.5333, pop:1400000, timezone:-3},
{name:"Campinas, Brazil", lat:-22.9056, lon:-47.0608, pop:1200000, timezone:-3},
{name:"São Luís, Brazil", lat:-2.5387, lon:-44.2825, pop:1100000, timezone:-3},
{name:"São Gonçalo, Brazil", lat:-22.8268, lon:-43.0539, pop:1000000, timezone:-3},
{name:"Maceió, Brazil", lat:-9.6658, lon:-35.7350, pop:1000000, timezone:-3},
{name:"Duque de Caxias, Brazil", lat:-22.7858, lon:-43.3117, pop:900000, timezone:-3},
{name:"Natal, Brazil", lat:-5.7945, lon:-35.2110, pop:900000, timezone:-3},
{name:"Teresina, Brazil", lat:-5.0892, lon:-42.8019, pop:900000, timezone:-3},
{name:"Campo Grande, Brazil", lat:-20.4697, lon:-54.6201, pop:900000, timezone:-4},
{name:"Nova Iguaçu, Brazil", lat:-22.7592, lon:-43.4511, pop:800000, timezone:-3},
{name:"São Bernardo do Campo, Brazil", lat:-23.6914, lon:-46.5646, pop:800000, timezone:-3},
{name:"João Pessoa, Brazil", lat:-7.1195, lon:-34.8450, pop:800000, timezone:-3},
{name:"Santo André, Brazil", lat:-23.6639, lon:-46.5383, pop:700000, timezone:-3},
{name:"Osasco, Brazil", lat:-23.5329, lon:-46.7916, pop:700000, timezone:-3},
{name:"Jaboatão dos Guararapes, Brazil", lat:-8.1128, lon:-35.0150, pop:700000, timezone:-3},
{name:"São José dos Campos, Brazil", lat:-23.1791, lon:-45.8872, pop:700000, timezone:-3},
{name:"Ribeirão Preto, Brazil", lat:-21.1775, lon:-47.8103, pop:700000, timezone:-3},
{name:"Uberlândia, Brazil", lat:-18.9186, lon:-48.2772, pop:700000, timezone:-3},
{name:"Contagem, Brazil", lat:-19.9317, lon:-44.0539, pop:600000, timezone:-3},
{name:"Sorocaba, Brazil", lat:-23.5015, lon:-47.4526, pop:700000, timezone:-3},
{name:"Aracaju, Brazil", lat:-10.9472, lon:-37.0731, pop:600000, timezone:-3},
{name:"Feira de Santana, Brazil", lat:-12.2664, lon:-38.9663, pop:600000, timezone:-3},
{name:"Cuiabá, Brazil", lat:-15.6010, lon:-56.0974, pop:600000, timezone:-4},
{name:"Joinville, Brazil", lat:-26.3045, lon:-48.8487, pop:600000, timezone:-3},
{name:"Juiz de Fora, Brazil", lat:-21.7642, lon:-43.3503, pop:500000, timezone:-3},
{name:"Londrina, Brazil", lat:-23.3045, lon:-51.1696, pop:500000, timezone:-3},
{name:"Niterói, Brazil", lat:-22.8833, lon:-43.1036, pop:500000, timezone:-3},
{name:"Anápolis, Brazil", lat:-16.3281, lon:-48.9530, pop:400000, timezone:-3},
{name:"Porto Velho, Brazil", lat:-8.7612, lon:-63.9004, pop:500000, timezone:-4},
{name:"Serra, Brazil", lat:-20.1286, lon:-40.3078, pop:500000, timezone:-3},
{name:"Caxias do Sul, Brazil", lat:-29.1685, lon:-51.1794, pop:500000, timezone:-3},
{name:"Campos dos Goytacazes, Brazil", lat:-21.7523, lon:-41.3304, pop:500000, timezone:-3},
{name:"Vila Velha, Brazil", lat:-20.3297, lon:-40.2925, pop:500000, timezone:-3},
{name:"Florianópolis, Brazil", lat:-27.5954, lon:-48.5480, pop:500000, timezone:-3},
{name:"Mauá, Brazil", lat:-23.6678, lon:-46.4613, pop:500000, timezone:-3},
{name:"São João de Meriti, Brazil", lat:-22.8039, lon:-43.3722, pop:500000, timezone:-3},
{name:"São José do Rio Preto, Brazil", lat:-20.8113, lon:-49.3758, pop:500000, timezone:-3},
{name:"Mogi das Cruzes, Brazil", lat:-23.5226, lon:-46.1879, pop:400000, timezone:-3},
{name:"Diadema, Brazil", lat:-23.6861, lon:-46.6228, pop:400000, timezone:-3},
{name:"Campina Grande, Brazil", lat:-7.2307, lon:-35.8811, pop:400000, timezone:-3},
{name:"Jundiaí, Brazil", lat:-23.1857, lon:-46.8978, pop:400000, timezone:-3},
{name:"Caruaru, Brazil", lat:-8.2846, lon:-35.9699, pop:400000, timezone:-3},
{name:"Olinda, Brazil", lat:-8.0089, lon:-34.8553, pop:400000, timezone:-3},
{name:"Piracicaba, Brazil", lat:-22.7253, lon:-47.6493, pop:400000, timezone:-3},
{name:"Bauru, Brazil", lat:-22.3147, lon:-49.0605, pop:400000, timezone:-3},
{name:"Montes Claros, Brazil", lat:-16.7350, lon:-43.8617, pop:400000, timezone:-3},
{name:"Rio Branco, Brazil", lat:-9.9754, lon:-67.8249, pop:400000, timezone:-5},
{name:"Ananindeua, Brazil", lat:-1.3656, lon:-48.3722, pop:500000, timezone:-3},
{name:"São Vicente, Brazil", lat:-23.9631, lon:-46.3919, pop:400000, timezone:-3},
{name:"Cariacica, Brazil", lat:-20.2639, lon:-40.4167, pop:400000, timezone:-3},
{name:"Vitória, Brazil", lat:-20.3155, lon:-40.3128, pop:400000, timezone:-3},
{name:"Pelotas, Brazil", lat:-31.7654, lon:-52.3376, pop:300000, timezone:-3},
{name:"Canoas, Brazil", lat:-29.9178, lon:-51.1836, pop:300000, timezone:-3},
{name:"Franca, Brazil", lat:-20.5386, lon:-47.4009, pop:300000, timezone:-3},
{name:"Ponta Grossa, Brazil", lat:-25.0950, lon:-50.1619, pop:300000, timezone:-3},
{name:"Blumenau, Brazil", lat:-26.9194, lon:-49.0661, pop:300000, timezone:-3},
{name:"Petrolina, Brazil", lat:-9.3891, lon:-40.5030, pop:300000, timezone:-3},
{name:"Paulista, Brazil", lat:-7.9408, lon:-34.8731, pop:300000, timezone:-3},
{name:"Ribeirão das Neves, Brazil", lat:-19.7669, lon:-44.0869, pop:300000, timezone:-3},
{name:"Cascavel, Brazil", lat:-24.9558, lon:-53.4553, pop:300000, timezone:-3},
{name:"Praia Grande, Brazil", lat:-24.0058, lon:-46.4028, pop:300000, timezone:-3},
{name:"São José de Ribamar, Brazil", lat:-2.5619, lon:-44.0542, pop:300000, timezone:-3},
{name:"Guarujá, Brazil", lat:-23.9931, lon:-46.2564, pop:300000, timezone:-3},
{name:"Taubaté, Brazil", lat:-23.0264, lon:-45.5553, pop:300000, timezone:-3},
{name:"Petrolina, Brazil", lat:-9.3891, lon:-40.5030, pop:300000, timezone:-3},
{name:"Limeira, Brazil", lat:-22.5647, lon:-47.4017, pop:300000, timezone:-3},
{name:"Suzano, Brazil", lat:-23.5425, lon:-46.3108, pop:300000, timezone:-3},
{name:"Petrópolis, Brazil", lat:-22.5050, lon:-43.1786, pop:300000, timezone:-3},
{name:"Volta Redonda, Brazil", lat:-22.5231, lon:-44.1042, pop:300000, timezone:-3},
{name:"Foz do Iguaçu, Brazil", lat:-25.5163, lon:-54.5854, pop:300000, timezone:-3},
{name:"Novo Hamburgo, Brazil", lat:-29.6783, lon:-51.1306, pop:250000, timezone:-3},
{name:"Colombo, Brazil", lat:-25.2917, lon:-49.2242, pop:250000, timezone:-3},
{name:"Magé, Brazil", lat:-22.6528, lon:-43.0408, pop:250000, timezone:-3},
{name:"Itaboraí, Brazil", lat:-22.7444, lon:-42.8592, pop:250000, timezone:-3},
{name:"Várzea Grande, Brazil", lat:-15.6467, lon:-56.1325, pop:250000, timezone:-4},
{name:"Santa Maria, Brazil", lat:-29.6842, lon:-53.8069, pop:250000, timezone:-3},
{name:"Gravataí, Brazil", lat:-29.9442, lon:-50.9919, pop:250000, timezone:-3},
{name:"Governador Valadares, Brazil", lat:-18.8500, lon:-41.9500, pop:250000, timezone:-3},
{name:"Barueri, Brazil", lat:-23.5106, lon:-46.8761, pop:250000, timezone:-3},
{name:"Embu das Artes, Brazil", lat:-23.6489, lon:-46.8522, pop:250000, timezone:-3},
{name:"Taubaté, Brazil", lat:-23.0264, lon:-45.5553, pop:300000, timezone:-3},
{name:"Indaiatuba, Brazil", lat:-23.0903, lon:-47.2181, pop:250000, timezone:-3},
{name:"São Carlos, Brazil", lat:-22.0175, lon:-47.8910, pop:250000, timezone:-3},
{name:"Jacareí, Brazil", lat:-23.3053, lon:-45.9658, pop:250000, timezone:-3},
{name:"Americana, Brazil", lat:-22.7392, lon:-47.3314, pop:250000, timezone:-3},
{name:"Araraquara, Brazil", lat:-21.7944, lon:-48.1756, pop:250000, timezone:-3},
{name:"Marília, Brazil", lat:-22.2139, lon:-49.9458, pop:250000, timezone:-3},
{name:"Presidente Prudente, Brazil", lat:-22.1256, lon:-51.3889, pop:250000, timezone:-3},
{name:"Rio Claro, Brazil", lat:-22.4114, lon:-47.5614, pop:250000, timezone:-3},
{name:"Hortolândia, Brazil", lat:-22.8583, lon:-47.2200, pop:250000, timezone:-3},
{name:"Itu, Brazil", lat:-23.2642, lon:-47.2992, pop:200000, timezone:-3},
{name:"Bragança Paulista, Brazil", lat:-22.9527, lon:-46.5419, pop:200000, timezone:-3},
{name:"Pindamonhangaba, Brazil", lat:-22.9239, lon:-45.4617, pop:200000, timezone:-3},
{name:"Atibaia, Brazil", lat:-23.1169, lon:-46.5503, pop:200000, timezone:-3},
{name:"Catanduva, Brazil", lat:-21.1378, lon:-48.9728, pop:150000, timezone:-3},
{name:"Botucatu, Brazil", lat:-22.8858, lon:-48.4450, pop:150000, timezone:-3},
{name:"Barretos, Brazil", lat:-20.5572, lon:-48.5678, pop:150000, timezone:-3},
{name:"Araçatuba, Brazil", lat:-21.2089, lon:-50.4328, pop:200000, timezone:-3},
{name:"Ourinhos, Brazil", lat:-22.9789, lon:-49.8706, pop:100000, timezone:-3},
{name:"Assis, Brazil", lat:-22.6617, lon:-50.4119, pop:100000, timezone:-3},
{name:"Birigui, Brazil", lat:-21.2886, lon:-50.3400, pop:100000, timezone:-3},
{name:"Lins, Brazil", lat:-21.6786, lon:-49.7425, pop:100000, timezone:-3},
{name:"Jaú, Brazil", lat:-22.2958, lon:-48.5578, pop:150000, timezone:-3},
{name:"Lençóis Paulista, Brazil", lat:-22.5986, lon:-48.8003, pop:100000, timezone:-3},
{name:"Avaré, Brazil", lat:-23.0989, lon:-48.9256, pop:100000, timezone:-3},
{name:"Itapetininga, Brazil", lat:-23.5917, lon:-48.0531, pop:150000, timezone:-3},
{name:"Tatuí, Brazil", lat:-23.3556, lon:-47.8569, pop:100000, timezone:-3},
{name:"Capivari, Brazil", lat:-22.9950, lon:-47.5078, pop:50000, timezone:-3},
{name:"Porto Seguro, Brazil", lat:-16.4497, lon:-39.0647, pop:150000, timezone:-3},
{name:"Ilhéus, Brazil", lat:-14.7886, lon:-39.0494, pop:200000, timezone:-3},
{name:"Itabuna, Brazil", lat:-14.7856, lon:-39.2803, pop:200000, timezone:-3},
{name:"Vitória da Conquista, Brazil", lat:-14.8661, lon:-40.8394, pop:350000, timezone:-3},
{name:"Jequié, Brazil", lat:-13.8589, lon:-40.0850, pop:150000, timezone:-3},
{name:"Alagoinhas, Brazil", lat:-12.1356, lon:-38.4192, pop:150000, timezone:-3},
{name:"Serrinha, Brazil", lat:-11.6642, lon:-39.0075, pop:80000, timezone:-3},
{name:"Paulo Afonso, Brazil", lat:-9.4061, lon:-38.2147, pop:100000, timezone:-3},
{name:"Juazeiro, Brazil", lat:-9.4167, lon:-40.5000, pop:250000, timezone:-3},
{name:"Petrolina, Brazil", lat:-9.3891, lon:-40.5030, pop:300000, timezone:-3},
{name:"Garanhuns, Brazil", lat:-8.8903, lon:-36.4964, pop:150000, timezone:-3},
{name:"Caruaru, Brazil", lat:-8.2846, lon:-35.9699, pop:400000, timezone:-3},
{name:"Paulista, Brazil", lat:-7.9408, lon:-34.8731, pop:300000, timezone:-3},
{name:"Olinda, Brazil", lat:-8.0089, lon:-34.8553, pop:400000, timezone:-3},
{name:"Jaboatão dos Guararapes, Brazil", lat:-8.1128, lon:-35.0150, pop:700000, timezone:-3},
{name:"Cabo de Santo Agostinho, Brazil", lat:-8.2833, lon:-35.0333, pop:200000, timezone:-3},
{name:"Igarassu, Brazil", lat:-7.8342, lon:-34.9064, pop:100000, timezone:-3},
{name:"Abreu e Lima, Brazil", lat:-7.9117, lon:-34.9028, pop:100000, timezone:-3},
{name:"Camaragibe, Brazil", lat:-8.0236, lon:-34.9781, pop:150000, timezone:-3},
{name:"São Lourenço da Mata, Brazil", lat:-8.0022, lon:-35.0181, pop:100000, timezone:-3},
{name:"Moreno, Brazil", lat:-8.1186, lon:-35.0922, pop:60000, timezone:-3},
{name:"Ipojuca, Brazil", lat:-8.4000, lon:-35.0639, pop:100000, timezone:-3},
{name:"Escada, Brazil", lat:-8.3592, lon:-35.2236, pop:70000, timezone:-3},
{name:"Vitória de Santo Antão, Brazil", lat:-8.1264, lon:-35.2914, pop:150000, timezone:-3},
{name:"Gravatá, Brazil", lat:-8.2011, lon:-35.5647, pop:80000, timezone:-3},
{name:"Bezerros, Brazil", lat:-8.2333, lon:-35.7500, pop:60000, timezone:-3},
{name:"Carpina, Brazil", lat:-7.8508, lon:-35.2544, pop:80000, timezone:-3},
{name:"Limoeiro, Brazil", lat:-7.8747, lon:-35.4500, pop:60000, timezone:-3},
{name:"Surubim, Brazil", lat:-7.8472, lon:-35.7547, pop:60000, timezone:-3},
{name:"Pesqueira, Brazil", lat:-8.3578, lon:-36.6964, pop:70000, timezone:-3},
{name:"Arcoverde, Brazil", lat:-8.4189, lon:-37.0539, pop:70000, timezone:-3},
{name:"Serra Talhada, Brazil", lat:-7.9919, lon:-38.2983, pop:80000, timezone:-3},
{name:"Salgueiro, Brazil", lat:-8.0722, lon:-39.1192, pop:60000, timezone:-3},
{name:"Petrolândia, Brazil", lat:-9.0686, lon:-38.3028, pop:40000, timezone:-3},
{name:"Floresta, Brazil", lat:-8.6008, lon:-38.5686, pop:30000, timezone:-3},
{name:"Belém de São Francisco, Brazil", lat:-8.7539, lon:-38.9658, pop:20000, timezone:-3},
{name:"Cabrobó, Brazil", lat:-8.5142, lon:-39.3100, pop:30000, timezone:-3},
{name:"Orocó, Brazil", lat:-8.6186, lon:-39.6028, pop:15000, timezone:-3},
{name:"Santa Maria da Boa Vista, Brazil", lat:-8.8089, lon:-39.8250, pop:40000, timezone:-3},
{name:"Lagoa Grande, Brazil", lat:-8.9942, lon:-40.2722, pop:10000, timezone:-3},
{name:"Afrânio, Brazil", lat:-8.5117, lon:-41.0092, pop:20000, timezone:-3},
{name:"Dormentes, Brazil", lat:-8.4417, lon:-40.7681, pop:10000, timezone:-3},
{name:"Santa Cruz, Brazil", lat:-6.7667, lon:-38.0333, pop:40000, timezone:-3},
{name:"Pau dos Ferros, Brazil", lat:-6.1108, lon:-38.2069, pop:30000, timezone:-3},
{name:"Mossoró, Brazil", lat:-5.1875, lon:-37.3442, pop:300000, timezone:-3},
{name:"Caicó, Brazil", lat:-6.4583, lon:-37.0978, pop:70000, timezone:-3},
{name:"Currais Novos, Brazil", lat:-6.2611, lon:-36.5147, pop:50000, timezone:-3},
{name:"Açu, Brazil", lat:-5.5767, lon:-36.9086, pop:60000, timezone:-3},
{name:"Macau, Brazil", lat:-5.1150, lon:-36.6342, pop:30000, timezone:-3},
{name:"João Câmara, Brazil", lat:-5.5378, lon:-35.8197, pop:40000, timezone:-3},
{name:"Ceará-Mirim, Brazil", lat:-5.6342, lon:-35.4256, pop:70000, timezone:-3},
{name:"São Gonçalo do Amarante, Brazil", lat:-5.7931, lon:-35.3292, pop:100000, timezone:-3},
{name:"Extremoz, Brazil", lat:-5.7056, lon:-35.3072, pop:30000, timezone:-3},
{name:"San Pedro Sula, Honduras", lat:15.5042, lon:-88.0250, pop:700000, timezone:-6},
{name:"Tegucigalpa, Honduras", lat:14.0723, lon:-87.1921, pop:1400000, timezone:-6},
{name:"San Salvador, El Salvador", lat:13.6929, lon:-89.2182, pop:2400000, timezone:-6},
{name:"Santa Ana, El Salvador", lat:13.9944, lon:-89.5597, pop:250000, timezone:-6},
{name:"San Miguel, El Salvador", lat:13.4833, lon:-88.1833, pop:250000, timezone:-6},
{name:"Managua, Nicaragua", lat:12.1140, lon:-86.2362, pop:1400000, timezone:-6},
{name:"León, Nicaragua", lat:12.4356, lon:-86.8794, pop:200000, timezone:-6},
{name:"Granada, Nicaragua", lat:11.9344, lon:-85.9561, pop:150000, timezone:-6},
{name:"San José, Costa Rica", lat:9.9281, lon:-84.0907, pop:1500000, timezone:-6},
{name:"Alajuela, Costa Rica", lat:10.0162, lon:-84.2116, pop:300000, timezone:-6},
{name:"Cartago, Costa Rica", lat:9.8644, lon:-83.9194, pop:150000, timezone:-6},
{name:"Heredia, Costa Rica", lat:9.9985, lon:-84.1165, pop:150000, timezone:-6},
{name:"Liberia, Costa Rica", lat:10.6349, lon:-85.4377, pop:70000, timezone:-6},
{name:"Panama City, Panama", lat:8.9824, lon:-79.5199, pop:1800000, timezone:-5},
{name:"Colón, Panama", lat:9.3547, lon:-79.9014, pop:200000, timezone:-5},
{name:"David, Panama", lat:8.4333, lon:-82.4333, pop:150000, timezone:-5},
{name:"Santiago, Panama", lat:8.1000, lon:-80.9833, pop:100000, timezone:-5},
{name:"Belmopan, Belize", lat:17.2510, lon:-88.7590, pop:25000, timezone:-6},
{name:"Belize City, Belize", lat:17.5046, lon:-88.1962, pop:60000, timezone:-6},
{name:"San Ignacio, Belize", lat:17.1588, lon:-89.0696, pop:20000, timezone:-6},
{name:"Guatemala City, Guatemala", lat:14.6349, lon:-90.5069, pop:3000000, timezone:-6},
{name:"Mixco, Guatemala", lat:14.6333, lon:-90.6064, pop:500000, timezone:-6},
{name:"Villa Nueva, Guatemala", lat:14.5269, lon:-90.5875, pop:500000, timezone:-6},
{name:"Quetzaltenango, Guatemala", lat:14.8347, lon:-91.5181, pop:200000, timezone:-6},
{name:"Escuintla, Guatemala", lat:14.3050, lon:-90.7850, pop:150000, timezone:-6},
{name:"Cobán, Guatemala", lat:15.4833, lon:-90.3167, pop:100000, timezone:-6},
{name:"Antigua Guatemala, Guatemala", lat:14.5611, lon:-90.7344, pop:50000, timezone:-6},
{name:"Santiago de los Caballeros, Dominican Republic", lat:19.4517, lon:-70.6970, pop:700000, timezone:-4},
{name:"La Romana, Dominican Republic", lat:18.4273, lon:-68.9728, pop:250000, timezone:-4},
{name:"San Pedro de Macorís, Dominican Republic", lat:18.4616, lon:-69.2972, pop:200000, timezone:-4},
{name:"Puerto Plata, Dominican Republic", lat:19.7934, lon:-70.6884, pop:150000, timezone:-4},
{name:"La Vega, Dominican Republic", lat:19.2221, lon:-70.5296, pop:250000, timezone:-4},
{name:"San Francisco de Macorís, Dominican Republic", lat:19.3000, lon:-70.2500, pop:200000, timezone:-4},
{name:"Santiago de Cuba, Cuba", lat:20.0208, lon:-75.8267, pop:500000, timezone:-5},
{name:"Camagüey, Cuba", lat:21.3808, lon:-77.9169, pop:300000, timezone:-5},
{name:"Holguín, Cuba", lat:20.8872, lon:-76.2631, pop:300000, timezone:-5},
{name:"Santa Clara, Cuba", lat:22.4069, lon:-79.9647, pop:250000, timezone:-5},
{name:"Guantánamo, Cuba", lat:20.1444, lon:-75.2092, pop:200000, timezone:-5},
{name:"Bayamo, Cuba", lat:20.3792, lon:-76.6433, pop:150000, timezone:-5},
{name:"Cienfuegos, Cuba", lat:22.1497, lon:-80.4364, pop:150000, timezone:-5},
{name:"Pinar del Río, Cuba", lat:22.4175, lon:-83.6981, pop:150000, timezone:-5},
{name:"Matanzas, Cuba", lat:23.0411, lon:-81.5775, pop:150000, timezone:-5},
{name:"Cárdenas, Cuba", lat:23.0400, lon:-81.2050, pop:100000, timezone:-5},
{name:"Port-au-Prince, Haiti", lat:18.5944, lon:-72.3074, pop:2800000, timezone:-5},
{name:"Carrefour, Haiti", lat:18.5414, lon:-72.3994, pop:500000, timezone:-5},
{name:"Delmas, Haiti", lat:18.5500, lon:-72.3000, pop:400000, timezone:-5},
{name:"Pétion-Ville, Haiti", lat:18.5125, lon:-72.2853, pop:300000, timezone:-5},
{name:"Cap-Haïtien, Haiti", lat:19.7578, lon:-72.2042, pop:300000, timezone:-5},
{name:"Gonaïves, Haiti", lat:19.4456, lon:-72.6883, pop:300000, timezone:-5},
{name:"Les Cayes, Haiti", lat:18.2000, lon:-73.7500, pop:150000, timezone:-5},
{name:"Jacmel, Haiti", lat:18.2342, lon:-72.5347, pop:100000, timezone:-5},
{name:"Kingston, Jamaica", lat:17.9712, lon:-76.7936, pop:600000, timezone:-5},
{name:"Montego Bay, Jamaica", lat:18.4762, lon:-77.8939, pop:110000, timezone:-5},
{name:"Spanish Town, Jamaica", lat:17.9911, lon:-76.9574, pop:150000, timezone:-5},
{name:"Portmore, Jamaica", lat:17.9500, lon:-76.8790, pop:200000, timezone:-5},
{name:"Mandeville, Jamaica", lat:18.0333, lon:-77.5000, pop:50000, timezone:-5},
{name:"Ocho Rios, Jamaica", lat:18.4025, lon:-77.1047, pop:20000, timezone:-5},
{name:"Port of Spain, Trinidad and Tobago", lat:10.6549, lon:-61.5019, pop:500000, timezone:-4},
{name:"San Fernando, Trinidad and Tobago", lat:10.2833, lon:-61.4667, pop:50000, timezone:-4},
{name:"Chaguanas, Trinidad and Tobago", lat:10.5167, lon:-61.4167, pop:80000, timezone:-4},
{name:"Arima, Trinidad and Tobago", lat:10.6333, lon:-61.2833, pop:40000, timezone:-4},
{name:"Nassau, Bahamas", lat:25.0343, lon:-77.3963, pop:280000, timezone:-5},
{name:"Freeport, Bahamas", lat:26.5333, lon:-78.7000, pop:50000, timezone:-5},
{name:"Bridgetown, Barbados", lat:13.0975, lon:-59.6105, pop:100000, timezone:-4},
{name:"Castries, Saint Lucia", lat:14.0101, lon:-60.9875, pop:20000, timezone:-4},
{name:"Kingstown, Saint Vincent", lat:13.1582, lon:-61.2248, pop:25000, timezone:-4},
{name:"St. George's, Grenada", lat:12.0561, lon:-61.7486, pop:30000, timezone:-4},
{name:"Roseau, Dominica", lat:15.3010, lon:-61.3881, pop:15000, timezone:-4},
{name:"Basseterre, Saint Kitts", lat:17.3026, lon:-62.7177, pop:15000, timezone:-4},
{name:"St. John's, Antigua", lat:17.1274, lon:-61.8468, pop:25000, timezone:-4},
{name:"Road Town, British Virgin Islands", lat:18.4286, lon:-64.6185, pop:15000, timezone:-4},
{name:"Charlotte Amalie, US Virgin Islands", lat:18.3419, lon:-64.9307, pop:20000, timezone:-4},
{name:"Oranjestad, Aruba", lat:12.5211, lon:-70.0351, pop:35000, timezone:-4},
{name:"Willemstad, Curaçao", lat:12.1224, lon:-68.8824, pop:150000, timezone:-4},
{name:"Philipsburg, Sint Maarten", lat:18.0296, lon:-63.0475, pop:20000, timezone:-4},
{name:"Maracaibo, Venezuela", lat:10.6427, lon:-71.6125, pop:2500000, timezone:-4},
{name:"Valencia, Venezuela", lat:10.1621, lon:-68.0077, pop:1800000, timezone:-4},
{name:"Barquisimeto, Venezuela", lat:10.0647, lon:-69.3570, pop:1200000, timezone:-4},
{name:"Maracay, Venezuela", lat:10.2469, lon:-67.5958, pop:1200000, timezone:-4},
{name:"Ciudad Guayana, Venezuela", lat:8.3533, lon:-62.6410, pop:1000000, timezone:-4},
{name:"Barcelona, Venezuela", lat:10.1333, lon:-64.7000, pop:500000, timezone:-4},
{name:"Maturín, Venezuela", lat:9.7500, lon:-63.1833, pop:500000, timezone:-4},
{name:"Puerto La Cruz, Venezuela", lat:10.2167, lon:-64.6333, pop:300000, timezone:-4},
{name:"San Cristóbal, Venezuela", lat:7.7669, lon:-72.2250, pop:400000, timezone:-4},
{name:"Cumaná, Venezuela", lat:10.4667, lon:-64.1667, pop:400000, timezone:-4},
{name:"Guayaquil, Ecuador", lat:-2.1700, lon:-79.9224, pop:3000000, timezone:-5},
{name:"Cuenca, Ecuador", lat:-2.9001, lon:-79.0059, pop:600000, timezone:-5},
{name:"Santo Domingo, Ecuador", lat:-0.2532, lon:-79.1754, pop:500000, timezone:-5},
{name:"Machala, Ecuador", lat:-3.2581, lon:-79.9554, pop:300000, timezone:-5},
{name:"Manta, Ecuador", lat:-0.9677, lon:-80.7089, pop:250000, timezone:-5},
{name:"Portoviejo, Ecuador", lat:-1.0547, lon:-80.4545, pop:250000, timezone:-5},
{name:"Ambato, Ecuador", lat:-1.2491, lon:-78.6168, pop:200000, timezone:-5},
{name:"Riobamba, Ecuador", lat:-1.6709, lon:-78.6471, pop:200000, timezone:-5},
{name:"Ibarra, Ecuador", lat:0.3517, lon:-78.1223, pop:150000, timezone:-5},
{name:"Loja, Ecuador", lat:-3.9931, lon:-79.2042, pop:200000, timezone:-5},
{name:"Esmeraldas, Ecuador", lat:0.9592, lon:-79.6539, pop:200000, timezone:-5},
{name:"Quevedo, Ecuador", lat:-1.0286, lon:-79.4635, pop:150000, timezone:-5},
{name:"Milagro, Ecuador", lat:-2.1342, lon:-79.5942, pop:150000, timezone:-5},
{name:"Santa Cruz, Bolivia", lat:-17.7833, lon:-63.1821, pop:2200000, timezone:-4},
{name:"Cochabamba, Bolivia", lat:-17.3895, lon:-66.1568, pop:1400000, timezone:-4},
{name:"El Alto, Bolivia", lat:-16.5000, lon:-68.1500, pop:1000000, timezone:-4},
{name:"Oruro, Bolivia", lat:-17.9833, lon:-67.1500, pop:300000, timezone:-4},
{name:"Potosí, Bolivia", lat:-19.5836, lon:-65.7531, pop:200000, timezone:-4},
{name:"Sucre, Bolivia", lat:-19.0196, lon:-65.2619, pop:300000, timezone:-4},
{name:"Tarija, Bolivia", lat:-21.5355, lon:-64.7296, pop:250000, timezone:-4},
{name:"Trinidad, Bolivia", lat:-14.8333, lon:-64.9000, pop:100000, timezone:-4},
{name:"Cobija, Bolivia", lat:-11.0264, lon:-68.7692, pop:50000, timezone:-4},
{name:"Riberalta, Bolivia", lat:-11.0064, lon:-66.0631, pop:100000, timezone:-4},
{name:"Asunción, Paraguay", lat:-25.2637, lon:-57.5759, pop:2200000, timezone:-4},
{name:"Ciudad del Este, Paraguay", lat:-25.5097, lon:-54.6112, pop:300000, timezone:-4},
{name:"San Lorenzo, Paraguay", lat:-25.3333, lon:-57.5333, pop:300000, timezone:-4},
{name:"Luque, Paraguay", lat:-25.2667, lon:-57.4833, pop:250000, timezone:-4},
{name:"Capiatá, Paraguay", lat:-25.3500, lon:-57.4167, pop:250000, timezone:-4},
{name:"Lambaré, Paraguay", lat:-25.3333, lon:-57.6000, pop:200000, timezone:-4},
{name:"Fernando de la Mora, Paraguay", lat:-25.3167, lon:-57.6000, pop:150000, timezone:-4},
{name:"Encarnación, Paraguay", lat:-27.3333, lon:-55.8667, pop:150000, timezone:-4},
{name:"Pedro Juan Caballero, Paraguay", lat:-22.5333, lon:-55.7333, pop:100000, timezone:-4},
{name:"Coronel Oviedo, Paraguay", lat:-25.4500, lon:-56.4500, pop:100000, timezone:-4},
{name:"Salto, Uruguay", lat:-31.3833, lon:-57.9667, pop:100000, timezone:-3},
{name:"Paysandú, Uruguay", lat:-32.3214, lon:-58.0756, pop:80000, timezone:-3},
{name:"Rivera, Uruguay", lat:-30.9053, lon:-55.5508, pop:70000, timezone:-3},
{name:"Maldonado, Uruguay", lat:-34.9000, lon:-54.9500, pop:100000, timezone:-3},
{name:"Tacuarembó, Uruguay", lat:-31.7333, lon:-55.9833, pop:50000, timezone:-3},
{name:"Melo, Uruguay", lat:-32.3667, lon:-54.1833, pop:50000, timezone:-3},
{name:"Mercedes, Uruguay", lat:-33.2500, lon:-58.0333, pop:40000, timezone:-3},
{name:"Artigas, Uruguay", lat:-30.4000, lon:-56.4667, pop:40000, timezone:-3},
{name:"Minas, Uruguay", lat:-34.3667, lon:-55.2333, pop:40000, timezone:-3},
{name:"Durazno, Uruguay", lat:-33.3833, lon:-56.5167, pop:35000, timezone:-3},
{name:"Parnamirim, Brazil", lat:-5.9156, lon:-35.2628, pop:250000, timezone:-3},
{name:"Macaíba, Brazil", lat:-5.8583, lon:-35.3539, pop:80000, timezone:-3},
{name:"São José de Mipibu, Brazil", lat:-6.0750, lon:-35.2378, pop:40000, timezone:-3},
{name:"Nísia Floresta, Brazil", lat:-6.0911, lon:-35.2089, pop:30000, timezone:-3},
{name:"Goianinha, Brazil", lat:-6.2667, lon:-35.2000, pop:30000, timezone:-3},
{name:"Canguaretama, Brazil", lat:-6.3800, lon:-35.1350, pop:30000, timezone:-3},
{name:"Baía Formosa, Brazil", lat:-6.3694, lon:-35.0078, pop:10000, timezone:-3},
{name:"Tibau do Sul, Brazil", lat:-6.1861, lon:-35.0917, pop:15000, timezone:-3},
{name:"Senador Georgino Avelino, Brazil", lat:-6.1500, lon:-35.1333, pop:5000, timezone:-3},
{name:"Arês, Brazil", lat:-6.1944, lon:-35.1606, pop:15000, timezone:-3},
{name:"Espírito Santo, Brazil", lat:-6.2833, lon:-35.3167, pop:10000, timezone:-3},
{name:"Lagoa de Pedras, Brazil", lat:-6.1500, lon:-35.4333, pop:10000, timezone:-3},
{name:"Santo Antônio, Brazil", lat:-6.3106, lon:-35.4789, pop:20000, timezone:-3},
{name:"Passa e Fica, Brazil", lat:-6.4333, lon:-35.6333, pop:10000, timezone:-3},
{name:"Nova Cruz, Brazil", lat:-6.4750, lon:-35.4333, pop:40000, timezone:-3},
{name:"Monte Alegre, Brazil", lat:-6.0667, lon:-35.3333, pop:20000, timezone:-3},
{name:"Taipu, Brazil", lat:-5.6219, lon:-35.5967, pop:15000, timezone:-3},
{name:"Pureza, Brazil", lat:-5.4639, lon:-35.5556, pop:10000, timezone:-3},
{name:"Touros, Brazil", lat:-5.1989, lon:-35.4606, pop:30000, timezone:-3},
{name:"São Miguel do Gostoso, Brazil", lat:-5.1231, lon:-35.6356, pop:10000, timezone:-3},
{name:"Pedra Grande, Brazil", lat:-5.1500, lon:-35.8833, pop:5000, timezone:-3},
{name:"Parazinho, Brazil", lat:-5.2222, lon:-35.8397, pop:5000, timezone:-3},
{name:"Jandaíra, Brazil", lat:-5.3528, lon:-36.1278, pop:10000, timezone:-3},
{name:"Caraúbas, Brazil", lat:-5.7928, lon:-37.5567, pop:30000, timezone:-3},
{name:"Apodi, Brazil", lat:-5.6642, lon:-37.7989, pop:40000, timezone:-3},
{name:"Felipe Guerra, Brazil", lat:-5.5928, lon:-37.6889, pop:10000, timezone:-3},
{name:"Governador Dix-Sept Rosado, Brazil", lat:-5.4589, lon:-37.5208, pop:15000, timezone:-3},
{name:"Umarizal, Brazil", lat:-5.9906, lon:-37.8144, pop:10000, timezone:-3},
{name:"Olho d'Água do Borges", lat:-5.9500, lon:-37.7000, pop:5000, timezone:-3},
{name:"Rafael Godeiro, Brazil", lat:-6.0750, lon:-37.7167, pop:5000, timezone:-3},
{name:"Patu, Brazil", lat:-6.1000, lon:-37.6333, pop:20000, timezone:-3},
{name:"Messias Targino, Brazil", lat:-6.0833, lon:-37.5167, pop:5000, timezone:-3},
{name:"Campo Grande, Brazil", lat:-5.8667, lon:-37.3000, pop:10000, timezone:-3},
{name:"Janduís, Brazil", lat:-6.0167, lon:-37.3500, pop:5000, timezone:-3},
{name:"Triunfo, Brazil", lat:-6.5500, lon:-38.5500, pop:10000, timezone:-3},
{name:"Encanto, Brazil", lat:-6.1100, lon:-38.3100, pop:5000, timezone:-3},
{name:"São Francisco do Oeste, Brazil", lat:-5.9833, lon:-38.1500, pop:5000, timezone:-3},
{name:"Frutuoso Gomes, Brazil", lat:-6.1500, lon:-37.8500, pop:5000, timezone:-3},
{name:"Almino Afonso, Brazil", lat:-6.1500, lon:-37.7667, pop:5000, timezone:-3},
{name:"Antônio Martins, Brazil", lat:-6.2167, lon:-37.8833, pop:5000, timezone:-3},
{name:"Serrinha dos Pintos, Brazil", lat:-6.1000, lon:-37.9500, pop:5000, timezone:-3},
{name:"Martins, Brazil", lat:-6.0833, lon:-37.9167, pop:10000, timezone:-3},
{name:"Portalegre, Brazil", lat:-5.9833, lon:-37.9833, pop:5000, timezone:-3},
{name:"Riacho de Santana, Brazil", lat:-6.2667, lon:-38.3167, pop:5000, timezone:-3},
{name:"Água Nova, Brazil", lat:-6.2000, lon:-38.3000, pop:5000, timezone:-3},
{name:"Coronel João Pessoa, Brazil", lat:-6.2500, lon:-38.4500, pop:5000, timezone:-3},
{name:"Luís Gomes, Brazil", lat:-6.4167, lon:-38.3833, pop:10000, timezone:-3},
{name:"José da Penha, Brazil", lat:-6.3167, lon:-38.2833, pop:5000, timezone:-3},
{name:"Major Sales, Brazil", lat:-6.4000, lon:-38.3167, pop:5000, timezone:-3},
{name:"Tenente Ananias, Brazil", lat:-6.4667, lon:-38.1833, pop:10000, timezone:-3},
{name:"Doutor Severiano, Brazil", lat:-6.0833, lon:-38.3667, pop:5000, timezone:-3},
{name:"São Miguel, Brazil", lat:-6.2167, lon:-38.5000, pop:20000, timezone:-3},
{name:"Venha-Ver, Brazil", lat:-6.3167, lon:-38.4833, pop:5000, timezone:-3},
{name:"Taboleiro Grande, Brazil", lat:-5.9167, lon:-38.0333, pop:5000, timezone:-3},
{name:"Riacho da Cruz, Brazil", lat:-5.9333, lon:-37.9833, pop:5000, timezone:-3},
{name:"Rodolfo Fernandes, Brazil", lat:-5.7833, lon:-38.0667, pop:5000, timezone:-3},
{name:"Severiano Melo, Brazil", lat:-5.7833, lon:-37.9500, pop:5000, timezone:-3},
{name:"Itaú, Brazil", lat:-5.8333, lon:-37.9833, pop:5000, timezone:-3},
{name:"José da Penha, Brazil", lat:-6.3167, lon:-38.2833, pop:5000, timezone:-3},
{name:"Cali, Colombia", lat:3.4516, lon:-76.5320, pop:3000000, timezone:-5},

{name:"Arequipa, Peru", lat:-16.4090, lon:-71.5375, pop:1000000, timezone:-5},

{name:"Rosario, Argentina", lat:-32.9442, lon:-60.6505, pop:1300000, timezone:-3},
{name:"Cordoba, Argentina", lat:-31.4201, lon:-64.1888, pop:1500000, timezone:-3},

/* --- EDGE / REMOTE --- */
{name:"Anchorage, USA", lat:61.2181, lon:-149.9003, pop:400000, timezone:-9},
{name:"Honolulu, USA", lat:21.3069, lon:-157.8583, pop:1000000, timezone:-10},

/* =========================
   🌍 EUROPE (1–70)
========================= */

/* --- MEGACITIES --- */
{name:"Istanbul, Turkey", lat:41.0082, lon:28.9784, pop:16200000, timezone:3},
{name:"Moscow, Russia", lat:55.7558, lon:37.6173, pop:12700000, timezone:3},
{name:"London, UK", lat:51.5074, lon:-0.1278, pop:10400000, timezone:0},
{name:"Paris, France", lat:48.8566, lon:2.3522, pop:11300000, timezone:1},
{name:"Madrid, Spain", lat:40.4168, lon:-3.7038, pop:6800000, timezone:1},
{name:"Berlin, Germany", lat:52.5200, lon:13.4050, pop:4400000, timezone:1},
{name:"Rome, Italy", lat:41.9028, lon:12.4964, pop:4300000, timezone:1},

/* --- MAJOR WESTERN EUROPE --- */
{name:"Barcelona, Spain", lat:41.3851, lon:2.1734, pop:5500000, timezone:1},
{name:"Milan, Italy", lat:45.4642, lon:9.1900, pop:5000000, timezone:1},
{name:"Naples, Italy", lat:40.8518, lon:14.2681, pop:3100000, timezone:1},
{name:"Hamburg, Germany", lat:53.5511, lon:9.9937, pop:2800000, timezone:1},
{name:"Munich, Germany", lat:48.1351, lon:11.5820, pop:2600000, timezone:1},
{name:"Frankfurt, Germany", lat:50.1109, lon:8.6821, pop:2400000, timezone:1},
{name:"Cologne, Germany", lat:50.9375, lon:6.9603, pop:2200000, timezone:1},
{name:"Brussels, Belgium", lat:50.8503, lon:4.3517, pop:2100000, timezone:1},
{name:"Tallinn, Estonia", lat:59.4370, lon:24.7536, pop:450000, timezone:2},
{name:"Tartu, Estonia", lat:58.3780, lon:26.7290, pop:100000, timezone:2},
{name:"Narva, Estonia", lat:59.3797, lon:28.1791, pop:50000, timezone:2},
{name:"Pärnu, Estonia", lat:58.3859, lon:24.4971, pop:40000, timezone:2},
{name:"Riga, Latvia", lat:56.9496, lon:24.1052, pop:600000, timezone:2},
{name:"Daugavpils, Latvia", lat:55.8747, lon:26.5362, pop:80000, timezone:2},
{name:"Liepāja, Latvia", lat:56.5047, lon:21.0107, pop:70000, timezone:2},
{name:"Jelgava, Latvia", lat:56.6500, lon:23.7128, pop:55000, timezone:2},
{name:"Jūrmala, Latvia", lat:56.9680, lon:23.7703, pop:50000, timezone:2},
{name:"Vilnius, Lithuania", lat:54.6872, lon:25.2797, pop:700000, timezone:2},
{name:"Kaunas, Lithuania", lat:54.8985, lon:23.9036, pop:300000, timezone:2},
{name:"Klaipėda, Lithuania", lat:55.7033, lon:21.1443, pop:150000, timezone:2},
{name:"Šiauliai, Lithuania", lat:55.9349, lon:23.3135, pop:100000, timezone:2},
{name:"Panevėžys, Lithuania", lat:55.7333, lon:24.3500, pop:90000, timezone:2},
{name:"Minsk, Belarus", lat:53.9006, lon:27.5590, pop:2000000, timezone:3},
{name:"Gomel, Belarus", lat:52.4345, lon:30.9754, pop:500000, timezone:3},
{name:"Mogilev, Belarus", lat:53.9168, lon:30.3449, pop:350000, timezone:3},
{name:"Vitebsk, Belarus", lat:55.1904, lon:30.2049, pop:350000, timezone:3},
{name:"Grodno, Belarus", lat:53.6884, lon:23.8258, pop:350000, timezone:3},
{name:"Brest, Belarus", lat:52.0975, lon:23.6877, pop:350000, timezone:3},
{name:"Kyiv, Ukraine", lat:50.4501, lon:30.5234, pop:3000000, timezone:2},
{name:"Kharkiv, Ukraine", lat:49.9935, lon:36.2304, pop:1400000, timezone:2},
{name:"Odesa, Ukraine", lat:46.4825, lon:30.7233, pop:1000000, timezone:2},
{name:"Dnipro, Ukraine", lat:48.4647, lon:35.0462, pop:1000000, timezone:2},
{name:"Donetsk, Ukraine", lat:48.0159, lon:37.8028, pop:900000, timezone:2},
{name:"Zaporizhzhia, Ukraine", lat:47.8388, lon:35.1396, pop:700000, timezone:2},
{name:"Lviv, Ukraine", lat:49.8397, lon:24.0297, pop:700000, timezone:2},
{name:"Kryvyi Rih, Ukraine", lat:47.9105, lon:33.3918, pop:600000, timezone:2},
{name:"Mykolaiv, Ukraine", lat:46.9750, lon:31.9946, pop:500000, timezone:2},
{name:"Mariupol, Ukraine", lat:47.0971, lon:37.5434, pop:400000, timezone:2},
{name:"Vinnytsia, Ukraine", lat:49.2331, lon:28.4682, pop:400000, timezone:2},
{name:"Kherson, Ukraine", lat:46.6354, lon:32.6169, pop:300000, timezone:2},
{name:"Poltava, Ukraine", lat:49.5883, lon:34.5514, pop:300000, timezone:2},
{name:"Chernihiv, Ukraine", lat:51.4982, lon:31.2893, pop:300000, timezone:2},
{name:"Cherkasy, Ukraine", lat:49.4444, lon:32.0598, pop:300000, timezone:2},
{name:"Sumy, Ukraine", lat:50.9077, lon:34.7981, pop:300000, timezone:2},
{name:"Zhytomyr, Ukraine", lat:50.2547, lon:28.6587, pop:250000, timezone:2},
{name:"Khmelnytskyi, Ukraine", lat:49.4229, lon:26.9871, pop:250000, timezone:2},
{name:"Rivne, Ukraine", lat:50.6199, lon:26.2516, pop:250000, timezone:2},
{name:"Ivano-Frankivsk, Ukraine", lat:48.9226, lon:24.7111, pop:250000, timezone:2},
{name:"Ternopil, Ukraine", lat:49.5535, lon:25.5948, pop:250000, timezone:2},
{name:"Lutsk, Ukraine", lat:50.7472, lon:25.3254, pop:200000, timezone:2},
{name:"Uzhhorod, Ukraine", lat:48.6208, lon:22.2879, pop:120000, timezone:2},
{name:"Chernivtsi, Ukraine", lat:48.2917, lon:25.9352, pop:250000, timezone:2},
{name:"Chișinău, Moldova", lat:47.0105, lon:28.8638, pop:700000, timezone:2},
{name:"Tiraspol, Moldova", lat:46.8403, lon:29.6433, pop:150000, timezone:2},
{name:"Bălți, Moldova", lat:47.7631, lon:27.9294, pop:150000, timezone:2},
{name:"Bender, Moldova", lat:46.8306, lon:29.4711, pop:100000, timezone:2},
{name:"Bucharest, Romania", lat:44.4268, lon:26.1025, pop:2300000, timezone:2},
{name:"Cluj-Napoca, Romania", lat:46.7712, lon:23.6236, pop:700000, timezone:2},
{name:"Timișoara, Romania", lat:45.7489, lon:21.2087, pop:500000, timezone:2},
{name:"Iași, Romania", lat:47.1585, lon:27.6014, pop:400000, timezone:2},
{name:"Constanța, Romania", lat:44.1598, lon:28.6348, pop:300000, timezone:2},
{name:"Craiova, Romania", lat:44.3302, lon:23.7949, pop:300000, timezone:2},
{name:"Brașov, Romania", lat:45.6427, lon:25.5887, pop:300000, timezone:2},
{name:"Galați, Romania", lat:45.4353, lon:28.0080, pop:250000, timezone:2},
{name:"Ploiești, Romania", lat:44.9462, lon:26.0364, pop:200000, timezone:2},
{name:"Oradea, Romania", lat:47.0465, lon:21.9189, pop:200000, timezone:2},
{name:"Brăila, Romania", lat:45.2692, lon:27.9575, pop:180000, timezone:2},
{name:"Arad, Romania", lat:46.1866, lon:21.3123, pop:150000, timezone:2},
{name:"Pitești, Romania", lat:44.8565, lon:24.8692, pop:150000, timezone:2},
{name:"Sibiu, Romania", lat:45.7983, lon:24.1256, pop:150000, timezone:2},
{name:"Bacău, Romania", lat:46.5670, lon:26.9146, pop:150000, timezone:2},
{name:"Târgu Mureș, Romania", lat:46.5386, lon:24.5514, pop:150000, timezone:2},
{name:"Baia Mare, Romania", lat:47.6567, lon:23.5850, pop:120000, timezone:2},
{name:"Buzău, Romania", lat:45.1500, lon:26.8333, pop:100000, timezone:2},
{name:"Satu Mare, Romania", lat:47.7900, lon:22.8900, pop:100000, timezone:2},
{name:"Sofia, Bulgaria", lat:42.6977, lon:23.3219, pop:1700000, timezone:2},
{name:"Plovdiv, Bulgaria", lat:42.1354, lon:24.7453, pop:700000, timezone:2},
{name:"Varna, Bulgaria", lat:43.2141, lon:27.9147, pop:500000, timezone:2},
{name:"Burgas, Bulgaria", lat:42.5048, lon:27.4626, pop:200000, timezone:2},
{name:"Ruse, Bulgaria", lat:43.8356, lon:25.9657, pop:150000, timezone:2},
{name:"Stara Zagora, Bulgaria", lat:42.4258, lon:25.6345, pop:150000, timezone:2},
{name:"Pleven, Bulgaria", lat:43.4170, lon:24.6067, pop:100000, timezone:2},
{name:"Sliven, Bulgaria", lat:42.6858, lon:26.3292, pop:90000, timezone:2},
{name:"Dobrich, Bulgaria", lat:43.5726, lon:27.8273, pop:90000, timezone:2},
{name:"Shumen, Bulgaria", lat:43.2712, lon:26.9361, pop:80000, timezone:2},
{name:"Belgrade, Serbia", lat:44.7866, lon:20.4489, pop:1700000, timezone:1},
{name:"Novi Sad, Serbia", lat:45.2671, lon:19.8335, pop:400000, timezone:1},
{name:"Niš, Serbia", lat:43.3209, lon:21.8958, pop:250000, timezone:1},
{name:"Kragujevac, Serbia", lat:44.0128, lon:20.9114, pop:150000, timezone:1},
{name:"Subotica, Serbia", lat:46.1000, lon:19.6667, pop:100000, timezone:1},
{name:"Zrenjanin, Serbia", lat:45.3833, lon:20.3833, pop:80000, timezone:1},
{name:"Pančevo, Serbia", lat:44.8708, lon:20.6403, pop:80000, timezone:1},
{name:"Čačak, Serbia", lat:43.8914, lon:20.3497, pop:70000, timezone:1},
{name:"Kraljevo, Serbia", lat:43.7258, lon:20.6894, pop:70000, timezone:1},
{name:"Novi Pazar, Serbia", lat:43.1367, lon:20.5122, pop:70000, timezone:1},
{name:"Zagreb, Croatia", lat:45.8150, lon:15.9819, pop:1000000, timezone:1},
{name:"Split, Croatia", lat:43.5081, lon:16.4402, pop:200000, timezone:1},
{name:"Rijeka, Croatia", lat:45.3271, lon:14.4422, pop:150000, timezone:1},
{name:"Osijek, Croatia", lat:45.5550, lon:18.6956, pop:100000, timezone:1},
{name:"Zadar, Croatia", lat:44.1194, lon:15.2314, pop:80000, timezone:1},
{name:"Slavonski Brod, Croatia", lat:45.1600, lon:18.0156, pop:60000, timezone:1},
{name:"Pula, Croatia", lat:44.8666, lon:13.8497, pop:60000, timezone:1},
{name:"Karlovac, Croatia", lat:45.4872, lon:15.5478, pop:50000, timezone:1},
{name:"Varaždin, Croatia", lat:46.3044, lon:16.3378, pop:50000, timezone:1},
{name:"Šibenik, Croatia", lat:43.7350, lon:15.8906, pop:40000, timezone:1},
{name:"Sarajevo, Bosnia", lat:43.8563, lon:18.4131, pop:500000, timezone:1},
{name:"Banja Luka, Bosnia", lat:44.7722, lon:17.1910, pop:200000, timezone:1},
{name:"Tuzla, Bosnia", lat:44.5384, lon:18.6708, pop:120000, timezone:1},
{name:"Zenica, Bosnia", lat:44.2017, lon:17.9040, pop:100000, timezone:1},
{name:"Mostar, Bosnia", lat:43.3433, lon:17.8081, pop:100000, timezone:1},
{name:"Bijeljina, Bosnia", lat:44.7569, lon:19.2161, pop:100000, timezone:1},
{name:"Prijedor, Bosnia", lat:44.9811, lon:16.7142, pop:80000, timezone:1},
{name:"Brčko, Bosnia", lat:44.8700, lon:18.8100, pop:80000, timezone:1},
{name:"Doboj, Bosnia", lat:44.7314, lon:18.0850, pop:70000, timezone:1},
{name:"Bihać, Bosnia", lat:44.8169, lon:15.8708, pop:60000, timezone:1},
{name:"Amsterdam, Netherlands", lat:52.3676, lon:4.9041, pop:2500000, timezone:1},
{name:"Rotterdam, Netherlands", lat:51.9244, lon:4.4777, pop:1300000, timezone:1},
{name:"The Hague, Netherlands", lat:52.0705, lon:4.3007, pop:1200000, timezone:1},
{name:"Zurich, Switzerland", lat:47.3769, lon:8.5417, pop:1500000, timezone:1},
{name:"Geneva, Switzerland", lat:46.2044, lon:6.1432, pop:1000000, timezone:1},

/* --- UK & IRELAND --- */
{name:"Manchester, UK", lat:53.4808, lon:-2.2426, pop:2800000, timezone:0},
{name:"Birmingham, UK", lat:52.4862, lon:-1.8904, pop:2600000, timezone:0},
{name:"Leeds, UK", lat:53.8008, lon:-1.5491, pop:1900000, timezone:0},
{name:"Glasgow, UK", lat:55.8642, lon:-4.2518, pop:1700000, timezone:0},
{name:"Liverpool, UK", lat:53.4084, lon:-2.9916, pop:1500000, timezone:0},
{name:"Dublin, Ireland", lat:53.3498, lon:-6.2603, pop:1400000, timezone:0},

/* --- NORTHERN EUROPE --- */
{name:"Stockholm, Sweden", lat:59.3293, lon:18.0686, pop:2400000, timezone:1},
{name:"Oslo, Norway", lat:59.9139, lon:10.7522, pop:1100000, timezone:1},
{name:"Copenhagen, Denmark", lat:55.6761, lon:12.5683, pop:1400000, timezone:1},
{name:"Helsinki, Finland", lat:60.1699, lon:24.9384, pop:1300000, timezone:2},

/* --- EASTERN EUROPE CORE --- */
{name:"Warsaw, Poland", lat:52.2297, lon:21.0122, pop:3100000, timezone:1},
{name:"Birmingham, UK", lat:52.4862, lon:-1.8904, pop:2600000, timezone:0},
{name:"Glasgow, UK", lat:55.8642, lon:-4.2518, pop:1700000, timezone:0},
{name:"Liverpool, UK", lat:53.4084, lon:-2.9916, pop:1500000, timezone:0},
{name:"Leeds, UK", lat:53.8008, lon:-1.5491, pop:1900000, timezone:0},
{name:"Sheffield, UK", lat:53.3811, lon:-1.4701, pop:700000, timezone:0},
{name:"Edinburgh, UK", lat:55.9533, lon:-3.1883, pop:550000, timezone:0},
{name:"Bristol, UK", lat:51.4545, lon:-2.5879, pop:700000, timezone:0},
{name:"Manchester, UK", lat:53.4808, lon:-2.2426, pop:2800000, timezone:0},
{name:"Cardiff, UK", lat:51.4816, lon:-3.1791, pop:500000, timezone:0},
{name:"Belfast, UK", lat:54.5973, lon:-5.9301, pop:600000, timezone:0},
{name:"Newcastle, UK", lat:54.9783, lon:-1.6178, pop:800000, timezone:0},
{name:"Nottingham, UK", lat:52.9548, lon:-1.1581, pop:700000, timezone:0},
{name:"Leicester, UK", lat:52.6369, lon:-1.1398, pop:600000, timezone:0},
{name:"Coventry, UK", lat:52.4068, lon:-1.5197, pop:400000, timezone:0},
{name:"Bradford, UK", lat:53.7960, lon:-1.7594, pop:500000, timezone:0},
{name:"Southampton, UK", lat:50.9097, lon:-1.4044, pop:300000, timezone:0},
{name:"Portsmouth, UK", lat:50.8198, lon:-1.0880, pop:200000, timezone:0},
{name:"Plymouth, UK", lat:50.3755, lon:-4.1427, pop:250000, timezone:0},
{name:"Derby, UK", lat:52.9225, lon:-1.4746, pop:250000, timezone:0},
{name:"Stoke-on-Trent, UK", lat:53.0027, lon:-2.1794, pop:250000, timezone:0},
{name:"Wolverhampton, UK", lat:52.5862, lon:-2.1288, pop:250000, timezone:0},
{name:"Reading, UK", lat:51.4543, lon:-0.9781, pop:200000, timezone:0},
{name:"Northampton, UK", lat:52.2405, lon:-0.9027, pop:200000, timezone:0},
{name:"Luton, UK", lat:51.8787, lon:-0.4200, pop:200000, timezone:0},
{name:"Aberdeen, UK", lat:57.1497, lon:-2.0943, pop:200000, timezone:0},
{name:"Dundee, UK", lat:56.4620, lon:-2.9707, pop:150000, timezone:0},
{name:"Swansea, UK", lat:51.6214, lon:-3.9436, pop:250000, timezone:0},
{name:"York, UK", lat:53.9591, lon:-1.0815, pop:200000, timezone:0},
{name:"Oxford, UK", lat:51.7520, lon:-1.2577, pop:150000, timezone:0},
{name:"Cambridge, UK", lat:52.2053, lon:0.1218, pop:150000, timezone:0},
{name:"Brighton, UK", lat:50.8225, lon:-0.1372, pop:300000, timezone:0},
{name:"Bournemouth, UK", lat:50.7192, lon:-1.8808, pop:200000, timezone:0},
{name:"Blackpool, UK", lat:53.8175, lon:-3.0357, pop:150000, timezone:0},
{name:"Middlesbrough, UK", lat:54.5742, lon:-1.2350, pop:150000, timezone:0},
{name:"Ipswich, UK", lat:52.0567, lon:1.1482, pop:150000, timezone:0},
{name:"Norwich, UK", lat:52.6309, lon:1.2974, pop:200000, timezone:0},
{name:"Exeter, UK", lat:50.7184, lon:-3.5339, pop:150000, timezone:0},
{name:"Chelmsford, UK", lat:51.7356, lon:0.4685, pop:150000, timezone:0},
{name:"Colchester, UK", lat:51.8959, lon:0.8919, pop:150000, timezone:0},
{name:"Basildon, UK", lat:51.5761, lon:0.4887, pop:100000, timezone:0},
{name:"Maidstone, UK", lat:51.2704, lon:0.5227, pop:150000, timezone:0},
{name:"Gillingham, UK", lat:51.3863, lon:0.5480, pop:100000, timezone:0},
{name:"Canterbury, UK", lat:51.2802, lon:1.0789, pop:50000, timezone:0},
{name:"Hastings, UK", lat:50.8552, lon:0.5729, pop:100000, timezone:0},
{name:"Eastbourne, UK", lat:50.7687, lon:0.2845, pop:100000, timezone:0},
{name:"Worthing, UK", lat:50.8147, lon:-0.3714, pop:100000, timezone:0},
{name:"Crawley, UK", lat:51.1092, lon:-0.1872, pop:100000, timezone:0},
{name:"Slough, UK", lat:51.5105, lon:-0.5950, pop:150000, timezone:0},
{name:"High Wycombe, UK", lat:51.6286, lon:-0.7482, pop:100000, timezone:0},
{name:"Watford, UK", lat:51.6565, lon:-0.3903, pop:100000, timezone:0},
{name:"St Albans, UK", lat:51.7520, lon:-0.3390, pop:80000, timezone:0},
{name:"Hemel Hempstead, UK", lat:51.7537, lon:-0.4497, pop:100000, timezone:0},
{name:"Stevenage, UK", lat:51.9022, lon:-0.2027, pop:90000, timezone:0},
{name:"Harlow, UK", lat:51.7690, lon:0.0950, pop:90000, timezone:0},
{name:"Cheltenham, UK", lat:51.8994, lon:-2.0783, pop:120000, timezone:0},
{name:"Gloucester, UK", lat:51.8642, lon:-2.2382, pop:130000, timezone:0},
{name:"Worcester, UK", lat:52.1936, lon:-2.2216, pop:100000, timezone:0},
{name:"Hereford, UK", lat:52.0565, lon:-2.7160, pop:60000, timezone:0},
{name:"Shrewsbury, UK", lat:52.7073, lon:-2.7553, pop:70000, timezone:0},
{name:"Telford, UK", lat:52.6766, lon:-2.4493, pop:150000, timezone:0},
{name:"Walsall, UK", lat:52.5860, lon:-1.9829, pop:270000, timezone:0},
{name:"Dudley, UK", lat:52.5123, lon:-2.0810, pop:300000, timezone:0},
{name:"West Bromwich, UK", lat:52.5187, lon:-1.9945, pop:80000, timezone:0},
{name:"Solihull, UK", lat:52.4118, lon:-1.7776, pop:200000, timezone:0},
{name:"Sutton Coldfield, UK", lat:52.5700, lon:-1.8200, pop:100000, timezone:0},
{name:"Nuneaton, UK", lat:52.5233, lon:-1.4680, pop:90000, timezone:0},
{name:"Rugby, UK", lat:52.3709, lon:-1.2650, pop:70000, timezone:0},
{name:"Leamington Spa, UK", lat:52.2920, lon:-1.5360, pop:50000, timezone:0},
{name:"Stratford-upon-Avon, UK", lat:52.1917, lon:-1.7083, pop:30000, timezone:0},
{name:"Banbury, UK", lat:52.0629, lon:-1.3398, pop:50000, timezone:0},
{name:"Bicester, UK", lat:51.9000, lon:-1.1500, pop:30000, timezone:0},
{name:"Aylesbury, UK", lat:51.8167, lon:-0.8167, pop:60000, timezone:0},
{name:"Milton Keynes, UK", lat:52.0406, lon:-0.7594, pop:250000, timezone:0},
{name:"Bedford, UK", lat:52.1364, lon:-0.4607, pop:100000, timezone:0},
{name:"Luton, UK", lat:51.8787, lon:-0.4200, pop:200000, timezone:0},
{name:"Peterborough, UK", lat:52.5695, lon:-0.2405, pop:200000, timezone:0},
{name:"Cambridge, UK", lat:52.2053, lon:0.1218, pop:150000, timezone:0},
{name:"Ely, UK", lat:52.3992, lon:0.2625, pop:20000, timezone:0},
{name:"King's Lynn, UK", lat:52.7517, lon:0.3953, pop:40000, timezone:0},
{name:"Great Yarmouth, UK", lat:52.6083, lon:1.7306, pop:60000, timezone:0},
{name:"Lowestoft, UK", lat:52.4814, lon:1.7539, pop:70000, timezone:0},
{name:"Ipswich, UK", lat:52.0567, lon:1.1482, pop:150000, timezone:0},
{name:"Colchester, UK", lat:51.8959, lon:0.8919, pop:150000, timezone:0},
{name:"Chelmsford, UK", lat:51.7356, lon:0.4685, pop:150000, timezone:0},
{name:"Southend-on-Sea, UK", lat:51.5450, lon:0.7077, pop:180000, timezone:0},
{name:"Basildon, UK", lat:51.5761, lon:0.4887, pop:100000, timezone:0},
{name:"Thurrock, UK", lat:51.4935, lon:0.3529, pop:170000, timezone:0},
{name:"Grays, UK", lat:51.4750, lon:0.3250, pop:70000, timezone:0},
{name:"Dartford, UK", lat:51.4462, lon:0.2167, pop:100000, timezone:0},
{name:"Gravesend, UK", lat:51.4419, lon:0.3708, pop:50000, timezone:0},
{name:"Rochester, UK", lat:51.3875, lon:0.5053, pop:30000, timezone:0},
{name:"Chatham, UK", lat:51.3800, lon:0.5200, pop:70000, timezone:0},
{name:"Gillingham, UK", lat:51.3863, lon:0.5480, pop:100000, timezone:0},
{name:"Maidstone, UK", lat:51.2704, lon:0.5227, pop:150000, timezone:0},
{name:"Ashford, UK", lat:51.1465, lon:0.8750, pop:70000, timezone:0},
{name:"Folkestone, UK", lat:51.0814, lon:1.1697, pop:50000, timezone:0},
{name:"Dover, UK", lat:51.1279, lon:1.3134, pop:30000, timezone:0},
{name:"Canterbury, UK", lat:51.2802, lon:1.0789, pop:50000, timezone:0},
{name:"Margate, UK", lat:51.3891, lon:1.3868, pop:60000, timezone:0},
{name:"Ramsgate, UK", lat:51.3356, lon:1.4178, pop:40000, timezone:0},
{name:"Broadstairs, UK", lat:51.3590, lon:1.4394, pop:25000, timezone:0},
{name:"Whitstable, UK", lat:51.3607, lon:1.0257, pop:30000, timezone:0},
{name:"Herne Bay, UK", lat:51.3729, lon:1.1285, pop:40000, timezone:0},
{name:"Faversham, UK", lat:51.3144, lon:0.8914, pop:20000, timezone:0},
{name:"Sittingbourne, UK", lat:51.3417, lon:0.7328, pop:50000, timezone:0},
{name:"Sheerness, UK", lat:51.4406, lon:0.7625, pop:10000, timezone:0},
{name:"Isle of Sheppey, UK", lat:51.4000, lon:0.8000, pop:40000, timezone:0},
{name:"Krakow, Poland", lat:50.0647, lon:19.9450, pop:1500000, timezone:1},
{name:"Budapest, Hungary", lat:47.4979, lon:19.0402, pop:3000000, timezone:1},
{name:"Prague, Czech Republic", lat:50.0755, lon:14.4378, pop:2700000, timezone:1},
{name:"Bratislava, Slovakia", lat:48.1486, lon:17.1077, pop:700000, timezone:1},
{name:"Vienna, Austria", lat:48.2082, lon:16.3738, pop:2900000, timezone:1}, // (intentional regional importance)

/* --- BALKANS --- */
{name:"Athens, Greece", lat:37.9838, lon:23.7275, pop:3200000, timezone:2},
{name:"Belgrade, Serbia", lat:44.7866, lon:20.4489, pop:1700000, timezone:1},
{name:"Zagreb, Croatia", lat:45.8150, lon:15.9819, pop:1000000, timezone:1},
{name:"Sarajevo, Bosnia", lat:43.8563, lon:18.4131, pop:500000, timezone:1},
{name:"Skopje, North Macedonia", lat:41.9973, lon:21.4280, pop:600000, timezone:1},
{name:"Sofia, Bulgaria", lat:42.6977, lon:23.3219, pop:1700000, timezone:2},
{name:"Bucharest, Romania", lat:44.4268, lon:26.1025, pop:2300000, timezone:2},

/* --- SOUTHERN EUROPE --- */
{name:"Lisbon, Portugal", lat:38.7223, lon:-9.1393, pop:2900000, timezone:0},
{name:"Porto, Portugal", lat:41.1579, lon:-8.6291, pop:1300000, timezone:0},
{name:"Valencia, Spain", lat:39.4699, lon:-0.3763, pop:2500000, timezone:1},
{name:"Seville, Spain", lat:37.3891, lon:-5.9845, pop:1500000, timezone:1},

/* --- TURKEY & EDGE EUROPE --- */
{name:"Ankara, Turkey", lat:39.9334, lon:32.8597, pop:5700000, timezone:3},
{name:"Izmir, Turkey", lat:38.4237, lon:27.1428, pop:4300000, timezone:3},

/* --- RUSSIA WEST --- */
{name:"Saint Petersburg, Russia", lat:59.9311, lon:30.3609, pop:6000000, timezone:3},

/* --- SMALL BUT IMPORTANT --- */
{name:"Reykjavik, Iceland", lat:64.1466, lon:-21.9426, pop:250000, timezone:0},
{name:"Luxembourg City, Luxembourg", lat:49.6116, lon:6.1319, pop:130000, timezone:1},
{name:"Monaco, Monaco", lat:43.7384, lon:7.4246, pop:40000, timezone:1},
{name:"Andorra la Vella, Andorra", lat:42.5063, lon:1.5218, pop:22000, timezone:1},

/* =========================
   🌍 EUROPE (71–140)
========================= */

/* --- FRANCE (EXPANDED) --- */
{name:"Lyon, France", lat:45.7640, lon:4.8357, pop:1800000, timezone:1},
{name:"Marseille, France", lat:43.2965, lon:5.3698, pop:1700000, timezone:1},
{name:"Toulouse, France", lat:43.6047, lon:1.4442, pop:1400000, timezone:1},
{name:"Nice, France", lat:43.7102, lon:7.2620, pop:1000000, timezone:1},
{name:"Bordeaux, France", lat:44.8378, lon:-0.5792, pop:900000, timezone:1},

/* --- GERMANY (EXPANDED) --- */
{name:"Stuttgart, Germany", lat:48.7758, lon:9.1829, pop:2700000, timezone:1},
{name:"Düsseldorf, Germany", lat:51.2277, lon:6.7735, pop:1600000, timezone:1},
{name:"Dortmund, Germany", lat:51.5136, lon:7.4653, pop:1500000, timezone:1},
{name:"Essen, Germany", lat:51.4556, lon:7.0116, pop:1100000, timezone:1},
{name:"Leipzig, Germany", lat:51.3397, lon:12.3731, pop:1200000, timezone:1},

/* --- ITALY (EXPANDED) --- */
{name:"Turin, Italy", lat:45.0703, lon:7.6869, pop:1700000, timezone:1},
{name:"Palermo, Italy", lat:38.1157, lon:13.3615, pop:1000000, timezone:1},
{name:"Bologna, Italy", lat:44.4949, lon:11.3426, pop:1000000, timezone:1},
{name:"Florence, Italy", lat:43.7696, lon:11.2558, pop:1000000, timezone:1},

/* --- SPAIN (EXPANDED) --- */
{name:"Bilbao, Spain", lat:43.2630, lon:-2.9350, pop:1000000, timezone:1},
{name:"Malaga, Spain", lat:36.7213, lon:-4.4214, pop:1000000, timezone:1},
{name:"Zaragoza, Spain", lat:41.6488, lon:-0.8891, pop:700000, timezone:1},

/* --- POLAND (EXPANDED) --- */
{name:"Gdansk, Poland", lat:54.3520, lon:18.6466, pop:1000000, timezone:1},
{name:"Wroclaw, Poland", lat:51.1079, lon:17.0385, pop:1200000, timezone:1},
{name:"Poznan, Poland", lat:52.4064, lon:16.9252, pop:900000, timezone:1},

/* --- ROMANIA & BULGARIA --- */
{name:"Cluj-Napoca, Romania", lat:46.7712, lon:23.6236, pop:700000, timezone:2},
{name:"Timisoara, Romania", lat:45.7489, lon:21.2087, pop:500000, timezone:2},
{name:"Varna, Bulgaria", lat:43.2141, lon:27.9147, pop:500000, timezone:2},
{name:"Plovdiv, Bulgaria", lat:42.1354, lon:24.7453, pop:700000, timezone:2},

/* --- UK (EXPANDED) --- */
{name:"Sheffield, UK", lat:53.3811, lon:-1.4701, pop:700000, timezone:0},
{name:"Newcastle, UK", lat:54.9783, lon:-1.6178, pop:800000, timezone:0},
{name:"Bristol, UK", lat:51.4545, lon:-2.5879, pop:700000, timezone:0},
{name:"Nottingham, UK", lat:52.9548, lon:-1.1581, pop:700000, timezone:0},
{name:"Leicester, UK", lat:52.6369, lon:-1.1398, pop:600000, timezone:0},

/* --- SCANDINAVIA (EXPANDED) --- */
{name:"Gothenburg, Sweden", lat:57.7089, lon:11.9746, pop:1000000, timezone:1},
{name:"Malmo, Sweden", lat:55.6050, lon:13.0038, pop:700000, timezone:1},
{name:"Bergen, Norway", lat:60.3913, lon:5.3221, pop:400000, timezone:1},
{name:"Trondheim, Norway", lat:63.4305, lon:10.3951, pop:300000, timezone:1},
{name:"Aarhus, Denmark", lat:56.1629, lon:10.2039, pop:400000, timezone:1},

/* --- FINLAND & BALTICS --- */
{name:"Tampere, Finland", lat:61.4978, lon:23.7610, pop:400000, timezone:2},
{name:"Turku, Finland", lat:60.4518, lon:22.2666, pop:300000, timezone:2},
{name:"Tallinn, Estonia", lat:59.4370, lon:24.7536, pop:450000, timezone:2},
{name:"Riga, Latvia", lat:56.9496, lon:24.1052, pop:600000, timezone:2},
{name:"Vilnius, Lithuania", lat:54.6872, lon:25.2797, pop:700000, timezone:2},

/* --- UKRAINE --- */
{name:"Kyiv, Ukraine", lat:50.4501, lon:30.5234, pop:3000000, timezone:2},
{name:"Kharkiv, Ukraine", lat:49.9935, lon:36.2304, pop:1400000, timezone:2},
{name:"Odesa, Ukraine", lat:46.4825, lon:30.7233, pop:1000000, timezone:2},
{name:"Dnipro, Ukraine", lat:48.4647, lon:35.0462, pop:1000000, timezone:2},

/* --- BELARUS --- */
{name:"Minsk, Belarus", lat:53.9006, lon:27.5590, pop:2000000, timezone:3},

/* --- RUSSIA (EXPANDED WEST) --- */
{name:"Kazan, Russia", lat:55.8304, lon:49.0661, pop:1300000, timezone:3},
{name:"Nizhny Novgorod, Russia", lat:56.2965, lon:43.9361, pop:1200000, timezone:3},
{name:"Rostov-on-Don, Russia", lat:47.2357, lon:39.7015, pop:1100000, timezone:3},
{name:"Samara, Russia", lat:53.1959, lon:50.1008, pop:1100000, timezone:4},

/* --- BALKANS (EXPANDED) --- */
{name:"Tirana, Albania", lat:41.3275, lon:19.8187, pop:800000, timezone:1},
{name:"Podgorica, Montenegro", lat:42.4304, lon:19.2594, pop:300000, timezone:1},
{name:"Pristina, Kosovo", lat:42.6629, lon:21.1655, pop:500000, timezone:1},
{name:"Ljubljana, Slovenia", lat:46.0569, lon:14.5058, pop:300000, timezone:1},

/* --- CENTRAL EUROPE SMALL --- */
{name:"Salzburg, Austria", lat:47.8095, lon:13.0550, pop:300000, timezone:1},
{name:"Innsbruck, Austria", lat:47.2692, lon:11.4041, pop:300000, timezone:1},
{name:"Basel, Switzerland", lat:47.5596, lon:7.5886, pop:600000, timezone:1},
{name:"Lausanne, Switzerland", lat:46.5197, lon:6.6323, pop:400000, timezone:1},

/* --- MEDITERRANEAN SMALL STATES --- */
{name:"Valletta, Malta", lat:35.8989, lon:14.5146, pop:200000, timezone:1},
{name:"Nicosia, Cyprus", lat:35.1856, lon:33.3823, pop:300000, timezone:2},

/* =========================
   🌏 ASIA (1–80)
========================= */

/* --- MEGACITIES --- */
{name:"Tokyo, Japan", lat:35.6762, lon:139.6503, pop:37400000, timezone:9},
{name:"Delhi, India", lat:28.7041, lon:77.1025, pop:32900000, timezone:5.5},
{name:"Shanghai, China", lat:31.2304, lon:121.4737, pop:29200000, timezone:8},
{name:"Dhaka, Bangladesh", lat:23.8103, lon:90.4125, pop:23200000, timezone:6},
{name:"Beijing, China", lat:39.9042, lon:116.4074, pop:21700000, timezone:8},
{name:"Mumbai, India", lat:19.0760, lon:72.8777, pop:22100000, timezone:5.5},
{name:"Karachi, Pakistan", lat:24.8607, lon:67.0011, pop:17700000, timezone:5},
{name:"Guangzhou, China", lat:23.1291, lon:113.2644, pop:25000000, timezone:8},
{name:"Shenzhen, China", lat:22.5431, lon:114.0579, pop:17500000, timezone:8},
{name:"Chongqing, China", lat:29.5630, lon:106.5516, pop:17000000, timezone:8},

/* --- EAST ASIA --- */
{name:"Seoul, South Korea", lat:37.5665, lon:126.9780, pop:9700000, timezone:9},
{name:"Busan, South Korea", lat:35.1796, lon:129.0756, pop:3400000, timezone:9},
{name:"Osaka, Japan", lat:34.6937, lon:135.5023, pop:19000000, timezone:9},
{name:"Nagoya, Japan", lat:35.1815, lon:136.9066, pop:9000000, timezone:9},
{name:"Sapporo, Japan", lat:43.0618, lon:141.3545, pop:2600000, timezone:9},
{name:"Fukuoka, Japan", lat:33.5904, lon:130.4017, pop:2600000, timezone:9},
{name:"Taiepi, Taiwan", lat:25.0330, lon:121.5654, pop:7800000, timezone:8},

/* --- CHINA EXPANDED --- */
{name:"Chengdu, China", lat:30.5728, lon:104.0668, pop:16000000, timezone:8},
{name:"Wuhan, China", lat:30.5928, lon:114.3055, pop:11000000, timezone:8},
{name:"Xi'an, China", lat:34.3416, lon:108.9398, pop:9000000, timezone:8},
{name:"Hangzhou, China", lat:30.2741, lon:120.1551, pop:12000000, timezone:8},
{name:"Nanjing, China", lat:32.0603, lon:118.7969, pop:9500000, timezone:8},
{name:"Tianjin, China", lat:39.3434, lon:117.3616, pop:13000000, timezone:8},

/* --- INDIA EXPANDED --- */
{name:"Bangalore, India", lat:12.9716, lon:77.5946, pop:14000000, timezone:5.5},
{name:"Kolkata, India", lat:22.5726, lon:88.3639, pop:15000000, timezone:5.5},
{name:"Chennai, India", lat:13.0827, lon:80.2707, pop:11000000, timezone:5.5},
{name:"Hyderabad, India", lat:17.3850, lon:78.4867, pop:10500000, timezone:5.5},
{name:"Ahmedabad, India", lat:23.0225, lon:72.5714, pop:8000000, timezone:5.5},
{name:"Pune, India", lat:18.5204, lon:73.8567, pop:7500000, timezone:5.5},

/* --- SOUTHEAST ASIA --- */
{name:"Jakarta, Indonesia", lat:-6.2088, lon:106.8456, pop:34000000, timezone:7},
{name:"Manila, Philippines", lat:14.5995, lon:120.9842, pop:25000000, timezone:8},
{name:"Bangkok, Thailand", lat:13.7563, lon:100.5018, pop:17000000, timezone:7},
{name:"Ho Chi Minh City, Vietnam", lat:10.8231, lon:106.6297, pop:13000000, timezone:7},
{name:"Hanoi, Vietnam", lat:21.0278, lon:105.8342, pop:8500000, timezone:7},
{name:"Kuala Lumpur, Malaysia", lat:3.1390, lon:101.6869, pop:8000000, timezone:8},
{name:"Singapore, Singapore", lat:1.3521, lon:103.8198, pop:5900000, timezone:8},

/* --- MIDDLE EAST --- */
{name:"Dubai, UAE", lat:25.2048, lon:55.2708, pop:3500000, timezone:4},
{name:"Abu Dhabi, UAE", lat:24.4539, lon:54.3773, pop:1500000, timezone:4},
{name:"Riyadh, Saudi Arabia", lat:24.7136, lon:46.6753, pop:7500000, timezone:3},
{name:"Jeddah, Saudi Arabia", lat:21.4858, lon:39.1925, pop:4800000, timezone:3},
{name:"Doha, Qatar", lat:25.2854, lon:51.5310, pop:1000000, timezone:3},

/* --- CENTRAL / SOUTH ASIA --- */
{name:"Lahore, Pakistan", lat:31.5497, lon:74.3436, pop:13000000, timezone:5},
{name:"Islamabad, Pakistan", lat:33.6844, lon:73.0479, pop:1000000, timezone:5},
{name:"Kathmandu, Nepal", lat:27.7172, lon:85.3240, pop:1500000, timezone:5.75},
{name:"Colombo, Sri Lanka", lat:6.9271, lon:79.8612, pop:2300000, timezone:5.5},

/* --- EAST EDGE --- */
{name:"Ulaanbaatar, Mongolia", lat:47.8864, lon:106.9057, pop:1600000, timezone:8},

/* --- SMALL BUT IMPORTANT --- */
{name:"Tbilisi, Georgia", lat:41.7151, lon:44.8271, pop:1200000, timezone:4},
{name:"Yerevan, Armenia", lat:40.1792, lon:44.4991, pop:1100000, timezone:4},
{name:"Baku, Azerbaijan", lat:40.4093, lon:49.8671, pop:2300000, timezone:4},

/* =========================
   🌏 ASIA (81–160)
========================= */

/* --- CHINA (FURTHER EXPANSION) --- */
{name:"Suzhou, China", lat:31.2989, lon:120.5853, pop:8000000, timezone:8},
{name:"Qingdao, China", lat:36.0671, lon:120.3826, pop:6000000, timezone:8},
{name:"Dalian, China", lat:38.9140, lon:121.6147, pop:6000000, timezone:8},
{name:"Shenyang, China", lat:41.8057, lon:123.4315, pop:7000000, timezone:8},
{name:"Harbin, China", lat:45.8038, lon:126.5349, pop:5000000, timezone:8},
{name:"Wuxi, China", lat:31.4912, lon:120.3119, pop:7000000, timezone:8},
{name:"Ningbo, China", lat:29.8683, lon:121.5440, pop:8000000, timezone:8},
{name:"Foshan, China", lat:23.0215, lon:113.1214, pop:9000000, timezone:8},
{name:"Dongguan, China", lat:23.0207, lon:113.7518, pop:10000000, timezone:8},
{name:"Zhongshan, China", lat:22.5170, lon:113.3927, pop:4000000, timezone:8},
{name:"Huizhou, China", lat:23.1115, lon:114.4152, pop:5000000, timezone:8},
{name:"Jiangmen, China", lat:22.5787, lon:113.0815, pop:4000000, timezone:8},
{name:"Zhuhai, China", lat:22.2711, lon:113.5767, pop:2000000, timezone:8},
{name:"Shantou, China", lat:23.3541, lon:116.6819, pop:5000000, timezone:8},
{name:"Zhanjiang, China", lat:21.2707, lon:110.3593, pop:7000000, timezone:8},
{name:"Haikou, China", lat:20.0440, lon:110.1999, pop:2000000, timezone:8},
{name:"Sanya, China", lat:18.2528, lon:109.5119, pop:1000000, timezone:8},
{name:"Guiyang, China", lat:26.6470, lon:106.6302, pop:5000000, timezone:8},
{name:"Nanchang, China", lat:28.6820, lon:115.8579, pop:6000000, timezone:8},
{name:"Hefei, China", lat:31.8206, lon:117.2272, pop:9000000, timezone:8},
{name:"Changsha, China", lat:28.2282, lon:112.9388, pop:10000000, timezone:8},
{name:"Zhengzhou, China", lat:34.7466, lon:113.6253, pop:12000000, timezone:8},
{name:"Shijiazhuang, China", lat:38.0428, lon:114.5149, pop:11000000, timezone:8},
{name:"Taiyuan, China", lat:37.8706, lon:112.5489, pop:4000000, timezone:8},
{name:"Hohhot, China", lat:40.8424, lon:111.7498, pop:3000000, timezone:8},
{name:"Yinchuan, China", lat:38.4872, lon:106.2309, pop:2000000, timezone:8},
{name:"Lanzhou, China", lat:36.0611, lon:103.8343, pop:4000000, timezone:8},
{name:"Almaty, Kazakhstan", lat:43.2220, lon:76.8512, pop:2000000, timezone:6},
{name:"Astana, Kazakhstan", lat:51.1694, lon:71.4491, pop:1300000, timezone:6},
{name:"Shymkent, Kazakhstan", lat:42.3000, lon:69.6000, pop:1000000, timezone:6},
{name:"Karaganda, Kazakhstan", lat:49.8047, lon:73.1094, pop:500000, timezone:6},
{name:"Aktobe, Kazakhstan", lat:50.2833, lon:57.1667, pop:500000, timezone:5},
{name:"Pavlodar, Kazakhstan", lat:52.3000, lon:76.9500, pop:350000, timezone:6},
{name:"Taraz, Kazakhstan", lat:42.9000, lon:71.3667, pop:350000, timezone:6},
{name:"Ust-Kamenogorsk, Kazakhstan", lat:49.9483, lon:82.6278, pop:300000, timezone:6},
{name:"Semey, Kazakhstan", lat:50.4111, lon:80.2275, pop:300000, timezone:6},
{name:"Kostanay, Kazakhstan", lat:53.2144, lon:63.6246, pop:250000, timezone:6},
{name:"Tashkent, Uzbekistan", lat:41.2995, lon:69.2401, pop:2600000, timezone:5},
{name:"Samarkand, Uzbekistan", lat:39.6542, lon:66.9597, pop:500000, timezone:5},
{name:"Namangan, Uzbekistan", lat:40.9983, lon:71.6726, pop:600000, timezone:5},
{name:"Andijan, Uzbekistan", lat:40.7833, lon:72.3333, pop:400000, timezone:5},
{name:"Bukhara, Uzbekistan", lat:39.7747, lon:64.4286, pop:300000, timezone:5},
{name:"Nukus, Uzbekistan", lat:42.4531, lon:59.6103, pop:300000, timezone:5},
{name:"Qarshi, Uzbekistan", lat:38.8667, lon:65.8000, pop:250000, timezone:5},
{name:"Fergana, Uzbekistan", lat:40.3864, lon:71.7864, pop:300000, timezone:5},
{name:"Kokand, Uzbekistan", lat:40.5286, lon:70.9425, pop:250000, timezone:5},
{name:"Jizzakh, Uzbekistan", lat:40.1158, lon:67.8422, pop:200000, timezone:5},
{name:"Bishkek, Kyrgyzstan", lat:42.8746, lon:74.5698, pop:1000000, timezone:6},
{name:"Osh, Kyrgyzstan", lat:40.5283, lon:72.7985, pop:300000, timezone:6},
{name:"Jalal-Abad, Kyrgyzstan", lat:40.9333, lon:73.0000, pop:100000, timezone:6},
{name:"Karakol, Kyrgyzstan", lat:42.4907, lon:78.3936, pop:70000, timezone:6},
{name:"Tokmok, Kyrgyzstan", lat:42.8333, lon:75.2833, pop:60000, timezone:6},
{name:"Dushanbe, Tajikistan", lat:38.5598, lon:68.7870, pop:900000, timezone:5},
{name:"Khujand, Tajikistan", lat:40.2826, lon:69.6222, pop:200000, timezone:5},
{name:"Kulob, Tajikistan", lat:37.9094, lon:69.7819, pop:100000, timezone:5},
{name:"Qurghonteppa, Tajikistan", lat:37.8364, lon:68.7803, pop:100000, timezone:5},
{name:"Istaravshan, Tajikistan", lat:39.9142, lon:69.0033, pop:60000, timezone:5},
{name:"Ashgabat, Turkmenistan", lat:37.9601, lon:58.3261, pop:900000, timezone:5},
{name:"Türkmenabat, Turkmenistan", lat:39.0733, lon:63.5786, pop:250000, timezone:5},
{name:"Daşoguz, Turkmenistan", lat:41.8333, lon:59.9667, pop:200000, timezone:5},
{name:"Mary, Turkmenistan", lat:37.6000, lon:61.8333, pop:150000, timezone:5},
{name:"Balkanabat, Turkmenistan", lat:39.5167, lon:54.3667, pop:100000, timezone:5},
{name:"Ulaanbaatar, Mongolia", lat:47.8864, lon:106.9057, pop:1600000, timezone:8},
{name:"Erdenet, Mongolia", lat:49.0272, lon:104.0444, pop:100000, timezone:8},
{name:"Darkhan, Mongolia", lat:49.4867, lon:105.9228, pop:80000, timezone:8},
{name:"Choibalsan, Mongolia", lat:48.0728, lon:114.5328, pop:40000, timezone:8},
{name:"Mörön, Mongolia", lat:49.6342, lon:100.1625, pop:30000, timezone:8},
{name:"Tbilisi, Georgia", lat:41.7151, lon:44.8271, pop:1200000, timezone:4},
{name:"Batumi, Georgia", lat:41.6168, lon:41.6367, pop:150000, timezone:4},
{name:"Kutaisi, Georgia", lat:42.2679, lon:42.6946, pop:150000, timezone:4},
{name:"Rustavi, Georgia", lat:41.5495, lon:44.9930, pop:150000, timezone:4},
{name:"Zugdidi, Georgia", lat:42.5088, lon:41.8709, pop:50000, timezone:4},
{name:"Yerevan, Armenia", lat:40.1792, lon:44.4991, pop:1100000, timezone:4},
{name:"Gyumri, Armenia", lat:40.7942, lon:43.8453, pop:120000, timezone:4},
{name:"Vanadzor, Armenia", lat:40.8074, lon:44.4970, pop:80000, timezone:4},
{name:"Vagharshapat, Armenia", lat:40.1656, lon:44.2947, pop:50000, timezone:4},
{name:"Hrazdan, Armenia", lat:40.4975, lon:44.7662, pop:40000, timezone:4},
{name:"Baku, Azerbaijan", lat:40.4093, lon:49.8671, pop:2300000, timezone:4},
{name:"Ganja, Azerbaijan", lat:40.6828, lon:46.3606, pop:300000, timezone:4},
{name:"Sumqayit, Azerbaijan", lat:40.5897, lon:49.6686, pop:300000, timezone:4},
{name:"Mingachevir, Azerbaijan", lat:40.7700, lon:47.0489, pop:100000, timezone:4},
{name:"Lankaran, Azerbaijan", lat:38.7543, lon:48.8500, pop:50000, timezone:4},
{name:"Shiraz, Iran", lat:29.5918, lon:52.5837, pop:1500000, timezone:3.5},
{name:"Tabriz, Iran", lat:38.0962, lon:46.2738, pop:1500000, timezone:3.5},
{name:"Qom, Iran", lat:34.6416, lon:50.8746, pop:1200000, timezone:3.5},
{name:"Ahvaz, Iran", lat:31.3183, lon:48.6706, pop:1200000, timezone:3.5},
{name:"Kermanshah, Iran", lat:34.3142, lon:47.0650, pop:900000, timezone:3.5},
{name:"Urmia, Iran", lat:37.5527, lon:45.0761, pop:700000, timezone:3.5},
{name:"Rasht, Iran", lat:37.2808, lon:49.5832, pop:700000, timezone:3.5},
{name:"Zahedan, Iran", lat:29.4963, lon:60.8629, pop:600000, timezone:3.5},
{name:"Hamadan, Iran", lat:34.7992, lon:48.5146, pop:500000, timezone:3.5},
{name:"Kerman, Iran", lat:30.2832, lon:57.0788, pop:500000, timezone:3.5},
{name:"Yazd, Iran", lat:31.8974, lon:54.3569, pop:500000, timezone:3.5},
{name:"Ardabil, Iran", lat:38.2498, lon:48.2933, pop:500000, timezone:3.5},
{name:"Bandar Abbas, Iran", lat:27.1832, lon:56.2666, pop:500000, timezone:3.5},
{name:"Arak, Iran", lat:34.0917, lon:49.6892, pop:500000, timezone:3.5},
{name:"Eslamshahr, Iran", lat:35.5522, lon:51.2350, pop:500000, timezone:3.5},
{name:"Zanjan, Iran", lat:36.6736, lon:48.4787, pop:400000, timezone:3.5},
{name:"Sanandaj, Iran", lat:35.3219, lon:46.9862, pop:400000, timezone:3.5},
{name:"Qazvin, Iran", lat:36.2688, lon:50.0041, pop:400000, timezone:3.5},
{name:"Khorramabad, Iran", lat:33.4878, lon:48.3558, pop:350000, timezone:3.5},
{name:"Gorgan, Iran", lat:36.8427, lon:54.4439, pop:350000, timezone:3.5},
{name:"Sari, Iran", lat:36.5633, lon:53.0601, pop:300000, timezone:3.5},
{name:"Bushehr, Iran", lat:28.9684, lon:50.8385, pop:250000, timezone:3.5},
{name:"Birjand, Iran", lat:32.8663, lon:59.2211, pop:200000, timezone:3.5},
{name:"Sabzevar, Iran", lat:36.2126, lon:57.6819, pop:250000, timezone:3.5},
{name:"Amol, Iran", lat:36.4697, lon:52.3508, pop:250000, timezone:3.5},
{name:"Bojnurd, Iran", lat:37.4747, lon:57.3290, pop:200000, timezone:3.5},
{name:"Ilam, Iran", lat:33.6374, lon:46.4226, pop:200000, timezone:3.5},
{name:"Yasuj, Iran", lat:30.6684, lon:51.5880, pop:150000, timezone:3.5},
{name:"Semnan, Iran", lat:35.5769, lon:53.3920, pop:150000, timezone:3.5},
{name:"Shahrud, Iran", lat:36.4182, lon:54.9763, pop:150000, timezone:3.5},
{name:"Kashan, Iran", lat:33.9850, lon:51.4100, pop:300000, timezone:3.5},
{name:"Najafabad, Iran", lat:32.6342, lon:51.3667, pop:300000, timezone:3.5},
{name:"Saveh, Iran", lat:35.0213, lon:50.3566, pop:200000, timezone:3.5},
{name:"Malayer, Iran", lat:34.2969, lon:48.8236, pop:200000, timezone:3.5},
{name:"Borujerd, Iran", lat:33.8973, lon:48.7516, pop:250000, timezone:3.5},
{name:"Maragheh, Iran", lat:37.3890, lon:46.2378, pop:150000, timezone:3.5},
{name:"Mahabad, Iran", lat:36.7631, lon:45.7222, pop:150000, timezone:3.5},
{name:"Saqqez, Iran", lat:36.2499, lon:46.2735, pop:150000, timezone:3.5},
{name:"Bukan, Iran", lat:36.5211, lon:46.2089, pop:150000, timezone:3.5},
{name:"Piranshahr, Iran", lat:36.6944, lon:45.1417, pop:100000, timezone:3.5},
{name:"Oshnavieh, Iran", lat:37.0397, lon:45.0983, pop:80000, timezone:3.5},
{name:"Salmas, Iran", lat:38.1975, lon:44.7653, pop:100000, timezone:3.5},
{name:"Khoy, Iran", lat:38.5503, lon:44.9521, pop:200000, timezone:3.5},
{name:"Maku, Iran", lat:39.2911, lon:44.5167, pop:50000, timezone:3.5},
{name:"Jolfa, Iran", lat:38.9400, lon:45.6300, pop:10000, timezone:3.5},
{name:"Xining, China", lat:36.6171, lon:101.7782, pop:2000000, timezone:8},
{name:"Lhasa, China", lat:29.6525, lon:91.1721, pop:500000, timezone:8},
{name:"Ürümqi, China", lat:43.8256, lon:87.6168, pop:4000000, timezone:6},
{name:"Kashgar, China", lat:39.4704, lon:75.9898, pop:500000, timezone:6},
{name:"Hotan, China", lat:37.1142, lon:79.9200, pop:300000, timezone:6},
{name:"Aksu, China", lat:41.1675, lon:80.2636, pop:500000, timezone:6},
{name:"Korla, China", lat:41.7270, lon:86.1489, pop:500000, timezone:6},
{name:"Turpan, China", lat:42.9513, lon:89.1895, pop:300000, timezone:6},
{name:"Hami, China", lat:42.8333, lon:93.5000, pop:500000, timezone:6},
{name:"Changchun, China", lat:43.8171, lon:125.3235, pop:7000000, timezone:8},
{name:"Jilin, China", lat:43.8508, lon:126.5603, pop:4000000, timezone:8},
{name:"Harbin, China", lat:45.8038, lon:126.5349, pop:5000000, timezone:8},
{name:"Qiqihar, China", lat:47.3543, lon:123.9182, pop:5000000, timezone:8},
{name:"Daqing, China", lat:46.5893, lon:125.1031, pop:3000000, timezone:8},
{name:"Mudanjiang, China", lat:44.5516, lon:129.6328, pop:2000000, timezone:8},
{name:"Jiamusi, China", lat:46.7996, lon:130.3189, pop:2000000, timezone:8},
{name:"Suihua, China", lat:46.6373, lon:126.9687, pop:5000000, timezone:8},
{name:"Yichun, China", lat:47.7275, lon:128.8411, pop:1000000, timezone:8},
{name:"Heihe, China", lat:50.2450, lon:127.4880, pop:1600000, timezone:8},
{name:"Baotou, China", lat:40.6574, lon:109.8403, pop:2000000, timezone:8},
{name:"Ordos, China", lat:39.6086, lon:109.7811, pop:2000000, timezone:8},
{name:"Wuhai, China", lat:39.6550, lon:106.7942, pop:500000, timezone:8},
{name:"Chifeng, China", lat:42.2578, lon:118.8869, pop:4000000, timezone:8},
{name:"Tongliao, China", lat:43.6174, lon:122.2650, pop:3000000, timezone:8},
{name:"Hulunbuir, China", lat:49.2153, lon:119.7589, pop:2500000, timezone:8},
{name:"Ulanqab, China", lat:40.9948, lon:113.1326, pop:2000000, timezone:8},
{name:"Bayannur, China", lat:40.7432, lon:107.3877, pop:1600000, timezone:8},
{name:"Alxa, China", lat:38.8510, lon:105.7280, pop:200000, timezone:8},
{name:"Xilinhot, China", lat:43.9333, lon:116.0667, pop:200000, timezone:8},
{name:"Erenhot, China", lat:43.6500, lon:111.9833, pop:100000, timezone:8},
{name:"Manzhouli, China", lat:49.6000, lon:117.4333, pop:200000, timezone:8},
{name:"Hailar, China", lat:49.2000, lon:119.7000, pop:300000, timezone:8},
{name:"Yakeshi, China", lat:49.2833, lon:120.7333, pop:400000, timezone:8},
{name:"Zhalantun, China", lat:48.0000, lon:122.7333, pop:400000, timezone:8},
{name:"Arxan, China", lat:47.1833, lon:119.9500, pop:100000, timezone:8},
{name:"Genhe, China", lat:50.7833, lon:121.5167, pop:100000, timezone:8},
{name:"Mohe, China", lat:52.9667, lon:122.5333, pop:80000, timezone:8},
{name:"Heihe, China", lat:50.2450, lon:127.4880, pop:1600000, timezone:8},
{name:"Jiayuguan, China", lat:39.7727, lon:98.2882, pop:200000, timezone:8},
{name:"Jiuquan, China", lat:39.7324, lon:98.4943, pop:1000000, timezone:8},
{name:"Zhangye, China", lat:38.9259, lon:100.4498, pop:1200000, timezone:8},
{name:"Wuwei, China", lat:37.9283, lon:102.6380, pop:1800000, timezone:8},
{name:"Baiyin, China", lat:36.5447, lon:104.1386, pop:1700000, timezone:8},
{name:"Tianshui, China", lat:34.5809, lon:105.7249, pop:3000000, timezone:8},
{name:"Longnan, China", lat:33.3886, lon:104.9219, pop:2500000, timezone:8},
{name:"Pingliang, China", lat:35.5431, lon:106.6653, pop:2000000, timezone:8},
{name:"Qingyang, China", lat:35.7344, lon:107.6436, pop:2000000, timezone:8},
{name:"Dingxi, China", lat:35.5806, lon:104.6261, pop:2500000, timezone:8},
{name:"Gannan, China", lat:34.9833, lon:102.9167, pop:700000, timezone:8},
{name:"Linxia, China", lat:35.6018, lon:103.2105, pop:2000000, timezone:8},
{name:"Gannan Tibetan, China", lat:34.9833, lon:102.9167, pop:700000, timezone:8},
{name:"Jinan, China", lat:36.6512, lon:117.1201, pop:6000000, timezone:8},
{name:"Fuzhou, China", lat:26.0745, lon:119.2965, pop:5000000, timezone:8},
{name:"Xiamen, China", lat:24.4798, lon:118.0894, pop:5000000, timezone:8},
{name:"Kunming, China", lat:25.0389, lon:102.7183, pop:6000000, timezone:8},
{name:"Nanning, China", lat:22.8170, lon:108.3669, pop:5000000, timezone:8},

/* --- INDIA (FURTHER EXPANSION) --- */
{name:"Jaipur, India", lat:26.9124, lon:75.7873, pop:4000000, timezone:5.5},
{name:"Lucknow, India", lat:26.8467, lon:80.9462, pop:3800000, timezone:5.5},
{name:"Kanpur, India", lat:26.4499, lon:80.3319, pop:3200000, timezone:5.5},
{name:"Nagpur, India", lat:21.1458, lon:79.0882, pop:3000000, timezone:5.5},
{name:"Indore, India", lat:22.7196, lon:75.8577, pop:3000000, timezone:5.5},
{name:"Bhopal, India", lat:23.2599, lon:77.4126, pop:2200000, timezone:5.5},
{name:"Surat, India", lat:21.1702, lon:72.8311, pop:7000000, timezone:5.5},
{name:"Vadodara, India", lat:22.3072, lon:73.1812, pop:2000000, timezone:5.5},

/* --- PAKISTAN / BANGLADESH --- */
{name:"Faisalabad, Pakistan", lat:31.4504, lon:73.1350, pop:3500000, timezone:5},
{name:"Chittagong, Bangladesh", lat:22.3569, lon:91.7832, pop:5000000, timezone:6},

/* --- SOUTHEAST ASIA EXPANDED --- */
{name:"Surabaya, Indonesia", lat:-7.2575, lon:112.7521, pop:10000000, timezone:7},
{name:"Bandung, Indonesia", lat:-6.9175, lon:107.6191, pop:9000000, timezone:7},
{name:"Medan, Indonesia", lat:3.5952, lon:98.6722, pop:3000000, timezone:7},
{name:"Semarang, Indonesia", lat:-6.9667, lon:110.4167, pop:2000000, timezone:7},

{name:"Cebu City, Philippines", lat:10.3157, lon:123.8854, pop:3000000, timezone:8},
{name:"Davao City, Philippines", lat:7.1907, lon:125.4553, pop:2500000, timezone:8},

{name:"Phnom Penh, Cambodia", lat:11.5564, lon:104.9282, pop:2300000, timezone:7},
{name:"Vientiane, Laos", lat:17.9757, lon:102.6331, pop:800000, timezone:7},
{name:"Yangon, Myanmar", lat:16.8409, lon:96.1735, pop:7000000, timezone:6.5},
{name:"Mandalay, Myanmar", lat:21.9588, lon:96.0891, pop:1500000, timezone:6.5},

/* --- MIDDLE EAST EXPANDED --- */
{name:"Tehran, Iran", lat:35.6892, lon:51.3890, pop:9000000, timezone:3.5},
{name:"Mashhad, Iran", lat:36.2605, lon:59.6168, pop:3500000, timezone:3.5},
{name:"Isfahan, Iran", lat:32.6546, lon:51.6680, pop:2200000, timezone:3.5},
{name:"Baghdad, Iraq", lat:33.3152, lon:44.3661, pop:8000000, timezone:3},
{name:"Kuwait City, Kuwait", lat:29.3759, lon:47.9774, pop:3000000, timezone:3},
{name:"Muscat, Oman", lat:23.5880, lon:58.3829, pop:1500000, timezone:4},
{name:"Amman, Jordan", lat:31.9454, lon:35.9284, pop:4000000, timezone:3},
{name:"Beirut, Lebanon", lat:33.8938, lon:35.5018, pop:2000000, timezone:2},
{name:"Jerusalem, Israel", lat:31.7683, lon:35.2137, pop:1000000, timezone:2},
{name:"Tel Aviv, Israel", lat:32.0853, lon:34.7818, pop:4000000, timezone:2},

/* --- CENTRAL ASIA --- */
{name:"Almaty, Kazakhstan", lat:43.2220, lon:76.8512, pop:2000000, timezone:6},
{name:"Astana, Kazakhstan", lat:51.1694, lon:71.4491, pop:1300000, timezone:6},
{name:"Tashkent, Uzbekistan", lat:41.2995, lon:69.2401, pop:2600000, timezone:5},
{name:"Bishkek, Kyrgyzstan", lat:42.8746, lon:74.5698, pop:1000000, timezone:6},
{name:"Dushanbe, Tajikistan", lat:38.5598, lon:68.7870, pop:900000, timezone:5},

/* --- FAR EAST / PACIFIC EDGE --- */
{name:"Vladivostok, Russia", lat:43.1155, lon:131.8855, pop:600000, timezone:10},
{name:"Khabarovsk, Russia", lat:48.4827, lon:135.0838, pop:600000, timezone:10},

/* --- SOUTH ASIA SMALL --- */
{name:"Male, Maldives", lat:4.1755, lon:73.5093, pop:250000, timezone:5},

/* --- FINAL SMALL / EDGE --- */
{name:"Thimphu, Bhutan", lat:27.4728, lon:89.6390, pop:150000, timezone:6},
{name:"Urumqi, China", lat:43.8256, lon:87.6168, pop:4000000, timezone:6},

/* =========================
   🌍 AFRICA (~50)
========================= */

/* --- MEGACITIES --- */
{name:"Cairo, Egypt", lat:30.0444, lon:31.2357, pop:22000000, timezone:2},
{name:"Lagos, Nigeria", lat:6.5244, lon:3.3792, pop:16000000, timezone:1},
{name:"Kinshasa, DR Congo", lat:-4.4419, lon:15.2663, pop:15000000, timezone:1},

/* --- NORTH AFRICA --- */
{name:"Alexandria, Egypt", lat:31.2001, lon:29.9187, pop:5500000, timezone:2},
{name:"Casablanca, Morocco", lat:33.5731, lon:-7.5898, pop:4200000, timezone:1},
{name:"Rabat, Morocco", lat:34.0209, lon:-6.8416, pop:1800000, timezone:1},
{name:"Marrakesh, Morocco", lat:31.6295, lon:-7.9811, pop:1200000, timezone:1},
{name:"Algiers, Algeria", lat:36.7538, lon:3.0588, pop:3500000, timezone:1},
{name:"Tunis, Tunisia", lat:36.8065, lon:10.1815, pop:2600000, timezone:1},
{name:"Tripoli, Libya", lat:32.8872, lon:13.1913, pop:1200000, timezone:2},

/* --- WEST AFRICA --- */
{name:"Abidjan, Ivory Coast", lat:5.3600, lon:-4.0083, pop:6000000, timezone:0},
{name:"Accra, Ghana", lat:5.6037, lon:-0.1870, pop:4200000, timezone:0},
{name:"Kumasi, Ghana", lat:6.6885, lon:-1.6244, pop:3000000, timezone:0},
{name:"Dakar, Senegal", lat:14.7167, lon:-17.4677, pop:3500000, timezone:0},
{name:"Bamako, Mali", lat:12.6392, lon:-8.0029, pop:2800000, timezone:0},
{name:"Ouagadougou, Burkina Faso", lat:12.3714, lon:-1.5197, pop:2500000, timezone:0},
{name:"Niamey, Niger", lat:13.5116, lon:2.1254, pop:1500000, timezone:1},
{name:"Conakry, Guinea", lat:9.6412, lon:-13.5784, pop:2000000, timezone:0},

/* --- CENTRAL AFRICA --- */
{name:"Brazzaville, Congo", lat:-4.2634, lon:15.2429, pop:2500000, timezone:1},
{name:"Douala, Cameroon", lat:4.0511, lon:9.7679, pop:3500000, timezone:1},
{name:"Yaounde, Cameroon", lat:3.8480, lon:11.5021, pop:3000000, timezone:1},
{name:"Libreville, Gabon", lat:0.4162, lon:9.4673, pop:800000, timezone:1},

/* --- EAST AFRICA --- */
{name:"Nairobi, Kenya", lat:-1.2921, lon:36.8219, pop:5500000, timezone:3},
{name:"Addis Ababa, Ethiopia", lat:8.9806, lon:38.7578, pop:5000000, timezone:3},
{name:"Dar es Salaam, Tanzania", lat:-6.7924, lon:39.2083, pop:7000000, timezone:3},
{name:"Kampala, Uganda", lat:0.3476, lon:32.5825, pop:4000000, timezone:3},
{name:"Mogadishu, Somalia", lat:2.0469, lon:45.3182, pop:2500000, timezone:3},

/* --- SOUTHERN AFRICA --- */
{name:"Johannesburg, South Africa", lat:-26.2041, lon:28.0473, pop:6000000, timezone:2},
{name:"Luanda, Angola", lat:-8.8390, lon:13.2894, pop:10400000, timezone:1},
{name:"Khartoum, Sudan", lat:15.5007, lon:32.5599, pop:7400000, timezone:2},
{name:"Kano, Nigeria", lat:12.0022, lon:8.5920, pop:5550000, timezone:1},
{name:"Ibadan, Nigeria", lat:7.3775, lon:3.9470, pop:3500000, timezone:1},
{name:"Abuja, Nigeria", lat:9.0765, lon:7.3986, pop:3200000, timezone:1},
{name:"Port Harcourt, Nigeria", lat:4.8156, lon:7.0498, pop:2300000, timezone:1},
{name:"Benin City, Nigeria", lat:6.3350, lon:5.6037, pop:1800000, timezone:1},
{name:"Kaduna, Nigeria", lat:10.5222, lon:7.4384, pop:2000000, timezone:1},
{name:"Maiduguri, Nigeria", lat:11.8333, lon:13.1500, pop:1200000, timezone:1},
{name:"Zaria, Nigeria", lat:11.1113, lon:7.7227, pop:1100000, timezone:1},
{name:"Aba, Nigeria", lat:5.1066, lon:7.3667, pop:1300000, timezone:1},
{name:"Jos, Nigeria", lat:9.8965, lon:8.8583, pop:1100000, timezone:1},
{name:"Ilorin, Nigeria", lat:8.4966, lon:4.5426, pop:1200000, timezone:1},
{name:"Enugu, Nigeria", lat:6.4584, lon:7.5464, pop:1000000, timezone:1},
{name:"Warri, Nigeria", lat:5.5167, lon:5.7500, pop:900000, timezone:1},
{name:"Onitsha, Nigeria", lat:6.1667, lon:6.7833, pop:1250000, timezone:1},
{name:"Sokoto, Nigeria", lat:13.0627, lon:5.2333, pop:1200000, timezone:1},
{name:"Owerri, Nigeria", lat:5.4833, lon:7.0333, pop:800000, timezone:1},
{name:"Ouagadougou, Burkina Faso", lat:12.3714, lon:-1.5197, pop:2500000, timezone:0},
{name:"Bobo-Dioulasso, Burkina Faso", lat:11.1781, lon:-4.2979, pop:900000, timezone:0},
{name:"Koudougou, Burkina Faso", lat:12.2500, lon:-2.3667, pop:100000, timezone:0},
{name:"Ouahigouya, Burkina Faso", lat:13.5833, lon:-2.4167, pop:100000, timezone:0},
{name:"Banfora, Burkina Faso", lat:10.6333, lon:-4.7667, pop:100000, timezone:0},
{name:"Bamako, Mali", lat:12.6392, lon:-8.0029, pop:2800000, timezone:0},
{name:"Sikasso, Mali", lat:11.3167, lon:-5.6667, pop:300000, timezone:0},
{name:"Ségou, Mali", lat:13.4317, lon:-6.2658, pop:200000, timezone:0},
{name:"Mopti, Mali", lat:14.4843, lon:-4.1820, pop:150000, timezone:0},
{name:"Kayes, Mali", lat:14.4500, lon:-11.4333, pop:150000, timezone:0},
{name:"Gao, Mali", lat:16.2667, lon:-0.0500, pop:100000, timezone:0},
{name:"Timbuktu, Mali", lat:16.7733, lon:-3.0074, pop:50000, timezone:0},
{name:"Niamey, Niger", lat:13.5116, lon:2.1254, pop:1500000, timezone:1},
{name:"Zinder, Niger", lat:13.8072, lon:8.9883, pop:300000, timezone:1},
{name:"Maradi, Niger", lat:13.5000, lon:7.1000, pop:300000, timezone:1},
{name:"Agadez, Niger", lat:16.9736, lon:7.9911, pop:150000, timezone:1},
{name:"Tahoua, Niger", lat:14.8888, lon:5.2692, pop:150000, timezone:1},
{name:"Diffa, Niger", lat:13.3157, lon:12.6113, pop:50000, timezone:1},
{name:"N'Djamena, Chad", lat:12.1348, lon:15.0557, pop:1500000, timezone:1},
{name:"Moundou, Chad", lat:8.5667, lon:16.0833, pop:200000, timezone:1},
{name:"Sarh, Chad", lat:9.1500, lon:18.3833, pop:150000, timezone:1},
{name:"Abéché, Chad", lat:13.8292, lon:20.8324, pop:100000, timezone:1},
{name:"Kélo, Chad", lat:9.3167, lon:15.8000, pop:50000, timezone:1},
{name:"Bangui, Central African Republic", lat:4.3947, lon:18.5582, pop:900000, timezone:1},
{name:"Bimbo, Central African Republic", lat:4.3333, lon:18.5167, pop:200000, timezone:1},
{name:"Berbérati, Central African Republic", lat:4.2611, lon:15.7894, pop:100000, timezone:1},
{name:"Carnot, Central African Republic", lat:4.9333, lon:15.8833, pop:50000, timezone:1},
{name:"Bambari, Central African Republic", lat:5.7667, lon:20.6667, pop:50000, timezone:1},
{name:"Nouakchott, Mauritania", lat:18.0735, lon:-15.9582, pop:1500000, timezone:0},
{name:"Nouadhibou, Mauritania", lat:20.9311, lon:-17.0347, pop:150000, timezone:0},
{name:"Rosso, Mauritania", lat:16.5128, lon:-15.8050, pop:50000, timezone:0},
{name:"Kaédi, Mauritania", lat:16.1500, lon:-13.5000, pop:50000, timezone:0},
{name:"Zouérat, Mauritania", lat:22.7333, lon:-12.4667, pop:50000, timezone:0},
{name:"Dakar, Senegal", lat:14.7167, lon:-17.4677, pop:3500000, timezone:0},
{name:"Touba, Senegal", lat:14.8667, lon:-15.8833, pop:800000, timezone:0},
{name:"Thiès, Senegal", lat:14.7886, lon:-16.9260, pop:400000, timezone:0},
{name:"Rufisque, Senegal", lat:14.7167, lon:-17.2667, pop:300000, timezone:0},
{name:"Kaolack, Senegal", lat:14.1519, lon:-16.0756, pop:300000, timezone:0},
{name:"Saint-Louis, Senegal", lat:16.0179, lon:-16.4896, pop:200000, timezone:0},
{name:"Ziguinchor, Senegal", lat:12.5833, lon:-16.2719, pop:200000, timezone:0},
{name:"Diourbel, Senegal", lat:14.6500, lon:-16.2333, pop:150000, timezone:0},
{name:"Louga, Senegal", lat:15.6167, lon:-16.2167, pop:100000, timezone:0},
{name:"Tambacounda, Senegal", lat:13.7708, lon:-13.6672, pop:100000, timezone:0},
{name:"Conakry, Guinea", lat:9.6412, lon:-13.5784, pop:2000000, timezone:0},
{name:"Nzérékoré, Guinea", lat:7.7500, lon:-8.8167, pop:300000, timezone:0},
{name:"Kankan, Guinea", lat:10.3854, lon:-9.3057, pop:200000, timezone:0},
{name:"Kindia, Guinea", lat:10.0569, lon:-12.8658, pop:150000, timezone:0},
{name:"Labé, Guinea", lat:11.3182, lon:-12.2833, pop:100000, timezone:0},
{name:"Freetown, Sierra Leone", lat:8.4840, lon:-13.2299, pop:1200000, timezone:0},
{name:"Bo, Sierra Leone", lat:7.9647, lon:-11.7383, pop:200000, timezone:0},
{name:"Kenema, Sierra Leone", lat:7.8767, lon:-11.1900, pop:200000, timezone:0},
{name:"Makeni, Sierra Leone", lat:8.8861, lon:-12.0442, pop:100000, timezone:0},
{name:"Koidu, Sierra Leone", lat:8.6439, lon:-10.9719, pop:100000, timezone:0},
{name:"Monrovia, Liberia", lat:6.3005, lon:-10.7969, pop:1500000, timezone:0},
{name:"Gbarnga, Liberia", lat:6.9956, lon:-9.4711, pop:50000, timezone:0},
{name:"Buchanan, Liberia", lat:5.8811, lon:-10.0447, pop:50000, timezone:0},
{name:"Harper, Liberia", lat:4.3750, lon:-7.7167, pop:30000, timezone:0},
{name:"Voinjama, Liberia", lat:8.4219, lon:-9.7478, pop:30000, timezone:0},
{name:"Abidjan, Ivory Coast", lat:5.3600, lon:-4.0083, pop:6000000, timezone:0},
{name:"Bouaké, Ivory Coast", lat:7.6906, lon:-5.0303, pop:800000, timezone:0},
{name:"Daloa, Ivory Coast", lat:6.8774, lon:-6.4502, pop:300000, timezone:0},
{name:"Korhogo, Ivory Coast", lat:9.4581, lon:-5.6297, pop:250000, timezone:0},
{name:"San-Pédro, Ivory Coast", lat:4.7485, lon:-6.6363, pop:200000, timezone:0},
{name:"Yamoussoukro, Ivory Coast", lat:6.8276, lon:-5.2893, pop:300000, timezone:0},
{name:"Man, Ivory Coast", lat:7.4125, lon:-7.5539, pop:200000, timezone:0},
{name:"Gagnoa, Ivory Coast", lat:6.1333, lon:-5.9333, pop:200000, timezone:0},
{name:"Abengourou, Ivory Coast", lat:6.7297, lon:-3.4964, pop:150000, timezone:0},
{name:"Divo, Ivory Coast", lat:5.8372, lon:-5.3572, pop:150000, timezone:0},
{name:"Accra, Ghana", lat:5.6037, lon:-0.1870, pop:4200000, timezone:0},
{name:"Kumasi, Ghana", lat:6.6885, lon:-1.6244, pop:3000000, timezone:0},
{name:"Tamale, Ghana", lat:9.4008, lon:-0.8393, pop:600000, timezone:0},
{name:"Sekondi-Takoradi, Ghana", lat:4.9340, lon:-1.7130, pop:500000, timezone:0},
{name:"Ashaiman, Ghana", lat:5.6833, lon:-0.0333, pop:300000, timezone:0},
{name:"Sunyani, Ghana", lat:7.3399, lon:-2.3268, pop:200000, timezone:0},
{name:"Cape Coast, Ghana", lat:5.1053, lon:-1.2466, pop:200000, timezone:0},
{name:"Obuasi, Ghana", lat:6.2000, lon:-1.6833, pop:200000, timezone:0},
{name:"Teshie, Ghana", lat:5.5833, lon:-0.1000, pop:200000, timezone:0},
{name:"Tema, Ghana", lat:5.6667, lon:-0.0167, pop:300000, timezone:0},
{name:"Lomé, Togo", lat:6.1725, lon:1.2314, pop:2000000, timezone:0},
{name:"Sokodé, Togo", lat:8.9833, lon:1.1333, pop:150000, timezone:0},
{name:"Kara, Togo", lat:9.5511, lon:1.1861, pop:100000, timezone:0},
{name:"Kpalimé, Togo", lat:6.9000, lon:0.6333, pop:100000, timezone:0},
{name:"Atakpamé, Togo", lat:7.5333, lon:1.1333, pop:80000, timezone:0},
{name:"Cotonou, Benin", lat:6.3703, lon:2.3912, pop:1500000, timezone:1},
{name:"Porto-Novo, Benin", lat:6.4969, lon:2.6289, pop:300000, timezone:1},
{name:"Parakou, Benin", lat:9.3372, lon:2.6303, pop:300000, timezone:1},
{name:"Djougou, Benin", lat:9.7081, lon:1.6664, pop:150000, timezone:1},
{name:"Bohicon, Benin", lat:7.1783, lon:2.0667, pop:150000, timezone:1},
{name:"Abomey, Benin", lat:7.1833, lon:1.9833, pop:100000, timezone:1},
{name:"Kandi, Benin", lat:11.1342, lon:2.9386, pop:100000, timezone:1},
{name:"Natitingou, Benin", lat:10.3042, lon:1.3794, pop:100000, timezone:1},
{name:"Ouidah, Benin", lat:6.3667, lon:2.0833, pop:100000, timezone:1},
{name:"Lokossa, Benin", lat:6.6389, lon:1.7167, pop:100000, timezone:1},
{name:"Abeokuta, Nigeria", lat:7.1557, lon:3.3451, pop:500000, timezone:1},
{name:"Calabar, Nigeria", lat:4.9757, lon:8.3417, pop:500000, timezone:1},
{name:"Uyo, Nigeria", lat:5.0380, lon:7.9094, pop:500000, timezone:1},
{name:"Akure, Nigeria", lat:7.2526, lon:5.1931, pop:500000, timezone:1},
{name:"Osogbo, Nigeria", lat:7.7717, lon:4.5560, pop:500000, timezone:1},
{name:"Bauchi, Nigeria", lat:10.3158, lon:9.8442, pop:500000, timezone:1},
{name:"Gombe, Nigeria", lat:10.2897, lon:11.1673, pop:400000, timezone:1},
{name:"Yola, Nigeria", lat:9.2035, lon:12.4954, pop:400000, timezone:1},
{name:"Makurdi, Nigeria", lat:7.7333, lon:8.5333, pop:400000, timezone:1},
{name:"Minna, Nigeria", lat:9.6139, lon:6.5569, pop:300000, timezone:1},
{name:"Lokoja, Nigeria", lat:7.8024, lon:6.7333, pop:200000, timezone:1},
{name:"Asaba, Nigeria", lat:6.2000, lon:6.7333, pop:150000, timezone:1},
{name:"Awka, Nigeria", lat:6.2100, lon:7.0700, pop:300000, timezone:1},
{name:"Ogbomosho, Nigeria", lat:8.1333, lon:4.2500, pop:400000, timezone:1},
{name:"Ife, Nigeria", lat:7.4667, lon:4.5667, pop:500000, timezone:1},
{name:"Ilesa, Nigeria", lat:7.6167, lon:4.7333, pop:200000, timezone:1},
{name:"Ede, Nigeria", lat:7.7333, lon:4.4333, pop:150000, timezone:1},
{name:"Iseyin, Nigeria", lat:7.9667, lon:3.6000, pop:100000, timezone:1},
{name:"Saki, Nigeria", lat:8.6667, lon:3.3833, pop:100000, timezone:1},
{name:"Oyo, Nigeria", lat:7.8500, lon:3.9333, pop:400000, timezone:1},
{name:"Iwo, Nigeria", lat:7.6333, lon:4.1833, pop:150000, timezone:1},
{name:"Ejigbo, Nigeria", lat:7.9000, lon:4.3167, pop:100000, timezone:1},
{name:"Ikire, Nigeria", lat:7.3500, lon:4.1833, pop:100000, timezone:1},
{name:"Inisa, Nigeria", lat:7.8500, lon:4.3333, pop:80000, timezone:1},
{name:"Gbongan, Nigeria", lat:7.4667, lon:4.3500, pop:80000, timezone:1},
{name:"Ikirun, Nigeria", lat:7.9167, lon:4.6667, pop:100000, timezone:1},
{name:"Ila Orangun, Nigeria", lat:8.0167, lon:4.9000, pop:80000, timezone:1},
{name:"Offa, Nigeria", lat:8.1500, lon:4.7167, pop:100000, timezone:1},
{name:"Omu-Aran, Nigeria", lat:8.1333, lon:5.1000, pop:80000, timezone:1},
{name:"Ilorin, Nigeria", lat:8.4966, lon:4.5426, pop:1200000, timezone:1},
{name:"Jebba, Nigeria", lat:9.1333, lon:4.8333, pop:50000, timezone:1},
{name:"Bida, Nigeria", lat:9.0833, lon:6.0167, pop:200000, timezone:1},
{name:"Kontagora, Nigeria", lat:10.4000, lon:5.4667, pop:100000, timezone:1},
{name:"New Bussa, Nigeria", lat:9.8833, lon:4.5167, pop:30000, timezone:1},
{name:"Mokwa, Nigeria", lat:9.2833, lon:5.0500, pop:50000, timezone:1},
{name:"Lafia, Nigeria", lat:8.4833, lon:8.5167, pop:300000, timezone:1},
{name:"Keffi, Nigeria", lat:8.8500, lon:7.8667, pop:100000, timezone:1},
{name:"Nasarawa, Nigeria", lat:8.5333, lon:7.7000, pop:50000, timezone:1},
{name:"Akwanga, Nigeria", lat:8.9167, lon:8.4000, pop:50000, timezone:1},
{name:"Wukari, Nigeria", lat:7.8667, lon:9.7833, pop:100000, timezone:1},
{name:"Jalingo, Nigeria", lat:8.9000, lon:11.3667, pop:200000, timezone:1},
{name:"Bali, Nigeria", lat:7.8500, lon:10.9833, pop:50000, timezone:1},
{name:"Takum, Nigeria", lat:7.2667, lon:9.9833, pop:50000, timezone:1},
{name:"Ibi, Nigeria", lat:8.1833, lon:9.7500, pop:30000, timezone:1},
{name:"Dong, Nigeria", lat:8.0500, lon:10.3500, pop:20000, timezone:1},
{name:"Gembu, Nigeria", lat:6.7167, lon:11.2500, pop:30000, timezone:1},
{name:"Serti, Nigeria", lat:7.5000, lon:11.3667, pop:20000, timezone:1},
{name:"Mubi, Nigeria", lat:10.2667, lon:13.2667, pop:200000, timezone:1},
{name:"Hong, Nigeria", lat:10.2333, lon:12.9333, pop:50000, timezone:1},
{name:"Gombi, Nigeria", lat:10.1667, lon:12.7333, pop:30000, timezone:1},
{name:"Song, Nigeria", lat:9.8333, lon:12.6333, pop:30000, timezone:1},
{name:"Numan, Nigeria", lat:9.4667, lon:12.0333, pop:50000, timezone:1},
{name:"Jimeta, Nigeria", lat:9.2833, lon:12.4667, pop:200000, timezone:1},
{name:"Yola, Nigeria", lat:9.2035, lon:12.4954, pop:400000, timezone:1},
{name:"Girei, Nigeria", lat:9.3667, lon:12.5500, pop:50000, timezone:1},
{name:"Mayo Belwa, Nigeria", lat:9.0500, lon:12.0500, pop:30000, timezone:1},
{name:"Fufore, Nigeria", lat:9.2167, lon:12.6500, pop:30000, timezone:1},
{name:"Jada, Nigeria", lat:8.7667, lon:12.1500, pop:30000, timezone:1},
{name:"Ganye, Nigeria", lat:8.4333, lon:12.0667, pop:50000, timezone:1},
{name:"Toungo, Nigeria", lat:8.1167, lon:12.0500, pop:20000, timezone:1},
{name:"Sugu, Nigeria", lat:8.0500, lon:11.9000, pop:10000, timezone:1},
{name:"Mbulo, Nigeria", lat:8.3000, lon:11.7000, pop:10000, timezone:1},
{name:"Koma, Nigeria", lat:8.4000, lon:11.5000, pop:10000, timezone:1},
{name:"Verre, Nigeria", lat:8.5500, lon:12.3000, pop:10000, timezone:1},
{name:"Lamorde, Nigeria", lat:9.0000, lon:12.8000, pop:20000, timezone:1},
{name:"Shelleng, Nigeria", lat:9.9000, lon:12.0000, pop:20000, timezone:1},
{name:"Guyuk, Nigeria", lat:9.9000, lon:11.9167, pop:30000, timezone:1},
{name:"Shani, Nigeria", lat:10.5000, lon:12.0000, pop:20000, timezone:1},
{name:"Askira, Nigeria", lat:10.6500, lon:12.9000, pop:20000, timezone:1},
{name:"Uba, Nigeria", lat:10.4500, lon:13.2000, pop:20000, timezone:1},
{name:"Michika, Nigeria", lat:10.6167, lon:13.3833, pop:30000, timezone:1},
{name:"Madagali, Nigeria", lat:10.9000, lon:13.6000, pop:20000, timezone:1},
{name:"Gwoza, Nigeria", lat:11.0833, lon:13.7000, pop:30000, timezone:1},
{name:"Bama, Nigeria", lat:11.5167, lon:13.6833, pop:50000, timezone:1},
{name:"Ngala, Nigeria", lat:12.3333, lon:14.2000, pop:30000, timezone:1},
{name:"Kala-Balge, Nigeria", lat:12.0000, lon:14.5000, pop:20000, timezone:1},
{name:"Dikwa, Nigeria", lat:12.0333, lon:13.9167, pop:30000, timezone:1},
{name:"Mafa, Nigeria", lat:11.9333, lon:13.6000, pop:20000, timezone:1},
{name:"Konduga, Nigeria", lat:11.6500, lon:13.4167, pop:30000, timezone:1},
{name:"Jere, Nigeria", lat:11.9000, lon:13.1500, pop:100000, timezone:1},
{name:"Monguno, Nigeria", lat:12.6833, lon:13.6167, pop:30000, timezone:1},
{name:"Kukawa, Nigeria", lat:12.9167, lon:13.5667, pop:20000, timezone:1},
{name:"Gubio, Nigeria", lat:12.5000, lon:12.7667, pop:20000, timezone:1},
{name:"Magumeri, Nigeria", lat:12.1167, lon:12.8333, pop:20000, timezone:1},
{name:"Nganzai, Nigeria", lat:12.6167, lon:13.0000, pop:20000, timezone:1},
{name:"Mobbar, Nigeria", lat:13.0000, lon:13.0000, pop:20000, timezone:1},
{name:"Abadam, Nigeria", lat:13.6000, lon:13.2000, pop:20000, timezone:1},
{name:"Guzamala, Nigeria", lat:12.9000, lon:13.3000, pop:10000, timezone:1},
{name:"Kaga, Nigeria", lat:11.8000, lon:12.5000, pop:20000, timezone:1},
{name:"Damboa, Nigeria", lat:11.1500, lon:12.7500, pop:30000, timezone:1},
{name:"Chibok, Nigeria", lat:10.8667, lon:12.8500, pop:30000, timezone:1},
{name:"Askira/Uba, Nigeria", lat:10.6500, lon:12.9000, pop:50000, timezone:1},
{name:"Hawul, Nigeria", lat:10.4000, lon:12.2000, pop:30000, timezone:1},
{name:"Biu, Nigeria", lat:10.6167, lon:12.1833, pop:100000, timezone:1},
{name:"Kwaya Kusar, Nigeria", lat:10.5000, lon:11.9000, pop:20000, timezone:1},
{name:"Bayo, Nigeria", lat:10.3000, lon:11.7000, pop:20000, timezone:1},
{name:"Shani, Nigeria", lat:10.5000, lon:12.0000, pop:20000, timezone:1},
{name:"Pretoria, South Africa", lat:-25.7479, lon:28.2293, pop:3000000, timezone:2},
{name:"Cape Town, South Africa", lat:-33.9249, lon:18.4241, pop:4600000, timezone:2},
{name:"Durban, South Africa", lat:-29.8587, lon:31.0218, pop:3500000, timezone:2},
{name:"Port Elizabeth, South Africa", lat:-33.9608, lon:25.6022, pop:1300000, timezone:2},

{name:"Lusaka, Zambia", lat:-15.3875, lon:28.3228, pop:3000000, timezone:2},
{name:"Harare, Zimbabwe", lat:-17.8252, lon:31.0335, pop:2500000, timezone:2},
{name:"Maputo, Mozambique", lat:-25.9692, lon:32.5732, pop:2000000, timezone:2},
{name:"Gaborone, Botswana", lat:-24.6282, lon:25.9231, pop:500000, timezone:2},
{name:"Windhoek, Namibia", lat:-22.5609, lon:17.0658, pop:450000, timezone:2},

/* --- ISLANDS --- */
{name:"Antananarivo, Madagascar", lat:-18.8792, lon:47.5079, pop:3000000, timezone:3},
{name:"Port Louis, Mauritius", lat:-20.1609, lon:57.5012, pop:600000, timezone:4},

/* =========================
   🇦🇺 AUSTRALIA (15)
========================= */

{name:"Sydney, Australia", lat:-33.8688, lon:151.2093, pop:5300000, timezone:10},
{name:"Melbourne, Australia", lat:-37.8136, lon:144.9631, pop:5100000, timezone:10},
{name:"Brisbane, Australia", lat:-27.4698, lon:153.0251, pop:2600000, timezone:10},
{name:"Perth, Australia", lat:-31.9505, lon:115.8605, pop:2100000, timezone:8},
{name:"Adelaide, Australia", lat:-34.9285, lon:138.6007, pop:1400000, timezone:9.5},

{name:"Gold Coast, Australia", lat:-28.0167, lon:153.4000, pop:700000, timezone:10},
{name:"Newcastle, Australia", lat:-32.9283, lon:151.7817, pop:500000, timezone:10},
{name:"Canberra, Australia", lat:-35.2809, lon:149.1300, pop:450000, timezone:10},
{name:"Sunshine Coast, Australia", lat:-26.6500, lon:153.0667, pop:350000, timezone:10},
{name:"Wollongong, Australia", lat:-34.4278, lon:150.8931, pop:300000, timezone:10},

{name:"Hobart, Australia", lat:-42.8821, lon:147.3272, pop:250000, timezone:10},
{name:"Geelong, Australia", lat:-38.1499, lon:144.3617, pop:250000, timezone:10},
{name:"Townsville, Australia", lat:-19.2589, lon:146.8169, pop:200000, timezone:10},
{name:"Cairns, Australia", lat:-16.9186, lon:145.7781, pop:150000, timezone:10},
{name:"Darwin, Australia", lat:-12.4634, lon:130.8456, pop:150000, timezone:9.5},

/* =========================
   🌊 OCEANIA (30)
========================= */

/* --- NEW ZEALAND --- */
{name:"Auckland, New Zealand", lat:-36.8485, lon:174.7633, pop:1700000, timezone:12},
{name:"Wellington, New Zealand", lat:-41.2865, lon:174.7762, pop:500000, timezone:12},
{name:"Christchurch, New Zealand", lat:-43.5321, lon:172.6362, pop:400000, timezone:12},
{name:"Hamilton, New Zealand", lat:-37.7870, lon:175.2793, pop:200000, timezone:12},
{name:"Tauranga, New Zealand", lat:-37.6878, lon:176.1651, pop:150000, timezone:12},

/* --- PAPUA NEW GUINEA --- */
{name:"Port Moresby, PNG", lat:-9.4438, lon:147.1803, pop:400000, timezone:10},

/* --- FIJI --- */
{name:"Suva, Fiji", lat:-18.1248, lon:178.4501, pop:200000, timezone:12},
{name:"Nadi, Fiji", lat:-17.7765, lon:177.4350, pop:70000, timezone:12},

/* --- SOLOMON ISLANDS --- */
{name:"Honiara, Solomon Islands", lat:-9.4456, lon:159.9729, pop:100000, timezone:11},

/* --- VANUATU --- */
{name:"Port Vila, Vanuatu", lat:-17.7333, lon:168.3167, pop:60000, timezone:11},

/* --- NEW CALEDONIA --- */
{name:"Noumea, New Caledonia", lat:-22.2758, lon:166.4580, pop:100000, timezone:11},

/* --- SAMOA --- */
{name:"Apia, Samoa", lat:-13.8500, lon:-171.7500, pop:40000, timezone:13},

/* --- TONGA --- */
{name:"Nuku'alofa, Tonga", lat:-21.1394, lon:-175.2044, pop:30000, timezone:13},

/* --- MICRONESIA --- */
{name:"Palikir, Micronesia", lat:6.9248, lon:158.1610, pop:6000, timezone:11},

/* --- MARSHALL ISLANDS --- */
{name:"Majuro, Marshall Islands", lat:7.0897, lon:171.3803, pop:30000, timezone:12},

/* --- PALAU --- */
{name:"Ngerulmud, Palau", lat:7.5000, lon:134.6242, pop:300, timezone:9},

/* --- KIRIBATI --- */
{name:"Tarawa, Kiribati", lat:1.4518, lon:173.0348, pop:60000, timezone:12},

/* --- NAURU --- */
{name:"Yaren, Nauru", lat:-0.5477, lon:166.9209, pop:10000, timezone:12},

/* --- TUVALU --- */
{name:"Funafuti, Tuvalu", lat:-8.5167, lon:179.2167, pop:6000, timezone:12},

/* --- COOK ISLANDS --- */
{name:"Avarua, Cook Islands", lat:-21.2078, lon:-159.7750, pop:13000, timezone:-10},

/* --- FRENCH POLYNESIA --- */
{name:"Papeete, French Polynesia", lat:-17.5516, lon:-149.5585, pop:140000, timezone:-10},

/* --- GUAM --- */
{name:"Hagatna, Guam", lat:13.4757, lon:144.7489, pop:1000, timezone:10},

/* --- NORTHERN MARIANA ISLANDS --- */
{name:"Saipan, Northern Mariana Islands", lat:15.1778, lon:145.7500, pop:50000, timezone:10}
];

// ==========================
// 🌟 CREATE LIGHTS (FIXED)
// ==========================
function isLikelyLand(lat, lon) {

    if (lat > 75 || lat < -75) return false;

    if (lat > -60 && lat < 60) {
        if (lon < -100 && lon > -160) return false;
        if (lon > 140 || lon < -160) return false;
    }

    if (lat > -50 && lat < 50 && lon > -60 && lon < -20) {
        return false;
    }

    if (lat > -40 && lat < 20 && lon > 60 && lon < 100) {
        return false;
    }

    return true;
}

cities.forEach(city => {
    if (!isLikelyLand(city.lat, city.lon)) return;

    // Use manual radius if provided, otherwise calculate from population
    const size = city.radius
        ? city.radius
        : Math.min(Math.max(Math.sqrt(city.pop) / 80, 8), 55);

    const intensity = Math.min(Math.max(city.pop / 12000000, 0.5), 2.3);
    const color = getRegionColor(city.lat, city.lon);
    city.color = color;

    city.entity = geofs.api.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat, 2000),
        ellipse: {
            semiMajorAxis: size * 1000,   // now in meters
            semiMinorAxis: size * 1000,
            material: new Cesium.ImageMaterialProperty({
                image: glowCanvas(intensity, city.pop, color),
                transparent: true
            })
        }
    });

    city.brightness = 0;
});

        // ==========================
// 🌐 GEOFS-AFTER-DARK MENU
// ==========================

// 🔹 HIDE LIGHTS INITIALLY
cities.forEach(city => {
    if (city.entity) {
        city.entity.show = false; // all lights OFF at start
    }
});

const menu = document.createElement("div");
Object.assign(menu.style, {
    position: "fixed",
    top: "20px",
    left: "20px",
    background: "#111a",
    color: "#fff",
    padding: "10px",
    borderRadius: "8px",
    zIndex: 9999,
    cursor: "move",
    maxHeight: "90vh",
    overflowY: "auto"
});

const header = document.createElement("div");

// ==========================
// 🔀 MODE TABS
// ==========================
const tabContainer = document.createElement("div");
tabContainer.style.display = "flex";
tabContainer.style.marginTop = "10px";

const manualTab = document.createElement("button");
manualTab.textContent = "Created By SkyTeamDelta";
manualTab.style.flex = "1";

// Highlight function
function updateTabStyles() {
    manualTab.style.background = "#444";
}

updateTabStyles();

tabContainer.appendChild(manualTab);
menu.appendChild(tabContainer);

manualTab.onclick = () => {
    currentMode = "manual";
    updateTabStyles();

    // Turn OFF all lights first
    cities.forEach(c => {
        if (c.entity) c.entity.show = false;
    });
};

header.textContent = "🌐 GeoFS-After-Dark";
header.style.fontWeight = "bold";
menu.appendChild(header);

const container = document.createElement("div");

let isTyping = false;

// ==========================
// 🔍 CITY SEARCH
// ==========================
const searchBox = document.createElement("input");

searchBox.addEventListener("focus", () => {
    isTyping = true;
});

searchBox.addEventListener("blur", () => {
    isTyping = false;
});

searchBox.type = "text";
searchBox.placeholder = "Search city...";
searchBox.style.width = "100%";
searchBox.style.marginTop = "10px";
searchBox.style.padding = "4px";

const resultBox = document.createElement("div");
resultBox.style.marginTop = "5px";
resultBox.style.maxHeight = "120px";
resultBox.style.overflowY = "auto";

searchBox.addEventListener("input", () => {
    const query = searchBox.value.toLowerCase();
    resultBox.innerHTML = "";

    if (!query) return;

    const matches = cities.filter(city =>
        city.name.toLowerCase().includes(query)
    ).slice(0, 6);

    matches.forEach(city => {
        const btn = document.createElement("div");
        btn.textContent = `${city.name} (UTC${city.timezone >= 0 ? '+' : ''}${city.timezone})`;

        btn.style.cursor = "pointer";
        btn.style.padding = "4px";
        btn.style.borderBottom = "1px solid rgba(255,255,255,0.1)";

        btn.addEventListener("click", () => {
    if (currentMode !== "manual") return;
            // turn OFF all lights first
            cities.forEach(c => {
                if (c.entity) c.entity.show = false;
            });

            // turn ON selected timezone
            cities.forEach(c => {
                if (c.entity && Math.abs(c.timezone - city.timezone) < 0.01) {
                    c.entity.show = true;
                }
            });
        });

        resultBox.appendChild(btn);
    });
});

container.appendChild(searchBox);
container.appendChild(resultBox);
menu.appendChild(container);

const timezones = [
    -12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,
    0,1,2,3,3.5,4,5,5.5,5.75,6,7,8,9,9.5,10,11,12,13
];

timezones.forEach(tz => {
    const label = document.createElement("label");
    label.style.display = "block";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = false; // starts unchecked
    cb.dataset.tz = tz;

    cb.addEventListener("change", () => {
    if (currentMode !== "manual") return;
        const activeTZ = Array.from(container.querySelectorAll("input"))
            .filter(i => i.checked)
            .map(i => parseFloat(i.dataset.tz));

        cities.forEach(city => {
            if (city.entity) {
                city.entity.show = activeTZ.some(tz =>
                    Math.abs(tz - (city.timezone ?? 0)) < 0.01
                );
            }
        });
    });

    label.appendChild(cb);
    label.appendChild(document.createTextNode(` UTC${tz >= 0 ? '+' : ''}${tz}`));
    container.appendChild(label);
});

document.body.appendChild(menu);

// ==========================
// 🖱 DRAGGING
// ==========================
let isDragging = false, offsetX = 0, offsetY = 0;

header.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - menu.offsetLeft;
    offsetY = e.clientY - menu.offsetTop;
});

document.addEventListener("mouseup", () => isDragging = false);

document.addEventListener("mousemove", e => {
    if (isDragging) {
        menu.style.left = (e.clientX - offsetX) + "px";
        menu.style.top = (e.clientY - offsetY) + "px";
    }
});

// ==========================
// 🔒 FULL UI FOCUS MODE
// ==========================
document.addEventListener("keydown", function(e) {
    if (isTyping) {
        e.stopPropagation();
    }
}, true);

document.addEventListener("keyup", function(e) {
    if (isTyping) {
        e.stopPropagation();
    }
}, true);

document.addEventListener("keypress", function(e) {
    if (isTyping) {
        e.stopPropagation();
    }
}, true);

// ==========================
// 🔽 COLLAPSE MENU
// ==========================
let collapsed = false;
header.addEventListener("dblclick", () => {
    collapsed = !collapsed;
    container.style.display = collapsed ? "none" : "block";
});

    }

})();
