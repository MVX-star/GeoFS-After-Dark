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
    const g = ctx.createRadialGradient(size/2, size/2, size*0.02, size/2, size/2, size*0.65);

g.addColorStop(0,   `rgba(${color[0]},${color[1]},${color[2]},${0.8*intensity})`);
g.addColorStop(0.35,`rgba(${color[0]},${color[1]},${color[2]},${0.3*intensity})`);
g.addColorStop(0.7, `rgba(${color[0]},${color[1]},${color[2]},${0.05*intensity})`);
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
{name:"Buenos Aires, Argentina", lat:-34.6037, lon:-58.3816, pop:16360000, timezone:-3},
{name:"Los Angeles, USA", lat:34.0522, lon:-118.2437, pop:12790000, timezone:-8},
{name:"Bogotá, Colombia", lat:4.7110, lon:-74.0721, pop:12770000, timezone:-5},
{name:"Lima, Peru", lat:-12.0464, lon:-77.0428, pop:11280000, timezone:-5},
{name:"Chicago, USA", lat:41.8781, lon:-87.6298, pop:290000, timezone:-6},

/* --- USA CORE --- */
{name:"Houston, USA", lat:29.7604, lon:-95.3698, pop:7100000, timezone:-6},
{name:"Dallas, USA", lat:32.7767, lon:-96.7970, pop:6400000, timezone:-6},
{name:"Miami, USA", lat:25.7617, lon:-80.1918, pop:200000, timezone:-5},
{name:"Philadelphia, USA", lat:39.9526, lon:-75.1652, pop:6100000, timezone:-5},
{name:"Atlanta, USA", lat:33.7490, lon:-84.3880, pop:6000000, timezone:-5},
{name:"Washington DC, USA", lat:38.9072, lon:-77.0369, pop:6300000, timezone:-5},
{name:"Phoenix, USA", lat:33.4484, lon:-112.0740, pop:5000000, timezone:-7},
{name:"San Francisco, USA", lat:37.7749, lon:-122.4194, pop:4800000, timezone:-8},
{name:"San Bernardino, USA", lat:34.0845, lon:-117.2919, pop:230000, timezone:-7},

{name:"Detroit, USA", lat:42.3314, lon:-83.0458, pop:3700000, timezone:-5},
{name:"Minneapolis, USA", lat:44.9778, lon:-93.2650, pop:3600000, timezone:-6},
{name:"Denver, USA", lat:39.7392, lon:-104.9903, pop:3000000, timezone:-7},
{name:"San Diego, USA", lat:32.7157, lon:-117.1611, pop:3300000, timezone:-8},
{name:"Tampa, USA", lat:27.9506, lon:-82.4572, pop:3200000, timezone:-5},
{name:"Charlotte, USA", lat:35.2271, lon:-80.8431, pop:2800000, timezone:-5},
{name:"San Antonio, USA", lat:29.4241, lon:-98.4936, pop:2600000, timezone:-6},
{name:"Austin, USA", lat:30.2672, lon:-97.7431, pop:2400000, timezone:-6},
{name:"Las Vegas, USA", lat:36.1699, lon:-115.1398, pop:400000, timezone:-8},
{name:"Baltimore, USA", lat:39.2905, lon:-76.6104, pop:2300000, timezone:-5},

{name:"Portland, USA", lat:45.5152, lon:-122.6784, pop:2500000, timezone:-8},
{name:"St. Louis, USA", lat:38.6270, lon:-90.1994, pop:2100000, timezone:-6},
/* =========================
   🌎 AMERICAS – DIVERSE CONTINUATION
========================= */

// USA – Inland / different regions
{name:"Boise, USA", lat:43.6150, lon:-116.2023, pop:250000, timezone:-7},
{name:"Spokane, USA", lat:47.6588, lon:-117.4260, pop:550000, timezone:-8},
{name:"Salt Lake City, USA", lat:40.7608, lon:-111.8910, pop:1200000, timezone:-7},
{name:"Provo, USA", lat:40.2338, lon:-111.6585, pop:120000, timezone:-7},
{name:"Ogden, USA", lat:41.2230, lon:-111.9738, pop:90000, timezone:-7},
{name:"Billings, USA", lat:45.7833, lon:-108.5007, pop:110000, timezone:-7},
{name:"Missoula, USA", lat:46.8721, lon:-113.9940, pop:75000, timezone:-7},
{name:"Great Falls, USA", lat:47.4942, lon:-111.2833, pop:60000, timezone:-7},
{name:"Helena, USA", lat:46.5891, lon:-112.0391, pop:30000, timezone:-7},
{name:"Bozeman, USA", lat:45.6770, lon:-111.0429, pop:50000, timezone:-7},
{name:"Cheyenne, USA", lat:41.1400, lon:-104.8202, pop:65000, timezone:-7},
{name:"Casper, USA", lat:42.8666, lon:-106.3131, pop:58000, timezone:-7},
{name:"Rapid City, USA", lat:44.0805, lon:-103.2310, pop:75000, timezone:-7},
{name:"Sioux Falls, USA", lat:43.5446, lon:-96.7311, pop:190000, timezone:-6},
{name:"Fargo, USA", lat:46.8772, lon:-96.7898, pop:125000, timezone:-6},
{name:"Bismarck, USA", lat:46.8083, lon:-100.7837, pop:75000, timezone:-6},
{name:"Grand Forks, USA", lat:47.9253, lon:-97.0329, pop:55000, timezone:-6},
{name:"Minot, USA", lat:48.2325, lon:-101.2963, pop:45000, timezone:-6},
{name:"Duluth, USA", lat:46.7867, lon:-92.1005, pop:85000, timezone:-6},
{name:"Rochester, USA", lat:44.0121, lon:-92.4802, pop:120000, timezone:-6},
{name:"St. Cloud, USA", lat:45.5579, lon:-94.1632, pop:70000, timezone:-6},
{name:"Eau Claire, USA", lat:44.8113, lon:-91.4985, pop:70000, timezone:-6},
{name:"Green Bay, USA", lat:44.5133, lon:-88.0133, pop:105000, timezone:-6},
{name:"Appleton, USA", lat:44.2619, lon:-88.4154, pop:75000, timezone:-6},
{name:"Oshkosh, USA", lat:44.0247, lon:-88.5426, pop:65000, timezone:-6},
{name:"Racine, USA", lat:42.7261, lon:-87.7829, pop:75000, timezone:-6},
{name:"Kenosha, USA", lat:42.5847, lon:-87.8212, pop:100000, timezone:-6},
{name:"Rockford, USA", lat:42.2711, lon:-89.0940, pop:145000, timezone:-6},
{name:"Peoria, USA", lat:40.6936, lon:-89.5890, pop:110000, timezone:-6},
{name:"Springfield, USA", lat:39.7817, lon:-89.6501, pop:115000, timezone:-6},
{name:"Champaign, USA", lat:40.1164, lon:-88.2434, pop:90000, timezone:-6},
{name:"Bloomington, USA", lat:40.4842, lon:-88.9937, pop:80000, timezone:-6},
{name:"Decatur, USA", lat:39.8403, lon:-88.9548, pop:70000, timezone:-6},
{name:"Joliet, USA", lat:41.5250, lon:-88.0817, pop:150000, timezone:-6},
{name:"Aurora, USA", lat:41.7606, lon:-88.3201, pop:180000, timezone:-6},
{name:"Naperville, USA", lat:41.7508, lon:-88.1535, pop:150000, timezone:-6},
{name:"Elgin, USA", lat:42.0354, lon:-88.2826, pop:110000, timezone:-6},
{name:"Waukegan, USA", lat:42.3636, lon:-87.8448, pop:85000, timezone:-6},
{name:"Cicero, USA", lat:41.8456, lon:-87.7539, pop:80000, timezone:-6},
{name:"Arlington Heights, USA", lat:42.0884, lon:-87.9806, pop:75000, timezone:-6},
{name:"Evanston, USA", lat:42.0451, lon:-87.6877, pop:75000, timezone:-6},
{name:"Schaumburg, USA", lat:42.0334, lon:-88.0834, pop:75000, timezone:-6},
{name:"Bolingbrook, USA", lat:41.6986, lon:-88.0684, pop:75000, timezone:-6},
{name:"Palatine, USA", lat:42.1103, lon:-88.0342, pop:70000, timezone:-6},
{name:"Skokie, USA", lat:42.0334, lon:-87.7334, pop:65000, timezone:-6},
{name:"Des Plaines, USA", lat:42.0334, lon:-87.8834, pop:60000, timezone:-6},
{name:"Orland Park, USA", lat:41.6303, lon:-87.8539, pop:60000, timezone:-6},
{name:"Tinley Park, USA", lat:41.5734, lon:-87.7845, pop:55000, timezone:-6},
{name:"Oak Lawn, USA", lat:41.7100, lon:-87.7581, pop:55000, timezone:-6},
{name:"Berwyn, USA", lat:41.8506, lon:-87.7937, pop:55000, timezone:-6},
{name:"Mount Prospect, USA", lat:42.0664, lon:-87.9373, pop:55000, timezone:-6},
{name:"Wheaton, USA", lat:41.8661, lon:-88.1070, pop:53000, timezone:-6},
{name:"Oak Park, USA", lat:41.8850, lon:-87.7845, pop:52000, timezone:-6},
{name:"Downers Grove, USA", lat:41.8089, lon:-88.0112, pop:50000, timezone:-6},
{name:"Glenview, USA", lat:42.0698, lon:-87.7877, pop:48000, timezone:-6},
{name:"Lombard, USA", lat:41.8800, lon:-88.0078, pop:45000, timezone:-6},
{name:"Elmhurst, USA", lat:41.8995, lon:-87.9403, pop:45000, timezone:-6},
{name:"Buffalo Grove, USA", lat:42.1514, lon:-87.9598, pop:40000, timezone:-6},
{name:"Hoffman Estates, USA", lat:42.0428, lon:-88.0798, pop:50000, timezone:-6},
{name:"Streamwood, USA", lat:42.0256, lon:-88.1784, pop:40000, timezone:-6},
{name:"Carol Stream, USA", lat:41.9125, lon:-88.1348, pop:40000, timezone:-6},
{name:"Wheeling, USA", lat:42.1392, lon:-87.9290, pop:40000, timezone:-6},
{name:"Hanover Park, USA", lat:41.9995, lon:-88.1451, pop:38000, timezone:-6},
{name:"Carpentersville, USA", lat:42.1211, lon:-88.2579, pop:38000, timezone:-6},
{name:"Addison, USA", lat:41.9317, lon:-87.9890, pop:37000, timezone:-6},
{name:"Calumet City, USA", lat:41.6156, lon:-87.5295, pop:36000, timezone:-6},
{name:"Northbrook, USA", lat:42.1275, lon:-87.8289, pop:34000, timezone:-6},
{name:"St. Charles, USA", lat:41.9142, lon:-88.3087, pop:33000, timezone:-6},
{name:"Woodridge, USA", lat:41.7469, lon:-88.0434, pop:33000, timezone:-6},
{name:"Elk Grove Village, USA", lat:42.0039, lon:-87.9703, pop:33000, timezone:-6},
{name:"Mundelein, USA", lat:42.2631, lon:-88.0039, pop:32000, timezone:-6},
{name:"Crystal Lake, USA", lat:42.2411, lon:-88.3162, pop:40000, timezone:-6},
{name:"Romeoville, USA", lat:41.6475, lon:-88.0895, pop:40000, timezone:-6},
{name:"Plainfield, USA", lat:41.6269, lon:-88.2039, pop:45000, timezone:-6},
{name:"Oswego, USA", lat:41.6828, lon:-88.3515, pop:35000, timezone:-6},
{name:"Yorkville, USA", lat:41.6411, lon:-88.4473, pop:20000, timezone:-6},
{name:"Montgomery, USA", lat:41.7306, lon:-88.3459, pop:20000, timezone:-6},
{name:"North Aurora, USA", lat:41.8061, lon:-88.3273, pop:18000, timezone:-6},
{name:"Batavia, USA", lat:41.8500, lon:-88.3126, pop:26000, timezone:-6},
{name:"Geneva, USA", lat:41.8875, lon:-88.3053, pop:22000, timezone:-6},
{name:"St. Charles, USA", lat:41.9142, lon:-88.3087, pop:33000, timezone:-6},
{name:"West Chicago, USA", lat:41.8847, lon:-88.2040, pop:27000, timezone:-6},
{name:"Warrenville, USA", lat:41.8178, lon:-88.1734, pop:14000, timezone:-6},
{name:"Naperville, USA", lat:41.7508, lon:-88.1535, pop:150000, timezone:-6},
{name:"Lisle, USA", lat:41.8011, lon:-88.0748, pop:24000, timezone:-6},
{name:"Woodridge, USA", lat:41.7469, lon:-88.0434, pop:33000, timezone:-6},
{name:"Darien, USA", lat:41.7519, lon:-87.9790, pop:22000, timezone:-6},
{name:"Willowbrook, USA", lat:41.7695, lon:-87.9356, pop:9000, timezone:-6},
{name:"Burr Ridge, USA", lat:41.7489, lon:-87.9184, pop:11000, timezone:-6},
{name:"Hinsdale, USA", lat:41.8009, lon:-87.9370, pop:17000, timezone:-6},
{name:"Western Springs, USA", lat:41.8097, lon:-87.9006, pop:13000, timezone:-6},
{name:"La Grange, USA", lat:41.8050, lon:-87.8692, pop:16000, timezone:-6},
{name:"La Grange Park, USA", lat:41.8334, lon:-87.8687, pop:14000, timezone:-6},
{name:"Brookfield, USA", lat:41.8236, lon:-87.8467, pop:19000, timezone:-6},
{name:"Riverside, USA", lat:41.8306, lon:-87.8192, pop:9000, timezone:-6},
{name:"North Riverside, USA", lat:41.8467, lon:-87.8231, pop:7000, timezone:-6},
{name:"Berwyn, USA", lat:41.8506, lon:-87.7937, pop:55000, timezone:-6},
{name:"Cicero, USA", lat:41.8456, lon:-87.7539, pop:80000, timezone:-6},
{name:"Stickney, USA", lat:41.8211, lon:-87.7828, pop:7000, timezone:-6},
{name:"Forest View, USA", lat:41.8089, lon:-87.7970, pop:1000, timezone:-6},
{name:"Summit, USA", lat:41.7881, lon:-87.8103, pop:11000, timezone:-6},
{name:"Bedford Park, USA", lat:41.7700, lon:-87.7856, pop:500, timezone:-6},
{name:"McCook, USA", lat:41.8006, lon:-87.8312, pop:2000, timezone:-6},
{name:"Hodgkins, USA", lat:41.7689, lon:-87.8590, pop:2000, timezone:-6},
{name:"Countryside, USA", lat:41.7828, lon:-87.8781, pop:6000, timezone:-6},
{name:"Indian Head Park, USA", lat:41.7703, lon:-87.8973, pop:4000, timezone:-6},
{name:"Willow Springs, USA", lat:41.7409, lon:-87.8603, pop:6000, timezone:-6},
{name:"Justice, USA", lat:41.7445, lon:-87.8376, pop:13000, timezone:-6},
{name:"Bridgeview, USA", lat:41.7500, lon:-87.8042, pop:16000, timezone:-6},
{name:"Hickory Hills, USA", lat:41.7256, lon:-87.8251, pop:14000, timezone:-6},
{name:"Palos Hills, USA", lat:41.6967, lon:-87.8170, pop:17000, timezone:-6},
{name:"Palos Park, USA", lat:41.6670, lon:-87.8306, pop:5000, timezone:-6},
{name:"Palos Heights, USA", lat:41.6681, lon:-87.7964, pop:12000, timezone:-6},
{name:"Worth, USA", lat:41.6898, lon:-87.7973, pop:11000, timezone:-6},
{name:"Chicago Ridge, USA", lat:41.7014, lon:-87.7792, pop:14000, timezone:-6},
{name:"Oak Lawn, USA", lat:41.7100, lon:-87.7581, pop:55000, timezone:-6},
{name:"Evergreen Park, USA", lat:41.7206, lon:-87.7014, pop:20000, timezone:-6},
{name:"Hometown, USA", lat:41.7145, lon:-87.7314, pop:4000, timezone:-6},
{name:"Merrionette Park, USA", lat:41.6845, lon:-87.7017, pop:2000, timezone:-6},
{name:"Blue Island, USA", lat:41.6573, lon:-87.6801, pop:22000, timezone:-6},
{name:"Calumet Park, USA", lat:41.6628, lon:-87.6606, pop:8000, timezone:-6},
{name:"Riverdale, USA", lat:41.6334, lon:-87.6331, pop:13000, timezone:-6},
{name:"Dolton, USA", lat:41.6389, lon:-87.6073, pop:22000, timezone:-6},
{name:"South Holland, USA", lat:41.6009, lon:-87.6069, pop:22000, timezone:-6},
{name:"Harvey, USA", lat:41.6100, lon:-87.6467, pop:24000, timezone:-6},
{name:"Dixmoor, USA", lat:41.6317, lon:-87.6609, pop:3000, timezone:-6},
{name:"Phoenix, USA", lat:41.6111, lon:-87.6345, pop:2000, timezone:-6},
{name:"Posen, USA", lat:41.6295, lon:-87.6814, pop:6000, timezone:-6},
{name:"Midlothian, USA", lat:41.6253, lon:-87.7176, pop:15000, timezone:-6},
{name:"Robbins, USA", lat:41.6439, lon:-87.7039, pop:5000, timezone:-6},
{name:"Crestwood, USA", lat:41.6611, lon:-87.7526, pop:11000, timezone:-6},
{name:"Alsip, USA", lat:41.6689, lon:-87.7387, pop:19000, timezone:-6},
{name:"Merrionette Park, USA", lat:41.6845, lon:-87.7017, pop:2000, timezone:-6},
{name:"Oak Forest, USA", lat:41.6028, lon:-87.7439, pop:28000, timezone:-6},
{name:"Tinley Park, USA", lat:41.5734, lon:-87.7845, pop:55000, timezone:-6},
{name:"Orland Park, USA", lat:41.6303, lon:-87.8539, pop:60000, timezone:-6},
{name:"Orland Hills, USA", lat:41.5878, lon:-87.8431, pop:7000, timezone:-6},
{name:"Mokena, USA", lat:41.5261, lon:-87.8892, pop:20000, timezone:-6},
{name:"New Lenox, USA", lat:41.5120, lon:-87.9656, pop:27000, timezone:-6},
{name:"Frankfort, USA", lat:41.4959, lon:-87.8487, pop:20000, timezone:-6},
{name:"Monee, USA", lat:41.4181, lon:-87.7417, pop:5000, timezone:-6},
{name:"University Park, USA", lat:41.4470, lon:-87.6806, pop:7000, timezone:-6},
{name:"Park Forest, USA", lat:41.4914, lon:-87.6745, pop:21000, timezone:-6},
{name:"Richton Park, USA", lat:41.4845, lon:-87.7034, pop:14000, timezone:-6},
{name:"Matteson, USA", lat:41.5039, lon:-87.7131, pop:19000, timezone:-6},
{name:"Olympia Fields, USA", lat:41.5134, lon:-87.6742, pop:5000, timezone:-6},
{name:"Flossmoor, USA", lat:41.5428, lon:-87.6848, pop:9500, timezone:-6},
{name:"Homewood, USA", lat:41.5573, lon:-87.6656, pop:19000, timezone:-6},
{name:"Hazel Crest, USA", lat:41.5717, lon:-87.6945, pop:14000, timezone:-6},
{name:"East Hazel Crest, USA", lat:41.5736, lon:-87.6464, pop:1500, timezone:-6},
{name:"Markham, USA", lat:41.5936, lon:-87.6984, pop:12000, timezone:-6},
{name:"Country Club Hills, USA", lat:41.5681, lon:-87.7203, pop:17000, timezone:-6},
{name:"Harvey, USA", lat:41.6100, lon:-87.6467, pop:24000, timezone:-6},
{name:"Phoenix, USA", lat:41.6111, lon:-87.6345, pop:2000, timezone:-6},
{name:"Dixmoor, USA", lat:41.6317, lon:-87.6609, pop:3000, timezone:-6},
{name:"Blue Island, USA", lat:41.6573, lon:-87.6801, pop:22000, timezone:-6},
{name:"Calumet Park, USA", lat:41.6628, lon:-87.6606, pop:8000, timezone:-6},
{name:"Riverdale, USA", lat:41.6334, lon:-87.6331, pop:13000, timezone:-6},
{name:"Dolton, USA", lat:41.6389, lon:-87.6073, pop:22000, timezone:-6},
{name:"South Holland, USA", lat:41.6009, lon:-87.6069, pop:22000, timezone:-6},
{name:"Thornton, USA", lat:41.5681, lon:-87.6081, pop:2000, timezone:-6},
{name:"Lansing, USA", lat:41.5648, lon:-87.5390, pop:28000, timezone:-6},
{name:"Calumet City, USA", lat:41.6156, lon:-87.5295, pop:36000, timezone:-6},
{name:"Burnham, USA", lat:41.6389, lon:-87.5567, pop:4000, timezone:-6},
{name:"Hammond, USA", lat:41.5834, lon:-87.5000, pop:75000, timezone:-6},
{name:"East Chicago, USA", lat:41.6392, lon:-87.4548, pop:28000, timezone:-6},
{name:"Whiting, USA", lat:41.6798, lon:-87.4945, pop:5000, timezone:-6},
{name:"Griffith, USA", lat:41.5284, lon:-87.4237, pop:16000, timezone:-6},
{name:"Highland, USA", lat:41.5509, lon:-87.4510, pop:24000, timezone:-6},
{name:"Munster, USA", lat:41.5645, lon:-87.5125, pop:23000, timezone:-6},
{name:"Schererville, USA", lat:41.4789, lon:-87.4548, pop:29000, timezone:-6},
{name:"Dyer, USA", lat:41.4942, lon:-87.5217, pop:16000, timezone:-6},
{name:"St. John, USA", lat:41.4500, lon:-87.4400, pop:17000, timezone:-6},
{name:"Crown Point, USA", lat:41.4170, lon:-87.3653, pop:30000, timezone:-6},
{name:"Merrillville, USA", lat:41.4828, lon:-87.3328, pop:35000, timezone:-6},
{name:"Hobart, USA", lat:41.5323, lon:-87.2550, pop:29000, timezone:-6},
{name:"Lake Station, USA", lat:41.5750, lon:-87.2389, pop:12000, timezone:-6},
{name:"Portage, USA", lat:41.5759, lon:-87.1761, pop:37000, timezone:-6},
{name:"Valparaiso, USA", lat:41.4731, lon:-87.0611, pop:34000, timezone:-6},
{name:"Chesterton, USA", lat:41.6106, lon:-87.0642, pop:14000, timezone:-6},
{name:"Porter, USA", lat:41.6156, lon:-87.0742, pop:5000, timezone:-6},
{name:"Burns Harbor, USA", lat:41.6259, lon:-87.1470, pop:1000, timezone:-6},
{name:"Ogden Dunes, USA", lat:41.6228, lon:-87.1917, pop:1000, timezone:-6},
{name:"Dune Acres, USA", lat:41.6500, lon:-87.0833, pop:200, timezone:-6},
{name:"Beverly Shores, USA", lat:41.6834, lon:-86.9834, pop:600, timezone:-6},
{name:"Michigan City, USA", lat:41.7075, lon:-86.8950, pop:31000, timezone:-6},
{name:"La Porte, USA", lat:41.6106, lon:-86.7225, pop:22000, timezone:-6},
{name:"Westville, USA", lat:41.5414, lon:-86.9006, pop:6000, timezone:-6},
{name:"Kingsford Heights, USA", lat:41.4806, lon:-86.6917, pop:1000, timezone:-6},
{name:"Wanatah, USA", lat:41.4292, lon:-86.9000, pop:1000, timezone:-6},
{name:"Kouts, USA", lat:41.3167, lon:-87.0264, pop:2000, timezone:-6},
{name:"Hebron, USA", lat:41.3186, lon:-87.2000, pop:4000, timezone:-6},
{name:"Cedar Lake, USA", lat:41.3648, lon:-87.4411, pop:12000, timezone:-6},
{name:"Crown Point, USA", lat:41.4170, lon:-87.3653, pop:30000, timezone:-6},
{name:"St. John, USA", lat:41.4500, lon:-87.4400, pop:17000, timezone:-6},
{name:"Dyer, USA", lat:41.4942, lon:-87.5217, pop:16000, timezone:-6},
{name:"Schererville, USA", lat:41.4789, lon:-87.4548, pop:29000, timezone:-6},
{name:"Highland, USA", lat:41.5509, lon:-87.4510, pop:24000, timezone:-6},
{name:"Griffith, USA", lat:41.5284, lon:-87.4237, pop:16000, timezone:-6},
{name:"Munster, USA", lat:41.5645, lon:-87.5125, pop:23000, timezone:-6},
{name:"Hammond, USA", lat:41.5834, lon:-87.5000, pop:75000, timezone:-6},
{name:"East Chicago, USA", lat:41.6392, lon:-87.4548, pop:28000, timezone:-6},
{name:"Whiting, USA", lat:41.6798, lon:-87.4945, pop:5000, timezone:-6},
{name:"Kansas City, USA", lat:39.0997, lon:-94.5786, pop:2100000, timezone:-6},
{name:"Raleigh, USA", lat:35.7796, lon:-78.6382, pop:1400000, timezone:-5},
{name:"Virginia Beach, USA", lat:36.8529, lon:-75.9780, pop:450000, timezone:-5},
{name:"Oakland, USA", lat:37.8044, lon:-122.2712, pop:450000, timezone:-8},
{name:"Tulsa, USA", lat:36.1540, lon:-95.9928, pop:1000000, timezone:-6},
{name:"Arlington, USA", lat:32.7357, lon:-97.1081, pop:400000, timezone:-6},
{name:"New Orleans, USA", lat:29.9511, lon:-90.0715, pop:1300000, timezone:-6},
{name:"Wichita, USA", lat:37.6872, lon:-97.3301, pop:650000, timezone:-6},
{name:"Bakersfield, USA", lat:35.3733, lon:-119.0187, pop:500000, timezone:-8},
// USA continued (mid-sized / secondary)
{name:"Scottsdale, USA", lat:33.4942, lon:-111.9261, pop:250000, timezone:-7},
{name:"North Las Vegas, USA", lat:36.1989, lon:-115.1175, pop:250000, timezone:-8},
{name:"Fremont, USA", lat:37.5485, lon:-121.9886, pop:230000, timezone:-8},
{name:"Gilbert, USA", lat:33.3528, lon:-111.7890, pop:250000, timezone:-7},
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
{name:"Knoxville, USA", lat:35.9606, lon:-83.9207, pop:900000, timezone:-5},
{name:"Chattanooga, USA", lat:35.0456, lon:-85.3097, pop:550000, timezone:-5},
{name:"Mobile, USA", lat:30.6954, lon:-88.0399, pop:400000, timezone:-6},
{name:"Shreveport, USA", lat:32.5252, lon:-93.7502, pop:400000, timezone:-6},
{name:"Jackson, USA", lat:32.2988, lon:-90.1848, pop:500000, timezone:-6},
{name:"Augusta, USA", lat:33.4735, lon:-82.0105, pop:600000, timezone:-5},
{name:"Columbia, USA", lat:34.0007, lon:-81.0348, pop:800000, timezone:-5},
{name:"Charleston, USA", lat:32.7765, lon:-79.9311, pop:800000, timezone:-5},
{name:"Savannah, USA", lat:32.0809, lon:-81.0912, pop:400000, timezone:-5},
{name:"Fayetteville, USA", lat:35.0527, lon:-78.8784, pop:500000, timezone:-5},
{name:"Wilmington, USA", lat:34.2257, lon:-77.9447, pop:300000, timezone:-5},
{name:"Asheville, USA", lat:35.5951, lon:-82.5515, pop:200000, timezone:-5},
{name:"Greenville, USA", lat:34.8526, lon:-82.3940, pop:500000, timezone:-5},
{name:"Huntsville, USA", lat:34.7304, lon:-86.5861, pop:500000, timezone:-6},
{name:"Tuscaloosa, USA", lat:33.2098, lon:-87.5692, pop:250000, timezone:-6},
{name:"Pensacola, USA", lat:30.4213, lon:-87.2169, pop:500000, timezone:-6},
{name:"Gainesville, USA", lat:29.6516, lon:-82.3248, pop:300000, timezone:-5},
{name:"Daytona Beach, USA", lat:29.2108, lon:-81.0228, pop:200000, timezone:-5},
{name:"Melbourne, USA", lat:28.0836, lon:-80.6081, pop:200000, timezone:-5},
{name:"Fort Myers, USA", lat:26.6406, lon:-81.8723, pop:800000, timezone:-5},
{name:"Naples, USA", lat:26.1420, lon:-81.7948, pop:400000, timezone:-5},
{name:"Sarasota, USA", lat:27.3364, lon:-82.5307, pop:400000, timezone:-5},
{name:"Clearwater, USA", lat:27.9659, lon:-82.8001, pop:120000, timezone:-5},
{name:"St. Petersburg, USA", lat:27.7676, lon:-82.6403, pop:260000, timezone:-5},
{name:"Lakeland, USA", lat:28.0395, lon:-81.9498, pop:300000, timezone:-5},
{name:"Ocala, USA", lat:29.1872, lon:-82.1401, pop:200000, timezone:-5},
{name:"Gainesville, USA", lat:29.6516, lon:-82.3248, pop:300000, timezone:-5},
{name:"Fort Lauderdale, USA", lat:26.1224, lon:-80.1373, pop:1800000, timezone:-5},
{name:"West Palm Beach, USA", lat:26.7153, lon:-80.0534, pop:1500000, timezone:-5},
{name:"Boca Raton, USA", lat:26.3683, lon:-80.1289, pop:100000, timezone:-5},
{name:"Pompano Beach, USA", lat:26.2379, lon:-80.1248, pop:110000, timezone:-5},
{name:"Hollywood, USA", lat:26.0112, lon:-80.1495, pop:150000, timezone:-5},
{name:"Miramar, USA", lat:25.9873, lon:-80.2322, pop:140000, timezone:-5},
{name:"Coral Springs, USA", lat:26.2712, lon:-80.2706, pop:140000, timezone:-5},
{name:"Pembroke Pines, USA", lat:26.0078, lon:-80.2963, pop:170000, timezone:-5},
{name:"Davie, USA", lat:26.0765, lon:-80.2521, pop:100000, timezone:-5},
{name:"Sunrise, USA", lat:26.1572, lon:-80.2860, pop:100000, timezone:-5},
{name:"Plantation, USA", lat:26.1276, lon:-80.2331, pop:90000, timezone:-5},
{name:"Deerfield Beach, USA", lat:26.3184, lon:-80.0998, pop:80000, timezone:-5},
{name:"Boynton Beach, USA", lat:26.5253, lon:-80.0664, pop:80000, timezone:-5},
{name:"Delray Beach, USA", lat:26.4615, lon:-80.0728, pop:70000, timezone:-5},
{name:"Jupiter, USA", lat:26.9342, lon:-80.0942, pop:60000, timezone:-5},
{name:"Palm Beach Gardens, USA", lat:26.8234, lon:-80.1387, pop:60000, timezone:-5},
{name:"Wellington, USA", lat:26.6618, lon:-80.2684, pop:60000, timezone:-5},
{name:"Royal Palm Beach, USA", lat:26.7084, lon:-80.2306, pop:40000, timezone:-5},
{name:"Greenacres, USA", lat:26.6276, lon:-80.1353, pop:40000, timezone:-5},
{name:"Lake Worth, USA", lat:26.6168, lon:-80.0684, pop:40000, timezone:-5},
{name:"Riviera Beach, USA", lat:26.7753, lon:-80.0581, pop:35000, timezone:-5},
{name:"Palm Springs, USA", lat:26.6359, lon:-80.0962, pop:25000, timezone:-5},
{name:"Lantana, USA", lat:26.5867, lon:-80.0519, pop:12000, timezone:-5},
{name:"Hypoluxo, USA", lat:26.5667, lon:-80.0500, pop:3000, timezone:-5},
{name:"Manalapan, USA", lat:26.5667, lon:-80.0333, pop:500, timezone:-5},
{name:"Ocean Ridge, USA", lat:26.5333, lon:-80.0500, pop:2000, timezone:-5},
{name:"Briny Breezes, USA", lat:26.5167, lon:-80.0500, pop:500, timezone:-5},
{name:"Gulf Stream, USA", lat:26.5000, lon:-80.0667, pop:1000, timezone:-5},
{name:"Delray Beach, USA", lat:26.4615, lon:-80.0728, pop:70000, timezone:-5},
{name:"Boca Raton, USA", lat:26.3683, lon:-80.1289, pop:100000, timezone:-5},
{name:"Deerfield Beach, USA", lat:26.3184, lon:-80.0998, pop:80000, timezone:-5},
{name:"Pompano Beach, USA", lat:26.2379, lon:-80.1248, pop:110000, timezone:-5},
{name:"Lighthouse Point, USA", lat:26.2756, lon:-80.0873, pop:10000, timezone:-5},
{name:"Hillsboro Beach, USA", lat:26.3000, lon:-80.0833, pop:2000, timezone:-5},
{name:"Lauderdale-by-the-Sea, USA", lat:26.1917, lon:-80.0967, pop:6000, timezone:-5},
{name:"Sea Ranch Lakes, USA", lat:26.2000, lon:-80.1000, pop:700, timezone:-5},
{name:"Lauderdale Lakes, USA", lat:26.1667, lon:-80.2000, pop:35000, timezone:-5},
{name:"North Lauderdale, USA", lat:26.2167, lon:-80.2167, pop:45000, timezone:-5},
{name:"Tamarac, USA", lat:26.2129, lon:-80.2498, pop:70000, timezone:-5},
{name:"Margate, USA", lat:26.2445, lon:-80.2064, pop:60000, timezone:-5},
{name:"Coconut Creek, USA", lat:26.2517, lon:-80.1789, pop:60000, timezone:-5},
{name:"Parkland, USA", lat:26.3101, lon:-80.2373, pop:35000, timezone:-5},
{name:"Coral Springs, USA", lat:26.2712, lon:-80.2706, pop:140000, timezone:-5},
{name:"Sunrise, USA", lat:26.1572, lon:-80.2860, pop:100000, timezone:-5},
{name:"Plantation, USA", lat:26.1276, lon:-80.2331, pop:90000, timezone:-5},
{name:"Davie, USA", lat:26.0765, lon:-80.2521, pop:100000, timezone:-5},
{name:"Cooper City, USA", lat:26.0573, lon:-80.2717, pop:35000, timezone:-5},
{name:"Southwest Ranches, USA", lat:26.0587, lon:-80.3373, pop:8000, timezone:-5},
{name:"Weston, USA", lat:26.1004, lon:-80.3998, pop:70000, timezone:-5},
{name:"Pembroke Pines, USA", lat:26.0078, lon:-80.2963, pop:170000, timezone:-5},
{name:"Miramar, USA", lat:25.9873, lon:-80.2322, pop:140000, timezone:-5},
{name:"Hollywood, USA", lat:26.0112, lon:-80.1495, pop:150000, timezone:-5},
{name:"Hallandale Beach, USA", lat:25.9812, lon:-80.1484, pop:40000, timezone:-5},
{name:"Aventura, USA", lat:25.9565, lon:-80.1392, pop:40000, timezone:-5},
{name:"North Miami Beach, USA", lat:25.9331, lon:-80.1625, pop:45000, timezone:-5},
{name:"Sunny Isles Beach, USA", lat:25.9390, lon:-80.1230, pop:22000, timezone:-5},
{name:"Bal Harbour, USA", lat:25.8990, lon:-80.1260, pop:3000, timezone:-5},
{name:"Bay Harbor Islands, USA", lat:25.8876, lon:-80.1312, pop:6000, timezone:-5},
{name:"Surfside, USA", lat:25.8784, lon:-80.1256, pop:6000, timezone:-5},
{name:"Indian Creek, USA", lat:25.8780, lon:-80.1320, pop:100, timezone:-5},
{name:"Miami Beach, USA", lat:25.7907, lon:-80.1300, pop:90000, timezone:-5},
{name:"Miami Shores, USA", lat:25.8632, lon:-80.1931, pop:10000, timezone:-5},
{name:"North Miami, USA", lat:25.8901, lon:-80.1867, pop:60000, timezone:-5},
{name:"Biscayne Park, USA", lat:25.8759, lon:-80.1806, pop:3000, timezone:-5},
{name:"El Portal, USA", lat:25.8554, lon:-80.1931, pop:2000, timezone:-5},
{name:"Miami Springs, USA", lat:25.8223, lon:-80.2895, pop:14000, timezone:-5},
{name:"Virginia Gardens, USA", lat:25.8109, lon:-80.2987, pop:2000, timezone:-5},
{name:"Hialeah Gardens, USA", lat:25.8651, lon:-80.3245, pop:22000, timezone:-5},
{name:"Medley, USA", lat:25.8470, lon:-80.3370, pop:1000, timezone:-5},
{name:"Doral, USA", lat:25.8195, lon:-80.3553, pop:70000, timezone:-5},
{name:"Sweetwater, USA", lat:25.7959, lon:-80.3731, pop:20000, timezone:-5},
{name:"West Miami, USA", lat:25.7634, lon:-80.2967, pop:7000, timezone:-5},
{name:"Coral Gables, USA", lat:25.7215, lon:-80.2684, pop:50000, timezone:-5},
{name:"South Miami, USA", lat:25.7073, lon:-80.2934, pop:12000, timezone:-5},
{name:"Pinecrest, USA", lat:25.6670, lon:-80.3081, pop:18000, timezone:-5},
{name:"Palmetto Bay, USA", lat:25.6218, lon:-80.3248, pop:25000, timezone:-5},
{name:"Cutler Bay, USA", lat:25.5808, lon:-80.3460, pop:45000, timezone:-5},
{name:"Homestead, USA", lat:25.4687, lon:-80.4776, pop:80000, timezone:-5},
{name:"Florida City, USA", lat:25.4479, lon:-80.4792, pop:12000, timezone:-5},
{name:"Key Largo, USA", lat:25.0865, lon:-80.4473, pop:10000, timezone:-5},
{name:"Islamorada, USA", lat:24.9243, lon:-80.6278, pop:6000, timezone:-5},
{name:"Marathon, USA", lat:24.7136, lon:-81.0904, pop:8000, timezone:-5},
{name:"Key West, USA", lat:24.5551, lon:-81.7800, pop:25000, timezone:-5},
{name:"Aurora, USA", lat:39.7294, lon:-104.8319, pop:400000, timezone:-7},
{name:"Anaheim, USA", lat:33.8366, lon:-117.9143, pop:350000, timezone:-8},
{name:"Santa Ana, USA", lat:33.7455, lon:-117.8677, pop:300000, timezone:-8},
{name:"Riverside, USA", lat:33.9806, lon:-117.3755, pop:300000, timezone:-8},
{name:"Corpus Christi, USA", lat:27.8006, lon:-97.3964, pop:350000, timezone:-6},
{name:"Lexington, USA", lat:38.0406, lon:-84.5037, pop:350000, timezone:-5},
{name:"Henderson, USA", lat:36.0395, lon:-114.9817, pop:350000, timezone:-8},
{name:"Stockton, USA", lat:37.9577, lon:-121.2908, pop:300000, timezone:-8},
{name:"Saint Paul, USA", lat:44.9537, lon:-93.0900, pop:300000, timezone:-6},
{name:"Greensboro, USA", lat:36.0726, lon:-79.7920, pop:300000, timezone:-5},
{name:"Lincoln, USA", lat:40.8258, lon:-96.6852, pop:300000, timezone:-6},
{name:"Plano, USA", lat:33.0198, lon:-96.6989, pop:300000, timezone:-6},
{name:"Newark, USA", lat:40.7357, lon:-74.1724, pop:300000, timezone:-5},
{name:"Toledo, USA", lat:41.6528, lon:-83.5379, pop:300000, timezone:-5},
{name:"Chula Vista, USA", lat:32.6401, lon:-117.0842, pop:280000, timezone:-8},
{name:"Jersey City, USA", lat:40.7178, lon:-74.0431, pop:300000, timezone:-5},
{name:"Chandler, USA", lat:33.3062, lon:-111.8413, pop:280000, timezone:-7},
{name:"Laredo, USA", lat:27.5306, lon:-99.4803, pop:250000, timezone:-6},
{name:"Madison, USA", lat:43.0731, lon:-89.4012, pop:280000, timezone:-6},
{name:"Durham, USA", lat:35.9940, lon:-78.8986, pop:300000, timezone:-5},
{name:"Lubbock, USA", lat:33.5779, lon:-101.8552, pop:250000, timezone:-6},
{name:"Winston-Salem, USA", lat:36.0999, lon:-80.2442, pop:250000, timezone:-5},
{name:"Garland, USA", lat:32.9126, lon:-96.6389, pop:250000, timezone:-6},
/* =========================
   🌎 MEXICO + CENTRAL AMERICA + SOUTH AMERICA + HAWAII + ALASKA
========================= */

// Hawaii
{name:"Honolulu, USA", lat:21.3069, lon:-157.8583, pop:1000000, timezone:-10},
{name:"Hilo, USA", lat:19.7074, lon:-155.0900, pop:45000, timezone:-10},
{name:"Kailua-Kona, USA", lat:19.6400, lon:-155.9969, pop:25000, timezone:-10},
{name:"Kahului, USA", lat:20.8895, lon:-156.4729, pop:30000, timezone:-10},
{name:"Pearl City, USA", lat:21.3972, lon:-157.9736, pop:45000, timezone:-10},
{name:"Waipahu, USA", lat:21.3867, lon:-158.0092, pop:40000, timezone:-10},
{name:"Kane’ohe, USA", lat:21.4183, lon:-157.8036, pop:35000, timezone:-10},
{name:"Mililani, USA", lat:21.4511, lon:-158.0011, pop:30000, timezone:-10},
{name:"Ewa Gentry, USA", lat:21.3400, lon:-158.0300, pop:25000, timezone:-10},
{name:"Kihei, USA", lat:20.7644, lon:-156.4450, pop:25000, timezone:-10},

// Alaska
{name:"Anchorage, USA", lat:61.2181, lon:-149.9003, pop:290000, timezone:-9},
{name:"Fairbanks, USA", lat:64.8378, lon:-147.7164, pop:32000, timezone:-9},
{name:"Juneau, USA", lat:58.3019, lon:-134.4197, pop:32000, timezone:-9},
{name:"Wasilla, USA", lat:61.5814, lon:-149.4394, pop:10000, timezone:-9},
{name:"Sitka, USA", lat:57.0531, lon:-135.3300, pop:9000, timezone:-9},
{name:"Ketchikan, USA", lat:55.3422, lon:-131.6461, pop:8000, timezone:-9},
{name:"Kenai, USA", lat:60.5544, lon:-151.2583, pop:8000, timezone:-9},
{name:"Kodiak, USA", lat:57.7900, lon:-152.4072, pop:6000, timezone:-9},
{name:"Bethel, USA", lat:60.7922, lon:-161.7558, pop:6000, timezone:-9},
{name:"Palmer, USA", lat:61.5997, lon:-149.1128, pop:7000, timezone:-9},

// Mexico – secondary & regional
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
{name:"Puebla, Mexico", lat:19.0414, lon:-98.2063, pop:3200000, timezone:-6},
{name:"Reynosa, Mexico", lat:26.0508, lon:-98.2975, pop:700000, timezone:-6},
{name:"Matamoros, Mexico", lat:25.8690, lon:-97.5027, pop:500000, timezone:-6},
{name:"Nuevo Laredo, Mexico", lat:27.4864, lon:-99.5075, pop:400000, timezone:-6},
{name:"Tampico, Mexico", lat:22.2553, lon:-97.8686, pop:800000, timezone:-6},
{name:"Ciudad Victoria, Mexico", lat:23.7369, lon:-99.1411, pop:350000, timezone:-6},
{name:"Torreón, Mexico", lat:25.5428, lon:-103.4068, pop:1200000, timezone:-6},
{name:"Gómez Palacio, Mexico", lat:25.5699, lon:-103.4997, pop:350000, timezone:-6},
{name:"Durango, Mexico", lat:24.0277, lon:-104.6532, pop:600000, timezone:-6},
{name:"Zacatecas, Mexico", lat:22.7709, lon:-102.5832, pop:300000, timezone:-6},
{name:"Fresnillo, Mexico", lat:23.1749, lon:-102.8678, pop:200000, timezone:-6},
{name:"Pachuca, Mexico", lat:20.1011, lon:-98.7591, pop:300000, timezone:-6},
{name:"Tulancingo, Mexico", lat:20.0836, lon:-98.3669, pop:150000, timezone:-6},
{name:"Tlaxcala, Mexico", lat:19.3182, lon:-98.2375, pop:100000, timezone:-6},
{name:"Cuernavaca, Mexico", lat:18.9242, lon:-99.2216, pop:400000, timezone:-6},
{name:"Cuautla, Mexico", lat:18.8124, lon:-98.9550, pop:200000, timezone:-6},
{name:"Chilpancingo, Mexico", lat:17.5515, lon:-99.5006, pop:250000, timezone:-6},
{name:"Iguala, Mexico", lat:18.3450, lon:-99.5397, pop:150000, timezone:-6},
{name:"Taxco, Mexico", lat:18.5565, lon:-99.6042, pop:50000, timezone:-6},
{name:"Oaxaca, Mexico", lat:17.0732, lon:-96.7266, pop:300000, timezone:-6},
{name:"Salina Cruz, Mexico", lat:16.1753, lon:-95.1956, pop:80000, timezone:-6},
{name:"Tehuantepec, Mexico", lat:16.3256, lon:-95.2417, pop:40000, timezone:-6},
{name:"Tuxtla Gutiérrez, Mexico", lat:16.7510, lon:-93.1167, pop:600000, timezone:-6},
{name:"San Cristóbal de las Casas, Mexico", lat:16.7370, lon:-92.6376, pop:200000, timezone:-6},
{name:"Tapachula, Mexico", lat:14.9036, lon:-92.2581, pop:350000, timezone:-6},
{name:"Villahermosa, Mexico", lat:17.9892, lon:-92.9281, pop:700000, timezone:-6},
{name:"Campeche, Mexico", lat:19.8301, lon:-90.5349, pop:250000, timezone:-6},
{name:"Chetumal, Mexico", lat:18.5001, lon:-88.2960, pop:150000, timezone:-5},
{name:"Playa del Carmen, Mexico", lat:20.6296, lon:-87.0739, pop:300000, timezone:-5},
{name:"Cozumel, Mexico", lat:20.5083, lon:-86.9458, pop:100000, timezone:-5},
{name:"Isla Mujeres, Mexico", lat:21.2311, lon:-86.7311, pop:15000, timezone:-5},
{name:"Progreso, Mexico", lat:21.2833, lon:-89.6667, pop:50000, timezone:-6},
{name:"Valladolid, Mexico", lat:20.6889, lon:-88.2017, pop:50000, timezone:-6},
{name:"Tizimín, Mexico", lat:21.1500, lon:-88.1500, pop:50000, timezone:-6},
{name:"Motul, Mexico", lat:21.1000, lon:-89.2833, pop:25000, timezone:-6},
{name:"Izamal, Mexico", lat:20.9333, lon:-89.0167, pop:15000, timezone:-6},
{name:"Ticul, Mexico", lat:20.4000, lon:-89.5333, pop:35000, timezone:-6},
{name:"Oxkutzcab, Mexico", lat:20.3000, lon:-89.4167, pop:25000, timezone:-6},
{name:"Tekax, Mexico", lat:20.2000, lon:-89.2833, pop:25000, timezone:-6},
{name:"Peto, Mexico", lat:20.1167, lon:-88.9167, pop:20000, timezone:-6},
{name:"Espita, Mexico", lat:21.0167, lon:-88.3000, pop:10000, timezone:-6},
{name:"Temozón, Mexico", lat:20.8000, lon:-88.2000, pop:15000, timezone:-6},
{name:"Kaua, Mexico", lat:20.7500, lon:-88.4167, pop:5000, timezone:-6},
{name:"Chichimilá, Mexico", lat:20.6333, lon:-88.2167, pop:10000, timezone:-6},
{name:"Tixcacalcupul, Mexico", lat:20.5500, lon:-88.2500, pop:5000, timezone:-6},
{name:"Chemax, Mexico", lat:20.6500, lon:-87.9333, pop:15000, timezone:-6},
{name:"Colonia Yucatán, Mexico", lat:20.8333, lon:-87.7000, pop:5000, timezone:-5},
{name:"Kantunilkin, Mexico", lat:21.1000, lon:-87.4833, pop:10000, timezone:-5},
{name:"Solferino, Mexico", lat:21.3000, lon:-87.3000, pop:2000, timezone:-5},
{name:"Holbox, Mexico", lat:21.5236, lon:-87.3781, pop:2000, timezone:-5},
{name:"Isla Blanca, Mexico", lat:21.4500, lon:-86.7833, pop:1000, timezone:-5},
{name:"Puerto Morelos, Mexico", lat:20.8500, lon:-86.8750, pop:15000, timezone:-5},
{name:"Akumal, Mexico", lat:20.4000, lon:-87.3167, pop:5000, timezone:-5},
{name:"Tulum, Mexico", lat:20.2114, lon:-87.4654, pop:50000, timezone:-5},
{name:"Felipe Carrillo Puerto, Mexico", lat:19.5833, lon:-88.0500, pop:30000, timezone:-5},
{name:"José María Morelos, Mexico", lat:19.7500, lon:-88.7000, pop:15000, timezone:-5},
{name:"Bacalar, Mexico", lat:18.6667, lon:-88.4000, pop:15000, timezone:-5},
{name:"Mahahual, Mexico", lat:18.7167, lon:-87.7000, pop:5000, timezone:-5},
{name:"Xcalak, Mexico", lat:18.2667, lon:-87.8333, pop:1000, timezone:-5},
{name:"Chetumal, Mexico", lat:18.5001, lon:-88.2960, pop:150000, timezone:-5},
{name:"Calderitas, Mexico", lat:18.5500, lon:-88.2500, pop:5000, timezone:-5},
{name:"Subteniente López, Mexico", lat:18.4833, lon:-88.3833, pop:3000, timezone:-5},
{name:"Huay-Pix, Mexico", lat:18.5167, lon:-88.4333, pop:2000, timezone:-5},
{name:"Laguna Guerrero, Mexico", lat:18.7000, lon:-88.2500, pop:1000, timezone:-5},
{name:"Raudales, Mexico", lat:18.4500, lon:-88.5333, pop:1000, timezone:-5},
{name:"Alvaro Obregón, Mexico", lat:18.3000, lon:-88.6500, pop:2000, timezone:-5},
{name:"Sabidos, Mexico", lat:18.2500, lon:-88.7000, pop:1000, timezone:-5},
{name:"Morocoy, Mexico", lat:18.2000, lon:-88.7500, pop:1000, timezone:-5},
{name:"Cacao, Mexico", lat:18.1500, lon:-88.8000, pop:1000, timezone:-5},
{name:"Pucté, Mexico", lat:18.1000, lon:-88.8500, pop:1000, timezone:-5},
{name:"Nuevo Progreso, Mexico", lat:18.0500, lon:-88.9000, pop:1000, timezone:-5},
{name:"La Unión, Mexico", lat:18.0000, lon:-88.9500, pop:1000, timezone:-5},
// ==========================
// 🇿🇦 JOHANNESBURG–PRETORIA
// ==========================

// Johannesburg
{name:"Johannesburg - CBD", lat:-26.2041, lon:28.0473, pop:1500000, timezone:2},
{name:"Johannesburg - Sandton", lat:-26.1076, lon:28.0567, pop:800000, timezone:2},
{name:"Johannesburg - Rosebank", lat:-26.1450, lon:28.0430, pop:400000, timezone:2},
{name:"Johannesburg - Soweto", lat:-26.2485, lon:27.8540, pop:1200000, timezone:2},
{name:"Johannesburg - Randburg", lat:-26.0936, lon:27.9947, pop:500000, timezone:2},
{name:"Johannesburg - Roodepoort", lat:-26.1625, lon:27.8725, pop:500000, timezone:2},

// East Rand
{name:"Germiston", lat:-26.2259, lon:28.1700, pop:250000, timezone:2},
{name:"Boksburg", lat:-26.2120, lon:28.2590, pop:300000, timezone:2},
{name:"Benoni", lat:-26.1885, lon:28.3208, pop:300000, timezone:2},
{name:"Kempton Park", lat:-26.0980, lon:28.2330, pop:250000, timezone:2},
{name:"Edenvale", lat:-26.1400, lon:28.1500, pop:150000, timezone:2},

// Mid-corridor
{name:"Midrand", lat:-25.9895, lon:28.1284, pop:500000, timezone:2},
{name:"Centurion", lat:-25.8603, lon:28.1894, pop:350000, timezone:2},
{name:"Vanderbijlpark", lat:-26.7117, lon:27.8370, pop:250000, timezone:2},
{name:"Vereeniging", lat:-26.6731, lon:27.9261, pop:250000, timezone:2},

// Pretoria
{name:"Pretoria - CBD", lat:-25.7479, lon:28.2293, pop:900000, timezone:2},
{name:"Pretoria - Centurion", lat:-25.8603, lon:28.1894, pop:350000, timezone:2},
{name:"Pretoria - Hatfield", lat:-25.7460, lon:28.2370, pop:300000, timezone:2},
{name:"Pretoria - Menlyn", lat:-25.7830, lon:28.2760, pop:300000, timezone:2},
{name:"Pretoria - Soshanguve", lat:-25.4700, lon:28.1000, pop:500000, timezone:2},
{name:"Mamelodi", lat:-25.7060, lon:28.3830, pop:400000, timezone:2},
{name:"Akasia", lat:-25.6270, lon:28.1000, pop:200000, timezone:2},
// ==========================
// 🇮🇳 MUMBAI METROPOLITAN REGION
// ==========================
{name:"Mumbai - South", lat:18.9388, lon:72.8354, pop:1200000, timezone:5.5},
{name:"Mumbai - Central", lat:19.0178, lon:72.8478, pop:1800000, timezone:5.5},
{name:"Mumbai - Bandra", lat:19.0607, lon:72.8362, pop:900000, timezone:5.5},
{name:"Mumbai - Andheri", lat:19.1197, lon:72.8468, pop:1400000, timezone:5.5},
{name:"Mumbai - Borivali", lat:19.2300, lon:72.8567, pop:900000, timezone:5.5},
{name:"Mumbai - Powai", lat:19.1176, lon:72.9060, pop:500000, timezone:5.5},

{name:"Thane", lat:19.2183, lon:72.9781, pop:2000000, timezone:5.5},
{name:"Navi Mumbai", lat:19.0330, lon:73.0297, pop:1400000, timezone:5.5},
{name:"Kalyan", lat:19.2437, lon:73.1355, pop:700000, timezone:5.5},
{name:"Dombivli", lat:19.2183, lon:73.0867, pop:700000, timezone:5.5},
{name:"Mira Road", lat:19.2952, lon:72.8544, pop:500000, timezone:5.5},
{name:"Bhiwandi", lat:19.2813, lon:73.0483, pop:700000, timezone:5.5},
{name:"Vasai", lat:19.3919, lon:72.8397, pop:500000, timezone:5.5},
{name:"Virar", lat:19.4559, lon:72.8114, pop:400000, timezone:5.5},
{name:"Panvel", lat:18.9894, lon:73.1175, pop:300000, timezone:5.5},
// ==========================
// 🇫🇷 PARIS METROPOLITAN AREA
// ==========================
{name:"Paris - Centre", lat:48.8566, lon:2.3522, pop:2500000, timezone:1},
{name:"Paris - La Défense", lat:48.8920, lon:2.2369, pop:700000, timezone:1},
{name:"Paris - Montmartre", lat:48.8867, lon:2.3431, pop:500000, timezone:1},
{name:"Paris - Montparnasse", lat:48.8422, lon:2.3219, pop:400000, timezone:1},

{name:"Saint-Denis", lat:48.9362, lon:2.3574, pop:120000, timezone:1},
{name:"Boulogne-Billancourt", lat:48.8397, lon:2.2399, pop:120000, timezone:1},
{name:"Argenteuil", lat:48.9472, lon:2.2467, pop:110000, timezone:1},
{name:"Montreuil", lat:48.8638, lon:2.4485, pop:110000, timezone:1},
{name:"Nanterre", lat:48.8924, lon:2.2067, pop:100000, timezone:1},
{name:"Créteil", lat:48.7904, lon:2.4556, pop:95000, timezone:1},
{name:"Vitry-sur-Seine", lat:48.7872, lon:2.3922, pop:95000, timezone:1},
{name:"Versailles", lat:48.8014, lon:2.1301, pop:85000, timezone:1},
{name:"Cergy", lat:49.0360, lon:2.0610, pop:70000, timezone:1},
{name:"Évry-Courcouronnes", lat:48.6298, lon:2.4418, pop:70000, timezone:1},
{name:"Aulnay-sous-Bois", lat:48.9381, lon:2.4946, pop:90000, timezone:1},
{name:"Marne-la-Vallée", lat:48.8422, lon:2.6036, pop:100000, timezone:1},
// ==========================
// 🇬🇧 GREATER LONDON
// ==========================
{name:"London - Central", lat:51.5074, lon:-0.1278, pop:2000000, timezone:0},
{name:"London - Westminster", lat:51.4975, lon:-0.1357, pop:700000, timezone:0},
{name:"London - Canary Wharf", lat:51.5054, lon:-0.0235, pop:500000, timezone:0},
{name:"London - Camden", lat:51.5416, lon:-0.1433, pop:400000, timezone:0},
{name:"London - Croydon", lat:51.3762, lon:-0.0982, pop:400000, timezone:0},
{name:"London - Wembley", lat:51.5580, lon:-0.2800, pop:300000, timezone:0},
{name:"London - Stratford", lat:51.5460, lon:-0.0090, pop:300000, timezone:0},
{name:"London - Greenwich", lat:51.4826, lon:0.0077, pop:300000, timezone:0},

{name:"Ilford", lat:51.5590, lon:0.0741, pop:200000, timezone:0},
{name:"Romford", lat:51.5768, lon:0.1801, pop:150000, timezone:0},
{name:"Watford", lat:51.6565, lon:-0.3903, pop:150000, timezone:0},
{name:"Slough", lat:51.5105, lon:-0.5950, pop:150000, timezone:0},
{name:"Brentford", lat:51.4750, lon:-0.3060, pop:100000, timezone:0},
{name:"Croydon", lat:51.3762, lon:-0.0982, pop:200000, timezone:0},
{name:"Luton", lat:51.8787, lon:-0.4200, pop:250000, timezone:0},
{name:"Basildon", lat:51.5761, lon:0.4887, pop:180000, timezone:0},
{name:"Tres Garantías, Mexico", lat:17.9500, lon:-89.0000, pop:1000, timezone:-5},
// ==========================
// 🇨🇦 GREATER TORONTO AREA
// ==========================
{name:"Toronto - Downtown", lat:43.6532, lon:-79.3832, pop:1200000, timezone:-5},
{name:"Toronto - North York", lat:43.7615, lon:-79.4111, pop:700000, timezone:-5},
{name:"Toronto - Scarborough", lat:43.7764, lon:-79.2318, pop:650000, timezone:-5},
{name:"Toronto - Etobicoke", lat:43.6205, lon:-79.5132, pop:500000, timezone:-5},
{name:"Toronto - York", lat:43.6896, lon:-79.4802, pop:300000, timezone:-5},

{name:"Mississauga", lat:43.5890, lon:-79.6441, pop:800000, timezone:-5},
{name:"Brampton", lat:43.7315, lon:-79.7624, pop:700000, timezone:-5},
{name:"Vaughan", lat:43.8563, lon:-79.5085, pop:350000, timezone:-5},
{name:"Markham", lat:43.8561, lon:-79.3370, pop:350000, timezone:-5},
{name:"Richmond Hill", lat:43.8828, lon:-79.4403, pop:250000, timezone:-5},
{name:"Oakville", lat:43.4675, lon:-79.6877, pop:250000, timezone:-5},
{name:"Burlington", lat:43.3255, lon:-79.7990, pop:200000, timezone:-5},
{name:"Ajax", lat:43.8509, lon:-79.0204, pop:150000, timezone:-5},
{name:"Pickering", lat:43.8384, lon:-79.0868, pop:100000, timezone:-5},
{name:"Oshawa", lat:43.8975, lon:-78.8658, pop:180000, timezone:-5},
{name:"Tomas Garrido, Mexico", lat:17.9000, lon:-89.0500, pop:1000, timezone:-5},
// ==========================
// 🇮🇩 JAKARTA METRO / JABODETABEK
// ==========================
{name:"Jakarta - Central", lat:-6.2088, lon:106.8456, pop:3000000, timezone:7},
{name:"Jakarta - South", lat:-6.2615, lon:106.8106, pop:1800000, timezone:7},
{name:"Jakarta - West", lat:-6.1683, lon:106.7588, pop:1800000, timezone:7},
{name:"Jakarta - East", lat:-6.2250, lon:106.9000, pop:1800000, timezone:7},
{name:"Jakarta - North", lat:-6.1380, lon:106.8800, pop:1500000, timezone:7},

{name:"Tangerang", lat:-6.1783, lon:106.6319, pop:2000000, timezone:7},
{name:"South Tangerang", lat:-6.2886, lon:106.7179, pop:1400000, timezone:7},
{name:"Bekasi", lat:-6.2383, lon:106.9756, pop:2500000, timezone:7},
{name:"Depok", lat:-6.4025, lon:106.7942, pop:2100000, timezone:7},
{name:"Bogor", lat:-6.5971, lon:106.8060, pop:1100000, timezone:7},
{name:"Cibinong", lat:-6.4810, lon:106.8500, pop:300000, timezone:7},
{name:"Karawang", lat:-6.3050, lon:107.3000, pop:400000, timezone:7},
{name:"Cikarang", lat:-6.2610, lon:107.1520, pop:400000, timezone:7},
{name:"Conhuas, Mexico", lat:18.4000, lon:-89.5000, pop:1000, timezone:-6},
// ==========================
// 🇮🇳 DELHI NCR
// ==========================
{name:"Delhi - Central", lat:28.6139, lon:77.2090, pop:3000000, timezone:5.5},
{name:"Delhi - South", lat:28.5244, lon:77.1855, pop:1500000, timezone:5.5},
{name:"Delhi - East", lat:28.6280, lon:77.2780, pop:1200000, timezone:5.5},
{name:"Delhi - North", lat:28.7041, lon:77.1025, pop:1500000, timezone:5.5},
{name:"Delhi - West", lat:28.6667, lon:77.0667, pop:1300000, timezone:5.5},

{name:"Gurugram", lat:28.4595, lon:77.0266, pop:1200000, timezone:5.5},
{name:"Noida", lat:28.5355, lon:77.3910, pop:700000, timezone:5.5},
{name:"Ghaziabad", lat:28.6692, lon:77.4538, pop:1200000, timezone:5.5},
{name:"Faridabad", lat:28.4089, lon:77.3178, pop:1200000, timezone:5.5},
{name:"Greater Noida", lat:28.4744, lon:77.5040, pop:500000, timezone:5.5},
{name:"Bahadurgarh", lat:28.6929, lon:76.9350, pop:250000, timezone:5.5},
{name:"Sonipat", lat:28.9931, lon:77.0151, pop:300000, timezone:5.5},
{name:"Panipat", lat:29.3909, lon:76.9635, pop:400000, timezone:5.5},
// ==========================
// 🇰🇷 SEOUL CAPITAL AREA
// ==========================
{name:"Seoul - Jongno", lat:37.5730, lon:126.9794, pop:300000, timezone:9},
{name:"Seoul - Gangnam", lat:37.4979, lon:127.0276, pop:700000, timezone:9},
{name:"Seoul - Gangbuk", lat:37.6396, lon:127.0257, pop:500000, timezone:9},
{name:"Seoul - Yeongdeungpo", lat:37.5264, lon:126.8963, pop:500000, timezone:9},
{name:"Seoul - Songpa", lat:37.5145, lon:127.1059, pop:700000, timezone:9},
{name:"Seoul - Mapo", lat:37.5663, lon:126.9014, pop:400000, timezone:9},
{name:"Seoul - Guro", lat:37.4954, lon:126.8874, pop:400000, timezone:9},
{name:"Seoul - Nowon", lat:37.6543, lon:127.0560, pop:500000, timezone:9},

{name:"Incheon", lat:37.4563, lon:126.7052, pop:3000000, timezone:9},
{name:"Bucheon", lat:37.5034, lon:126.7660, pop:800000, timezone:9},
{name:"Goyang", lat:37.6584, lon:126.8320, pop:1100000, timezone:9},
{name:"Suwon", lat:37.2636, lon:127.0286, pop:1200000, timezone:9},
{name:"Seongnam", lat:37.4200, lon:127.1265, pop:950000, timezone:9},
{name:"Yongin", lat:37.2411, lon:127.1776, pop:1100000, timezone:9},
{name:"Anyang", lat:37.3943, lon:126.9568, pop:550000, timezone:9},
{name:"Gwangmyeong", lat:37.4786, lon:126.8647, pop:300000, timezone:9},
{name:"Uijeongbu", lat:37.7381, lon:127.0337, pop:450000, timezone:9},
{name:"Namyangju", lat:37.6360, lon:127.2165, pop:700000, timezone:9},
{name:"Hanam", lat:37.5393, lon:127.2148, pop:330000, timezone:9},
{name:"Gimpo", lat:37.6153, lon:126.7156, pop:500000, timezone:9},
// ==========================
// 🇧🇷 SÃO PAULO METRO
// ==========================
{name:"São Paulo - Centro", lat:-23.5505, lon:-46.6333, pop:6000000, timezone:-3},
{name:"São Paulo - Paulista", lat:-23.5614, lon:-46.6562, pop:1200000, timezone:-3},
{name:"São Paulo - Pinheiros", lat:-23.5670, lon:-46.7010, pop:700000, timezone:-3},
{name:"São Paulo - Moema", lat:-23.6000, lon:-46.6670, pop:500000, timezone:-3},
{name:"São Paulo - Tatuapé", lat:-23.5400, lon:-46.5750, pop:700000, timezone:-3},
{name:"São Paulo - Santana", lat:-23.5000, lon:-46.6250, pop:500000, timezone:-3},
{name:"São Paulo - Santo Amaro", lat:-23.6540, lon:-46.7100, pop:600000, timezone:-3},
{name:"São Paulo - Itaquera", lat:-23.5400, lon:-46.4550, pop:700000, timezone:-3},

{name:"Guarulhos", lat:-23.4543, lon:-46.5337, pop:1400000, timezone:-3},
{name:"Osasco", lat:-23.5329, lon:-46.7917, pop:750000, timezone:-3},
{name:"São Bernardo do Campo", lat:-23.6914, lon:-46.5646, pop:850000, timezone:-3},
{name:"Santo André", lat:-23.6639, lon:-46.5383, pop:750000, timezone:-3},
{name:"São Caetano do Sul", lat:-23.6229, lon:-46.5548, pop:170000, timezone:-3},
{name:"Diadema", lat:-23.6860, lon:-46.6230, pop:430000, timezone:-3},
{name:"Mauá", lat:-23.6677, lon:-46.4613, pop:450000, timezone:-3},
{name:"Barueri", lat:-23.5112, lon:-46.8765, pop:300000, timezone:-3},
{name:"Taboão da Serra", lat:-23.6260, lon:-46.7910, pop:300000, timezone:-3},
{name:"Cotia", lat:-23.6020, lon:-46.9190, pop:250000, timezone:-3},
{name:"Mogi das Cruzes", lat:-23.5228, lon:-46.1883, pop:450000, timezone:-3},
// ==========================
// 🇲🇽 MEXICO CITY METRO
// ==========================
{name:"Mexico City - Centro", lat:19.4326, lon:-99.1332, pop:5000000, timezone:-6},
{name:"Mexico City - Polanco", lat:19.4330, lon:-99.1940, pop:700000, timezone:-6},
{name:"Mexico City - Coyoacán", lat:19.3467, lon:-99.1617, pop:600000, timezone:-6},
{name:"Mexico City - Iztapalapa", lat:19.3574, lon:-99.0050, pop:1800000, timezone:-6},
{name:"Mexico City - Gustavo A. Madero", lat:19.4870, lon:-99.1100, pop:1200000, timezone:-6},
{name:"Mexico City - Azcapotzalco", lat:19.4869, lon:-99.1830, pop:500000, timezone:-6},
{name:"Mexico City - Álvaro Obregón", lat:19.3587, lon:-99.2030, pop:800000, timezone:-6},
{name:"Mexico City - Tlalpan", lat:19.2879, lon:-99.1677, pop:700000, timezone:-6},
{name:"Mexico City - Xochimilco", lat:19.2570, lon:-99.1010, pop:400000, timezone:-6},

{name:"Nezahualcóyotl", lat:19.4000, lon:-99.0333, pop:1100000, timezone:-6},
{name:"Ecatepec", lat:19.6018, lon:-99.0507, pop:1600000, timezone:-6},
{name:"Naucalpan", lat:19.4785, lon:-99.2380, pop:800000, timezone:-6},
{name:"Tlalnepantla", lat:19.5400, lon:-99.1950, pop:700000, timezone:-6},
{name:"Chimalhuacán", lat:19.4216, lon:-98.9500, pop:700000, timezone:-6},
{name:"Texcoco", lat:19.5110, lon:-98.8820, pop:300000, timezone:-6},
{name:"Huixquilucan", lat:19.3600, lon:-99.3500, pop:300000, timezone:-6},
{name:"Atizapán de Zaragoza", lat:19.5580, lon:-99.2900, pop:500000, timezone:-6},
{name:"Cuautitlán Izcalli", lat:19.6430, lon:-99.2150, pop:600000, timezone:-6},

// Outer metro
{name:"Toluca", lat:19.2826, lon:-99.6557, pop:2000000, timezone:-6},
{name:"Metepec", lat:19.2500, lon:-99.6000, pop:250000, timezone:-6},
{name:"Xpujil, Mexico", lat:18.5000, lon:-89.4000, pop:5000, timezone:-6},
{name:"Zoh Laguna, Mexico", lat:18.5500, lon:-89.3500, pop:2000, timezone:-6},
{name:"Nicolas Bravo, Mexico", lat:18.4500, lon:-89.1000, pop:2000, timezone:-6},
{name:"Constitución, Mexico", lat:18.6000, lon:-89.0000, pop:1000, timezone:-6},
{name:"Escárcega, Mexico", lat:18.6069, lon:-90.7350, pop:30000, timezone:-6},
{name:"Champotón, Mexico", lat:19.3500, lon:-90.7167, pop:35000, timezone:-6},
{name:"Seybaplaya, Mexico", lat:19.6500, lon:-90.6833, pop:15000, timezone:-6},
{name:"Lerma, Mexico", lat:19.8000, lon:-90.6000, pop:10000, timezone:-6},
{name:"Campeche, Mexico", lat:19.8301, lon:-90.5349, pop:250000, timezone:-6},
{name:"Hecelchakán, Mexico", lat:20.1667, lon:-90.1333, pop:30000, timezone:-6},
{name:"Calkiní, Mexico", lat:20.3667, lon:-90.0500, pop:25000, timezone:-6},
{name:"Tenabo, Mexico", lat:20.0833, lon:-90.2167, pop:10000, timezone:-6},
{name:"Dzibalchen, Mexico", lat:19.4500, lon:-89.7333, pop:5000, timezone:-6},
{name:"Hopelchén, Mexico", lat:19.7500, lon:-89.8500, pop:10000, timezone:-6},
{name:"Bolonchen, Mexico", lat:20.0000, lon:-89.7500, pop:5000, timezone:-6},
{name:"Xpujil, Mexico", lat:18.5000, lon:-89.4000, pop:5000, timezone:-6},
{name:"Calakmul, Mexico", lat:18.1167, lon:-89.8000, pop:1000, timezone:-6},

// Central America secondary
{name:"San Pedro Sula, Honduras", lat:15.5042, lon:-88.0250, pop:700000, timezone:-6},
{name:"La Ceiba, Honduras", lat:15.7833, lon:-86.8000, pop:200000, timezone:-6},
{name:"Choloma, Honduras", lat:15.6167, lon:-87.9500, pop:250000, timezone:-6},
{name:"El Progreso, Honduras", lat:15.4000, lon:-87.8000, pop:150000, timezone:-6},
{name:"Comayagua, Honduras", lat:14.4500, lon:-87.6500, pop:150000, timezone:-6},
{name:"Puerto Cortés, Honduras", lat:15.8333, lon:-87.9333, pop:100000, timezone:-6},
{name:"Choluteca, Honduras", lat:13.3000, lon:-87.1833, pop:100000, timezone:-6},
{name:"Danlí, Honduras", lat:14.0333, lon:-86.5833, pop:70000, timezone:-6},
{name:"Juticalpa, Honduras", lat:14.6667, lon:-86.2167, pop:50000, timezone:-6},
{name:"Tela, Honduras", lat:15.7833, lon:-87.4500, pop:40000, timezone:-6},
{name:"Santa Rosa de Copán, Honduras", lat:14.7667, lon:-88.7833, pop:50000, timezone:-6},
{name:"Ocotepeque, Honduras", lat:14.4333, lon:-89.1833, pop:20000, timezone:-6},
{name:"Gracias, Honduras", lat:14.5833, lon:-88.5833, pop:15000, timezone:-6},
{name:"La Esperanza, Honduras", lat:14.3000, lon:-88.1833, pop:15000, timezone:-6},
{name:"Yoro, Honduras", lat:15.1333, lon:-87.1333, pop:30000, timezone:-6},
{name:"Olanchito, Honduras", lat:15.4833, lon:-86.5667, pop:30000, timezone:-6},
{name:"Trujillo, Honduras", lat:15.9167, lon:-85.9500, pop:20000, timezone:-6},
{name:"Tocoa, Honduras", lat:15.6833, lon:-86.0000, pop:40000, timezone:-6},
{name:"Catacamas, Honduras", lat:14.8000, lon:-85.9000, pop:40000, timezone:-6},
{name:"Santa Bárbara, Honduras", lat:14.9167, lon:-88.2333, pop:30000, timezone:-6},
{name:"San Pedro Sula, Honduras", lat:15.5042, lon:-88.0250, pop:700000, timezone:-6},

{name:"Santa Ana, El Salvador", lat:13.9944, lon:-89.5597, pop:250000, timezone:-6},
{name:"San Miguel, El Salvador", lat:13.4833, lon:-88.1833, pop:250000, timezone:-6},
{name:"Santa Tecla, El Salvador", lat:13.6769, lon:-89.2797, pop:150000, timezone:-6},
{name:"Mejicanos, El Salvador", lat:13.7400, lon:-89.2100, pop:150000, timezone:-6},
{name:"Soyapango, El Salvador", lat:13.7100, lon:-89.1500, pop:250000, timezone:-6},
{name:"Apopa, El Salvador", lat:13.8000, lon:-89.1800, pop:150000, timezone:-6},
{name:"Delgado, El Salvador", lat:13.7200, lon:-89.1700, pop:100000, timezone:-6},
{name:"Ilopango, El Salvador", lat:13.7000, lon:-89.1100, pop:100000, timezone:-6},
{name:"Tonacatepeque, El Salvador", lat:13.7800, lon:-89.1200, pop:100000, timezone:-6},
{name:"Cuscatancingo, El Salvador", lat:13.7300, lon:-89.1800, pop:80000, timezone:-6},
{name:"San Martín, El Salvador", lat:13.7400, lon:-89.0600, pop:80000, timezone:-6},
{name:"Ahuachapán, El Salvador", lat:13.9214, lon:-89.8450, pop:100000, timezone:-6},
{name:"Sonsonate, El Salvador", lat:13.7189, lon:-89.7228, pop:70000, timezone:-6},
{name:"Chalatenango, El Salvador", lat:14.0333, lon:-88.9333, pop:30000, timezone:-6},
{name:"Cojutepeque, El Salvador", lat:13.7167, lon:-88.9333, pop:50000, timezone:-6},
{name:"Zacatecoluca, El Salvador", lat:13.5000, lon:-88.8667, pop:50000, timezone:-6},
{name:"Usulután, El Salvador", lat:13.3500, lon:-88.4500, pop:70000, timezone:-6},
{name:"Santiago de María, El Salvador", lat:13.4833, lon:-88.2833, pop:20000, timezone:-6},
{name:"Berlin, El Salvador", lat:13.5000, lon:-88.5333, pop:15000, timezone:-6},
{name:"Jiquilisco, El Salvador", lat:13.3167, lon:-88.5833, pop:15000, timezone:-6},

{name:"León, Nicaragua", lat:12.4356, lon:-86.8794, pop:200000, timezone:-6},
{name:"Granada, Nicaragua", lat:11.9344, lon:-85.9561, pop:150000, timezone:-6},
{name:"Masaya, Nicaragua", lat:11.9744, lon:-86.0942, pop:150000, timezone:-6},
{name:"Chinandega, Nicaragua", lat:12.6292, lon:-87.1311, pop:150000, timezone:-6},
{name:"Estelí, Nicaragua", lat:13.0919, lon:-86.3536, pop:120000, timezone:-6},
{name:"Matagalpa, Nicaragua", lat:12.9256, lon:-85.9172, pop:150000, timezone:-6},
{name:"Jinotega, Nicaragua", lat:13.0917, lon:-86.0017, pop:100000, timezone:-6},
{name:"Juigalpa, Nicaragua", lat:12.1000, lon:-85.3667, pop:70000, timezone:-6},
{name:"Boaco, Nicaragua", lat:12.4667, lon:-85.6667, pop:50000, timezone:-6},
{name:"Rivas, Nicaragua", lat:11.4372, lon:-85.8261, pop:40000, timezone:-6},
{name:"Bluefields, Nicaragua", lat:12.0000, lon:-83.7667, pop:50000, timezone:-6},
{name:"Puerto Cabezas, Nicaragua", lat:14.0333, lon:-83.3833, pop:50000, timezone:-6},
{name:"Ocotal, Nicaragua", lat:13.6333, lon:-86.4833, pop:40000, timezone:-6},
{name:"Somoto, Nicaragua", lat:13.4833, lon:-86.5833, pop:30000, timezone:-6},
{name:"Jinotepe, Nicaragua", lat:11.8500, lon:-86.2000, pop:50000, timezone:-6},
{name:"Diriamba, Nicaragua", lat:11.8500, lon:-86.2333, pop:40000, timezone:-6},
{name:"San Marcos, Nicaragua", lat:11.9000, lon:-86.2000, pop:30000, timezone:-6},
{name:"Nagarote, Nicaragua", lat:12.2667, lon:-86.5667, pop:30000, timezone:-6},
{name:"La Paz Centro, Nicaragua", lat:12.3500, lon:-86.6833, pop:30000, timezone:-6},
{name:"El Viejo, Nicaragua", lat:12.6667, lon:-87.1667, pop:40000, timezone:-6},

{name:"Alajuela, Costa Rica", lat:10.0162, lon:-84.2116, pop:300000, timezone:-6},
{name:"Cartago, Costa Rica", lat:9.8644, lon:-83.9194, pop:150000, timezone:-6},
{name:"Heredia, Costa Rica", lat:9.9985, lon:-84.1165, pop:150000, timezone:-6},
{name:"Liberia, Costa Rica", lat:10.6349, lon:-85.4377, pop:70000, timezone:-6},
{name:"Puntarenas, Costa Rica", lat:9.9763, lon:-84.8384, pop:100000, timezone:-6},
{name:"Limón, Costa Rica", lat:9.9907, lon:-83.0360, pop:100000, timezone:-6},
{name:"San Isidro, Costa Rica", lat:9.3667, lon:-83.7000, pop:50000, timezone:-6},
{name:"Quepos, Costa Rica", lat:9.4316, lon:-84.1611, pop:20000, timezone:-6},
{name:"Jacó, Costa Rica", lat:9.6149, lon:-84.6298, pop:15000, timezone:-6},
{name:"Tamarindo, Costa Rica", lat:10.2993, lon:-85.8371, pop:10000, timezone:-6},
{name:"Nosara, Costa Rica", lat:9.9800, lon:-85.6500, pop:5000, timezone:-6},
{name:"Samara, Costa Rica", lat:9.8833, lon:-85.5167, pop:5000, timezone:-6},
{name:"Monteverde, Costa Rica", lat:10.3000, lon:-84.8167, pop:5000, timezone:-6},
{name:"La Fortuna, Costa Rica", lat:10.4667, lon:-84.6500, pop:15000, timezone:-6},
{name:"Puerto Viejo, Costa Rica", lat:9.6550, lon:-82.7530, pop:5000, timezone:-6},
{name:"Cahuita, Costa Rica", lat:9.7333, lon:-82.8333, pop:3000, timezone:-6},
{name:"Tortuguero, Costa Rica", lat:10.5333, lon:-83.5167, pop:2000, timezone:-6},
{name:"Golfito, Costa Rica", lat:8.6500, lon:-83.1500, pop:10000, timezone:-6},
{name:"Palmar Norte, Costa Rica", lat:8.9500, lon:-83.4500, pop:10000, timezone:-6},
{name:"Ciudad Neily, Costa Rica", lat:8.6500, lon:-82.9500, pop:15000, timezone:-6},

{name:"Colón, Panama", lat:9.3547, lon:-79.9014, pop:200000, timezone:-5},
{name:"David, Panama", lat:8.4333, lon:-82.4333, pop:150000, timezone:-5},
{name:"Santiago, Panama", lat:8.1000, lon:-80.9833, pop:100000, timezone:-5},
{name:"Chitré, Panama", lat:7.9667, lon:-80.4333, pop:50000, timezone:-5},
{name:"Las Tablas, Panama", lat:7.7667, lon:-80.2833, pop:30000, timezone:-5},
{name:"Penonomé, Panama", lat:8.5167, lon:-80.3500, pop:30000, timezone:-5},
{name:"Aguadulce, Panama", lat:8.2500, lon:-80.5500, pop:20000, timezone:-5},
{name:"La Chorrera, Panama", lat:8.8833, lon:-79.7833, pop:100000, timezone:-5},
{name:"Arraiján, Panama", lat:8.9500, lon:-79.6500, pop:100000, timezone:-5},
{name:"Tocumen, Panama", lat:9.0833, lon:-79.3833, pop:100000, timezone:-5},
{name:"Pacora, Panama", lat:9.0833, lon:-79.2833, pop:50000, timezone:-5},
{name:"Chepo, Panama", lat:9.1667, lon:-79.1000, pop:30000, timezone:-5},
{name:"La Palma, Panama", lat:8.4000, lon:-78.1500, pop:5000, timezone:-5},
{name:"El Real, Panama", lat:8.1000, lon:-77.7333, pop:2000, timezone:-5},
{name:"Yaviza, Panama", lat:8.1500, lon:-77.7000, pop:5000, timezone:-5},
{name:"Metetí, Panama", lat:8.5000, lon:-78.0000, pop:10000, timezone:-5},
{name:"Puerto Armuelles, Panama", lat:8.2833, lon:-82.8667, pop:20000, timezone:-5},
{name:"Boquete, Panama", lat:8.7833, lon:-82.4333, pop:20000, timezone:-5},
{name:"Volcán, Panama", lat:8.7833, lon:-82.6333, pop:15000, timezone:-5},
{name:"Cerro Punta, Panama", lat:8.8500, lon:-82.5833, pop:10000, timezone:-5},
{name:"Glendale, USA", lat:33.5387, lon:-112.1860, pop:250000, timezone:-7},
{name:"Hialeah, USA", lat:25.8576, lon:-80.2781, pop:230000, timezone:-5},
{name:"Reno, USA", lat:39.5296, lon:-119.8138, pop:250000, timezone:-8},
{name:"Cleveland, USA", lat:41.4993, lon:-81.6944, pop:2000000, timezone:-5},
{name:"Pittsburgh, USA", lat:40.4406, lon:-79.9959, pop:2300000, timezone:-5},
{name:"Columbus, USA", lat:39.9612, lon:-82.9988, pop:2100000, timezone:-5},
{name:"Indianapolis, USA", lat:39.7684, lon:-86.1581, pop:2100000, timezone:-5},
{name:"Nashville, USA", lat:36.1627, lon:-86.7816, pop:2000000, timezone:-6},

/* --- CANADA --- */
{name:"Montreal, Canada", lat:45.5017, lon:-73.5673, pop:4300000, timezone:-5},
{name:"Calgary, Canada", lat:51.0447, lon:-114.0719, pop:1600000, timezone:-7},
{name:"Ottawa, Canada", lat:45.4215, lon:-75.6972, pop:1400000, timezone:-5},
{name:"Edmonton, Canada", lat:53.5461, lon:-113.4938, pop:1400000, timezone:-7},
{name:"Quebec City, Canada", lat:46.8139, lon:-71.2080, pop:800000, timezone:-5},
{name:"Winnipeg, Canada", lat:49.8951, lon:-97.1384, pop:800000, timezone:-6},
{name:"Halifax, Canada", lat:44.6488, lon:-63.5752, pop:450000, timezone:-4},

/* --- MEXICO --- */
{name:"Guadalajara, Mexico", lat:20.6597, lon:-103.3496, pop:5500000, timezone:-6},
{name:"Monterrey, Mexico", lat:25.6866, lon:-100.3161, pop:5400000, timezone:-6},

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

{name:"Montevideo, Uruguay", lat:-34.9011, lon:-56.1645, pop:1700000, timezone:-3},

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
{name:"Ciudad del Este, Paraguay", lat:-25.5097, lon:-54.6112, pop:300000, timezone:-4},
{name:"Salto, Uruguay", lat:-31.3833, lon:-57.9667, pop:100000, timezone:-3},
{name:"Rosario, Argentina", lat:-32.9442, lon:-60.6505, pop:1300000, timezone:-3},
{name:"Córdoba, Argentina", lat:-31.4201, lon:-64.1888, pop:1500000, timezone:-3},
{name:"Mendoza, Argentina", lat:-32.8895, lon:-68.8458, pop:1200000, timezone:-3},
{name:"Tucumán, Argentina", lat:-26.8083, lon:-65.2176, pop:900000, timezone:-3},
{name:"La Plata, Argentina", lat:-34.9215, lon:-57.9545, pop:900000, timezone:-3},
{name:"Mar del Plata, Argentina", lat:-38.0055, lon:-57.5426, pop:700000, timezone:-3},
{name:"Salta, Argentina", lat:-24.7821, lon:-65.4232, pop:700000, timezone:-3},
{name:"Santa Fe, Argentina", lat:-31.6333, lon:-60.7000, pop:500000, timezone:-3},
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
/* =========================
   🌎 SOUTH AMERICA – DIVERSE SECONDARY CITIES
========================= */

// Brazil secondary (spread, not just the big ones)
{name:"Manaus, Brazil", lat:-3.1190, lon:-60.0217, pop:2200000, timezone:-4},
{name:"Belém, Brazil", lat:-1.4558, lon:-48.4902, pop:2500000, timezone:-3},
{name:"Goiânia, Brazil", lat:-16.6869, lon:-49.2648, pop:2500000, timezone:-3},
{name:"Campinas, Brazil", lat:-22.9056, lon:-47.0608, pop:1200000, timezone:-3},
{name:"São Luís, Brazil", lat:-2.5387, lon:-44.2825, pop:1100000, timezone:-3},
{name:"Maceió, Brazil", lat:-9.6658, lon:-35.7350, pop:1000000, timezone:-3},
{name:"Natal, Brazil", lat:-5.7945, lon:-35.2110, pop:900000, timezone:-3},
{name:"Teresina, Brazil", lat:-5.0892, lon:-42.8019, pop:900000, timezone:-3},
{name:"Campo Grande, Brazil", lat:-20.4697, lon:-54.6201, pop:900000, timezone:-4},
{name:"João Pessoa, Brazil", lat:-7.1195, lon:-34.8450, pop:800000, timezone:-3},
{name:"Aracaju, Brazil", lat:-10.9472, lon:-37.0731, pop:600000, timezone:-3},
{name:"Cuiabá, Brazil", lat:-15.6010, lon:-56.0974, pop:600000, timezone:-4},
{name:"Joinville, Brazil", lat:-26.3045, lon:-48.8487, pop:600000, timezone:-3},
{name:"Londrina, Brazil", lat:-23.3045, lon:-51.1696, pop:500000, timezone:-3},
{name:"Florianópolis, Brazil", lat:-27.5954, lon:-48.5480, pop:500000, timezone:-3},
{name:"Vitória, Brazil", lat:-20.3155, lon:-40.3128, pop:350000, timezone:-3},
{name:"Uberlândia, Brazil", lat:-18.9186, lon:-48.2772, pop:700000, timezone:-3},
{name:"Ribeirão Preto, Brazil", lat:-21.1775, lon:-47.8103, pop:700000, timezone:-3},
{name:"Sorocaba, Brazil", lat:-23.5015, lon:-47.4526, pop:700000, timezone:-3},
{name:"Santos, Brazil", lat:-23.9608, lon:-46.3336, pop:430000, timezone:-3},
{name:"Juiz de Fora, Brazil", lat:-21.7642, lon:-43.3503, pop:500000, timezone:-3},
{name:"Feira de Santana, Brazil", lat:-12.2664, lon:-38.9663, pop:600000, timezone:-3},
{name:"Cascavel, Brazil", lat:-24.9578, lon:-53.4595, pop:300000, timezone:-3},
{name:"Maringá, Brazil", lat:-23.4205, lon:-51.9333, pop:400000, timezone:-3},
{name:"Ponta Grossa, Brazil", lat:-25.0916, lon:-50.1668, pop:350000, timezone:-3},
{name:"Blumenau, Brazil", lat:-26.9194, lon:-49.0661, pop:350000, timezone:-3},
{name:"Caxias do Sul, Brazil", lat:-29.1685, lon:-51.1794, pop:500000, timezone:-3},
{name:"Pelotas, Brazil", lat:-31.7654, lon:-52.3376, pop:340000, timezone:-3},
{name:"Canoas, Brazil", lat:-29.9178, lon:-51.1836, pop:340000, timezone:-3},
{name:"Novo Hamburgo, Brazil", lat:-29.6783, lon:-51.1306, pop:240000, timezone:-3},
{name:"São José dos Campos, Brazil", lat:-23.1791, lon:-45.8872, pop:700000, timezone:-3},
{name:"Jundiaí, Brazil", lat:-23.1864, lon:-46.8842, pop:400000, timezone:-3},
{name:"Piracicaba, Brazil", lat:-22.7253, lon:-47.6492, pop:400000, timezone:-3},
{name:"Bauru, Brazil", lat:-22.3147, lon:-49.0608, pop:370000, timezone:-3},
{name:"Franca, Brazil", lat:-20.5386, lon:-47.4008, pop:350000, timezone:-3},
{name:"São José do Rio Preto, Brazil", lat:-20.8113, lon:-49.3758, pop:500000, timezone:-3},
{name:"Limeira, Brazil", lat:-22.5647, lon:-47.4017, pop:300000, timezone:-3},
{name:"Taubaté, Brazil", lat:-23.0264, lon:-45.5553, pop:300000, timezone:-3},
{name:"Guarujá, Brazil", lat:-23.9931, lon:-46.2564, pop:300000, timezone:-3},
{name:"Praia Grande, Brazil", lat:-24.0058, lon:-46.4028, pop:300000, timezone:-3},
{name:"São Vicente, Brazil", lat:-23.9631, lon:-46.3919, pop:350000, timezone:-3},
{name:"Caruaru, Brazil", lat:-8.2833, lon:-35.9761, pop:350000, timezone:-3},
{name:"Petrolina, Brazil", lat:-9.3986, lon:-40.5008, pop:350000, timezone:-3},
{name:"Campina Grande, Brazil", lat:-7.2306, lon:-35.8811, pop:400000, timezone:-3},
{name:"Olinda, Brazil", lat:-8.0089, lon:-34.8553, pop:400000, timezone:-3},
{name:"Paulista, Brazil", lat:-7.9408, lon:-34.8731, pop:300000, timezone:-3},
{name:"Jaboatão dos Guararapes, Brazil", lat:-8.1128, lon:-35.0150, pop:700000, timezone:-3},
{name:"Caucaia, Brazil", lat:-3.7361, lon:-38.6531, pop:350000, timezone:-3},
{name:"Maracanaú, Brazil", lat:-3.8767, lon:-38.6256, pop:220000, timezone:-3},
{name:"Sobral, Brazil", lat:-3.6892, lon:-40.3481, pop:200000, timezone:-3},
{name:"Juazeiro do Norte, Brazil", lat:-7.2131, lon:-39.3153, pop:270000, timezone:-3},
{name:"Crato, Brazil", lat:-7.2342, lon:-39.4094, pop:130000, timezone:-3},
{name:"Mossoró, Brazil", lat:-5.1875, lon:-37.3442, pop:300000, timezone:-3},
{name:"Parnamirim, Brazil", lat:-5.9156, lon:-35.2628, pop:250000, timezone:-3},
{name:"Arapiraca, Brazil", lat:-9.7525, lon:-36.6611, pop:230000, timezone:-3},
{name:"Palmas, Brazil", lat:-10.1840, lon:-48.3336, pop:300000, timezone:-3},
{name:"Porto Velho, Brazil", lat:-8.7612, lon:-63.9004, pop:500000, timezone:-4},
{name:"Rio Branco, Brazil", lat:-9.9754, lon:-67.8249, pop:400000, timezone:-5},
{name:"Boa Vista, Brazil", lat:2.8195, lon:-60.6714, pop:400000, timezone:-4},
{name:"Macapá, Brazil", lat:0.0349, lon:-51.0694, pop:500000, timezone:-3},
{name:"Santana, Brazil", lat:-0.0583, lon:-51.1817, pop:100000, timezone:-3},

// Argentina secondary
{name:"Córdoba, Argentina", lat:-31.4201, lon:-64.1888, pop:1500000, timezone:-3},
{name:"Rosario, Argentina", lat:-32.9442, lon:-60.6505, pop:1300000, timezone:-3},
{name:"Mendoza, Argentina", lat:-32.8895, lon:-68.8458, pop:1200000, timezone:-3},
{name:"Tucumán, Argentina", lat:-26.8083, lon:-65.2176, pop:900000, timezone:-3},
{name:"La Plata, Argentina", lat:-34.9215, lon:-57.9545, pop:900000, timezone:-3},
{name:"Mar del Plata, Argentina", lat:-38.0055, lon:-57.5426, pop:700000, timezone:-3},
{name:"Salta, Argentina", lat:-24.7821, lon:-65.4232, pop:700000, timezone:-3},
{name:"Santa Fe, Argentina", lat:-31.6333, lon:-60.7000, pop:500000, timezone:-3},
{name:"San Juan, Argentina", lat:-31.5375, lon:-68.5364, pop:500000, timezone:-3},
{name:"Resistencia, Argentina", lat:-27.4514, lon:-58.9867, pop:400000, timezone:-3},
{name:"Corrientes, Argentina", lat:-27.4806, lon:-58.8341, pop:350000, timezone:-3},
{name:"Posadas, Argentina", lat:-27.3671, lon:-55.8961, pop:350000, timezone:-3},
{name:"Neuquén, Argentina", lat:-38.9516, lon:-68.0591, pop:350000, timezone:-3},
{name:"Bahía Blanca, Argentina", lat:-38.7183, lon:-62.2663, pop:300000, timezone:-3},
{name:"San Salvador de Jujuy, Argentina", lat:-24.1858, lon:-65.2995, pop:300000, timezone:-3},
{name:"Paraná, Argentina", lat:-31.7319, lon:-60.5297, pop:250000, timezone:-3},
{name:"Formosa, Argentina", lat:-26.1847, lon:-58.1731, pop:250000, timezone:-3},
{name:"San Luis, Argentina", lat:-33.3017, lon:-66.3378, pop:200000, timezone:-3},
{name:"Catamarca, Argentina", lat:-28.4696, lon:-65.7852, pop:200000, timezone:-3},
{name:"La Rioja, Argentina", lat:-29.4131, lon:-66.8563, pop:180000, timezone:-3},
{name:"Santiago del Estero, Argentina", lat:-27.7951, lon:-64.2615, pop:300000, timezone:-3},
{name:"Río Cuarto, Argentina", lat:-33.1307, lon:-64.3499, pop:160000, timezone:-3},
{name:"Comodoro Rivadavia, Argentina", lat:-45.8641, lon:-67.4966, pop:180000, timezone:-3},
{name:"San Rafael, Argentina", lat:-34.6177, lon:-68.3301, pop:120000, timezone:-3},
{name:"Tandil, Argentina", lat:-37.3217, lon:-59.1332, pop:130000, timezone:-3},
{name:"Villa María, Argentina", lat:-32.4075, lon:-63.2402, pop:100000, timezone:-3},
{name:"Concordia, Argentina", lat:-31.3929, lon:-58.0169, pop:150000, timezone:-3},
{name:"Gualeguaychú, Argentina", lat:-33.0094, lon:-58.5172, pop:100000, timezone:-3},
{name:"Rafaela, Argentina", lat:-31.2503, lon:-61.4867, pop:100000, timezone:-3},
{name:"Venado Tuerto, Argentina", lat:-33.7456, lon:-61.9688, pop:80000, timezone:-3},

// Chile secondary
{name:"Valparaíso, Chile", lat:-33.0472, lon:-71.6127, pop:900000, timezone:-4},
{name:"Concepción, Chile", lat:-36.8201, lon:-73.0444, pop:1000000, timezone:-4},
{name:"Antofagasta, Chile", lat:-23.6509, lon:-70.3975, pop:400000, timezone:-4},
{name:"Viña del Mar, Chile", lat:-33.0245, lon:-71.5518, pop:300000, timezone:-4},
{name:"Temuco, Chile", lat:-38.7359, lon:-72.5904, pop:300000, timezone:-4},
{name:"Iquique, Chile", lat:-20.2307, lon:-70.1356, pop:200000, timezone:-4},
{name:"Puerto Montt, Chile", lat:-41.4693, lon:-72.9424, pop:250000, timezone:-4},
{name:"La Serena, Chile", lat:-29.9027, lon:-71.2520, pop:200000, timezone:-4},
{name:"Rancagua, Chile", lat:-34.1708, lon:-70.7444, pop:240000, timezone:-4},
{name:"Talca, Chile", lat:-35.4264, lon:-71.6554, pop:230000, timezone:-4},
{name:"Arica, Chile", lat:-18.4783, lon:-70.3126, pop:220000, timezone:-4},
{name:"Chillán, Chile", lat:-36.6066, lon:-72.1034, pop:180000, timezone:-4},
{name:"Osorno, Chile", lat:-40.5739, lon:-73.1319, pop:160000, timezone:-4},
{name:"Valdivia, Chile", lat:-39.8196, lon:-73.2452, pop:160000, timezone:-4},
{name:"Punta Arenas, Chile", lat:-53.1638, lon:-70.9171, pop:130000, timezone:-3},
{name:"Coyhaique, Chile", lat:-45.5752, lon:-72.0662, pop:60000, timezone:-3},
{name:"Calama, Chile", lat:-22.4567, lon:-68.9237, pop:160000, timezone:-4},
{name:"Copiapó, Chile", lat:-27.3668, lon:-70.3322, pop:160000, timezone:-4},
{name:"Curicó, Chile", lat:-34.9828, lon:-71.2394, pop:150000, timezone:-4},
{name:"Los Ángeles, Chile", lat:-37.4697, lon:-72.3535, pop:180000, timezone:-4},

// Colombia secondary
{name:"Barranquilla, Colombia", lat:10.9685, lon:-74.7813, pop:2300000, timezone:-5},
{name:"Cartagena, Colombia", lat:10.3910, lon:-75.4794, pop:1100000, timezone:-5},
{name:"Cúcuta, Colombia", lat:7.8891, lon:-72.4967, pop:800000, timezone:-5},
{name:"Bucaramanga, Colombia", lat:7.1254, lon:-73.1198, pop:1300000, timezone:-5},
{name:"Pereira, Colombia", lat:4.8133, lon:-75.6961, pop:700000, timezone:-5},
{name:"Ibagué, Colombia", lat:4.4389, lon:-75.2322, pop:600000, timezone:-5},
{name:"Manizales, Colombia", lat:5.0689, lon:-75.5174, pop:500000, timezone:-5},
{name:"Santa Marta, Colombia", lat:11.2408, lon:-74.1990, pop:500000, timezone:-5},
{name:"Villavicencio, Colombia", lat:4.1420, lon:-73.6266, pop:500000, timezone:-5},
{name:"Pasto, Colombia", lat:1.2136, lon:-77.2811, pop:450000, timezone:-5},
{name:"Montería, Colombia", lat:8.7479, lon:-75.8814, pop:450000, timezone:-5},
{name:"Valledupar, Colombia", lat:10.4631, lon:-73.2532, pop:450000, timezone:-5},
{name:"Neiva, Colombia", lat:2.9273, lon:-75.2819, pop:350000, timezone:-5},
{name:"Armenia, Colombia", lat:4.5339, lon:-75.6811, pop:300000, timezone:-5},
{name:"Sincelejo, Colombia", lat:9.3047, lon:-75.3978, pop:300000, timezone:-5},
{name:"Popayán, Colombia", lat:2.4419, lon:-76.6063, pop:280000, timezone:-5},
{name:"Tunja, Colombia", lat:5.5353, lon:-73.3678, pop:200000, timezone:-5},
{name:"Florencia, Colombia", lat:1.6144, lon:-75.6062, pop:170000, timezone:-5},
{name:"Riohacha, Colombia", lat:11.5444, lon:-72.9072, pop:200000, timezone:-5},
{name:"Quibdó, Colombia", lat:5.6947, lon:-76.6611, pop:130000, timezone:-5},
{name:"Arauca, Colombia", lat:7.0903, lon:-70.7591, pop:90000, timezone:-5},
{name:"Yopal, Colombia", lat:5.3378, lon:-72.3959, pop:150000, timezone:-5},
{name:"Mocoa, Colombia", lat:1.1528, lon:-76.6511, pop:50000, timezone:-5},
{name:"San José del Guaviare, Colombia", lat:2.5667, lon:-72.6333, pop:50000, timezone:-5},
{name:"Mitú, Colombia", lat:1.1983, lon:-70.1733, pop:30000, timezone:-5},
{name:"Inírida, Colombia", lat:3.8653, lon:-67.9239, pop:30000, timezone:-5},
{name:"Puerto Carreño, Colombia", lat:6.1889, lon:-67.4856, pop:15000, timezone:-5},
{name:"Leticia, Colombia", lat:-4.2153, lon:-69.9406, pop:50000, timezone:-5},

// Peru secondary
{name:"Arequipa, Peru", lat:-16.4090, lon:-71.5375, pop:1000000, timezone:-5},
{name:"Trujillo, Peru", lat:-8.1116, lon:-79.0288, pop:1000000, timezone:-5},
{name:"Chiclayo, Peru", lat:-6.7714, lon:-79.8409, pop:800000, timezone:-5},
{name:"Piura, Peru", lat:-5.1945, lon:-80.6328, pop:500000, timezone:-5},
{name:"Iquitos, Peru", lat:-3.7437, lon:-73.2516, pop:500000, timezone:-5},
{name:"Cusco, Peru", lat:-13.5319, lon:-71.9673, pop:500000, timezone:-5},
{name:"Huancayo, Peru", lat:-12.0651, lon:-75.2049, pop:400000, timezone:-5},
{name:"Chimbote, Peru", lat:-9.0853, lon:-78.5783, pop:400000, timezone:-5},
{name:"Pucallpa, Peru", lat:-8.3791, lon:-74.5539, pop:300000, timezone:-5},
{name:"Tacna, Peru", lat:-18.0066, lon:-70.2463, pop:300000, timezone:-5},
{name:"Ica, Peru", lat:-14.0678, lon:-75.7286, pop:300000, timezone:-5},
{name:"Juliaca, Peru", lat:-15.5000, lon:-70.1333, pop:280000, timezone:-5},
{name:"Sullana, Peru", lat:-4.9039, lon:-80.6853, pop:200000, timezone:-5},
{name:"Chincha Alta, Peru", lat:-13.4097, lon:-76.1322, pop:200000, timezone:-5},
{name:"Ayacucho, Peru", lat:-13.1631, lon:-74.2236, pop:200000, timezone:-5},
{name:"Cajamarca, Peru", lat:-7.1638, lon:-78.5003, pop:200000, timezone:-5},
{name:"Puno, Peru", lat:-15.8402, lon:-70.0219, pop:150000, timezone:-5},
{name:"Tumbes, Peru", lat:-3.5669, lon:-80.4515, pop:120000, timezone:-5},
{name:"Huaraz, Peru", lat:-9.5278, lon:-77.5278, pop:150000, timezone:-5},
{name:"Abancay, Peru", lat:-13.6339, lon:-72.8814, pop:70000, timezone:-5},
{name:"Puerto Maldonado, Peru", lat:-12.6000, lon:-69.1833, pop:80000, timezone:-5},
{name:"Moyobamba, Peru", lat:-6.0333, lon:-76.9667, pop:50000, timezone:-5},
{name:"Tarapoto, Peru", lat:-6.4833, lon:-76.3667, pop:150000, timezone:-5},
{name:"Jaén, Peru", lat:-5.7000, lon:-78.8000, pop:80000, timezone:-5},
{name:"Chachapoyas, Peru", lat:-6.2167, lon:-77.8667, pop:30000, timezone:-5},

// Bolivia secondary
{name:"Santa Cruz, Bolivia", lat:-17.7833, lon:-63.1821, pop:2200000, timezone:-4},
{name:"Cochabamba, Bolivia", lat:-17.3895, lon:-66.1568, pop:1400000, timezone:-4},
{name:"El Alto, Bolivia", lat:-16.5000, lon:-68.1500, pop:1000000, timezone:-4},
{name:"Oruro, Bolivia", lat:-17.9833, lon:-67.1500, pop:300000, timezone:-4},
{name:"Sucre, Bolivia", lat:-19.0196, lon:-65.2619, pop:300000, timezone:-4},
{name:"Potosí, Bolivia", lat:-19.5836, lon:-65.7531, pop:200000, timezone:-4},
{name:"Tarija, Bolivia", lat:-21.5355, lon:-64.7296, pop:250000, timezone:-4},
{name:"Trinidad, Bolivia", lat:-14.8333, lon:-64.9000, pop:100000, timezone:-4},
{name:"Cobija, Bolivia", lat:-11.0264, lon:-68.7692, pop:50000, timezone:-4},
{name:"Riberalta, Bolivia", lat:-11.0069, lon:-66.0531, pop:100000, timezone:-4},
{name:"Guayaramerín, Bolivia", lat:-10.8000, lon:-65.3500, pop:40000, timezone:-4},
{name:"Yacuiba, Bolivia", lat:-22.0167, lon:-63.6833, pop:100000, timezone:-4},
{name:"Montero, Bolivia", lat:-17.3333, lon:-63.2500, pop:100000, timezone:-4},
{name:"Quillacollo, Bolivia", lat:-17.4000, lon:-66.2833, pop:150000, timezone:-4},
{name:"Sacaba, Bolivia", lat:-17.4000, lon:-66.0500, pop:150000, timezone:-4},
{name:"Viacha, Bolivia", lat:-16.6500, lon:-68.3000, pop:80000, timezone:-4},
{name:"Warnes, Bolivia", lat:-17.5000, lon:-63.1667, pop:80000, timezone:-4},
{name:"La Guardia, Bolivia", lat:-17.8833, lon:-63.3167, pop:80000, timezone:-4},
{name:"Cotoca, Bolivia", lat:-17.7500, lon:-63.0500, pop:50000, timezone:-4},
{name:"Mineros, Bolivia", lat:-17.1167, lon:-63.2333, pop:30000, timezone:-4},

// Ecuador secondary
{name:"Guayaquil, Ecuador", lat:-2.1700, lon:-79.9224, pop:3000000, timezone:-5},
{name:"Cuenca, Ecuador", lat:-2.9001, lon:-79.0059, pop:600000, timezone:-5},
{name:"Santo Domingo, Ecuador", lat:-0.2532, lon:-79.1754, pop:500000, timezone:-5},
{name:"Machala, Ecuador", lat:-3.2581, lon:-79.9554, pop:300000, timezone:-5},
{name:"Manta, Ecuador", lat:-0.9677, lon:-80.7089, pop:250000, timezone:-5},
{name:"Portoviejo, Ecuador", lat:-1.0547, lon:-80.4545, pop:250000, timezone:-5},
{name:"Ambato, Ecuador", lat:-1.2491, lon:-78.6168, pop:200000, timezone:-5},
{name:"Riobamba, Ecuador", lat:-1.6635, lon:-78.6547, pop:180000, timezone:-5},
{name:"Esmeraldas, Ecuador", lat:0.9592, lon:-79.6539, pop:180000, timezone:-5},
{name:"Ibarra, Ecuador", lat:0.3517, lon:-78.1222, pop:150000, timezone:-5},
{name:"Loja, Ecuador", lat:-3.9931, lon:-79.2042, pop:200000, timezone:-5},
{name:"Quevedo, Ecuador", lat:-1.0286, lon:-79.4635, pop:180000, timezone:-5},
{name:"Milagro, Ecuador", lat:-2.1342, lon:-79.5942, pop:150000, timezone:-5},
{name:"Babahoyo, Ecuador", lat:-1.8022, lon:-79.5344, pop:100000, timezone:-5},
{name:"Latacunga, Ecuador", lat:-0.9352, lon:-78.6158, pop:100000, timezone:-5},
{name:"Tulcán, Ecuador", lat:0.8117, lon:-77.7172, pop:70000, timezone:-5},
{name:"Nueva Loja, Ecuador", lat:0.0847, lon:-76.8828, pop:50000, timezone:-5},
{name:"Tena, Ecuador", lat:-0.9931, lon:-77.8128, pop:30000, timezone:-5},
{name:"Puyo, Ecuador", lat:-1.4833, lon:-78.0000, pop:40000, timezone:-5},
{name:"Macas, Ecuador", lat:-2.3167, lon:-78.1167, pop:20000, timezone:-5},
{name:"Zamora, Ecuador", lat:-4.0692, lon:-78.9567, pop:15000, timezone:-5},
{name:"Guaranda, Ecuador", lat:-1.6000, lon:-79.0000, pop:30000, timezone:-5},
{name:"Azogues, Ecuador", lat:-2.7333, lon:-78.8333, pop:40000, timezone:-5},
{name:"Cotacachi, Ecuador", lat:0.3000, lon:-78.2667, pop:15000, timezone:-5},
{name:"Otavalo, Ecuador", lat:0.2333, lon:-78.2667, pop:50000, timezone:-5},

// Venezuela secondary
{name:"Maracaibo, Venezuela", lat:10.6427, lon:-71.6125, pop:2500000, timezone:-4},
{name:"Valencia, Venezuela", lat:10.1621, lon:-68.0077, pop:1800000, timezone:-4},
{name:"Barquisimeto, Venezuela", lat:10.0647, lon:-69.3570, pop:1200000, timezone:-4},
{name:"Maracay, Venezuela", lat:10.2469, lon:-67.5958, pop:1200000, timezone:-4},
{name:"Ciudad Guayana, Venezuela", lat:8.3533, lon:-62.6410, pop:1000000, timezone:-4},
{name:"Barcelona, Venezuela", lat:10.1360, lon:-64.6862, pop:500000, timezone:-4},
{name:"Maturín, Venezuela", lat:9.7457, lon:-63.1832, pop:500000, timezone:-4},
{name:"San Cristóbal, Venezuela", lat:7.7669, lon:-72.2250, pop:400000, timezone:-4},
{name:"Ciudad Bolívar, Venezuela", lat:8.1292, lon:-63.5409, pop:400000, timezone:-4},
{name:"Cumaná, Venezuela", lat:10.4635, lon:-64.1775, pop:400000, timezone:-4},
{name:"Mérida, Venezuela", lat:8.5897, lon:-71.1561, pop:300000, timezone:-4},
{name:"Cabimas, Venezuela", lat:10.4019, lon:-71.4461, pop:300000, timezone:-4},
{name:"Barinas, Venezuela", lat:8.6226, lon:-70.2075, pop:300000, timezone:-4},
{name:"Los Teques, Venezuela", lat:10.3445, lon:-67.0430, pop:200000, timezone:-4},
{name:"Guarenas, Venezuela", lat:10.4703, lon:-66.6064, pop:200000, timezone:-4},
{name:"Guatire, Venezuela", lat:10.4717, lon:-66.5406, pop:200000, timezone:-4},
{name:"Puerto La Cruz, Venezuela", lat:10.2167, lon:-64.6167, pop:200000, timezone:-4},
{name:"Punto Fijo, Venezuela", lat:11.6956, lon:-70.1994, pop:250000, timezone:-4},
{name:"Coro, Venezuela", lat:11.4048, lon:-69.6734, pop:200000, timezone:-4},
{name:"Valera, Venezuela", lat:9.3178, lon:-70.6036, pop:150000, timezone:-4},
{name:"Acarigua, Venezuela", lat:9.5597, lon:-69.1956, pop:150000, timezone:-4},
{name:"El Tigre, Venezuela", lat:8.8872, lon:-64.2514, pop:150000, timezone:-4},
{name:"Guanare, Venezuela", lat:9.0419, lon:-69.7489, pop:150000, timezone:-4},
{name:"Calabozo, Venezuela", lat:8.9242, lon:-67.4292, pop:130000, timezone:-4},
{name:"San Felipe, Venezuela", lat:10.3392, lon:-68.7425, pop:100000, timezone:-4},
{name:"La Victoria, Venezuela", lat:10.2278, lon:-67.3314, pop:100000, timezone:-4},
{name:"Cagua, Venezuela", lat:10.1869, lon:-67.4600, pop:100000, timezone:-4},
{name:"Turmero, Venezuela", lat:10.2283, lon:-67.4892, pop:150000, timezone:-4},
{name:"Maracay, Venezuela", lat:10.2469, lon:-67.5958, pop:1200000, timezone:-4},
{name:"San Juan de los Morros, Venezuela", lat:9.9111, lon:-67.3536, pop:100000, timezone:-4},
{name:"Zaraza, Venezuela", lat:9.3503, lon:-65.3247, pop:80000, timezone:-4},
{name:"Upata, Venezuela", lat:8.0086, lon:-62.3986, pop:80000, timezone:-4},
{name:"Tucupita, Venezuela", lat:9.0583, lon:-62.0500, pop:80000, timezone:-4},
{name:"Puerto Ayacucho, Venezuela", lat:5.6639, lon:-67.6236, pop:80000, timezone:-4},
{name:"San Fernando de Apure, Venezuela", lat:7.8878, lon:-67.4725, pop:150000, timezone:-4},

// Paraguay + Uruguay + Guyana + Suriname + French Guiana
{name:"Ciudad del Este, Paraguay", lat:-25.5097, lon:-54.6112, pop:300000, timezone:-4},
{name:"Encarnación, Paraguay", lat:-27.3306, lon:-55.8667, pop:150000, timezone:-4},
{name:"Pedro Juan Caballero, Paraguay", lat:-22.5472, lon:-55.7333, pop:100000, timezone:-4},
{name:"Coronel Oviedo, Paraguay", lat:-25.4444, lon:-56.4400, pop:100000, timezone:-4},
{name:"Caaguazú, Paraguay", lat:-25.4500, lon:-56.0167, pop:100000, timezone:-4},
{name:"Villarrica, Paraguay", lat:-25.7500, lon:-56.4333, pop:70000, timezone:-4},
{name:"Concepción, Paraguay", lat:-23.4064, lon:-57.4344, pop:70000, timezone:-4},
{name:"Pilar, Paraguay", lat:-26.8667, lon:-58.3000, pop:40000, timezone:-4},
{name:"Filadelfia, Paraguay", lat:-22.3500, lon:-60.0333, pop:20000, timezone:-4},
{name:"Salto, Uruguay", lat:-31.3833, lon:-57.9667, pop:100000, timezone:-3},
{name:"Paysandú, Uruguay", lat:-32.3214, lon:-58.0756, pop:100000, timezone:-3},
{name:"Rivera, Uruguay", lat:-30.9053, lon:-55.5508, pop:70000, timezone:-3},
{name:"Maldonado, Uruguay", lat:-34.9000, lon:-54.9500, pop:100000, timezone:-3},
{name:"Tacuarembó, Uruguay", lat:-31.7333, lon:-55.9833, pop:50000, timezone:-3},
{name:"Mercedes, Uruguay", lat:-33.2500, lon:-58.0333, pop:40000, timezone:-3},
{name:"Minas, Uruguay", lat:-34.3667, lon:-55.2333, pop:40000, timezone:-3},
{name:"Durazno, Uruguay", lat:-33.3806, lon:-56.5236, pop:35000, timezone:-3},
{name:"Florida, Uruguay", lat:-34.1000, lon:-56.2167, pop:35000, timezone:-3},
{name:"Treinta y Tres, Uruguay", lat:-33.2333, lon:-54.3833, pop:25000, timezone:-3},
{name:"Rocha, Uruguay", lat:-34.4833, lon:-54.3333, pop:25000, timezone:-3},
{name:"Artigas, Uruguay", lat:-30.4000, lon:-56.4667, pop:40000, timezone:-3},
{name:"Georgetown, Guyana", lat:6.8013, lon:-58.1551, pop:200000, timezone:-4},
{name:"Linden, Guyana", lat:6.0000, lon:-58.3000, pop:30000, timezone:-4},
{name:"New Amsterdam, Guyana", lat:6.2500, lon:-57.5167, pop:20000, timezone:-4},
{name:"Bartica, Guyana", lat:6.4000, lon:-58.6167, pop:15000, timezone:-4},
{name:"Lethem, Guyana", lat:3.3833, lon:-59.8000, pop:5000, timezone:-4},
{name:"Paramaribo, Suriname", lat:5.8520, lon:-55.2038, pop:250000, timezone:-3},
{name:"Lelydorp, Suriname", lat:5.7000, lon:-55.2333, pop:20000, timezone:-3},
{name:"Nieuw Nickerie, Suriname", lat:5.9500, lon:-56.9833, pop:15000, timezone:-3},
{name:"Moengo, Suriname", lat:5.6167, lon:-54.4000, pop:10000, timezone:-3},
{name:"Albina, Suriname", lat:5.5000, lon:-54.0500, pop:5000, timezone:-3},
{name:"Cayenne, French Guiana", lat:4.9224, lon:-52.3135, pop:60000, timezone:-3},
{name:"Kourou, French Guiana", lat:5.1597, lon:-52.6503, pop:25000, timezone:-3},
{name:"Saint-Laurent-du-Maroni, French Guiana", lat:5.5000, lon:-54.0333, pop:25000, timezone:-3},
{name:"Matoury, French Guiana", lat:4.8500, lon:-52.3333, pop:30000, timezone:-3},
{name:"Remire-Montjoly, French Guiana", lat:4.9000, lon:-52.2667, pop:20000, timezone:-3},
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
// Scandinavia
{name:"Gothenburg, Sweden", lat:57.7089, lon:11.9746, pop:600000, timezone:1},
{name:"Malmö, Sweden", lat:55.6050, lon:13.0038, pop:350000, timezone:1},
{name:"Uppsala, Sweden", lat:59.8586, lon:17.6389, pop:180000, timezone:1},
{name:"Västerås, Sweden", lat:59.6099, lon:16.5448, pop:150000, timezone:1},
{name:"Örebro, Sweden", lat:59.2741, lon:15.2066, pop:150000, timezone:1},
{name:"Linköping, Sweden", lat:58.4108, lon:15.6214, pop:160000, timezone:1},
{name:"Helsingborg, Sweden", lat:56.0465, lon:12.6945, pop:150000, timezone:1},
{name:"Jönköping, Sweden", lat:57.7826, lon:14.1614, pop:140000, timezone:1},
{name:"Norrköping, Sweden", lat:58.5877, lon:16.1924, pop:140000, timezone:1},
{name:"Lund, Sweden", lat:55.7047, lon:13.1910, pop:120000, timezone:1},
{name:"Umeå, Sweden", lat:63.8258, lon:20.2630, pop:130000, timezone:1},
{name:"Gävle, Sweden", lat:60.6749, lon:17.1413, pop:100000, timezone:1},
{name:"Borås, Sweden", lat:57.7210, lon:12.9401, pop:110000, timezone:1},
{name:"Eskilstuna, Sweden", lat:59.3666, lon:16.5077, pop:100000, timezone:1},
{name:"Halmstad, Sweden", lat:56.6745, lon:12.8568, pop:100000, timezone:1},

{name:"Bergen, Norway", lat:60.3913, lon:5.3221, pop:280000, timezone:1},
{name:"Trondheim, Norway", lat:63.4305, lon:10.3951, pop:200000, timezone:1},
{name:"Stavanger, Norway", lat:58.9700, lon:5.7331, pop:140000, timezone:1},
{name:"Drammen, Norway", lat:59.7440, lon:10.2045, pop:100000, timezone:1},
{name:"Fredrikstad, Norway", lat:59.2181, lon:10.9298, pop:80000, timezone:1},
{name:"Kristiansand, Norway", lat:58.1599, lon:8.0182, pop:90000, timezone:1},
{name:"Sandnes, Norway", lat:58.8524, lon:5.7352, pop:80000, timezone:1},
{name:"Tromsø, Norway", lat:69.6492, lon:18.9553, pop:75000, timezone:1},
{name:"Sarpsborg, Norway", lat:59.2839, lon:11.1097, pop:55000, timezone:1},
{name:"Skien, Norway", lat:59.2096, lon:9.6090, pop:55000, timezone:1},

{name:"Aarhus, Denmark", lat:56.1629, lon:10.2039, pop:280000, timezone:1},
{name:"Odense, Denmark", lat:55.4038, lon:10.4024, pop:180000, timezone:1},
{name:"Aalborg, Denmark", lat:57.0488, lon:9.9217, pop:120000, timezone:1},
{name:"Esbjerg, Denmark", lat:55.4765, lon:8.4594, pop:70000, timezone:1},
{name:"Randers, Denmark", lat:56.4607, lon:10.0364, pop:60000, timezone:1},
{name:"Kolding, Denmark", lat:55.4904, lon:9.4722, pop:60000, timezone:1},
{name:"Horsens, Denmark", lat:55.8607, lon:9.8500, pop:60000, timezone:1},
{name:"Vejle, Denmark", lat:55.7093, lon:9.5357, pop:55000, timezone:1},
{name:"Roskilde, Denmark", lat:55.6415, lon:12.0803, pop:50000, timezone:1},
{name:"Herning, Denmark", lat:56.1393, lon:8.9766, pop:50000, timezone:1},

{name:"Espoo, Finland", lat:60.2055, lon:24.6559, pop:280000, timezone:2},
{name:"Tampere, Finland", lat:61.4978, lon:23.7610, pop:240000, timezone:2},
{name:"Vantaa, Finland", lat:60.2934, lon:25.0378, pop:230000, timezone:2},
{name:"Oulu, Finland", lat:65.0121, lon:25.4651, pop:200000, timezone:2},
{name:"Turku, Finland", lat:60.4518, lon:22.2666, pop:190000, timezone:2},
{name:"Jyväskylä, Finland", lat:62.2415, lon:25.7209, pop:140000, timezone:2},
{name:"Lahti, Finland", lat:60.9827, lon:25.6612, pop:120000, timezone:2},
{name:"Kuopio, Finland", lat:62.8924, lon:27.6770, pop:120000, timezone:2},
{name:"Pori, Finland", lat:61.4851, lon:21.7974, pop:80000, timezone:2},
{name:"Joensuu, Finland", lat:62.6010, lon:29.7636, pop:75000, timezone:2},
{name:"Lappeenranta, Finland", lat:61.0587, lon:28.1887, pop:70000, timezone:2},
{name:"Hämeenlinna, Finland", lat:60.9959, lon:24.4642, pop:70000, timezone:2},
{name:"Vaasa, Finland", lat:63.0960, lon:21.6158, pop:70000, timezone:2},
{name:"Rovaniemi, Finland", lat:66.5039, lon:25.7294, pop:60000, timezone:2},
{name:"Seinäjoki, Finland", lat:62.7945, lon:22.8282, pop:60000, timezone:2},

// Benelux
{name:"Antwerp, Belgium", lat:51.2194, lon:4.4025, pop:500000, timezone:1},
{name:"Ghent, Belgium", lat:51.0543, lon:3.7174, pop:250000, timezone:1},
{name:"Charleroi, Belgium", lat:50.4108, lon:4.4446, pop:200000, timezone:1},
{name:"Liège, Belgium", lat:50.6326, lon:5.5797, pop:200000, timezone:1},
{name:"Bruges, Belgium", lat:51.2093, lon:3.2247, pop:120000, timezone:1},
{name:"Namur, Belgium", lat:50.4674, lon:4.8720, pop:100000, timezone:1},
{name:"Leuven, Belgium", lat:50.8798, lon:4.7005, pop:100000, timezone:1},
{name:"Mons, Belgium", lat:50.4542, lon:3.9523, pop:90000, timezone:1},
{name:"Aalst, Belgium", lat:50.9372, lon:4.0409, pop:80000, timezone:1},
{name:"Mechelen, Belgium", lat:51.0259, lon:4.4776, pop:80000, timezone:1},

{name:"Utrecht, Netherlands", lat:52.0907, lon:5.1214, pop:350000, timezone:1},
{name:"Eindhoven, Netherlands", lat:51.4416, lon:5.4697, pop:230000, timezone:1},
{name:"Tilburg, Netherlands", lat:51.5555, lon:5.0913, pop:220000, timezone:1},
{name:"Groningen, Netherlands", lat:53.2194, lon:6.5665, pop:230000, timezone:1},
{name:"Almere, Netherlands", lat:52.3508, lon:5.2647, pop:200000, timezone:1},
{name:"Breda, Netherlands", lat:51.5719, lon:4.7683, pop:180000, timezone:1},
{name:"Nijmegen, Netherlands", lat:51.8126, lon:5.8372, pop:170000, timezone:1},
{name:"Enschede, Netherlands", lat:52.2215, lon:6.8937, pop:160000, timezone:1},
{name:"Haarlem, Netherlands", lat:52.3874, lon:4.6462, pop:160000, timezone:1},
{name:"Arnhem, Netherlands", lat:51.9851, lon:5.8987, pop:160000, timezone:1},
{name:"Zaanstad, Netherlands", lat:52.4390, lon:4.8270, pop:150000, timezone:1},
{name:"Amersfoort, Netherlands", lat:52.1561, lon:5.3878, pop:150000, timezone:1},
{name:"Apeldoorn, Netherlands", lat:52.2112, lon:5.9699, pop:160000, timezone:1},
{name:"Hoofddorp, Netherlands", lat:52.3025, lon:4.6889, pop:150000, timezone:1},
{name:"Maastricht, Netherlands", lat:50.8514, lon:5.6910, pop:120000, timezone:1},
{name:"Leiden, Netherlands", lat:52.1601, lon:4.4970, pop:120000, timezone:1},
{name:"Dordrecht, Netherlands", lat:51.8133, lon:4.6901, pop:120000, timezone:1},
{name:"Zoetermeer, Netherlands", lat:52.0575, lon:4.4931, pop:120000, timezone:1},
{name:"Zwolle, Netherlands", lat:52.5168, lon:6.0830, pop:120000, timezone:1},
{name:"Deventer, Netherlands", lat:52.2550, lon:6.1639, pop:100000, timezone:1},

{name:"Luxembourg City, Luxembourg", lat:49.6116, lon:6.1319, pop:120000, timezone:1},
{name:"Esch-sur-Alzette, Luxembourg", lat:49.4958, lon:5.9806, pop:35000, timezone:1},
{name:"Differdange, Luxembourg", lat:49.5242, lon:5.8914, pop:25000, timezone:1},
{name:"Dudelange, Luxembourg", lat:49.4806, lon:6.0875, pop:20000, timezone:1},

// Austria & Switzerland
{name:"Graz, Austria", lat:47.0707, lon:15.4395, pop:290000, timezone:1},
{name:"Linz, Austria", lat:48.3069, lon:14.2858, pop:200000, timezone:1},
{name:"Salzburg, Austria", lat:47.8095, lon:13.0550, pop:150000, timezone:1},
{name:"Innsbruck, Austria", lat:47.2692, lon:11.4041, pop:130000, timezone:1},
{name:"Klagenfurt, Austria", lat:46.6247, lon:14.3053, pop:100000, timezone:1},
{name:"Villach, Austria", lat:46.6111, lon:13.8558, pop:60000, timezone:1},
{name:"Wels, Austria", lat:48.1575, lon:14.0289, pop:60000, timezone:1},
{name:"Sankt Pölten, Austria", lat:48.2047, lon:15.6256, pop:55000, timezone:1},
{name:"Dornbirn, Austria", lat:47.4125, lon:9.7417, pop:50000, timezone:1},
{name:"Wiener Neustadt, Austria", lat:47.8150, lon:16.2317, pop:45000, timezone:1},

{name:"Basel, Switzerland", lat:47.5596, lon:7.5886, pop:170000, timezone:1},
{name:"Lausanne, Switzerland", lat:46.5197, lon:6.6323, pop:140000, timezone:1},
{name:"Bern, Switzerland", lat:46.9480, lon:7.4474, pop:130000, timezone:1},
{name:"Winterthur, Switzerland", lat:47.4988, lon:8.7237, pop:110000, timezone:1},
{name:"Lucerne, Switzerland", lat:47.0502, lon:8.3093, pop:80000, timezone:1},
{name:"St. Gallen, Switzerland", lat:47.4245, lon:9.3767, pop:75000, timezone:1},
{name:"Lugano, Switzerland", lat:46.0037, lon:8.9511, pop:60000, timezone:1},
{name:"Biel/Bienne, Switzerland", lat:47.1371, lon:7.2472, pop:55000, timezone:1},
{name:"Thun, Switzerland", lat:46.7580, lon:7.6280, pop:45000, timezone:1},
{name:"Köniz, Switzerland", lat:46.9244, lon:7.4144, pop:40000, timezone:1},
{name:"La Chaux-de-Fonds, Switzerland", lat:47.0996, lon:6.8257, pop:38000, timezone:1},
{name:"Schaffhausen, Switzerland", lat:47.6960, lon:8.6349, pop:36000, timezone:1},
{name:"Fribourg, Switzerland", lat:46.8065, lon:7.1620, pop:38000, timezone:1},
{name:"Chur, Switzerland", lat:46.8500, lon:9.5333, pop:35000, timezone:1},
{name:"Neuchâtel, Switzerland", lat:46.9900, lon:6.9290, pop:33000, timezone:1},

// Portugal
{name:"Porto, Portugal", lat:41.1579, lon:-8.6291, pop:230000, timezone:0},
{name:"Braga, Portugal", lat:41.5454, lon:-8.4265, pop:180000, timezone:0},
{name:"Coimbra, Portugal", lat:40.2033, lon:-8.4103, pop:140000, timezone:0},
{name:"Funchal, Portugal", lat:32.6669, lon:-16.9241, pop:100000, timezone:0},
{name:"Setúbal, Portugal", lat:38.5244, lon:-8.8882, pop:120000, timezone:0},
{name:"Almada, Portugal", lat:38.6780, lon:-9.1580, pop:170000, timezone:0},
{name:"Agualva-Cacém, Portugal", lat:38.7667, lon:-9.3000, pop:120000, timezone:0},
{name:"Queluz, Portugal", lat:38.7553, lon:-9.2544, pop:100000, timezone:0},
{name:"Rio Tinto, Portugal", lat:41.1833, lon:-8.5667, pop:50000, timezone:0},
{name:"Barreiro, Portugal", lat:38.6631, lon:-9.0725, pop:80000, timezone:0},
{name:"Amadora, Portugal", lat:38.7538, lon:-9.2308, pop:170000, timezone:0},
{name:"Aveiro, Portugal", lat:40.6405, lon:-8.6538, pop:60000, timezone:0},
{name:"Évora, Portugal", lat:38.5714, lon:-7.9093, pop:50000, timezone:0},
{name:"Faro, Portugal", lat:37.0194, lon:-7.9322, pop:60000, timezone:0},
{name:"Leiria, Portugal", lat:39.7436, lon:-8.8071, pop:50000, timezone:0},
{name:"Guimarães, Portugal", lat:41.4440, lon:-8.2960, pop:50000, timezone:0},
{name:"Viseu, Portugal", lat:40.6610, lon:-7.9097, pop:50000, timezone:0},
{name:"Póvoa de Varzim, Portugal", lat:41.3833, lon:-8.7667, pop:60000, timezone:0},
// Poland secondary
{name:"Kraków, Poland", lat:50.0647, lon:19.9450, pop:780000, timezone:1},
{name:"Łódź, Poland", lat:51.7592, lon:19.4560, pop:670000, timezone:1},
{name:"Wrocław, Poland", lat:51.1079, lon:17.0385, pop:640000, timezone:1},
{name:"Poznań, Poland", lat:52.4064, lon:16.9252, pop:540000, timezone:1},
{name:"Gdańsk, Poland", lat:54.3520, lon:18.6466, pop:470000, timezone:1},
{name:"Szczecin, Poland", lat:53.4285, lon:14.5528, pop:400000, timezone:1},
{name:"Bydgoszcz, Poland", lat:53.1235, lon:18.0084, pop:350000, timezone:1},
{name:"Lublin, Poland", lat:51.2465, lon:22.5684, pop:340000, timezone:1},
{name:"Białystok, Poland", lat:53.1325, lon:23.1688, pop:290000, timezone:1},
{name:"Katowice, Poland", lat:50.2649, lon:19.0238, pop:290000, timezone:1},
{name:"Gdynia, Poland", lat:54.5189, lon:18.5305, pop:250000, timezone:1},
{name:"Częstochowa, Poland", lat:50.8118, lon:19.1203, pop:220000, timezone:1},
{name:"Radom, Poland", lat:51.4027, lon:21.1471, pop:210000, timezone:1},
{name:"Sosnowiec, Poland", lat:50.2863, lon:19.1040, pop:200000, timezone:1},
{name:"Toruń, Poland", lat:53.0138, lon:18.5984, pop:200000, timezone:1},
{name:"Kielce, Poland", lat:50.8661, lon:20.6286, pop:190000, timezone:1},
{name:"Gliwice, Poland", lat:50.2945, lon:18.6714, pop:180000, timezone:1},
{name:"Zabrze, Poland", lat:50.3249, lon:18.7857, pop:170000, timezone:1},
{name:"Bytom, Poland", lat:50.3480, lon:18.9328, pop:160000, timezone:1},
{name:"Olsztyn, Poland", lat:53.7784, lon:20.4801, pop:170000, timezone:1},
{name:"Rzeszów, Poland", lat:50.0412, lon:21.9991, pop:180000, timezone:1},
{name:"Ruda Śląska, Poland", lat:50.2550, lon:18.8550, pop:140000, timezone:1},
{name:"Rybnik, Poland", lat:50.0971, lon:18.5418, pop:140000, timezone:1},
{name:"Tychy, Poland", lat:50.1136, lon:18.9975, pop:130000, timezone:1},
{name:"Dąbrowa Górnicza, Poland", lat:50.3210, lon:19.1870, pop:120000, timezone:1},
{name:"Płock, Poland", lat:52.5463, lon:19.7065, pop:120000, timezone:1},
{name:"Elbląg, Poland", lat:54.1561, lon:19.4045, pop:120000, timezone:1},
{name:"Opole, Poland", lat:50.6751, lon:17.9213, pop:120000, timezone:1},
{name:"Gorzów Wielkopolski, Poland", lat:52.7368, lon:15.2288, pop:120000, timezone:1},
{name:"Włocławek, Poland", lat:52.6482, lon:19.0677, pop:110000, timezone:1},
{name:"Zielona Góra, Poland", lat:51.9356, lon:15.5062, pop:140000, timezone:1},
{name:"Tarnów, Poland", lat:50.0121, lon:20.9858, pop:110000, timezone:1},
{name:"Chorzów, Poland", lat:50.2979, lon:18.9545, pop:110000, timezone:1},
{name:"Kalisz, Poland", lat:51.7611, lon:18.0910, pop:100000, timezone:1},
{name:"Koszalin, Poland", lat:54.1943, lon:16.1715, pop:100000, timezone:1},
{name:"Legnica, Poland", lat:51.2101, lon:16.1619, pop:100000, timezone:1},
{name:"Grudziądz, Poland", lat:53.4837, lon:18.7536, pop:95000, timezone:1},
{name:"Słupsk, Poland", lat:54.4641, lon:17.0286, pop:90000, timezone:1},
{name:"Jaworzno, Poland", lat:50.2053, lon:19.2740, pop:90000, timezone:1},
{name:"Jastrzębie-Zdrój, Poland", lat:49.9553, lon:18.5748, pop:90000, timezone:1},

// Czechia & Slovakia
{name:"Brno, Czechia", lat:49.1951, lon:16.6068, pop:380000, timezone:1},
{name:"Ostrava, Czechia", lat:49.8209, lon:18.2625, pop:280000, timezone:1},
{name:"Plzeň, Czechia", lat:49.7384, lon:13.3736, pop:170000, timezone:1},
{name:"Liberec, Czechia", lat:50.7663, lon:15.0543, pop:100000, timezone:1},
{name:"Olomouc, Czechia", lat:49.5938, lon:17.2509, pop:100000, timezone:1},
{name:"Ústí nad Labem, Czechia", lat:50.6607, lon:14.0323, pop:90000, timezone:1},
{name:"Hradec Králové, Czechia", lat:50.2092, lon:15.8328, pop:90000, timezone:1},
{name:"České Budějovice, Czechia", lat:48.9745, lon:14.4744, pop:90000, timezone:1},
{name:"Pardubice, Czechia", lat:50.0343, lon:15.7812, pop:90000, timezone:1},
{name:"Zlín, Czechia", lat:49.2265, lon:17.6667, pop:75000, timezone:1},
{name:"Havířov, Czechia", lat:49.7798, lon:18.4369, pop:70000, timezone:1},
{name:"Kladno, Czechia", lat:50.1473, lon:14.1028, pop:70000, timezone:1},
{name:"Most, Czechia", lat:50.5030, lon:13.6362, pop:65000, timezone:1},
{name:"Opava, Czechia", lat:49.9387, lon:17.9026, pop:55000, timezone:1},
{name:"Frýdek-Místek, Czechia", lat:49.6853, lon:18.3481, pop:55000, timezone:1},
{name:"Karviná, Czechia", lat:49.8540, lon:18.5417, pop:50000, timezone:1},
{name:"Jihlava, Czechia", lat:49.3984, lon:15.5912, pop:50000, timezone:1},
{name:"Teplice, Czechia", lat:50.6404, lon:13.8245, pop:50000, timezone:1},
{name:"Děčín, Czechia", lat:50.7822, lon:14.2148, pop:50000, timezone:1},
{name:"Karlovy Vary, Czechia", lat:50.2322, lon:12.8710, pop:50000, timezone:1},

{name:"Košice, Slovakia", lat:48.7164, lon:21.2611, pop:240000, timezone:1},
{name:"Prešov, Slovakia", lat:48.9985, lon:21.2415, pop:90000, timezone:1},
{name:"Žilina, Slovakia", lat:49.2231, lon:18.7394, pop:80000, timezone:1},
{name:"Nitra, Slovakia", lat:48.3064, lon:18.0845, pop:80000, timezone:1},
{name:"Banská Bystrica, Slovakia", lat:48.7363, lon:19.1462, pop:80000, timezone:1},
{name:"Trnava, Slovakia", lat:48.3774, lon:17.5883, pop:65000, timezone:1},
{name:"Martin, Slovakia", lat:49.0665, lon:18.9220, pop:55000, timezone:1},
{name:"Trenčín, Slovakia", lat:48.8945, lon:18.0444, pop:55000, timezone:1},
{name:"Poprad, Slovakia", lat:49.0614, lon:20.2980, pop:50000, timezone:1},
{name:"Prievidza, Slovakia", lat:48.7745, lon:18.6275, pop:45000, timezone:1},
{name:"Zvolen, Slovakia", lat:48.5748, lon:19.1255, pop:40000, timezone:1},
{name:"Považská Bystrica, Slovakia", lat:49.1215, lon:18.4217, pop:40000, timezone:1},
{name:"Michalovce, Slovakia", lat:48.7543, lon:21.9195, pop:40000, timezone:1},
{name:"Nové Zámky, Slovakia", lat:47.9854, lon:18.1615, pop:38000, timezone:1},
{name:"Spišská Nová Ves, Slovakia", lat:48.9447, lon:20.5675, pop:35000, timezone:1},

// Hungary
{name:"Debrecen, Hungary", lat:47.5316, lon:21.6273, pop:200000, timezone:1},
{name:"Szeged, Hungary", lat:46.2530, lon:20.1414, pop:160000, timezone:1},
{name:"Miskolc, Hungary", lat:48.1035, lon:20.7784, pop:150000, timezone:1},
{name:"Pécs, Hungary", lat:46.0727, lon:18.2328, pop:140000, timezone:1},
{name:"Győr, Hungary", lat:47.6875, lon:17.6504, pop:130000, timezone:1},
{name:"Nyíregyháza, Hungary", lat:47.9554, lon:21.7167, pop:120000, timezone:1},
{name:"Kecskemét, Hungary", lat:46.9060, lon:19.6910, pop:110000, timezone:1},
{name:"Székesfehérvár, Hungary", lat:47.1860, lon:18.4221, pop:100000, timezone:1},
{name:"Szombathely, Hungary", lat:47.2307, lon:16.6218, pop:80000, timezone:1},
{name:"Szolnok, Hungary", lat:47.1747, lon:20.1965, pop:70000, timezone:1},
{name:"Tatabánya, Hungary", lat:47.5692, lon:18.4044, pop:65000, timezone:1},
{name:"Kaposvár, Hungary", lat:46.3596, lon:17.7966, pop:60000, timezone:1},
{name:"Érd, Hungary", lat:47.3867, lon:18.9094, pop:70000, timezone:1},
{name:"Veszprém, Hungary", lat:47.0926, lon:17.9115, pop:60000, timezone:1},
{name:"Békéscsaba, Hungary", lat:46.6770, lon:21.0860, pop:60000, timezone:1},
{name:"Zalaegerszeg, Hungary", lat:46.8453, lon:16.8470, pop:55000, timezone:1},
{name:"Sopron, Hungary", lat:47.6850, lon:16.5830, pop:60000, timezone:1},
{name:"Eger, Hungary", lat:47.9025, lon:20.3772, pop:55000, timezone:1},
{name:"Nagykanizsa, Hungary", lat:46.4535, lon:16.9910, pop:45000, timezone:1},
{name:"Dunaújváros, Hungary", lat:46.9645, lon:18.9390, pop:45000, timezone:1},

// Remaining Balkans & others
{name:"Skopje, North Macedonia", lat:41.9973, lon:21.4280, pop:550000, timezone:1},
{name:"Bitola, North Macedonia", lat:41.0314, lon:21.3347, pop:70000, timezone:1},
{name:"Kumanovo, North Macedonia", lat:42.1322, lon:21.7144, pop:70000, timezone:1},
{name:"Prilep, North Macedonia", lat:41.3451, lon:21.5528, pop:65000, timezone:1},
{name:"Tetovo, North Macedonia", lat:42.0097, lon:20.9715, pop:70000, timezone:1},
{name:"Veles, North Macedonia", lat:41.7156, lon:21.7756, pop:40000, timezone:1},
{name:"Ohrid, North Macedonia", lat:41.1172, lon:20.8016, pop:40000, timezone:1},
{name:"Štip, North Macedonia", lat:41.7458, lon:22.1958, pop:40000, timezone:1},
{name:"Gostivar, North Macedonia", lat:41.7960, lon:20.9082, pop:35000, timezone:1},
{name:"Strumica, North Macedonia", lat:41.4378, lon:22.6433, pop:35000, timezone:1},

{name:"Tirana, Albania", lat:41.3275, lon:19.8187, pop:500000, timezone:1},
{name:"Durrës, Albania", lat:41.3231, lon:19.4414, pop:120000, timezone:1},
{name:"Vlorë, Albania", lat:40.4686, lon:19.4832, pop:80000, timezone:1},
{name:"Shkodër, Albania", lat:42.0683, lon:19.5126, pop:80000, timezone:1},
{name:"Elbasan, Albania", lat:41.1125, lon:20.0822, pop:80000, timezone:1},
{name:"Fier, Albania", lat:40.7239, lon:19.5561, pop:60000, timezone:1},
{name:"Korçë, Albania", lat:40.6186, lon:20.7808, pop:50000, timezone:1},
{name:"Berat, Albania", lat:40.7058, lon:19.9522, pop:40000, timezone:1},
{name:"Lushnjë, Albania", lat:40.9419, lon:19.7050, pop:30000, timezone:1},
{name:"Kavajë, Albania", lat:41.1856, lon:19.5569, pop:25000, timezone:1},

{name:"Podgorica, Montenegro", lat:42.4304, lon:19.2594, pop:150000, timezone:1},
{name:"Nikšić, Montenegro", lat:42.7731, lon:18.9444, pop:55000, timezone:1},
{name:"Herceg Novi, Montenegro", lat:42.4531, lon:18.5375, pop:30000, timezone:1},
{name:"Bar, Montenegro", lat:42.0931, lon:19.1003, pop:30000, timezone:1},
{name:"Budva, Montenegro", lat:42.2864, lon:18.8400, pop:20000, timezone:1},
{name:"Cetinje, Montenegro", lat:42.3906, lon:18.9219, pop:15000, timezone:1},
{name:"Kotor, Montenegro", lat:42.4247, lon:18.7712, pop:15000, timezone:1},
{name:"Ulcinj, Montenegro", lat:41.9294, lon:19.2064, pop:10000, timezone:1},

{name:"Pristina, Kosovo", lat:42.6629, lon:21.1655, pop:200000, timezone:1},
{name:"Prizren, Kosovo", lat:42.2139, lon:20.7397, pop:180000, timezone:1},
{name:"Ferizaj, Kosovo", lat:42.3706, lon:21.1553, pop:100000, timezone:1},
{name:"Peja, Kosovo", lat:42.6594, lon:20.2883, pop:100000, timezone:1},
{name:"Gjakova, Kosovo", lat:42.3803, lon:20.4308, pop:90000, timezone:1},
{name:"Mitrovica, Kosovo", lat:42.8833, lon:20.8667, pop:80000, timezone:1},
{name:"Gjilan, Kosovo", lat:42.4639, lon:21.4681, pop:80000, timezone:1},
{name:"Vushtrri, Kosovo", lat:42.8231, lon:20.9675, pop:60000, timezone:1},
{name:"Podujeva, Kosovo", lat:42.9106, lon:21.1931, pop:70000, timezone:1},
{name:"Suhareka, Kosovo", lat:42.3586, lon:20.8250, pop:50000, timezone:1},
{name:"Matosinhos, Portugal", lat:41.1833, lon:-8.7000, pop:170000, timezone:0},
{name:"Gondomar, Portugal", lat:41.1500, lon:-8.5333, pop:160000, timezone:0},

// Greece
{name:"Thessaloniki, Greece", lat:40.6401, lon:22.9444, pop:800000, timezone:2},
{name:"Patras, Greece", lat:38.2466, lon:21.7346, pop:200000, timezone:2},
{name:"Heraklion, Greece", lat:35.3387, lon:25.1442, pop:170000, timezone:2},
{name:"Larissa, Greece", lat:39.6390, lon:22.4191, pop:160000, timezone:2},
{name:"Volos, Greece", lat:39.3666, lon:22.9500, pop:140000, timezone:2},
{name:"Ioannina, Greece", lat:39.6650, lon:20.8537, pop:110000, timezone:2},
{name:"Chania, Greece", lat:35.5138, lon:24.0180, pop:100000, timezone:2},
{name:"Chalcis, Greece", lat:38.4625, lon:23.5994, pop:60000, timezone:2},
{name:"Rhodes, Greece", lat:36.4349, lon:28.2176, pop:50000, timezone:2},
{name:"Agrinio, Greece", lat:38.6214, lon:21.4078, pop:50000, timezone:2},
{name:"Katerini, Greece", lat:40.2719, lon:22.5025, pop:50000, timezone:2},
{name:"Trikala, Greece", lat:39.5550, lon:21.7670, pop:60000, timezone:2},
{name:"Serres, Greece", lat:41.0850, lon:23.5475, pop:60000, timezone:2},
{name:"Lamia, Greece", lat:38.9000, lon:22.4333, pop:50000, timezone:2},
{name:"Kalamata, Greece", lat:37.0389, lon:22.1142, pop:55000, timezone:2},
{name:"Kavala, Greece", lat:40.9394, lon:24.4019, pop:55000, timezone:2},
{name:"Alexandroupoli, Greece", lat:40.8475, lon:25.8744, pop:55000, timezone:2},
{name:"Xanthi, Greece", lat:41.1347, lon:24.8881, pop:55000, timezone:2},
{name:"Komotini, Greece", lat:41.1190, lon:25.4050, pop:50000, timezone:2},
{name:"Veria, Greece", lat:40.5230, lon:22.2030, pop:45000, timezone:2},
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
{name:"Moscow, Russia", lat:55.7558, lon:37.6173, pop:12700000, timezone:3},
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

/* =========================
   🇪🇺 EUROPE – CLEAN ADDITIONS (~220)
========================= */

// United Kingdom secondary
{name:"Edinburgh, UK", lat:55.9533, lon:-3.1883, pop:550000, timezone:0},
{name:"Cardiff, UK", lat:51.4816, lon:-3.1791, pop:500000, timezone:0},
{name:"Belfast, UK", lat:54.5973, lon:-5.9301, pop:600000, timezone:0},
{name:"Coventry, UK", lat:52.4068, lon:-1.5197, pop:400000, timezone:0},
{name:"Bradford, UK", lat:53.7960, lon:-1.7594, pop:500000, timezone:0},
{name:"Southampton, UK", lat:50.9097, lon:-1.4044, pop:300000, timezone:0},
{name:"Portsmouth, UK", lat:50.8198, lon:-1.0880, pop:250000, timezone:0},
{name:"Plymouth, UK", lat:50.3755, lon:-4.1427, pop:250000, timezone:0},
{name:"Derby, UK", lat:52.9225, lon:-1.4746, pop:250000, timezone:0},
{name:"Stoke-on-Trent, UK", lat:53.0027, lon:-2.1794, pop:250000, timezone:0},
{name:"Wolverhampton, UK", lat:52.5862, lon:-2.1288, pop:250000, timezone:0},
{name:"Reading, UK", lat:51.4543, lon:-0.9781, pop:250000, timezone:0},
{name:"Northampton, UK", lat:52.2405, lon:-0.9027, pop:250000, timezone:0},
{name:"Luton, UK", lat:51.8787, lon:-0.4200, pop:250000, timezone:0},
{name:"Aberdeen, UK", lat:57.1497, lon:-2.0943, pop:200000, timezone:0},
{name:"Dundee, UK", lat:56.4620, lon:-2.9707, pop:150000, timezone:0},
{name:"Swansea, UK", lat:51.6214, lon:-3.9436, pop:250000, timezone:0},
{name:"York, UK", lat:53.9591, lon:-1.0815, pop:200000, timezone:0},
{name:"Oxford, UK", lat:51.7520, lon:-1.2577, pop:180000, timezone:0},
{name:"Cambridge, UK", lat:52.2053, lon:0.1218, pop:150000, timezone:0},
{name:"Brighton, UK", lat:50.8225, lon:-0.1372, pop:300000, timezone:0},
{name:"Bournemouth, UK", lat:50.7192, lon:-1.8808, pop:200000, timezone:0},
{name:"Middlesbrough, UK", lat:54.5742, lon:-1.2350, pop:150000, timezone:0},
{name:"Ipswich, UK", lat:52.0567, lon:1.1482, pop:150000, timezone:0},
{name:"Norwich, UK", lat:52.6309, lon:1.2974, pop:200000, timezone:0},
{name:"Exeter, UK", lat:50.7184, lon:-3.5339, pop:150000, timezone:0},
{name:"Milton Keynes, UK", lat:52.0406, lon:-0.7594, pop:250000, timezone:0},
{name:"Peterborough, UK", lat:52.5695, lon:-0.2405, pop:200000, timezone:0},
{name:"Southend-on-Sea, UK", lat:51.5450, lon:0.7077, pop:180000, timezone:0},
{name:"Cheltenham, UK", lat:51.8994, lon:-2.0783, pop:120000, timezone:0},
{name:"Gloucester, UK", lat:51.8642, lon:-2.2382, pop:130000, timezone:0},
{name:"Worcester, UK", lat:52.1936, lon:-2.2216, pop:100000, timezone:0},
{name:"Telford, UK", lat:52.6766, lon:-2.4493, pop:150000, timezone:0},
{name:"Walsall, UK", lat:52.5860, lon:-1.9829, pop:270000, timezone:0},
{name:"Dudley, UK", lat:52.5123, lon:-2.0810, pop:300000, timezone:0},
{name:"Solihull, UK", lat:52.4118, lon:-1.7776, pop:200000, timezone:0},

// Ireland
{name:"Cork, Ireland", lat:51.8985, lon:-8.4756, pop:220000, timezone:0},
{name:"Limerick, Ireland", lat:52.6638, lon:-8.6267, pop:100000, timezone:0},
{name:"Galway, Ireland", lat:53.2707, lon:-9.0568, pop:85000, timezone:0},
{name:"Waterford, Ireland", lat:52.2593, lon:-7.1101, pop:55000, timezone:0},
{name:"Drogheda, Ireland", lat:53.7189, lon:-6.3478, pop:45000, timezone:0},
{name:"Dundalk, Ireland", lat:54.0000, lon:-6.4167, pop:40000, timezone:0},

// France secondary
{name:"Lille, France", lat:50.6292, lon:3.0573, pop:1200000, timezone:1},
{name:"Nantes, France", lat:47.2184, lon:-1.5536, pop:700000, timezone:1},
{name:"Strasbourg, France", lat:48.5734, lon:7.7521, pop:500000, timezone:1},
{name:"Montpellier, France", lat:43.6108, lon:3.8767, pop:500000, timezone:1},
{name:"Rennes, France", lat:48.1173, lon:-1.6778, pop:450000, timezone:1},
{name:"Reims, France", lat:49.2583, lon:4.0317, pop:200000, timezone:1},
{name:"Le Havre, France", lat:49.4944, lon:0.1079, pop:200000, timezone:1},
{name:"Saint-Étienne, France", lat:45.4397, lon:4.3872, pop:400000, timezone:1},
{name:"Toulon, France", lat:43.1242, lon:5.9280, pop:600000, timezone:1},
{name:"Grenoble, France", lat:45.1885, lon:5.7245, pop:450000, timezone:1},
{name:"Dijon, France", lat:47.3220, lon:5.0415, pop:250000, timezone:1},
{name:"Angers, France", lat:47.4784, lon:-0.5632, pop:250000, timezone:1},
{name:"Nîmes, France", lat:43.8367, lon:4.3601, pop:200000, timezone:1},
{name:"Clermont-Ferrand, France", lat:45.7772, lon:3.0870, pop:300000, timezone:1},
{name:"Le Mans, France", lat:48.0061, lon:0.1996, pop:200000, timezone:1},
{name:"Aix-en-Provence, France", lat:43.5297, lon:5.4474, pop:150000, timezone:1},
{name:"Brest, France", lat:48.3905, lon:-4.4860, pop:200000, timezone:1},
{name:"Tours, France", lat:47.3941, lon:0.6848, pop:250000, timezone:1},
{name:"Amiens, France", lat:49.8941, lon:2.2958, pop:150000, timezone:1},
{name:"Limoges, France", lat:45.8336, lon:1.2611, pop:150000, timezone:1},
{name:"Perpignan, France", lat:42.6887, lon:2.8948, pop:150000, timezone:1},
{name:"Metz, France", lat:49.1193, lon:6.1757, pop:150000, timezone:1},
{name:"Besançon, France", lat:47.2378, lon:6.0241, pop:150000, timezone:1},
{name:"Orléans, France", lat:47.9029, lon:1.9093, pop:150000, timezone:1},
{name:"Mulhouse, France", lat:47.7508, lon:7.3359, pop:150000, timezone:1},
{name:"Rouen, France", lat:49.4432, lon:1.0993, pop:300000, timezone:1},
{name:"Caen, France", lat:49.1829, lon:-0.3707, pop:200000, timezone:1},
{name:"Nancy, France", lat:48.6921, lon:6.1844, pop:200000, timezone:1},

// Germany secondary
{name:"Bremen, Germany", lat:53.0793, lon:8.8017, pop:550000, timezone:1},
{name:"Hanover, Germany", lat:52.3759, lon:9.7320, pop:550000, timezone:1},
{name:"Nuremberg, Germany", lat:49.4521, lon:11.0767, pop:550000, timezone:1},
{name:"Duisburg, Germany", lat:51.4344, lon:6.7623, pop:500000, timezone:1},
{name:"Bochum, Germany", lat:51.4818, lon:7.2162, pop:350000, timezone:1},
{name:"Wuppertal, Germany", lat:51.2562, lon:7.1508, pop:350000, timezone:1},
{name:"Bielefeld, Germany", lat:52.0302, lon:8.5325, pop:330000, timezone:1},
{name:"Bonn, Germany", lat:50.7374, lon:7.0982, pop:330000, timezone:1},
{name:"Münster, Germany", lat:51.9607, lon:7.6261, pop:320000, timezone:1},
{name:"Karlsruhe, Germany", lat:49.0069, lon:8.4037, pop:310000, timezone:1},
{name:"Mannheim, Germany", lat:49.4875, lon:8.4660, pop:310000, timezone:1},
{name:"Augsburg, Germany", lat:48.3705, lon:10.8978, pop:300000, timezone:1},
{name:"Wiesbaden, Germany", lat:50.0782, lon:8.2398, pop:280000, timezone:1},
{name:"Gelsenkirchen, Germany", lat:51.5177, lon:7.0857, pop:260000, timezone:1},
{name:"Mönchengladbach, Germany", lat:51.1805, lon:6.4428, pop:260000, timezone:1},
{name:"Braunschweig, Germany", lat:52.2689, lon:10.5268, pop:250000, timezone:1},
{name:"Chemnitz, Germany", lat:50.8278, lon:12.9214, pop:250000, timezone:1},
{name:"Kiel, Germany", lat:54.3233, lon:10.1228, pop:250000, timezone:1},
{name:"Aachen, Germany", lat:50.7753, lon:6.0839, pop:250000, timezone:1},
{name:"Halle, Germany", lat:51.4825, lon:11.9700, pop:240000, timezone:1},
{name:"Magdeburg, Germany", lat:52.1205, lon:11.6276, pop:240000, timezone:1},
{name:"Freiburg, Germany", lat:47.9990, lon:7.8421, pop:230000, timezone:1},
{name:"Krefeld, Germany", lat:51.3388, lon:6.5853, pop:230000, timezone:1},
{name:"Lübeck, Germany", lat:53.8655, lon:10.6866, pop:220000, timezone:1},
{name:"Oberhausen, Germany", lat:51.4963, lon:6.8515, pop:210000, timezone:1},
{name:"Erfurt, Germany", lat:50.9848, lon:11.0299, pop:210000, timezone:1},
{name:"Rostock, Germany", lat:54.0924, lon:12.0991, pop:210000, timezone:1},
{name:"Mainz, Germany", lat:49.9929, lon:8.2473, pop:220000, timezone:1},
{name:"Kassel, Germany", lat:51.3127, lon:9.4797, pop:200000, timezone:1},
{name:"Hagen, Germany", lat:51.3671, lon:7.4633, pop:190000, timezone:1},
{name:"Hamm, Germany", lat:51.6739, lon:7.8150, pop:180000, timezone:1},
{name:"Saarbrücken, Germany", lat:49.2402, lon:6.9969, pop:180000, timezone:1},
{name:"Potsdam, Germany", lat:52.3906, lon:13.0645, pop:180000, timezone:1},
{name:"Ludwigshafen, Germany", lat:49.4774, lon:8.4452, pop:170000, timezone:1},
{name:"Oldenburg, Germany", lat:53.1435, lon:8.2146, pop:170000, timezone:1},
{name:"Osnabrück, Germany", lat:52.2799, lon:8.0472, pop:160000, timezone:1},
{name:"Leverkusen, Germany", lat:51.0459, lon:6.9841, pop:160000, timezone:1},
{name:"Heidelberg, Germany", lat:49.3988, lon:8.6724, pop:160000, timezone:1},
{name:"Darmstadt, Germany", lat:49.8728, lon:8.6512, pop:160000, timezone:1},
{name:"Regensburg, Germany", lat:49.0134, lon:12.1016, pop:150000, timezone:1},
{name:"Ingolstadt, Germany", lat:48.7665, lon:11.4257, pop:140000, timezone:1},
{name:"Würzburg, Germany", lat:49.7913, lon:9.9534, pop:130000, timezone:1},
{name:"Ulm, Germany", lat:48.4011, lon:9.9876, pop:120000, timezone:1},
{name:"Heilbronn, Germany", lat:49.1427, lon:9.2109, pop:120000, timezone:1},
{name:"Pforzheim, Germany", lat:48.8922, lon:8.6946, pop:120000, timezone:1},
{name:"Göttingen, Germany", lat:51.5413, lon:9.9158, pop:120000, timezone:1},
{name:"Trier, Germany", lat:49.7499, lon:6.6371, pop:110000, timezone:1},
{name:"Reutlingen, Germany", lat:48.4914, lon:9.2043, pop:110000, timezone:1},
{name:"Koblenz, Germany", lat:50.3569, lon:7.5890, pop:110000, timezone:1},
{name:"Jena, Germany", lat:50.9271, lon:11.5892, pop:110000, timezone:1},
{name:"Erlangen, Germany", lat:49.5897, lon:11.0078, pop:110000, timezone:1},
{name:"Siegen, Germany", lat:50.8748, lon:8.0243, pop:100000, timezone:1},
{name:"Hildesheim, Germany", lat:52.1509, lon:9.9511, pop:100000, timezone:1},

// Spain secondary
{name:"Murcia, Spain", lat:37.9922, lon:-1.1307, pop:450000, timezone:1},
{name:"Palma, Spain", lat:39.5696, lon:2.6502, pop:400000, timezone:1},
{name:"Las Palmas, Spain", lat:28.1235, lon:-15.4366, pop:380000, timezone:0},
{name:"Alicante, Spain", lat:38.3452, lon:-0.4810, pop:350000, timezone:1},
{name:"Córdoba, Spain", lat:37.8882, lon:-4.7794, pop:320000, timezone:1},
{name:"Valladolid, Spain", lat:41.6523, lon:-4.7245, pop:300000, timezone:1},
{name:"Vigo, Spain", lat:42.2406, lon:-8.7207, pop:300000, timezone:1},
{name:"Gijón, Spain", lat:43.5322, lon:-5.6611, pop:270000, timezone:1},
{name:"Vitoria, Spain", lat:42.8467, lon:-2.6716, pop:250000, timezone:1},
{name:"A Coruña, Spain", lat:43.3623, lon:-8.4115, pop:250000, timezone:1},
{name:"Granada, Spain", lat:37.1773, lon:-3.5986, pop:230000, timezone:1},
{name:"Elche, Spain", lat:38.2669, lon:-0.6983, pop:230000, timezone:1},
{name:"Oviedo, Spain", lat:43.3614, lon:-5.8493, pop:220000, timezone:1},
{name:"Cartagena, Spain", lat:37.6051, lon:-0.9861, pop:210000, timezone:1},
{name:"Jerez, Spain", lat:36.6866, lon:-6.1372, pop:210000, timezone:1},
{name:"Sabadell, Spain", lat:41.5433, lon:2.1094, pop:210000, timezone:1},
{name:"Móstoles, Spain", lat:40.3223, lon:-3.8649, pop:210000, timezone:1},
{name:"Alcalá de Henares, Spain", lat:40.4818, lon:-3.3635, pop:200000, timezone:1},
{name:"Pamplona, Spain", lat:42.8125, lon:-1.6458, pop:200000, timezone:1},
{name:"Fuenlabrada, Spain", lat:40.2842, lon:-3.7941, pop:190000, timezone:1},
{name:"Almería, Spain", lat:36.8340, lon:-2.4637, pop:200000, timezone:1},
{name:"Leganés, Spain", lat:40.3272, lon:-3.7635, pop:190000, timezone:1},
{name:"San Sebastián, Spain", lat:43.3183, lon:-1.9812, pop:190000, timezone:1},
{name:"Burgos, Spain", lat:42.3439, lon:-3.6969, pop:180000, timezone:1},
{name:"Salamanca, Spain", lat:40.9701, lon:-5.6635, pop:150000, timezone:1},
{name:"Albacete, Spain", lat:38.9942, lon:-1.8585, pop:170000, timezone:1},
{name:"Getafe, Spain", lat:40.3057, lon:-3.7329, pop:180000, timezone:1},
{name:"Castellón, Spain", lat:39.9864, lon:-0.0513, pop:170000, timezone:1},
{name:"Logroño, Spain", lat:42.4627, lon:-2.4449, pop:150000, timezone:1},
{name:"Badajoz, Spain", lat:38.8794, lon:-6.9707, pop:150000, timezone:1},
{name:"Huelva, Spain", lat:37.2571, lon:-6.9497, pop:140000, timezone:1},
{name:"León, Spain", lat:42.5987, lon:-5.5671, pop:130000, timezone:1},
{name:"Tarragona, Spain", lat:41.1189, lon:1.2445, pop:130000, timezone:1},
{name:"Cádiz, Spain", lat:36.5271, lon:-6.2886, pop:120000, timezone:1},
{name:"Lleida, Spain", lat:41.6176, lon:0.6200, pop:140000, timezone:1},
{name:"Marbella, Spain", lat:36.5101, lon:-4.8825, pop:150000, timezone:1},
{name:"Santa Cruz de Tenerife, Spain", lat:28.4636, lon:-16.2518, pop:200000, timezone:0},
{name:"Jaén, Spain", lat:37.7796, lon:-3.7849, pop:110000, timezone:1},
{name:"Ourense, Spain", lat:42.3360, lon:-7.8640, pop:110000, timezone:1},
{name:"Algeciras, Spain", lat:36.1408, lon:-5.4562, pop:120000, timezone:1},
{name:"Girona, Spain", lat:41.9794, lon:2.8214, pop:100000, timezone:1},
{name:"Cáceres, Spain", lat:39.4753, lon:-6.3724, pop:100000, timezone:1},

// Italy secondary
{name:"Bari, Italy", lat:41.1171, lon:16.8719, pop:320000, timezone:1},
{name:"Catania, Italy", lat:37.5079, lon:15.0830, pop:300000, timezone:1},
{name:"Verona, Italy", lat:45.4384, lon:10.9916, pop:260000, timezone:1},
{name:"Messina, Italy", lat:38.1938, lon:15.5540, pop:230000, timezone:1},
{name:"Padua, Italy", lat:45.4064, lon:11.8768, pop:210000, timezone:1},
{name:"Trieste, Italy", lat:45.6495, lon:13.7768, pop:200000, timezone:1},
{name:"Brescia, Italy", lat:45.5416, lon:10.2118, pop:200000, timezone:1},
{name:"Parma, Italy", lat:44.8015, lon:10.3279, pop:200000, timezone:1},
{name:"Taranto, Italy", lat:40.4644, lon:17.2470, pop:200000, timezone:1},
{name:"Prato, Italy", lat:43.8777, lon:11.1023, pop:200000, timezone:1},
{name:"Modena, Italy", lat:44.6471, lon:10.9252, pop:180000, timezone:1},
{name:"Reggio Calabria, Italy", lat:38.1113, lon:15.6473, pop:180000, timezone:1},
{name:"Reggio Emilia, Italy", lat:44.6983, lon:10.6300, pop:170000, timezone:1},
{name:"Perugia, Italy", lat:43.1107, lon:12.3908, pop:160000, timezone:1},
{name:"Livorno, Italy", lat:43.5485, lon:10.3106, pop:160000, timezone:1},
{name:"Ravenna, Italy", lat:44.4184, lon:12.2035, pop:160000, timezone:1},
{name:"Cagliari, Italy", lat:39.2238, lon:9.1217, pop:150000, timezone:1},
{name:"Foggia, Italy", lat:41.4622, lon:15.5446, pop:150000, timezone:1},
{name:"Rimini, Italy", lat:44.0678, lon:12.5695, pop:150000, timezone:1},
{name:"Salerno, Italy", lat:40.6824, lon:14.7681, pop:130000, timezone:1},
{name:"Ferrara, Italy", lat:44.8378, lon:11.6199, pop:130000, timezone:1},
{name:"Sassari, Italy", lat:40.7259, lon:8.5557, pop:120000, timezone:1},
{name:"Monza, Italy", lat:45.5845, lon:9.2744, pop:120000, timezone:1},
{name:"Syracuse, Italy", lat:37.0755, lon:15.2866, pop:120000, timezone:1},
{name:"Pescara, Italy", lat:42.4618, lon:14.2161, pop:120000, timezone:1},
{name:"Bergamo, Italy", lat:45.6983, lon:9.6773, pop:120000, timezone:1},
{name:"Forlì, Italy", lat:44.2226, lon:12.0407, pop:120000, timezone:1},
{name:"Trento, Italy", lat:46.0748, lon:11.1217, pop:120000, timezone:1},
{name:"Vicenza, Italy", lat:45.5455, lon:11.5354, pop:110000, timezone:1},
{name:"Terni, Italy", lat:42.5635, lon:12.6427, pop:110000, timezone:1},
{name:"Bolzano, Italy", lat:46.4983, lon:11.3548, pop:110000, timezone:1},
{name:"Novara, Italy", lat:45.4469, lon:8.6221, pop:100000, timezone:1},
{name:"Piacenza, Italy", lat:45.0522, lon:9.6929, pop:100000, timezone:1},
{name:"Ancona, Italy", lat:43.6158, lon:13.5189, pop:100000, timezone:1},
{name:"Arezzo, Italy", lat:43.4633, lon:11.8796, pop:100000, timezone:1},
{name:"Udine, Italy", lat:46.0711, lon:13.2346, pop:100000, timezone:1},
{name:"Cesena, Italy", lat:44.1391, lon:12.2431, pop:97000, timezone:1},
{name:"Lecce, Italy", lat:40.3515, lon:18.1750, pop:95000, timezone:1},
{name:"Pesaro, Italy", lat:43.9102, lon:12.9133, pop:95000, timezone:1},
{name:"La Spezia, Italy", lat:44.1024, lon:9.8241, pop:95000, timezone:1},

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
{name:"Dhaka, Bangladesh", lat:23.8103, lon:90.4125, pop:3200000, timezone:6},
{name:"Beijing, China", lat:39.9042, lon:116.4074, pop:21700000, timezone:8},
{name:"Karachi, Pakistan", lat:24.8607, lon:67.0011, pop:17700000, timezone:5},
{name:"Guangzhou, China", lat:23.1291, lon:113.2644, pop:5000000, timezone:8},
{name:"Shenzhen, China", lat:22.5431, lon:114.0579, pop:7500000, timezone:8},
{name:"Chongqing, China", lat:29.5630, lon:106.5516, pop:17000000, timezone:8},

/* --- EAST ASIA --- */
{name:"Busan, South Korea", lat:35.1796, lon:129.0756, pop:3400000, timezone:9},
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
/* =========================
   🌏 ASIA – FINAL WRAP-UP (Caucasus + remaining)
========================= */

// Caucasus secondary
{name:"Batumi, Georgia", lat:41.6168, lon:41.6367, pop:150000, timezone:4},
{name:"Kutaisi, Georgia", lat:42.2679, lon:42.6946, pop:150000, timezone:4},
{name:"Rustavi, Georgia", lat:41.5495, lon:44.9930, pop:150000, timezone:4},
{name:"Zugdidi, Georgia", lat:42.5088, lon:41.8709, pop:50000, timezone:4},
{name:"Gori, Georgia", lat:41.9842, lon:44.1158, pop:50000, timezone:4},
{name:"Poti, Georgia", lat:42.1500, lon:41.6667, pop:50000, timezone:4},
{name:"Telavi, Georgia", lat:41.9167, lon:45.4833, pop:20000, timezone:4},
{name:"Akhaltsikhe, Georgia", lat:41.6389, lon:42.9861, pop:20000, timezone:4},
{name:"Ozurgeti, Georgia", lat:41.9244, lon:42.0069, pop:20000, timezone:4},
{name:"Marneuli, Georgia", lat:41.4756, lon:44.8108, pop:25000, timezone:4},

{name:"Gyumri, Armenia", lat:40.7942, lon:43.8453, pop:120000, timezone:4},
{name:"Vanadzor, Armenia", lat:40.8074, lon:44.4970, pop:80000, timezone:4},
{name:"Vagharshapat, Armenia", lat:40.1656, lon:44.2947, pop:50000, timezone:4},
{name:"Hrazdan, Armenia", lat:40.4975, lon:44.7662, pop:40000, timezone:4},
{name:"Abovyan, Armenia", lat:40.2739, lon:44.6331, pop:45000, timezone:4},
{name:"Kapan, Armenia", lat:39.2075, lon:46.4058, pop:40000, timezone:4},
{name:"Goris, Armenia", lat:39.5128, lon:46.3386, pop:20000, timezone:4},
{name:"Artashat, Armenia", lat:39.9614, lon:44.5444, pop:20000, timezone:4},
{name:"Sevan, Armenia", lat:40.5550, lon:44.9536, pop:20000, timezone:4},
{name:"Ijevan, Armenia", lat:40.8789, lon:45.1478, pop:15000, timezone:4},

{name:"Ganja, Azerbaijan", lat:40.6828, lon:46.3606, pop:300000, timezone:4},
{name:"Sumqayit, Azerbaijan", lat:40.5897, lon:49.6686, pop:300000, timezone:4},
{name:"Mingachevir, Azerbaijan", lat:40.7700, lon:47.0489, pop:100000, timezone:4},
{name:"Lankaran, Azerbaijan", lat:38.7543, lon:48.8500, pop:50000, timezone:4},
{name:"Shirvan, Azerbaijan", lat:39.9319, lon:48.9203, pop:80000, timezone:4},
{name:"Nakhchivan, Azerbaijan", lat:39.2089, lon:45.4122, pop:90000, timezone:4},
{name:"Shaki, Azerbaijan", lat:41.1919, lon:47.1706, pop:70000, timezone:4},
{name:"Yevlakh, Azerbaijan", lat:40.6172, lon:47.1500, pop:60000, timezone:4},
{name:"Khachmaz, Azerbaijan", lat:41.4636, lon:48.8056, pop:40000, timezone:4},
{name:"Quba, Azerbaijan", lat:41.3611, lon:48.5136, pop:40000, timezone:4},
{name:"Qusar, Azerbaijan", lat:41.4264, lon:48.4356, pop:20000, timezone:4},
{name:"Zagatala, Azerbaijan", lat:41.6336, lon:46.6433, pop:20000, timezone:4},
{name:"Balakan, Azerbaijan", lat:41.7258, lon:46.4083, pop:15000, timezone:4},
{name:"Qabala, Azerbaijan", lat:40.9814, lon:47.8458, pop:15000, timezone:4},
{name:"Ismayilli, Azerbaijan", lat:40.7847, lon:48.1514, pop:15000, timezone:4},
{name:"Shamakhi, Azerbaijan", lat:40.6303, lon:48.6267, pop:30000, timezone:4},
{name:"Agdam, Azerbaijan", lat:39.9911, lon:46.9306, pop:20000, timezone:4},
{name:"Fuzuli, Azerbaijan", lat:39.6003, lon:47.1453, pop:20000, timezone:4},
{name:"Jabrayil, Azerbaijan", lat:39.3992, lon:47.0261, pop:10000, timezone:4},
{name:"Zangilan, Azerbaijan", lat:39.0781, lon:46.8733, pop:10000, timezone:4},

{name:"Male, Maldives", lat:4.1755, lon:73.5093, pop:250000, timezone:5},
{name:"Addu City, Maldives", lat:-0.6300, lon:73.1000, pop:30000, timezone:5},
{name:"Fuvahmulah, Maldives", lat:-0.2980, lon:73.4240, pop:12000, timezone:5},
{name:"Kulhudhuffushi, Maldives", lat:6.6220, lon:73.0700, pop:10000, timezone:5},
{name:"Thinadhoo, Maldives", lat:0.5300, lon:72.9970, pop:5000, timezone:5},

{name:"Thimphu, Bhutan", lat:27.4728, lon:89.6390, pop:150000, timezone:6},
{name:"Phuntsholing, Bhutan", lat:26.8500, lon:89.3833, pop:30000, timezone:6},
{name:"Paro, Bhutan", lat:27.4333, lon:89.4167, pop:15000, timezone:6},
{name:"Punakha, Bhutan", lat:27.5833, lon:89.8667, pop:10000, timezone:6},
// ==========================
// 🇻🇳 HO CHI MINH CITY METRO
// ==========================
{name:"HCMC - District 1", lat:10.7769, lon:106.7009, pop:1000000, timezone:7},
{name:"HCMC - District 3", lat:10.7840, lon:106.6840, pop:500000, timezone:7},
{name:"HCMC - District 5", lat:10.7540, lon:106.6630, pop:500000, timezone:7},
{name:"HCMC - District 7", lat:10.7350, lon:106.7210, pop:600000, timezone:7},
{name:"HCMC - Binh Thanh", lat:10.8100, lon:106.7100, pop:600000, timezone:7},
{name:"HCMC - Tan Binh", lat:10.8000, lon:106.6500, pop:600000, timezone:7},
{name:"HCMC - Thu Duc", lat:10.8500, lon:106.7700, pop:1500000, timezone:7},
{name:"HCMC - Go Vap", lat:10.8400, lon:106.6700, pop:700000, timezone:7},

{name:"Bien Hoa", lat:10.9574, lon:106.8426, pop:800000, timezone:7},
{name:"Thu Dau Mot", lat:10.9804, lon:106.6519, pop:400000, timezone:7},
{name:"Di An", lat:10.9068, lon:106.7690, pop:400000, timezone:7},
{name:"Tan Uyen", lat:11.0500, lon:106.7700, pop:300000, timezone:7},
{name:"Long An", lat:10.6956, lon:106.2431, pop:200000, timezone:7},
// ==========================
// 🇨🇳 SHENZHEN–DONGGUAN METRO
// ==========================
{name:"Shenzhen - Futian", lat:22.5431, lon:114.0579, pop:1200000, timezone:8},
{name:"Shenzhen - Luohu", lat:22.5480, lon:114.1230, pop:800000, timezone:8},
{name:"Shenzhen - Nanshan", lat:22.5333, lon:113.9300, pop:1000000, timezone:8},
{name:"Shenzhen - Bao'an", lat:22.5700, lon:113.8500, pop:1200000, timezone:8},
{name:"Shenzhen - Longgang", lat:22.7200, lon:114.2500, pop:1000000, timezone:8},
{name:"Shenzhen - Longhua", lat:22.6500, lon:114.0300, pop:800000, timezone:8},
{name:"Shenzhen - Guangming", lat:22.7480, lon:113.9350, pop:500000, timezone:8},
{name:"Shenzhen - Pingshan", lat:22.6900, lon:114.3500, pop:400000, timezone:8},

{name:"Dongguan - Center", lat:23.0200, lon:113.7500, pop:1000000, timezone:8},
{name:"Dongguan - Houjie", lat:22.9400, lon:113.6800, pop:500000, timezone:8},
{name:"Dongguan - Humen", lat:22.8200, lon:113.6800, pop:600000, timezone:8},
{name:"Dongguan - Chang'an", lat:22.8200, lon:113.8000, pop:500000, timezone:8},
{name:"Dongguan - Dalang", lat:22.9500, lon:113.9200, pop:400000, timezone:8},
// ==========================
// 🇨🇳 GUANGZHOU–FOSHAN METRO
// ==========================
{name:"Guangzhou - Tianhe", lat:23.1350, lon:113.3260, pop:1500000, timezone:8},
{name:"Guangzhou - Yuexiu", lat:23.1288, lon:113.2644, pop:1000000, timezone:8},
{name:"Guangzhou - Haizhu", lat:23.0833, lon:113.3000, pop:900000, timezone:8},
{name:"Guangzhou - Panyu", lat:22.9380, lon:113.3840, pop:1000000, timezone:8},
{name:"Guangzhou - Baiyun", lat:23.2500, lon:113.2700, pop:1000000, timezone:8},
{name:"Guangzhou - Huangpu", lat:23.1800, lon:113.4500, pop:800000, timezone:8},
{name:"Guangzhou - Nansha", lat:22.8000, lon:113.5000, pop:500000, timezone:8},

{name:"Foshan", lat:23.0218, lon:113.1219, pop:1500000, timezone:8},
{name:"Shunde", lat:22.8400, lon:113.2500, pop:800000, timezone:8},
{name:"Nanhai", lat:23.0300, lon:113.1400, pop:800000, timezone:8},
{name:"Sanshui", lat:23.1600, lon:112.8900, pop:400000, timezone:8},
{name:"Zhaoqing", lat:23.0470, lon:112.4650, pop:500000, timezone:8},
// ==========================
// 🇧🇩 DHAKA METRO
// ==========================
{name:"Dhaka - Central", lat:23.8103, lon:90.4125, pop:2000000, timezone:6},
{name:"Dhaka - Gulshan", lat:23.7925, lon:90.4078, pop:700000, timezone:6},
{name:"Dhaka - Dhanmondi", lat:23.7461, lon:90.3742, pop:600000, timezone:6},
{name:"Dhaka - Mirpur", lat:23.8223, lon:90.3654, pop:900000, timezone:6},
{name:"Dhaka - Uttara", lat:23.8759, lon:90.3795, pop:900000, timezone:6},
{name:"Dhaka - Mohammadpur", lat:23.7679, lon:90.3580, pop:600000, timezone:6},
{name:"Dhaka - Jatrabari", lat:23.7100, lon:90.4350, pop:500000, timezone:6},
{name:"Dhaka - Motijheel", lat:23.7333, lon:90.4167, pop:500000, timezone:6},

{name:"Tongi", lat:23.8980, lon:90.4050, pop:500000, timezone:6},
{name:"Savar", lat:23.8583, lon:90.2667, pop:350000, timezone:6},
{name:"Gazipur", lat:24.0023, lon:90.4264, pop:700000, timezone:6},
{name:"Narayanganj", lat:23.6238, lon:90.5000, pop:600000, timezone:6},
{name:"Keraniganj", lat:23.7000, lon:90.3500, pop:300000, timezone:6},
// ==========================
// 🇮🇳 KOLKATA METRO
// ==========================
{name:"Kolkata - Central", lat:22.5726, lon:88.3639, pop:1800000, timezone:5.5},
{name:"Kolkata - Salt Lake", lat:22.5804, lon:88.4120, pop:600000, timezone:5.5},
{name:"Kolkata - New Town", lat:22.5958, lon:88.4797, pop:500000, timezone:5.5},
{name:"Kolkata - Howrah", lat:22.5958, lon:88.2636, pop:800000, timezone:5.5},
{name:"Kolkata - Alipore", lat:22.5350, lon:88.3320, pop:500000, timezone:5.5},
{name:"Kolkata - Jadavpur", lat:22.4950, lon:88.3700, pop:500000, timezone:5.5},
{name:"Kolkata - Dum Dum", lat:22.6500, lon:88.4200, pop:500000, timezone:5.5},

{name:"Barasat", lat:22.7215, lon:88.4810, pop:300000, timezone:5.5},
{name:"Kalyani", lat:22.9750, lon:88.4340, pop:150000, timezone:5.5},
{name:"Bally", lat:22.6500, lon:88.3400, pop:250000, timezone:5.5},
{name:"Serampore", lat:22.7500, lon:88.3400, pop:200000, timezone:5.5},
{name:"Chandannagar", lat:22.8671, lon:88.3674, pop:200000, timezone:5.5},
// ==========================
// 🇳🇬 LAGOS METRO
// ==========================
{name:"Lagos - Island", lat:6.4541, lon:3.3947, pop:1500000, timezone:1},
{name:"Lagos - Mainland", lat:6.5244, lon:3.3792, pop:2000000, timezone:1},
{name:"Lagos - Ikeja", lat:6.6018, lon:3.3515, pop:1000000, timezone:1},
{name:"Lagos - Surulere", lat:6.5000, lon:3.3500, pop:700000, timezone:1},
{name:"Lagos - Yaba", lat:6.5090, lon:3.3710, pop:500000, timezone:1},
{name:"Lagos - Lekki", lat:6.4698, lon:3.5852, pop:800000, timezone:1},
{name:"Lagos - Ajah", lat:6.4667, lon:3.5667, pop:500000, timezone:1},
{name:"Lagos - Ikorodu", lat:6.6194, lon:3.5105, pop:600000, timezone:1},
{name:"Lagos - Agege", lat:6.6250, lon:3.3250, pop:500000, timezone:1},
{name:"Lagos - Alimosho", lat:6.5900, lon:3.2600, pop:1000000, timezone:1},
{name:"Lagos - Badagry", lat:6.4167, lon:2.8833, pop:150000, timezone:1},

// Nearby urban corridor
{name:"Ota", lat:6.6826, lon:3.2327, pop:400000, timezone:1},
{name:"Agbara", lat:6.5250, lon:3.1050, pop:200000, timezone:1},
{name:"Wangdue Phodrang, Bhutan", lat:27.4833, lon:89.9000, pop:10000, timezone:6},
{name:"Trongsa, Bhutan", lat:27.5000, lon:90.5000, pop:5000, timezone:6},
{name:"Bumthang, Bhutan", lat:27.5500, lon:90.7500, pop:5000, timezone:6},
{name:"Mongar, Bhutan", lat:27.2500, lon:91.2333, pop:5000, timezone:6},
{name:"Trashigang, Bhutan", lat:27.3333, lon:91.5500, pop:5000, timezone:6},
{name:"Samdrup Jongkhar, Bhutan", lat:26.8000, lon:91.5000, pop:10000, timezone:6},

{name:"Brunei, Brunei", lat:4.9031, lon:114.9398, pop:100000, timezone:8},
{name:"Kuala Belait, Brunei", lat:4.5833, lon:114.1833, pop:30000, timezone:8},
{name:"Seria, Brunei", lat:4.6167, lon:114.3167, pop:30000, timezone:8},
{name:"Tutong, Brunei", lat:4.8000, lon:114.6500, pop:20000, timezone:8},
{name:"Bangar, Brunei", lat:4.7167, lon:115.0667, pop:5000, timezone:8},

{name:"Dili, Timor-Leste", lat:-8.5569, lon:125.5736, pop:250000, timezone:9},
{name:"Baucau, Timor-Leste", lat:-8.4667, lon:126.4500, pop:20000, timezone:9},
{name:"Maliana, Timor-Leste", lat:-9.0000, lon:125.2167, pop:15000, timezone:9},
{name:"Suai, Timor-Leste", lat:-9.3000, lon:125.2500, pop:10000, timezone:9},
{name:"Lospalos, Timor-Leste", lat:-8.5167, lon:127.0000, pop:15000, timezone:9},
{name:"Kolkata, India", lat:22.5726, lon:88.3639, pop:5000000, timezone:5.5},
{name:"Chennai, India", lat:13.0827, lon:80.2707, pop:11000000, timezone:5.5},
{name:"Hyderabad, India", lat:17.3850, lon:78.4867, pop:10500000, timezone:5.5},
{name:"Ahmedabad, India", lat:23.0225, lon:72.5714, pop:8000000, timezone:5.5},
{name:"Pune, India", lat:18.5204, lon:73.8567, pop:7500000, timezone:5.5},

/* --- SOUTHEAST ASIA --- */
{name:"Ho Chi Minh City, Vietnam", lat:10.8231, lon:106.6297, pop:3000000, timezone:7},
{name:"Hanoi, Vietnam", lat:21.0278, lon:105.8342, pop:8500000, timezone:7},
{name:"Kuala Lumpur, Malaysia", lat:3.1390, lon:101.6869, pop:8000000, timezone:8},

/* --- MIDDLE EAST --- */
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
/* =========================
   🌏 ASIA – SPREAD OUT (East / Middle / South)
========================= */

// South Korea secondary
{name:"Incheon, South Korea", lat:37.4563, lon:126.7052, pop:2900000, timezone:9},
{name:"Daegu, South Korea", lat:35.8714, lon:128.6014, pop:2400000, timezone:9},
{name:"Daejeon, South Korea", lat:36.3504, lon:127.3845, pop:1500000, timezone:9},
{name:"Gwangju, South Korea", lat:35.1595, lon:126.8526, pop:1400000, timezone:9},
{name:"Ulsan, South Korea", lat:35.5384, lon:129.3114, pop:1100000, timezone:9},
{name:"Suwon, South Korea", lat:37.2636, lon:127.0286, pop:1200000, timezone:9},
{name:"Changwon, South Korea", lat:35.2280, lon:128.6811, pop:1000000, timezone:9},
{name:"Goyang, South Korea", lat:37.6584, lon:126.8320, pop:1000000, timezone:9},
{name:"Yongin, South Korea", lat:37.2411, lon:127.1775, pop:1000000, timezone:9},
{name:"Seongnam, South Korea", lat:37.4201, lon:127.1267, pop:900000, timezone:9},
{name:"Bucheon, South Korea", lat:37.5034, lon:126.7660, pop:800000, timezone:9},
{name:"Ansan, South Korea", lat:37.3219, lon:126.8309, pop:650000, timezone:9},
{name:"Anyang, South Korea", lat:37.3925, lon:126.9269, pop:580000, timezone:9},
{name:"Jeonju, South Korea", lat:35.8242, lon:127.1480, pop:650000, timezone:9},
{name:"Cheongju, South Korea", lat:36.6424, lon:127.4890, pop:850000, timezone:9},
{name:"Jeju, South Korea", lat:33.4996, lon:126.5312, pop:500000, timezone:9},

// Taiwan secondary
{name:"Kaohsiung, Taiwan", lat:22.6273, lon:120.3014, pop:2700000, timezone:8},
{name:"Taichung, Taiwan", lat:24.1477, lon:120.6736, pop:2800000, timezone:8},
{name:"Tainan, Taiwan", lat:22.9999, lon:120.2269, pop:1800000, timezone:8},
{name:"Hsinchu, Taiwan", lat:24.8036, lon:120.9686, pop:450000, timezone:8},
{name:"Keelung, Taiwan", lat:25.1276, lon:121.7392, pop:360000, timezone:8},
{name:"Chiayi, Taiwan", lat:23.4801, lon:120.4491, pop:260000, timezone:8},
{name:"Changhua, Taiwan", lat:24.0809, lon:120.5383, pop:230000, timezone:8},
{name:"Pingtung, Taiwan", lat:22.6697, lon:120.4833, pop:200000, timezone:8},
{name:"Yilan, Taiwan", lat:24.7570, lon:121.7530, pop:450000, timezone:8},
{name:"Hualien, Taiwan", lat:23.9911, lon:121.6111, pop:330000, timezone:8},
{name:"Taitung, Taiwan", lat:22.7583, lon:121.1444, pop:210000, timezone:8},
{name:"Miaoli, Taiwan", lat:24.5602, lon:120.8214, pop:540000, timezone:8},
{name:"Nantou, Taiwan", lat:23.9161, lon:120.6839, pop:480000, timezone:8},
{name:"Yunlin, Taiwan", lat:23.7092, lon:120.4313, pop:670000, timezone:8},
{name:"Penghu, Taiwan", lat:23.5711, lon:119.5794, pop:100000, timezone:8},

// Vietnam secondary
{name:"Da Nang, Vietnam", lat:16.0544, lon:108.2022, pop:1200000, timezone:7},
{name:"Hai Phong, Vietnam", lat:20.8449, lon:106.6881, pop:2000000, timezone:7},
{name:"Can Tho, Vietnam", lat:10.0452, lon:105.7469, pop:1200000, timezone:7},
{name:"Bien Hoa, Vietnam", lat:10.9508, lon:106.8220, pop:1000000, timezone:7},
{name:"Nha Trang, Vietnam", lat:12.2388, lon:109.1967, pop:400000, timezone:7},
{name:"Hue, Vietnam", lat:16.4637, lon:107.5909, pop:350000, timezone:7},
{name:"Vung Tau, Vietnam", lat:10.3460, lon:107.0843, pop:450000, timezone:7},
{name:"Qui Nhon, Vietnam", lat:13.7820, lon:109.2197, pop:300000, timezone:7},
{name:"Buon Ma Thuot, Vietnam", lat:12.6667, lon:108.0500, pop:350000, timezone:7},
{name:"Thai Nguyen, Vietnam", lat:21.5942, lon:105.8482, pop:300000, timezone:7},
{name:"Nam Dinh, Vietnam", lat:20.4200, lon:106.1683, pop:250000, timezone:7},
{name:"Vinh, Vietnam", lat:18.6796, lon:105.6813, pop:300000, timezone:7},
{name:"Rach Gia, Vietnam", lat:10.0167, lon:105.0833, pop:250000, timezone:7},
{name:"Long Xuyen, Vietnam", lat:10.3833, lon:105.4333, pop:250000, timezone:7},
{name:"My Tho, Vietnam", lat:10.3600, lon:106.3600, pop:200000, timezone:7},
{name:"Ca Mau, Vietnam", lat:9.1769, lon:105.1520, pop:200000, timezone:7},
{name:"Pleiku, Vietnam", lat:13.9833, lon:108.0000, pop:200000, timezone:7},
{name:"Dong Hoi, Vietnam", lat:17.4833, lon:106.6000, pop:100000, timezone:7},
{name:"Ha Long, Vietnam", lat:20.9500, lon:107.0833, pop:250000, timezone:7},
{name:"Thanh Hoa, Vietnam", lat:19.8000, lon:105.7667, pop:300000, timezone:7},

// Thailand secondary
{name:"Chiang Mai, Thailand", lat:18.7883, lon:98.9853, pop:1300000, timezone:7},
{name:"Hat Yai, Thailand", lat:7.0084, lon:100.4767, pop:400000, timezone:7},
{name:"Nakhon Ratchasima, Thailand", lat:14.9799, lon:102.0978, pop:450000, timezone:7},
{name:"Udon Thani, Thailand", lat:17.4138, lon:102.7872, pop:400000, timezone:7},
{name:"Khon Kaen, Thailand", lat:16.4419, lon:102.8360, pop:400000, timezone:7},
{name:"Chon Buri, Thailand", lat:13.3611, lon:100.9847, pop:300000, timezone:7},
{name:"Pattaya, Thailand", lat:12.9276, lon:100.8771, pop:300000, timezone:7},
{name:"Phuket, Thailand", lat:7.8804, lon:98.3923, pop:400000, timezone:7},
{name:"Songkhla, Thailand", lat:7.1988, lon:100.5951, pop:180000, timezone:7},
{name:"Nakhon Si Thammarat, Thailand", lat:8.4304, lon:99.9631, pop:250000, timezone:7},
{name:"Surat Thani, Thailand", lat:9.1401, lon:99.3331, pop:200000, timezone:7},
{name:"Chiang Rai, Thailand", lat:19.9105, lon:99.8406, pop:200000, timezone:7},
{name:"Lampang, Thailand", lat:18.2888, lon:99.4928, pop:150000, timezone:7},
{name:"Ubon Ratchathani, Thailand", lat:15.2287, lon:104.8564, pop:180000, timezone:7},
{name:"Nakhon Sawan, Thailand", lat:15.7047, lon:100.1372, pop:150000, timezone:7},
{name:"Rayong, Thailand", lat:12.6833, lon:101.2500, pop:150000, timezone:7},
{name:"Samut Prakan, Thailand", lat:13.5993, lon:100.5968, pop:500000, timezone:7},
{name:"Nonthaburi, Thailand", lat:13.8622, lon:100.5140, pop:300000, timezone:7},
{name:"Pathum Thani, Thailand", lat:14.0208, lon:100.5250, pop:250000, timezone:7},
{name:"Ayutthaya, Thailand", lat:14.3692, lon:100.5877, pop:150000, timezone:7},

// Myanmar / Cambodia / Laos
{name:"Naypyidaw, Myanmar", lat:19.7633, lon:96.0785, pop:1000000, timezone:6.5},
{name:"Mawlamyine, Myanmar", lat:16.4905, lon:97.6283, pop:300000, timezone:6.5},
{name:"Bago, Myanmar", lat:17.3350, lon:96.4797, pop:250000, timezone:6.5},
{name:"Pathein, Myanmar", lat:16.7792, lon:94.7321, pop:200000, timezone:6.5},
{name:"Monywa, Myanmar", lat:22.1086, lon:95.1358, pop:200000, timezone:6.5},
{name:"Meiktila, Myanmar", lat:20.8667, lon:95.8667, pop:150000, timezone:6.5},
{name:"Taunggyi, Myanmar", lat:20.7833, lon:97.0333, pop:200000, timezone:6.5},
{name:"Sittwe, Myanmar", lat:20.1500, lon:92.9000, pop:150000, timezone:6.5},
{name:"Myitkyina, Myanmar", lat:25.3833, lon:97.4000, pop:150000, timezone:6.5},
{name:"Hpa-An, Myanmar", lat:16.8906, lon:97.6333, pop:100000, timezone:6.5},

{name:"Siem Reap, Cambodia", lat:13.3633, lon:103.8564, pop:250000, timezone:7},
{name:"Battambang, Cambodia", lat:13.0957, lon:103.2022, pop:200000, timezone:7},
{name:"Sihanoukville, Cambodia", lat:10.6093, lon:103.5296, pop:150000, timezone:7},
{name:"Kampong Cham, Cambodia", lat:12.0000, lon:105.4500, pop:100000, timezone:7},
{name:"Kampot, Cambodia", lat:10.6167, lon:104.1833, pop:50000, timezone:7},
{name:"Kep, Cambodia", lat:10.4833, lon:104.3167, pop:20000, timezone:7},
{name:"Pursat, Cambodia", lat:12.5333, lon:103.9167, pop:50000, timezone:7},
{name:"Kampong Thom, Cambodia", lat:12.7000, lon:104.9000, pop:50000, timezone:7},
{name:"Kratie, Cambodia", lat:12.4882, lon:106.0188, pop:40000, timezone:7},
{name:"Stung Treng, Cambodia", lat:13.5259, lon:105.9683, pop:30000, timezone:7},

{name:"Pakse, Laos", lat:15.1202, lon:105.7990, pop:100000, timezone:7},
{name:"Savannakhet, Laos", lat:16.5600, lon:104.7500, pop:120000, timezone:7},
{name:"Luang Prabang, Laos", lat:19.8850, lon:102.1350, pop:60000, timezone:7},
/* =========================
   🌏 ASIA – SPREAD OUT CONTINUED (with some China)
========================= */

// Indonesia secondary
{name:"Makassar, Indonesia", lat:-5.1477, lon:119.4327, pop:1500000, timezone:8},
{name:"Palembang, Indonesia", lat:-2.9909, lon:104.7566, pop:1600000, timezone:7},
{name:"Tangerang, Indonesia", lat:-6.1783, lon:106.6319, pop:1800000, timezone:7},
{name:"Depok, Indonesia", lat:-6.4025, lon:106.7942, pop:2000000, timezone:7},
{name:"Bekasi, Indonesia", lat:-6.2383, lon:106.9756, pop:2500000, timezone:7},
{name:"Batam, Indonesia", lat:1.0456, lon:104.0305, pop:1200000, timezone:7},
{name:"Pekanbaru, Indonesia", lat:0.5071, lon:101.4478, pop:1000000, timezone:7},
{name:"Bandar Lampung, Indonesia", lat:-5.4294, lon:105.2610, pop:1200000, timezone:7},
{name:"Padang, Indonesia", lat:-0.9492, lon:100.3543, pop:900000, timezone:7},
{name:"Malang, Indonesia", lat:-7.9666, lon:112.6326, pop:900000, timezone:7},
{name:"Samarinda, Indonesia", lat:-0.5022, lon:117.1536, pop:800000, timezone:8},
{name:"Balikpapan, Indonesia", lat:-1.2379, lon:116.8529, pop:700000, timezone:8},
{name:"Pontianak, Indonesia", lat:-0.0263, lon:109.3425, pop:600000, timezone:7},
{name:"Manado, Indonesia", lat:1.4748, lon:124.8421, pop:450000, timezone:8},
{name:"Denpasar, Indonesia", lat:-8.6705, lon:115.2126, pop:900000, timezone:8},
{name:"Yogyakarta, Indonesia", lat:-7.7956, lon:110.3695, pop:400000, timezone:7},
{name:"Mataram, Indonesia", lat:-8.5833, lon:116.1167, pop:400000, timezone:8},
{name:"Kupang, Indonesia", lat:-10.1772, lon:123.6070, pop:400000, timezone:8},
{name:"Ambon, Indonesia", lat:-3.6954, lon:128.1814, pop:350000, timezone:9},
{name:"Jayapura, Indonesia", lat:-2.5337, lon:140.7181, pop:300000, timezone:9},

// Malaysia secondary
{name:"George Town, Malaysia", lat:5.4164, lon:100.3327, pop:700000, timezone:8},
{name:"Ipoh, Malaysia", lat:4.5975, lon:101.0901, pop:700000, timezone:8},
{name:"Johor Bahru, Malaysia", lat:1.4927, lon:103.7414, pop:1500000, timezone:8},
{name:"Melaka, Malaysia", lat:2.1896, lon:102.2501, pop:500000, timezone:8},
{name:"Kota Kinabalu, Malaysia", lat:5.9804, lon:116.0735, pop:500000, timezone:8},
{name:"Kuching, Malaysia", lat:1.5533, lon:110.3592, pop:600000, timezone:8},
{name:"Shah Alam, Malaysia", lat:3.0733, lon:101.5185, pop:600000, timezone:8},
{name:"Petaling Jaya, Malaysia", lat:3.1073, lon:101.6067, pop:600000, timezone:8},
{name:"Klang, Malaysia", lat:3.0449, lon:101.4456, pop:1000000, timezone:8},
{name:"Subang Jaya, Malaysia", lat:3.0565, lon:101.5851, pop:700000, timezone:8},
{name:"Seremban, Malaysia", lat:2.7259, lon:101.9378, pop:500000, timezone:8},
{name:"Kuantan, Malaysia", lat:3.8077, lon:103.3260, pop:400000, timezone:8},
{name:"Alor Setar, Malaysia", lat:6.1248, lon:100.3678, pop:400000, timezone:8},
{name:"Kota Bharu, Malaysia", lat:6.1254, lon:102.2381, pop:500000, timezone:8},
{name:"Miri, Malaysia", lat:4.3995, lon:113.9914, pop:300000, timezone:8},
{name:"Sibu, Malaysia", lat:2.3000, lon:111.8167, pop:250000, timezone:8},
{name:"Sandakan, Malaysia", lat:5.8402, lon:118.1179, pop:400000, timezone:8},
{name:"Tawau, Malaysia", lat:4.2448, lon:117.8912, pop:350000, timezone:8},
{name:"Bintulu, Malaysia", lat:3.1713, lon:113.0415, pop:200000, timezone:8},
{name:"Labuan, Malaysia", lat:5.2831, lon:115.2308, pop:100000, timezone:8},

// India secondary (spread)
{name:"Patna, India", lat:25.5941, lon:85.1376, pop:2000000, timezone:5.5},
{name:"Ranchi, India", lat:23.3441, lon:85.3096, pop:1500000, timezone:5.5},
{name:"Raipur, India", lat:21.2514, lon:81.6296, pop:1500000, timezone:5.5},
{name:"Bhubaneswar, India", lat:20.2961, lon:85.8245, pop:1000000, timezone:5.5},
{name:"Guwahati, India", lat:26.1445, lon:91.7362, pop:1000000, timezone:5.5},
{name:"Chandigarh, India", lat:30.7333, lon:76.7794, pop:1200000, timezone:5.5},
{name:"Thiruvananthapuram, India", lat:8.5241, lon:76.9366, pop:900000, timezone:5.5},
{name:"Kochi, India", lat:9.9312, lon:76.2673, pop:2000000, timezone:5.5},
{name:"Coimbatore, India", lat:11.0168, lon:76.9558, pop:2000000, timezone:5.5},
{name:"Madurai, India", lat:9.9252, lon:78.1198, pop:1500000, timezone:5.5},
{name:"Tiruchirappalli, India", lat:10.7905, lon:78.7047, pop:1000000, timezone:5.5},
{name:"Mysore, India", lat:12.2958, lon:76.6394, pop:1000000, timezone:5.5},
{name:"Mangalore, India", lat:12.9141, lon:74.8560, pop:600000, timezone:5.5},
{name:"Hubli, India", lat:15.3647, lon:75.1240, pop:1000000, timezone:5.5},
{name:"Belgaum, India", lat:15.8497, lon:74.4977, pop:500000, timezone:5.5},
{name:"Gulbarga, India", lat:17.3297, lon:76.8343, pop:500000, timezone:5.5},
{name:"Warangal, India", lat:17.9689, lon:79.5941, pop:700000, timezone:5.5},
{name:"Vijayawada, India", lat:16.5062, lon:80.6480, pop:1500000, timezone:5.5},
{name:"Visakhapatnam, India", lat:17.6868, lon:83.2185, pop:2000000, timezone:5.5},
{name:"Guntur, India", lat:16.3067, lon:80.4365, pop:700000, timezone:5.5},
{name:"Nellore, India", lat:14.4426, lon:79.9865, pop:500000, timezone:5.5},
{name:"Tirupati, India", lat:13.6288, lon:79.4192, pop:400000, timezone:5.5},
{name:"Rajahmundry, India", lat:17.0005, lon:81.8040, pop:500000, timezone:5.5},
{name:"Kakinada, India", lat:16.9891, lon:82.2475, pop:400000, timezone:5.5},
{name:"Eluru, India", lat:16.7107, lon:81.1040, pop:200000, timezone:5.5},
{name:"Ongole, India", lat:15.5057, lon:80.0499, pop:200000, timezone:5.5},
{name:"Kadapa, India", lat:14.4673, lon:78.8242, pop:300000, timezone:5.5},
{name:"Anantapur, India", lat:14.6819, lon:77.6006, pop:300000, timezone:5.5},
{name:"Kurnool, India", lat:15.8281, lon:78.0373, pop:500000, timezone:5.5},
{name:"Nizamabad, India", lat:18.6725, lon:78.0941, pop:300000, timezone:5.5},
{name:"Karimnagar, India", lat:18.4386, lon:79.1288, pop:300000, timezone:5.5},
{name:"Ramagundam, India", lat:18.8000, lon:79.4500, pop:250000, timezone:5.5},
{name:"Mahbubnagar, India", lat:16.7430, lon:77.9980, pop:200000, timezone:5.5},
{name:"Nalgonda, India", lat:17.0575, lon:79.2671, pop:150000, timezone:5.5},
{name:"Suryapet, India", lat:17.1400, lon:79.6200, pop:150000, timezone:5.5},
{name:"Khammam, India", lat:17.2473, lon:80.1514, pop:200000, timezone:5.5},
{name:"Adilabad, India", lat:19.6641, lon:78.5320, pop:150000, timezone:5.5},
{name:"Nizamabad, India", lat:18.6725, lon:78.0941, pop:300000, timezone:5.5},

// Bangladesh secondary
{name:"Khulna, Bangladesh", lat:22.8456, lon:89.5403, pop:1500000, timezone:6},
{name:"Rajshahi, Bangladesh", lat:24.3745, lon:88.6042, pop:800000, timezone:6},
{name:"Sylhet, Bangladesh", lat:24.8949, lon:91.8687, pop:700000, timezone:6},
{name:"Barisal, Bangladesh", lat:22.7010, lon:90.3535, pop:400000, timezone:6},
{name:"Rangpur, Bangladesh", lat:25.7439, lon:89.2752, pop:700000, timezone:6},
{name:"Comilla, Bangladesh", lat:23.4607, lon:91.1809, pop:500000, timezone:6},
{name:"Mymensingh, Bangladesh", lat:24.7471, lon:90.4203, pop:400000, timezone:6},
/* =========================
   🌏 ASIA – CONTINUED SPREAD (Southern + some China + Pakistan / Nepal / Sri Lanka)
========================= */

// Pakistan secondary
{name:"Rawalpindi, Pakistan", lat:33.5651, lon:73.0169, pop:2100000, timezone:5},
{name:"Multan, Pakistan", lat:30.1575, lon:71.5249, pop:1800000, timezone:5},
{name:"Gujranwala, Pakistan", lat:32.1877, lon:74.1945, pop:2000000, timezone:5},
{name:"Peshawar, Pakistan", lat:34.0151, lon:71.5249, pop:2000000, timezone:5},
{name:"Hyderabad, Pakistan", lat:25.3960, lon:68.3578, pop:1700000, timezone:5},
{name:"Quetta, Pakistan", lat:30.1798, lon:66.9750, pop:1000000, timezone:5},
{name:"Sialkot, Pakistan", lat:32.4945, lon:74.5229, pop:700000, timezone:5},
{name:"Bahawalpur, Pakistan", lat:29.3956, lon:71.6836, pop:700000, timezone:5},
{name:"Sargodha, Pakistan", lat:32.0836, lon:72.6711, pop:700000, timezone:5},
{name:"Sukkur, Pakistan", lat:27.7052, lon:68.8574, pop:500000, timezone:5},
{name:"Larkana, Pakistan", lat:27.5590, lon:68.2123, pop:450000, timezone:5},
{name:"Sheikhupura, Pakistan", lat:31.7167, lon:73.9833, pop:500000, timezone:5},
{name:"Jhang, Pakistan", lat:31.2681, lon:72.3181, pop:400000, timezone:5},
{name:"Gujrat, Pakistan", lat:32.5740, lon:74.0781, pop:400000, timezone:5},
{name:"Mardan, Pakistan", lat:34.1986, lon:72.0400, pop:350000, timezone:5},
{name:"Kasur, Pakistan", lat:31.1167, lon:74.4500, pop:350000, timezone:5},
{name:"Dera Ghazi Khan, Pakistan", lat:30.0500, lon:70.6333, pop:400000, timezone:5},
{name:"Sahiwal, Pakistan", lat:30.6667, lon:73.1000, pop:400000, timezone:5},
{name:"Okara, Pakistan", lat:30.8081, lon:73.4458, pop:350000, timezone:5},
{name:"Mirpur Khas, Pakistan", lat:25.5269, lon:69.0111, pop:250000, timezone:5},
{name:"Nawabshah, Pakistan", lat:26.2442, lon:68.4100, pop:300000, timezone:5},
{name:"Mingora, Pakistan", lat:34.7717, lon:72.3600, pop:300000, timezone:5},
{name:"Chiniot, Pakistan", lat:31.7200, lon:72.9789, pop:250000, timezone:5},
{name:"Kamoke, Pakistan", lat:31.9753, lon:74.2236, pop:250000, timezone:5},
{name:"Mandi Bahauddin, Pakistan", lat:32.5861, lon:73.4917, pop:200000, timezone:5},
{name:"Jhelum, Pakistan", lat:32.9333, lon:73.7333, pop:200000, timezone:5},
{name:"Sadiqabad, Pakistan", lat:28.3000, lon:70.1167, pop:250000, timezone:5},
{name:"Jacobabad, Pakistan", lat:28.2800, lon:68.4375, pop:200000, timezone:5},
{name:"Shikarpur, Pakistan", lat:27.9556, lon:68.6381, pop:200000, timezone:5},
{name:"Khanewal, Pakistan", lat:30.3000, lon:71.9333, pop:200000, timezone:5},
{name:"Hafizabad, Pakistan", lat:32.0700, lon:73.6880, pop:200000, timezone:5},
{name:"Kohat, Pakistan", lat:33.5869, lon:71.4414, pop:200000, timezone:5},
{name:"Abbottabad, Pakistan", lat:34.1463, lon:73.2117, pop:150000, timezone:5},
{name:"Murree, Pakistan", lat:33.9070, lon:73.3943, pop:30000, timezone:5},
{name:"Gilgit, Pakistan", lat:35.9208, lon:74.3144, pop:200000, timezone:5},
{name:"Skardu, Pakistan", lat:35.2971, lon:75.6335, pop:50000, timezone:5},
{name:"Muzaffarabad, Pakistan", lat:34.3700, lon:73.4700, pop:150000, timezone:5},
{name:"Mirpur, Pakistan", lat:33.1500, lon:73.7500, pop:100000, timezone:5},
{name:"Kotli, Pakistan", lat:33.5167, lon:73.9000, pop:100000, timezone:5},
{name:"Bhimber, Pakistan", lat:32.9833, lon:74.0667, pop:50000, timezone:5},

// Nepal secondary
{name:"Pokhara, Nepal", lat:28.2096, lon:83.9856, pop:500000, timezone:5.75},
{name:"Lalitpur, Nepal", lat:27.6667, lon:85.3333, pop:300000, timezone:5.75},
{name:"Bharatpur, Nepal", lat:27.6833, lon:84.4333, pop:300000, timezone:5.75},
{name:"Biratnagar, Nepal", lat:26.4833, lon:87.2833, pop:250000, timezone:5.75},
{name:"Birgunj, Nepal", lat:27.0000, lon:84.8667, pop:250000, timezone:5.75},
{name:"Dharan, Nepal", lat:26.8167, lon:87.2833, pop:150000, timezone:5.75},
{name:"Butwal, Nepal", lat:27.7000, lon:83.4500, pop:150000, timezone:5.75},
{name:"Hetauda, Nepal", lat:27.4284, lon:85.0322, pop:150000, timezone:5.75},
{name:"Janakpur, Nepal", lat:26.7288, lon:85.9263, pop:150000, timezone:5.75},
{name:"Nepalgunj, Nepal", lat:28.0500, lon:81.6167, pop:150000, timezone:5.75},
{name:"Itahari, Nepal", lat:26.6667, lon:87.2833, pop:100000, timezone:5.75},
{name:"Dhangadhi, Nepal", lat:28.6833, lon:80.6000, pop:150000, timezone:5.75},
{name:"Bhaktapur, Nepal", lat:27.6722, lon:85.4298, pop:80000, timezone:5.75},
{name:"Kirtipur, Nepal", lat:27.6781, lon:85.2770, pop:70000, timezone:5.75},
{name:"Tulsipur, Nepal", lat:28.1333, lon:82.3000, pop:60000, timezone:5.75},
{name:"Ghorahi, Nepal", lat:28.0333, lon:82.4833, pop:70000, timezone:5.75},
{name:"Siddharthanagar, Nepal", lat:27.5000, lon:83.4500, pop:70000, timezone:5.75},
{name:"Birendranagar, Nepal", lat:28.6000, lon:81.6167, pop:50000, timezone:5.75},
{name:"Damak, Nepal", lat:26.6667, lon:87.7000, pop:70000, timezone:5.75},
{name:"Bhadrapur, Nepal", lat:26.5333, lon:88.0833, pop:40000, timezone:5.75},

// Sri Lanka secondary
{name:"Kandy, Sri Lanka", lat:7.2906, lon:80.6337, pop:150000, timezone:5.5},
{name:"Galle, Sri Lanka", lat:6.0535, lon:80.2210, pop:100000, timezone:5.5},
{name:"Jaffna, Sri Lanka", lat:9.6615, lon:80.0255, pop:100000, timezone:5.5},
{name:"Negombo, Sri Lanka", lat:7.2083, lon:79.8358, pop:150000, timezone:5.5},
{name:"Trincomalee, Sri Lanka", lat:8.5874, lon:81.2152, pop:100000, timezone:5.5},
{name:"Batticaloa, Sri Lanka", lat:7.7102, lon:81.6924, pop:100000, timezone:5.5},
{name:"Anuradhapura, Sri Lanka", lat:8.3114, lon:80.4037, pop:70000, timezone:5.5},
{name:"Ratnapura, Sri Lanka", lat:6.6828, lon:80.4012, pop:60000, timezone:5.5},
{name:"Matara, Sri Lanka", lat:5.9549, lon:80.5550, pop:80000, timezone:5.5},
{name:"Kurunegala, Sri Lanka", lat:7.4863, lon:80.3623, pop:40000, timezone:5.5},
{name:"Badulla, Sri Lanka", lat:6.9934, lon:81.0550, pop:50000, timezone:5.5},
{name:"Nuwara Eliya, Sri Lanka", lat:6.9497, lon:80.7891, pop:30000, timezone:5.5},
{name:"Kalutara, Sri Lanka", lat:6.5854, lon:79.9607, pop:40000, timezone:5.5},
{name:"Gampaha, Sri Lanka", lat:7.0917, lon:79.9942, pop:100000, timezone:5.5},
{name:"Moratuwa, Sri Lanka", lat:6.7730, lon:79.8816, pop:200000, timezone:5.5},
{name:"Dehiwala-Mount Lavinia, Sri Lanka", lat:6.8400, lon:79.8800, pop:250000, timezone:5.5},
{name:"Sri Jayawardenepura Kotte, Sri Lanka", lat:6.9000, lon:79.9000, pop:150000, timezone:5.5},
{name:"Maharagama, Sri Lanka", lat:6.8480, lon:79.9265, pop:200000, timezone:5.5},
{name:"Kesbewa, Sri Lanka", lat:6.8000, lon:79.9400, pop:150000, timezone:5.5},
{name:"Homagama, Sri Lanka", lat:6.8440, lon:80.0020, pop:100000, timezone:5.5},

// Some more Chinese secondary (spread)
{name:"Yantai, China", lat:37.4638, lon:121.4479, pop:7000000, timezone:8},
{name:"Weifang, China", lat:36.7069, lon:119.1619, pop:9000000, timezone:8},
{name:"Zibo, China", lat:36.8135, lon:118.0547, pop:4500000, timezone:8},
{name:"Linyi, China", lat:35.1041, lon:118.3502, pop:10000000, timezone:8},
{name:"Jining, China", lat:35.4050, lon:116.5870, pop:8000000, timezone:8},
{name:"Tai'an, China", lat:36.2003, lon:117.0870, pop:5500000, timezone:8},
{name:"Weihai, China", lat:37.5128, lon:122.1201, pop:2800000, timezone:8},
{name:"Rizhao, China", lat:35.4164, lon:119.5269, pop:2800000, timezone:8},
{name:"Dezhou, China", lat:37.4513, lon:116.3575, pop:5500000, timezone:8},
{name:"Liaocheng, China", lat:36.4560, lon:115.9852, pop:5500000, timezone:8},
{name:"Binzhou, China", lat:37.3835, lon:117.9707, pop:3800000, timezone:8},
{name:"Dongying, China", lat:37.4345, lon:118.6746, pop:2000000, timezone:8},
{name:"Heze, China", lat:35.2333, lon:115.4333, pop:8000000, timezone:8},
{name:"Zaozhuang, China", lat:34.8109, lon:117.3238, pop:3700000, timezone:8},
{name:"Laiwu, China", lat:36.2144, lon:117.6667, pop:1200000, timezone:8},
{name:"Jinan, China", lat:36.6512, lon:117.1201, pop:6000000, timezone:8},
{name:"Qingdao, China", lat:36.0671, lon:120.3826, pop:6000000, timezone:8},
{name:"Yantai, China", lat:37.4638, lon:121.4479, pop:7000000, timezone:8},
{name:"Weifang, China", lat:36.7069, lon:119.1619, pop:9000000, timezone:8},
{name:"Zibo, China", lat:36.8135, lon:118.0547, pop:4500000, timezone:8},
{name:"Gazipur, Bangladesh", lat:23.9999, lon:90.4203, pop:1200000, timezone:6},
{name:"Narayanganj, Bangladesh", lat:23.6238, lon:90.5000, pop:1500000, timezone:6},
{name:"Bogura, Bangladesh", lat:24.8465, lon:89.3772, pop:400000, timezone:6},
{name:"Jessore, Bangladesh", lat:23.1667, lon:89.2167, pop:300000, timezone:6},
{name:"Dinajpur, Bangladesh", lat:25.6270, lon:88.6333, pop:300000, timezone:6},
{name:"Pabna, Bangladesh", lat:24.0000, lon:89.2500, pop:200000, timezone:6},
{name:"Tangail, Bangladesh", lat:24.2500, lon:89.9167, pop:200000, timezone:6},
{name:"Faridpur, Bangladesh", lat:23.6000, lon:89.8333, pop:150000, timezone:6},
{name:"Kushtia, Bangladesh", lat:23.9000, lon:89.1167, pop:200000, timezone:6},
{name:"Noakhali, Bangladesh", lat:22.8333, lon:91.1000, pop:150000, timezone:6},
{name:"Feni, Bangladesh", lat:23.0167, lon:91.4000, pop:150000, timezone:6},
{name:"Brahmanbaria, Bangladesh", lat:23.9667, lon:91.1167, pop:200000, timezone:6},
{name:"Chandpur, Bangladesh", lat:23.2333, lon:90.6500, pop:150000, timezone:6},

// Some Chinese secondary (spread, not concentrated)
{name:"Wenzhou, China", lat:27.9949, lon:120.6994, pop:9000000, timezone:8},
{name:"Shaoxing, China", lat:30.0023, lon:120.5810, pop:5000000, timezone:8},
{name:"Jiaxing, China", lat:30.7522, lon:120.7500, pop:5000000, timezone:8},
{name:"Huzhou, China", lat:30.8703, lon:120.0933, pop:3000000, timezone:8},
{name:"Taizhou, China", lat:28.6561, lon:121.4208, pop:6000000, timezone:8},
{name:"Jinhua, China", lat:29.0788, lon:119.6474, pop:5000000, timezone:8},
{name:"Quanzhou, China", lat:24.8741, lon:118.6757, pop:8000000, timezone:8},
{name:"Zhangzhou, China", lat:24.5130, lon:117.6471, pop:5000000, timezone:8},
{name:"Putian, China", lat:25.4394, lon:119.0078, pop:3000000, timezone:8},
{name:"Sanming, China", lat:26.2658, lon:117.6389, pop:2500000, timezone:8},
{name:"Nanping, China", lat:26.6418, lon:118.1770, pop:2600000, timezone:8},
{name:"Longyan, China", lat:25.0910, lon:117.0170, pop:2500000, timezone:8},
{name:"Ningde, China", lat:26.6656, lon:119.5477, pop:2800000, timezone:8},
{name:"Ganzhou, China", lat:25.8452, lon:114.9350, pop:9000000, timezone:8},
{name:"Jiujiang, China", lat:29.7051, lon:116.0019, pop:4500000, timezone:8},
{name:"Shangrao, China", lat:28.4549, lon:117.9434, pop:6500000, timezone:8},
{name:"Yichun, China", lat:27.8156, lon:114.4168, pop:5000000, timezone:8},
{name:"Jingdezhen, China", lat:29.2687, lon:117.1784, pop:1600000, timezone:8},
{name:"Pingxiang, China", lat:27.6229, lon:113.8546, pop:1800000, timezone:8},
{name:"Xinyu, China", lat:27.8186, lon:114.9171, pop:1100000, timezone:8},
{name:"Thakhek, Laos", lat:17.4000, lon:104.8000, pop:40000, timezone:7},
{name:"Phonsavan, Laos", lat:19.4500, lon:103.1833, pop:40000, timezone:7},
{name:"Xam Neua, Laos", lat:20.4167, lon:104.0667, pop:40000, timezone:7},
{name:"Muang Xay, Laos", lat:20.7000, lon:101.9833, pop:30000, timezone:7},
{name:"Luang Namtha, Laos", lat:20.9500, lon:101.4000, pop:30000, timezone:7},
{name:"Attapeu, Laos", lat:14.8000, lon:106.8333, pop:20000, timezone:7},
{name:"Saravan, Laos", lat:15.7167, lon:106.4167, pop:20000, timezone:7},

// Philippines secondary
{name:"Quezon City, Philippines", lat:14.6760, lon:121.0437, pop:3000000, timezone:8},
{name:"Caloocan, Philippines", lat:14.6488, lon:120.9830, pop:1600000, timezone:8},
{name:"Zamboanga City, Philippines", lat:6.9214, lon:122.0790, pop:900000, timezone:8},
{name:"Antipolo, Philippines", lat:14.6255, lon:121.1245, pop:900000, timezone:8},
{name:"Pasig, Philippines", lat:14.5764, lon:121.0851, pop:800000, timezone:8},
{name:"Taguig, Philippines", lat:14.5176, lon:121.0509, pop:900000, timezone:8},
{name:"Cagayan de Oro, Philippines", lat:8.4542, lon:124.6319, pop:700000, timezone:8},
{name:"Parañaque, Philippines", lat:14.4793, lon:121.0198, pop:700000, timezone:8},
{name:"Dasmarinas, Philippines", lat:14.3294, lon:120.9367, pop:700000, timezone:8},
{name:"General Santos, Philippines", lat:6.1164, lon:125.1716, pop:700000, timezone:8},
{name:"Bacoor, Philippines", lat:14.4590, lon:120.9420, pop:600000, timezone:8},
{name:"Iloilo City, Philippines", lat:10.7202, lon:122.5621, pop:450000, timezone:8},
{name:"Bacolod, Philippines", lat:10.6760, lon:122.9509, pop:600000, timezone:8},
{name:"Lapu-Lapu, Philippines", lat:10.3103, lon:123.9494, pop:400000, timezone:8},
{name:"Mandaue, Philippines", lat:10.3237, lon:123.9222, pop:350000, timezone:8},
{name:"Angeles, Philippines", lat:15.1450, lon:120.5950, pop:400000, timezone:8},
{name:"Iligan, Philippines", lat:8.2280, lon:124.2452, pop:350000, timezone:8},
{name:"Butuan, Philippines", lat:8.9472, lon:125.5406, pop:350000, timezone:8},
{name:"Tarlac City, Philippines", lat:15.4802, lon:120.5979, pop:350000, timezone:8},
{name:"Lucena, Philippines", lat:13.9314, lon:121.6173, pop:270000, timezone:8},
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
{name:"Lagos, Nigeria", lat:6.5244, lon:3.3792, pop:6000000, timezone:1},
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
/* =========================
   🌍 AFRICA ADDITIONS (+140)
========================= */

// North Africa / Maghreb
{name:"Oran, Algeria", lat:35.6971, lon:-0.6308, pop:1500000, timezone:1},
{name:"Constantine, Algeria", lat:36.3650, lon:6.6147, pop:900000, timezone:1},
{name:"Annaba, Algeria", lat:36.9000, lon:7.7667, pop:600000, timezone:1},
{name:"Blida, Algeria", lat:36.4700, lon:2.8300, pop:500000, timezone:1},
{name:"Batna, Algeria", lat:35.5500, lon:6.1667, pop:400000, timezone:1},
{name:"Sétif, Algeria", lat:36.1900, lon:5.4100, pop:400000, timezone:1},
{name:"Sidi Bel Abbès, Algeria", lat:35.2000, lon:-0.6300, pop:300000, timezone:1},
{name:"Biskra, Algeria", lat:34.8500, lon:5.7300, pop:300000, timezone:1},
{name:"Tébessa, Algeria", lat:35.4000, lon:8.1200, pop:250000, timezone:1},
/* =========================
   🌍 AFRICA – DIVERSE SECONDARY CITIES
========================= */

// North Africa
{name:"Alexandria, Egypt", lat:31.2001, lon:29.9187, pop:5200000, timezone:2},
{name:"Giza, Egypt", lat:30.0131, lon:31.2089, pop:8000000, timezone:2},
{name:"Port Said, Egypt", lat:31.2653, lon:32.3019, pop:750000, timezone:2},
{name:"Suez, Egypt", lat:29.9668, lon:32.5498, pop:700000, timezone:2},
{name:"Luxor, Egypt", lat:25.6872, lon:32.6396, pop:500000, timezone:2},
{name:"Aswan, Egypt", lat:24.0889, lon:32.8998, pop:300000, timezone:2},
{name:"Mansoura, Egypt", lat:31.0364, lon:31.3807, pop:500000, timezone:2},
{name:"Tanta, Egypt", lat:30.7865, lon:31.0004, pop:500000, timezone:2},
{name:"Zagazig, Egypt", lat:30.5877, lon:31.5020, pop:350000, timezone:2},
{name:"Ismailia, Egypt", lat:30.5965, lon:32.2715, pop:400000, timezone:2},
{name:"Faiyum, Egypt", lat:29.3099, lon:30.8418, pop:350000, timezone:2},
{name:"Asyut, Egypt", lat:27.1809, lon:31.1837, pop:450000, timezone:2},
{name:"Minya, Egypt", lat:28.1099, lon:30.7503, pop:300000, timezone:2},
{name:"Sohag, Egypt", lat:26.5569, lon:31.6948, pop:250000, timezone:2},
{name:"Qena, Egypt", lat:26.1551, lon:32.7160, pop:250000, timezone:2},
{name:"Hurghada, Egypt", lat:27.2579, lon:33.8116, pop:250000, timezone:2},
{name:"Sharm El Sheikh, Egypt", lat:27.9158, lon:34.3300, pop:100000, timezone:2},
{name:"Marsa Matruh, Egypt", lat:31.3525, lon:27.2373, pop:100000, timezone:2},
{name:"Damanhur, Egypt", lat:31.0341, lon:30.4682, pop:300000, timezone:2},
{name:"Banha, Egypt", lat:30.4591, lon:31.1786, pop:200000, timezone:2},

{name:"Casablanca, Morocco", lat:33.5731, lon:-7.5898, pop:3700000, timezone:1},
{name:"Fes, Morocco", lat:34.0181, lon:-5.0078, pop:1200000, timezone:1},
{name:"Tangier, Morocco", lat:35.7595, lon:-5.8340, pop:1000000, timezone:1},
{name:"Marrakech, Morocco", lat:31.6295, lon:-7.9811, pop:1000000, timezone:1},
{name:"Agadir, Morocco", lat:30.4278, lon:-9.5981, pop:500000, timezone:1},
{name:"Meknes, Morocco", lat:33.8935, lon:-5.5473, pop:600000, timezone:1},
{name:"Oujda, Morocco", lat:34.6814, lon:-1.9086, pop:500000, timezone:1},
{name:"Kenitra, Morocco", lat:34.2610, lon:-6.5802, pop:450000, timezone:1},
{name:"Tetouan, Morocco", lat:35.5889, lon:-5.3626, pop:400000, timezone:1},
{name:"Safi, Morocco", lat:32.2994, lon:-9.2372, pop:300000, timezone:1},
{name:"Mohammedia, Morocco", lat:33.6861, lon:-7.3830, pop:200000, timezone:1},
{name:"El Jadida, Morocco", lat:33.2316, lon:-8.5007, pop:200000, timezone:1},
{name:"Nador, Morocco", lat:35.1681, lon:-2.9287, pop:200000, timezone:1},
{name:"Beni Mellal, Morocco", lat:32.3373, lon:-6.3498, pop:200000, timezone:1},
{name:"Taza, Morocco", lat:34.2100, lon:-4.0100, pop:150000, timezone:1},
{name:"Settat, Morocco", lat:33.0010, lon:-7.6166, pop:150000, timezone:1},
{name:"Khouribga, Morocco", lat:32.8811, lon:-6.9063, pop:200000, timezone:1},
{name:"Larache, Morocco", lat:35.1932, lon:-6.1557, pop:130000, timezone:1},
{name:"Ksar El Kebir, Morocco", lat:35.0017, lon:-5.9056, pop:120000, timezone:1},
{name:"Guelmim, Morocco", lat:28.9869, lon:-10.0574, pop:120000, timezone:1},

{name:"Algiers, Algeria", lat:36.7538, lon:3.0588, pop:3500000, timezone:1},
{name:"Oran, Algeria", lat:35.6969, lon:-0.6331, pop:1500000, timezone:1},
{name:"Constantine, Algeria", lat:36.3650, lon:6.6147, pop:450000, timezone:1},
{name:"Annaba, Algeria", lat:36.9040, lon:7.7550, pop:350000, timezone:1},
{name:"Blida, Algeria", lat:36.4700, lon:2.8300, pop:300000, timezone:1},
{name:"Batna, Algeria", lat:35.5550, lon:6.1740, pop:300000, timezone:1},
{name:"Djelfa, Algeria", lat:34.6700, lon:3.2500, pop:300000, timezone:1},
{name:"Sétif, Algeria", lat:36.1900, lon:5.4100, pop:300000, timezone:1},
{name:"Sidi Bel Abbès, Algeria", lat:35.1900, lon:-0.6300, pop:250000, timezone:1},
{name:"Biskra, Algeria", lat:34.8500, lon:5.7300, pop:250000, timezone:1},
{name:"Tébessa, Algeria", lat:35.4000, lon:8.1200, pop:200000, timezone:1},
{name:"Tlemcen, Algeria", lat:34.8800, lon:-1.3200, pop:200000, timezone:1},
{name:"Béjaïa, Algeria", lat:36.7500, lon:5.0800, pop:200000, timezone:1},
{name:"Skikda, Algeria", lat:36.8700, lon:6.9000, pop:200000, timezone:1},
{name:"Tiaret, Algeria", lat:35.3700, lon:1.3200, pop:200000, timezone:1},
{name:"Béchar, Algeria", lat:31.6200, lon:-2.2200, pop:150000, timezone:1},
{name:"Mostaganem, Algeria", lat:35.9300, lon:0.0900, pop:150000, timezone:1},
{name:"Tizi Ouzou, Algeria", lat:36.7200, lon:4.0500, pop:150000, timezone:1},
{name:"El Oued, Algeria", lat:33.3700, lon:6.8700, pop:150000, timezone:1},
{name:"Ouargla, Algeria", lat:31.9500, lon:5.3300, pop:150000, timezone:1},

{name:"Tunis, Tunisia", lat:36.8065, lon:10.1815, pop:2300000, timezone:1},
{name:"Sfax, Tunisia", lat:34.7406, lon:10.7603, pop:300000, timezone:1},
{name:"Sousse, Tunisia", lat:35.8256, lon:10.6411, pop:250000, timezone:1},
{name:"Kairouan, Tunisia", lat:35.6781, lon:10.0963, pop:150000, timezone:1},
{name:"Bizerte, Tunisia", lat:37.2744, lon:9.8739, pop:150000, timezone:1},
{name:"Gabès, Tunisia", lat:33.8815, lon:10.0982, pop:150000, timezone:1},
{name:"Ariana, Tunisia", lat:36.8601, lon:10.1934, pop:120000, timezone:1},
{name:"Gafsa, Tunisia", lat:34.4250, lon:8.7842, pop:100000, timezone:1},
{name:"Monastir, Tunisia", lat:35.7770, lon:10.8262, pop:100000, timezone:1},
{name:"Ben Arous, Tunisia", lat:36.7531, lon:10.2189, pop:100000, timezone:1},
{name:"Kasserine, Tunisia", lat:35.1676, lon:8.8365, pop:80000, timezone:1},
{name:"Medenine, Tunisia", lat:33.3549, lon:10.5055, pop:70000, timezone:1},
{name:"Nabeul, Tunisia", lat:36.4561, lon:10.7376, pop:70000, timezone:1},
{name:"Mahdia, Tunisia", lat:35.5047, lon:11.0622, pop:60000, timezone:1},
{name:"Tozeur, Tunisia", lat:33.9197, lon:8.1335, pop:40000, timezone:1},

{name:"Tripoli, Libya", lat:32.8872, lon:13.1913, pop:1200000, timezone:2},
{name:"Benghazi, Libya", lat:32.1167, lon:20.0667, pop:700000, timezone:2},
{name:"Misrata, Libya", lat:32.3754, lon:15.0925, pop:350000, timezone:2},
{name:"Bayda, Libya", lat:32.7627, lon:21.7551, pop:200000, timezone:2},
{name:"Zawiya, Libya", lat:32.7522, lon:12.7278, pop:200000, timezone:2},
{name:"Zliten, Libya", lat:32.4674, lon:14.5687, pop:150000, timezone:2},
{name:"Ajdabiya, Libya", lat:30.7554, lon:20.2263, pop:150000, timezone:2},
{name:"Sabha, Libya", lat:27.0377, lon:14.4283, pop:100000, timezone:2},
{name:"Derna, Libya", lat:32.7569, lon:22.6377, pop:100000, timezone:2},
{name:"Tobruq, Libya", lat:32.0836, lon:23.9764, pop:100000, timezone:2},
{name:"Sirt, Libya", lat:31.2089, lon:16.5887, pop:80000, timezone:2},
{name:"Al Khums, Libya", lat:32.6486, lon:14.2619, pop:80000, timezone:2},
{name:"Ghat, Libya", lat:24.9647, lon:10.1781, pop:20000, timezone:2},
{name:"Ghadames, Libya", lat:30.1333, lon:9.5000, pop:10000, timezone:2},
{name:"Murzuq, Libya", lat:25.9155, lon:13.9184, pop:20000, timezone:2},

// West Africa
{name:"Lagos, Nigeria", lat:6.5244, lon:3.3792, pop:15000000, timezone:1},
{name:"Kano, Nigeria", lat:12.0022, lon:8.5920, pop:4000000, timezone:1},
{name:"Ibadan, Nigeria", lat:7.3775, lon:3.9470, pop:3500000, timezone:1},
{name:"Abuja, Nigeria", lat:9.0765, lon:7.3986, pop:3000000, timezone:1},
{name:"Port Harcourt, Nigeria", lat:4.8156, lon:7.0498, pop:3000000, timezone:1},
{name:"Benin City, Nigeria", lat:6.3350, lon:5.6037, pop:1500000, timezone:1},
{name:"Kaduna, Nigeria", lat:10.5105, lon:7.4165, pop:1500000, timezone:1},
{name:"Maiduguri, Nigeria", lat:11.8333, lon:13.1500, pop:1000000, timezone:1},
{name:"Zaria, Nigeria", lat:11.0667, lon:7.7000, pop:800000, timezone:1},
{name:"Aba, Nigeria", lat:5.1167, lon:7.3667, pop:1000000, timezone:1},
{name:"Jos, Nigeria", lat:9.9167, lon:8.9000, pop:900000, timezone:1},
{name:"Ilorin, Nigeria", lat:8.5000, lon:4.5500, pop:900000, timezone:1},
{name:"Oyo, Nigeria", lat:7.8500, lon:3.9333, pop:500000, timezone:1},
{name:"Enugu, Nigeria", lat:6.4500, lon:7.5000, pop:800000, timezone:1},
{name:"Abeokuta, Nigeria", lat:7.1500, lon:3.3500, pop:500000, timezone:1},
{name:"Sokoto, Nigeria", lat:13.0500, lon:5.2333, pop:600000, timezone:1},
{name:"Onitsha, Nigeria", lat:6.1667, lon:6.7833, pop:500000, timezone:1},
{name:"Warri, Nigeria", lat:5.5167, lon:5.7500, pop:500000, timezone:1},
{name:"Okene, Nigeria", lat:7.5500, lon:6.2333, pop:400000, timezone:1},
{name:"Calabar, Nigeria", lat:4.9500, lon:8.3167, pop:400000, timezone:1},
{name:"Uyo, Nigeria", lat:5.0333, lon:7.9167, pop:400000, timezone:1},
{name:"Akure, Nigeria", lat:7.2500, lon:5.2000, pop:500000, timezone:1},
{name:"Bauchi, Nigeria", lat:10.3158, lon:9.8442, pop:400000, timezone:1},
{name:"Gombe, Nigeria", lat:10.2897, lon:11.1673, pop:300000, timezone:1},
{name:"Katsina, Nigeria", lat:12.9855, lon:7.6171, pop:400000, timezone:1},
{name:"Minna, Nigeria", lat:9.6139, lon:6.5569, pop:300000, timezone:1},
{name:"Makurdi, Nigeria", lat:7.7333, lon:8.5333, pop:300000, timezone:1},
{name:"Lafia, Nigeria", lat:8.4833, lon:8.5167, pop:150000, timezone:1},
{name:"Damaturu, Nigeria", lat:11.7470, lon:11.9608, pop:100000, timezone:1},
{name:"Yola, Nigeria", lat:9.2000, lon:12.4833, pop:300000, timezone:1},
{name:"Jalingo, Nigeria", lat:8.9000, lon:11.3667, pop:150000, timezone:1},
{name:"Birnin Kebbi, Nigeria", lat:12.4500, lon:4.2000, pop:150000, timezone:1},
{name:"Dutse, Nigeria", lat:11.7992, lon:9.3392, pop:100000, timezone:1},
{name:"Gusau, Nigeria", lat:12.1628, lon:6.6614, pop:200000, timezone:1},
{name:"Lokoja, Nigeria", lat:7.8000, lon:6.7333, pop:150000, timezone:1},
{name:"Asaba, Nigeria", lat:6.1833, lon:6.7500, pop:150000, timezone:1},
{name:"Awka, Nigeria", lat:6.2100, lon:7.0700, pop:150000, timezone:1},
{name:"Umuahia, Nigeria", lat:5.5333, lon:7.4833, pop:150000, timezone:1},
{name:"Owerri, Nigeria", lat:5.4833, lon:7.0333, pop:500000, timezone:1},
{name:"Ado Ekiti, Nigeria", lat:7.6167, lon:5.2167, pop:400000, timezone:1},
{name:"Osogbo, Nigeria", lat:7.7667, lon:4.5667, pop:500000, timezone:1},
{name:"Ikeja, Nigeria", lat:6.6000, lon:3.3500, pop:300000, timezone:1},
{name:"Agege, Nigeria", lat:6.6167, lon:3.3167, pop:500000, timezone:1},
{name:"Ikorodu, Nigeria", lat:6.6167, lon:3.5000, pop:500000, timezone:1},
{name:"Badagry, Nigeria", lat:6.4167, lon:2.8833, pop:200000, timezone:1},
{name:"Epe, Nigeria", lat:6.5833, lon:3.9833, pop:100000, timezone:1},

{name:"Accra, Ghana", lat:5.6037, lon:-0.1870, pop:2500000, timezone:0},
{name:"Kumasi, Ghana", lat:6.6885, lon:-1.6244, pop:2000000, timezone:0},
{name:"Tamale, Ghana", lat:9.4008, lon:-0.8393, pop:400000, timezone:0},
{name:"Takoradi, Ghana", lat:4.8845, lon:-1.7554, pop:300000, timezone:0},
{name:"Ashaiman, Ghana", lat:5.6833, lon:-0.0333, pop:300000, timezone:0},
{name:"Sunyani, Ghana", lat:7.3399, lon:-2.3268, pop:150000, timezone:0},
{name:"Cape Coast, Ghana", lat:5.1053, lon:-1.2466, pop:200000, timezone:0},
{name:"Obuasi, Ghana", lat:6.2000, lon:-1.6833, pop:150000, timezone:0},
{name:"Teshie, Ghana", lat:5.5833, lon:-0.1000, pop:150000, timezone:0},
{name:"Tema, Ghana", lat:5.6667, lon:-0.0167, pop:200000, timezone:0},
{name:"Madina, Ghana", lat:5.6833, lon:-0.1667, pop:150000, timezone:0},
{name:"Koforidua, Ghana", lat:6.0941, lon:-0.2591, pop:150000, timezone:0},
{name:"Wa, Ghana", lat:10.0600, lon:-2.5000, pop:100000, timezone:0},
{name:"Bolgatanga, Ghana", lat:10.7856, lon:-0.8514, pop:100000, timezone:0},
{name:"Ho, Ghana", lat:6.6000, lon:0.4667, pop:100000, timezone:0},
{name:"Techiman, Ghana", lat:7.5833, lon:-1.9333, pop:100000, timezone:0},
{name:"Nkawkaw, Ghana", lat:6.5500, lon:-0.7667, pop:50000, timezone:0},
{name:"Winneba, Ghana", lat:5.3500, lon:-0.6333, pop:50000, timezone:0},
{name:"Dunkwa, Ghana", lat:5.9667, lon:-1.7833, pop:50000, timezone:0},
{name:"Berekum, Ghana", lat:7.4500, lon:-2.5833, pop:50000, timezone:0},

{name:"Abidjan, Ivory Coast", lat:5.3600, lon:-4.0083, pop:5000000, timezone:0},
{name:"Bouaké, Ivory Coast", lat:7.6900, lon:-5.0300, pop:800000, timezone:0},
{name:"Daloa, Ivory Coast", lat:6.8770, lon:-6.4500, pop:300000, timezone:0},
{name:"Yamoussoukro, Ivory Coast", lat:6.8276, lon:-5.2893, pop:300000, timezone:0},
{name:"San-Pédro, Ivory Coast", lat:4.7485, lon:-6.6363, pop:250000, timezone:0},
{name:"Korhogo, Ivory Coast", lat:9.4580, lon:-5.6290, pop:250000, timezone:0},
{name:"Man, Ivory Coast", lat:7.4125, lon:-7.5538, pop:150000, timezone:0},
{name:"Divo, Ivory Coast", lat:5.8374, lon:-5.3572, pop:150000, timezone:0},
{name:"Gagnoa, Ivory Coast", lat:6.1319, lon:-5.9506, pop:150000, timezone:0},
{name:"Abengourou, Ivory Coast", lat:6.7297, lon:-3.4964, pop:100000, timezone:0},
{name:"Anyama, Ivory Coast", lat:5.4946, lon:-4.0518, pop:150000, timezone:0},
{name:"Agboville, Ivory Coast", lat:5.9280, lon:-4.2130, pop:100000, timezone:0},
{name:"Grand-Bassam, Ivory Coast", lat:5.2118, lon:-3.7388, pop:80000, timezone:0},
{name:"Bingerville, Ivory Coast", lat:5.3550, lon:-3.8850, pop:50000, timezone:0},
{name:"Dabou, Ivory Coast", lat:5.3256, lon:-4.3767, pop:70000, timezone:0},
{name:"Soubré, Ivory Coast", lat:5.7850, lon:-6.6000, pop:100000, timezone:0},
{name:"Bondoukou, Ivory Coast", lat:8.0402, lon:-2.8000, pop:80000, timezone:0},
{name:"Odienné, Ivory Coast", lat:9.5000, lon:-7.5667, pop:50000, timezone:0},
{name:"Séguéla, Ivory Coast", lat:7.9611, lon:-6.6731, pop:50000, timezone:0},
{name:"Boundiali, Ivory Coast", lat:9.5333, lon:-6.4833, pop:50000, timezone:0},

{name:"Dakar, Senegal", lat:14.7167, lon:-17.4677, pop:3000000, timezone:0},
{name:"Thiès, Senegal", lat:14.7886, lon:-16.9260, pop:300000, timezone:0},
{name:"Rufisque, Senegal", lat:14.7150, lon:-17.2700, pop:200000, timezone:0},
{name:"Kaolack, Senegal", lat:14.1517, lon:-16.0726, pop:200000, timezone:0},
{name:"Saint-Louis, Senegal", lat:16.0179, lon:-16.4896, pop:200000, timezone:0},
{name:"Ziguinchor, Senegal", lat:12.5833, lon:-16.2719, pop:200000, timezone:0},
{name:"Diourbel, Senegal", lat:14.6528, lon:-16.2339, pop:150000, timezone:0},
{name:"Louga, Senegal", lat:15.6181, lon:-16.2264, pop:100000, timezone:0},
{name:"Tambacounda, Senegal", lat:13.7707, lon:-13.6673, pop:100000, timezone:0},
{name:"Mbour, Senegal", lat:14.4198, lon:-16.9638, pop:200000, timezone:0},
{name:"Touba, Senegal", lat:14.8667, lon:-15.8833, pop:500000, timezone:0},
{name:"Richard Toll, Senegal", lat:16.4667, lon:-15.7000, pop:50000, timezone:0},
{name:"Kolda, Senegal", lat:12.8833, lon:-14.9500, pop:80000, timezone:0},
{name:"Fatick, Senegal", lat:14.3333, lon:-16.4000, pop:30000, timezone:0},
{name:"Matam, Senegal", lat:15.6500, lon:-13.2500, pop:20000, timezone:0},
{name:"Kédougou, Senegal", lat:12.5500, lon:-12.1833, pop:20000, timezone:0},
{name:"Sédhiou, Senegal", lat:12.7000, lon:-15.5500, pop:20000, timezone:0},
{name:"Podor, Senegal", lat:16.6500, lon:-14.9667, pop:10000, timezone:0},
{name:"Bakel, Senegal", lat:14.9000, lon:-12.4500, pop:15000, timezone:0},
{name:"Linguère, Senegal", lat:15.3833, lon:-15.1167, pop:15000, timezone:0},

// East Africa
{name:"Nairobi, Kenya", lat:-1.2921, lon:36.8219, pop:4500000, timezone:3},
{name:"Mombasa, Kenya", lat:-4.0435, lon:39.6682, pop:1200000, timezone:3},
{name:"Kisumu, Kenya", lat:-0.0917, lon:34.7680, pop:400000, timezone:3},
{name:"Nakuru, Kenya", lat:-0.3031, lon:36.0800, pop:400000, timezone:3},
{name:"Eldoret, Kenya", lat:0.5143, lon:35.2698, pop:300000, timezone:3},
{name:"Thika, Kenya", lat:-1.0333, lon:37.0667, pop:200000, timezone:3},
{name:"Malindi, Kenya", lat:-3.2175, lon:40.1191, pop:150000, timezone:3},
{name:"Kitale, Kenya", lat:1.0157, lon:35.0062, pop:100000, timezone:3},
{name:"Garissa, Kenya", lat:-0.4536, lon:39.6401, pop:100000, timezone:3},
{name:"Kakamega, Kenya", lat:0.2827, lon:34.7519, pop:100000, timezone:3},
{name:"Nyeri, Kenya", lat:-0.4167, lon:36.9500, pop:100000, timezone:3},
{name:"Meru, Kenya", lat:0.0500, lon:37.6500, pop:100000, timezone:3},
{name:"Machakos, Kenya", lat:-1.5167, lon:37.2667, pop:150000, timezone:3},
{name:"Lamu, Kenya", lat:-2.2717, lon:40.9020, pop:20000, timezone:3},
{name:"Isiolo, Kenya", lat:0.3500, lon:37.5833, pop:50000, timezone:3},
{name:"Nanyuki, Kenya", lat:0.0167, lon:37.0667, pop:40000, timezone:3},
{name:"Naivasha, Kenya", lat:-0.7167, lon:36.4333, pop:50000, timezone:3},
{name:"Kericho, Kenya", lat:-0.3667, lon:35.2833, pop:50000, timezone:3},
{name:"Bungoma, Kenya", lat:0.5667, lon:34.5667, pop:50000, timezone:3},
{name:"Busia, Kenya", lat:0.4500, lon:34.1000, pop:50000, timezone:3},

{name:"Dar es Salaam, Tanzania", lat:-6.7924, lon:39.2083, pop:6000000, timezone:3},
{name:"Mwanza, Tanzania", lat:-2.5167, lon:32.9000, pop:700000, timezone:3},
{name:"Arusha, Tanzania", lat:-3.3869, lon:36.6830, pop:400000, timezone:3},
{name:"Mbeya, Tanzania", lat:-8.9000, lon:33.4500, pop:400000, timezone:3},
{name:"Morogoro, Tanzania", lat:-6.8167, lon:37.6667, pop:300000, timezone:3},
{name:"Tanga, Tanzania", lat:-5.0667, lon:39.1000, pop:250000, timezone:3},
{name:"Dodoma, Tanzania", lat:-6.1630, lon:35.7516, pop:400000, timezone:3},
{name:"Kigoma, Tanzania", lat:-4.8769, lon:29.6267, pop:200000, timezone:3},
{name:"Moshi, Tanzania", lat:-3.3500, lon:37.3333, pop:200000, timezone:3},
{name:"Tabora, Tanzania", lat:-5.0167, lon:32.8000, pop:200000, timezone:3},
{name:"Songea, Tanzania", lat:-10.6833, lon:35.6500, pop:150000, timezone:3},
{name:"Musoma, Tanzania", lat:-1.5000, lon:33.8000, pop:150000, timezone:3},
{name:"Shinyanga, Tanzania", lat:-3.6667, lon:33.4333, pop:150000, timezone:3},
{name:"Iringa, Tanzania", lat:-7.7667, lon:35.7000, pop:150000, timezone:3},
{name:"Singida, Tanzania", lat:-4.8167, lon:34.7500, pop:100000, timezone:3},
{name:"Sumbawanga, Tanzania", lat:-7.9667, lon:31.6167, pop:100000, timezone:3},
{name:"Bukoba, Tanzania", lat:-1.3333, lon:31.8167, pop:100000, timezone:3},
{name:"Lindi, Tanzania", lat:-10.0000, lon:39.7167, pop:50000, timezone:3},
{name:"Mtwara, Tanzania", lat:-10.2667, lon:40.1833, pop:100000, timezone:3},
{name:"Zanzibar City, Tanzania", lat:-6.1659, lon:39.2026, pop:500000, timezone:3},

{name:"Kampala, Uganda", lat:0.3476, lon:32.5825, pop:1500000, timezone:3},
{name:"Gulu, Uganda", lat:2.7667, lon:32.3000, pop:150000, timezone:3},
{name:"Lira, Uganda", lat:2.2500, lon:32.9000, pop:100000, timezone:3},
{name:"Mbarara, Uganda", lat:-0.6000, lon:30.6500, pop:200000, timezone:3},
{name:"Jinja, Uganda", lat:0.4333, lon:33.2000, pop:100000, timezone:3},
{name:"Mbale, Uganda", lat:1.0667, lon:34.1833, pop:100000, timezone:3},
{name:"Mukono, Uganda", lat:0.3500, lon:32.7500, pop:150000, timezone:3},
{name:"Masaka, Uganda", lat:-0.3333, lon:31.7333, pop:100000, timezone:3},
{name:"Entebbe, Uganda", lat:0.0500, lon:32.4500, pop:70000, timezone:3},
{name:"Fort Portal, Uganda", lat:0.6667, lon:30.2833, pop:50000, timezone:3},
{name:"Kabale, Uganda", lat:-1.2500, lon:29.9833, pop:50000, timezone:3},
{name:"Arua, Uganda", lat:3.0167, lon:30.9000, pop:60000, timezone:3},
{name:"Soroti, Uganda", lat:1.7167, lon:33.6167, pop:50000, timezone:3},
{name:"Tororo, Uganda", lat:0.7000, lon:34.1833, pop:50000, timezone:3},
{name:"Hoima, Uganda", lat:1.4333, lon:31.3500, pop:50000, timezone:3},
{name:"Mityana, Uganda", lat:0.4000, lon:32.0500, pop:50000, timezone:3},
{name:"Iganga, Uganda", lat:0.6167, lon:33.4667, pop:50000, timezone:3},
{name:"Luwero, Uganda", lat:0.8333, lon:32.5000, pop:30000, timezone:3},
{name:"Mubende, Uganda", lat:0.5667, lon:31.3833, pop:30000, timezone:3},
{name:"Kasese, Uganda", lat:0.1833, lon:30.0833, pop:50000, timezone:3},

// Southern Africa
{name:"Durban, South Africa", lat:-29.8587, lon:31.0218, pop:3500000, timezone:2},
{name:"Pretoria, South Africa", lat:-25.7479, lon:28.2293, pop:2500000, timezone:2},
{name:"Port Elizabeth, South Africa", lat:-33.9608, lon:25.6022, pop:1200000, timezone:2},
{name:"Bloemfontein, South Africa", lat:-29.0852, lon:26.1596, pop:500000, timezone:2},
{name:"East London, South Africa", lat:-33.0292, lon:27.8546, pop:300000, timezone:2},
{name:"Pietermaritzburg, South Africa", lat:-29.6006, lon:30.3794, pop:500000, timezone:2},
{name:"Kimberley, South Africa", lat:-28.7282, lon:24.7499, pop:250000, timezone:2},
{name:"Polokwane, South Africa", lat:-23.9045, lon:29.4689, pop:500000, timezone:2},
{name:"Nelspruit, South Africa", lat:-25.4753, lon:30.9694, pop:200000, timezone:2},
{name:"Rustenburg, South Africa", lat:-25.6676, lon:27.2421, pop:500000, timezone:2},
{name:"Witbank, South Africa", lat:-25.8772, lon:29.2200, pop:300000, timezone:2},
{name:"Vanderbijlpark, South Africa", lat:-26.7034, lon:27.8077, pop:100000, timezone:2},
{name:"George, South Africa", lat:-33.9642, lon:22.4597, pop:150000, timezone:2},
{name:"Welkom, South Africa", lat:-27.9833, lon:26.7333, pop:150000, timezone:2},
{name:"Klerksdorp, South Africa", lat:-26.8667, lon:26.6667, pop:150000, timezone:2},
{name:"Potchefstroom, South Africa", lat:-26.7167, lon:27.1000, pop:150000, timezone:2},
{name:"Middelburg, South Africa", lat:-25.7750, lon:29.4642, pop:150000, timezone:2},
{name:"Uitenhage, South Africa", lat:-33.7667, lon:25.4000, pop:200000, timezone:2},
{name:"Paarl, South Africa", lat:-33.7333, lon:18.9667, pop:150000, timezone:2},
{name:"Stellenbosch, South Africa", lat:-33.9333, lon:18.8500, pop:100000, timezone:2},
{name:"Somerset West, South Africa", lat:-34.0833, lon:18.8500, pop:100000, timezone:2},
{name:"Worcester, South Africa", lat:-33.6500, lon:19.4333, pop:100000, timezone:2},
{name:"Upington, South Africa", lat:-28.4500, lon:21.2500, pop:70000, timezone:2},
{name:"Mahikeng, South Africa", lat:-25.8500, lon:25.6333, pop:100000, timezone:2},
{name:"Vryheid, South Africa", lat:-27.7667, lon:30.8000, pop:50000, timezone:2},
{name:"Richards Bay, South Africa", lat:-28.7833, lon:32.0333, pop:100000, timezone:2},
{name:"Newcastle, South Africa", lat:-27.7500, lon:29.9333, pop:100000, timezone:2},
{name:"Ladysmith, South Africa", lat:-28.5500, lon:29.7833, pop:70000, timezone:2},

{name:"Lusaka, Zambia", lat:-15.3875, lon:28.3228, pop:2500000, timezone:2},
{name:"Ndola, Zambia", lat:-12.9587, lon:28.6366, pop:500000, timezone:2},
{name:"Kitwe, Zambia", lat:-12.8024, lon:28.2130, pop:500000, timezone:2},
{name:"Kabwe, Zambia", lat:-14.4469, lon:28.4464, pop:200000, timezone:2},
{name:"Chingola, Zambia", lat:-12.5289, lon:27.8700, pop:200000, timezone:2},
{name:"Mufulira, Zambia", lat:-12.5500, lon:28.2333, pop:150000, timezone:2},
{name:"Livingstone, Zambia", lat:-17.8419, lon:25.8543, pop:150000, timezone:2},
{name:"Luanshya, Zambia", lat:-13.1333, lon:28.4000, pop:150000, timezone:2},
{name:"Kasama, Zambia", lat:-10.2167, lon:31.2000, pop:100000, timezone:2},
{name:"Chipata, Zambia", lat:-13.6333, lon:32.6500, pop:100000, timezone:2},
{name:"Solwezi, Zambia", lat:-12.1833, lon:26.4000, pop:100000, timezone:2},
{name:"Mongu, Zambia", lat:-15.2667, lon:23.1333, pop:100000, timezone:2},
{name:"Mazabuka, Zambia", lat:-15.8667, lon:27.7667, pop:70000, timezone:2},
{name:"Kafue, Zambia", lat:-15.7667, lon:28.1833, pop:50000, timezone:2},
{name:"Chililabombwe, Zambia", lat:-12.3667, lon:27.8333, pop:50000, timezone:2},
{name:"Kalulushi, Zambia", lat:-12.8333, lon:28.0833, pop:50000, timezone:2},
{name:"Kapiri Mposhi, Zambia", lat:-13.9667, lon:28.6667, pop:50000, timezone:2},
{name:"Mansa, Zambia", lat:-11.2000, lon:28.8833, pop:50000, timezone:2},
{name:"Petauke, Zambia", lat:-14.2500, lon:31.3333, pop:30000, timezone:2},
{name:"Sesheke, Zambia", lat:-17.4667, lon:24.3000, pop:20000, timezone:2},

{name:"Harare, Zimbabwe", lat:-17.8252, lon:31.0335, pop:1500000, timezone:2},
{name:"Bulawayo, Zimbabwe", lat:-20.1500, lon:28.5833, pop:700000, timezone:2},
{name:"Chitungwiza, Zimbabwe", lat:-18.0167, lon:31.0667, pop:350000, timezone:2},
{name:"Mutare, Zimbabwe", lat:-18.9707, lon:32.6709, pop:200000, timezone:2},
{name:"Gweru, Zimbabwe", lat:-19.4500, lon:29.8167, pop:150000, timezone:2},
{name:"Kwekwe, Zimbabwe", lat:-18.9167, lon:29.8167, pop:100000, timezone:2},
{name:"Kadoma, Zimbabwe", lat:-18.3333, lon:29.9000, pop:100000, timezone:2},
{name:"Masvingo, Zimbabwe", lat:-20.0667, lon:30.8333, pop:100000, timezone:2},
{name:"Chinhoyi, Zimbabwe", lat:-17.3667, lon:30.2000, pop:70000, timezone:2},
{name:"Marondera, Zimbabwe", lat:-18.1833, lon:31.5500, pop:70000, timezone:2},
{name:"Norton, Zimbabwe", lat:-17.8833, lon:30.7000, pop:50000, timezone:2},
{name:"Chegutu, Zimbabwe", lat:-18.1333, lon:30.1500, pop:50000, timezone:2},
{name:"Bindura, Zimbabwe", lat:-17.3000, lon:31.3333, pop:40000, timezone:2},
{name:"Beitbridge, Zimbabwe", lat:-22.2167, lon:30.0000, pop:40000, timezone:2},
{name:"Victoria Falls, Zimbabwe", lat:-17.9243, lon:25.8572, pop:30000, timezone:2},
{name:"Hwange, Zimbabwe", lat:-18.3667, lon:26.5000, pop:30000, timezone:2},
{name:"Kariba, Zimbabwe", lat:-16.5167, lon:28.8000, pop:30000, timezone:2},
{name:"Rusape, Zimbabwe", lat:-18.5333, lon:32.1167, pop:30000, timezone:2},
{name:"Chiredzi, Zimbabwe", lat:-21.0500, lon:31.6667, pop:30000, timezone:2},
{name:"Zvishavane, Zimbabwe", lat:-20.3333, lon:30.0333, pop:30000, timezone:2},
{name:"Tlemcen, Algeria", lat:34.8800, lon:-1.3200, pop:250000, timezone:1},
{name:"Béjaïa, Algeria", lat:36.7500, lon:5.0800, pop:250000, timezone:1},
{name:"Skikda, Algeria", lat:36.8700, lon:6.9100, pop:250000, timezone:1},
{name:"Tiaret, Algeria", lat:35.3700, lon:1.3200, pop:200000, timezone:1},
{name:"Béchar, Algeria", lat:31.6200, lon:-2.2200, pop:200000, timezone:1},
{name:"Mostaganem, Algeria", lat:35.9300, lon:0.0900, pop:200000, timezone:1},

{name:"Tangier, Morocco", lat:35.7595, lon:-5.8340, pop:1200000, timezone:1},
{name:"Fez, Morocco", lat:34.0181, lon:-5.0078, pop:1200000, timezone:1},
{name:"Marrakesh, Morocco", lat:31.6295, lon:-7.9811, pop:1000000, timezone:1},
{name:"Agadir, Morocco", lat:30.4278, lon:-9.5981, pop:900000, timezone:1},
{name:"Meknes, Morocco", lat:33.8935, lon:-5.5473, pop:700000, timezone:1},
{name:"Oujda, Morocco", lat:34.6814, lon:-1.9086, pop:500000, timezone:1},
{name:"Kenitra, Morocco", lat:34.2610, lon:-6.5802, pop:500000, timezone:1},
{name:"Tetouan, Morocco", lat:35.5889, lon:-5.3626, pop:400000, timezone:1},
{name:"Safi, Morocco", lat:32.2994, lon:-9.2372, pop:350000, timezone:1},
{name:"Mohammedia, Morocco", lat:33.6860, lon:-7.3830, pop:300000, timezone:1},
{name:"El Jadida, Morocco", lat:33.2316, lon:-8.5007, pop:250000, timezone:1},
{name:"Nador, Morocco", lat:35.1681, lon:-2.9336, pop:250000, timezone:1},
{name:"Khouribga, Morocco", lat:32.8811, lon:-6.9063, pop:200000, timezone:1},
{name:"Beni Mellal, Morocco", lat:32.3373, lon:-6.3498, pop:200000, timezone:1},

{name:"Sfax, Tunisia", lat:34.7406, lon:10.7603, pop:600000, timezone:1},
{name:"Sousse, Tunisia", lat:35.8256, lon:10.6411, pop:400000, timezone:1},
{name:"Kairouan, Tunisia", lat:35.6781, lon:10.0963, pop:200000, timezone:1},
{name:"Bizerte, Tunisia", lat:37.2744, lon:9.8739, pop:200000, timezone:1},
{name:"Gabès, Tunisia", lat:33.8815, lon:10.0982, pop:150000, timezone:1},
{name:"Ariana, Tunisia", lat:36.8601, lon:10.1934, pop:150000, timezone:1},
{name:"Gafsa, Tunisia", lat:34.4250, lon:8.7842, pop:120000, timezone:1},
{name:"Monastir, Tunisia", lat:35.7770, lon:10.8262, pop:100000, timezone:1},

{name:"Benghazi, Libya", lat:32.1167, lon:20.0667, pop:800000, timezone:2},
{name:"Misrata, Libya", lat:32.3778, lon:15.0920, pop:500000, timezone:2},
{name:"Bayda, Libya", lat:32.7627, lon:21.7551, pop:200000, timezone:2},
{name:"Zawiya, Libya", lat:32.7522, lon:12.7278, pop:200000, timezone:2},
{name:"Zliten, Libya", lat:32.4674, lon:14.5687, pop:150000, timezone:2},
{name:"Tobruq, Libya", lat:32.0836, lon:23.9764, pop:150000, timezone:2},
{name:"Sabha, Libya", lat:27.0377, lon:14.4283, pop:130000, timezone:2},
{name:"Derna, Libya", lat:32.7556, lon:22.6376, pop:100000, timezone:2},

// West Africa (non-Nigeria heavy)
{name:"Bouaké, Ivory Coast", lat:7.6906, lon:-5.0303, pop:800000, timezone:0},
{name:"Daloa, Ivory Coast", lat:6.8774, lon:-6.4502, pop:300000, timezone:0},
{name:"Korhogo, Ivory Coast", lat:9.4581, lon:-5.6297, pop:250000, timezone:0},
{name:"San-Pédro, Ivory Coast", lat:4.7485, lon:-6.6363, pop:200000, timezone:0},
{name:"Yamoussoukro, Ivory Coast", lat:6.8276, lon:-5.2893, pop:300000, timezone:0},
{name:"Man, Ivory Coast", lat:7.4125, lon:-7.5539, pop:200000, timezone:0},
{name:"Gagnoa, Ivory Coast", lat:6.1333, lon:-5.9333, pop:200000, timezone:0},

{name:"Tamale, Ghana", lat:9.4008, lon:-0.8393, pop:600000, timezone:0},
{name:"Sekondi-Takoradi, Ghana", lat:4.9340, lon:-1.7130, pop:500000, timezone:0},
{name:"Ashaiman, Ghana", lat:5.6833, lon:-0.0333, pop:300000, timezone:0},
{name:"Sunyani, Ghana", lat:7.3399, lon:-2.3268, pop:200000, timezone:0},
{name:"Cape Coast, Ghana", lat:5.1053, lon:-1.2466, pop:200000, timezone:0},
{name:"Obuasi, Ghana", lat:6.2000, lon:-1.6833, pop:200000, timezone:0},
{name:"Tema, Ghana", lat:5.6667, lon:-0.0167, pop:300000, timezone:0},
{name:"Koforidua, Ghana", lat:6.0941, lon:-0.2600, pop:150000, timezone:0},
{name:"Ho, Ghana", lat:6.6009, lon:0.4713, pop:120000, timezone:0},

{name:"Thiès, Senegal", lat:14.7886, lon:-16.9260, pop:400000, timezone:0},
{name:"Kaolack, Senegal", lat:14.1519, lon:-16.0756, pop:300000, timezone:0},
{name:"Saint-Louis, Senegal", lat:16.0179, lon:-16.4896, pop:200000, timezone:0},
{name:"Ziguinchor, Senegal", lat:12.5833, lon:-16.2719, pop:200000, timezone:0},
{name:"Diourbel, Senegal", lat:14.6500, lon:-16.2333, pop:150000, timezone:0},
{name:"Louga, Senegal", lat:15.6167, lon:-16.2167, pop:100000, timezone:0},
{name:"Tambacounda, Senegal", lat:13.7708, lon:-13.6672, pop:100000, timezone:0},

{name:"Bobo-Dioulasso, Burkina Faso", lat:11.1781, lon:-4.2979, pop:900000, timezone:0},
{name:"Koudougou, Burkina Faso", lat:12.2500, lon:-2.3667, pop:100000, timezone:0},
{name:"Ouahigouya, Burkina Faso", lat:13.5833, lon:-2.4167, pop:100000, timezone:0},
{name:"Banfora, Burkina Faso", lat:10.6333, lon:-4.7667, pop:100000, timezone:0},

{name:"Sikasso, Mali", lat:11.3167, lon:-5.6667, pop:300000, timezone:0},
{name:"Ségou, Mali", lat:13.4317, lon:-6.2658, pop:200000, timezone:0},
{name:"Mopti, Mali", lat:14.4843, lon:-4.1820, pop:150000, timezone:0},
{name:"Kayes, Mali", lat:14.4500, lon:-11.4333, pop:150000, timezone:0},
{name:"Gao, Mali", lat:16.2667, lon:-0.0500, pop:100000, timezone:0},

{name:"Zinder, Niger", lat:13.8072, lon:8.9883, pop:300000, timezone:1},
{name:"Maradi, Niger", lat:13.5000, lon:7.1000, pop:300000, timezone:1},
{name:"Agadez, Niger", lat:16.9736, lon:7.9911, pop:150000, timezone:1},
{name:"Tahoua, Niger", lat:14.8888, lon:5.2692, pop:150000, timezone:1},

{name:"Nzérékoré, Guinea", lat:7.7500, lon:-8.8167, pop:300000, timezone:0},
{name:"Kankan, Guinea", lat:10.3854, lon:-9.3057, pop:200000, timezone:0},
{name:"Kindia, Guinea", lat:10.0569, lon:-12.8658, pop:150000, timezone:0},
{name:"Labé, Guinea", lat:11.3182, lon:-12.2833, pop:100000, timezone:0},

{name:"Bo, Sierra Leone", lat:7.9647, lon:-11.7383, pop:200000, timezone:0},
{name:"Kenema, Sierra Leone", lat:7.8767, lon:-11.1900, pop:200000, timezone:0},
{name:"Makeni, Sierra Leone", lat:8.8861, lon:-12.0442, pop:100000, timezone:0},

{name:"Gbarnga, Liberia", lat:6.9956, lon:-9.4711, pop:50000, timezone:0},
{name:"Buchanan, Liberia", lat:5.8811, lon:-10.0447, pop:50000, timezone:0},

{name:"Sokodé, Togo", lat:8.9833, lon:1.1333, pop:150000, timezone:0},
{name:"Kara, Togo", lat:9.5511, lon:1.1861, pop:100000, timezone:0},
{name:"Kpalimé, Togo", lat:6.9000, lon:0.6333, pop:100000, timezone:0},

{name:"Parakou, Benin", lat:9.3372, lon:2.6303, pop:300000, timezone:1},
{name:"Djougou, Benin", lat:9.7081, lon:1.6664, pop:150000, timezone:1},
{name:"Bohicon, Benin", lat:7.1783, lon:2.0667, pop:150000, timezone:1},
{name:"Abomey, Benin", lat:7.1833, lon:1.9833, pop:100000, timezone:1},

// Central Africa
{name:"Lubumbashi, DR Congo", lat:-11.6609, lon:27.4794, pop:2500000, timezone:2},
{name:"Mbuji-Mayi, DR Congo", lat:-6.1360, lon:23.5898, pop:2000000, timezone:2},
{name:"Kananga, DR Congo", lat:-5.8962, lon:22.4166, pop:1200000, timezone:2},
{name:"Kisangani, DR Congo", lat:0.5153, lon:25.1909, pop:1200000, timezone:2},
{name:"Bukavu, DR Congo", lat:-2.5083, lon:28.8604, pop:900000, timezone:2},
{name:"Goma, DR Congo", lat:-1.6794, lon:29.2228, pop:800000, timezone:2},
{name:"Kolwezi, DR Congo", lat:-10.7147, lon:25.4667, pop:500000, timezone:2},
{name:"Likasi, DR Congo", lat:-10.9830, lon:26.7330, pop:450000, timezone:2},
{name:"Tshikapa, DR Congo", lat:-6.4162, lon:20.7999, pop:600000, timezone:2},
{name:"Matadi, DR Congo", lat:-5.8166, lon:13.4500, pop:300000, timezone:1},
{name:"Mbandaka, DR Congo", lat:0.0486, lon:18.2603, pop:350000, timezone:1},
{name:"Bunia, DR Congo", lat:1.5600, lon:30.2500, pop:400000, timezone:2},
{name:"Butembo, DR Congo", lat:0.1416, lon:29.2917, pop:300000, timezone:2},
{name:"Uvira, DR Congo", lat:-3.3953, lon:29.1378, pop:250000, timezone:2},

{name:"Pointe-Noire, Congo", lat:-4.7761, lon:11.8635, pop:1200000, timezone:1},
{name:"Dolisie, Congo", lat:-4.1983, lon:12.6666, pop:100000, timezone:1},
{name:"Nkayi, Congo", lat:-4.1833, lon:13.2833, pop:80000, timezone:1},

{name:"Bafoussam, Cameroon", lat:5.4737, lon:10.4179, pop:400000, timezone:1},
{name:"Garoua, Cameroon", lat:9.3012, lon:13.3921, pop:350000, timezone:1},
{name:"Maroua, Cameroon", lat:10.5910, lon:14.3159, pop:300000, timezone:1},
{name:"Bamenda, Cameroon", lat:5.9631, lon:10.1591, pop:400000, timezone:1},
{name:"Ngaoundéré, Cameroon", lat:7.3167, lon:13.5833, pop:250000, timezone:1},
{name:"Kumba, Cameroon", lat:4.6363, lon:9.4469, pop:200000, timezone:1},
{name:"Buea, Cameroon", lat:4.1550, lon:9.2420, pop:150000, timezone:1},
{name:"Limbé, Cameroon", lat:4.0225, lon:9.2050, pop:120000, timezone:1},

{name:"Franceville, Gabon", lat:-1.6333, lon:13.5833, pop:110000, timezone:1},
{name:"Port-Gentil, Gabon", lat:-0.7193, lon:8.7815, pop:140000, timezone:1},
{name:"Oyem, Gabon", lat:1.5995, lon:11.5793, pop:60000, timezone:1},

{name:"Berbérati, Central African Republic", lat:4.2611, lon:15.7894, pop:100000, timezone:1},
{name:"Carnot, Central African Republic", lat:4.9333, lon:15.8833, pop:50000, timezone:1},
{name:"Bambari, Central African Republic", lat:5.7667, lon:20.6667, pop:50000, timezone:1},

{name:"Moundou, Chad", lat:8.5667, lon:16.0833, pop:200000, timezone:1},
{name:"Sarh, Chad", lat:9.1500, lon:18.3833, pop:150000, timezone:1},
{name:"Abéché, Chad", lat:13.8292, lon:20.8324, pop:100000, timezone:1},

// East Africa
{name:"Mombasa, Kenya", lat:-4.0435, lon:39.6682, pop:1400000, timezone:3},
{name:"Kisumu, Kenya", lat:-0.0917, lon:34.7680, pop:500000, timezone:3},
{name:"Nakuru, Kenya", lat:-0.3031, lon:36.0800, pop:400000, timezone:3},
{name:"Eldoret, Kenya", lat:0.5143, lon:35.2698, pop:400000, timezone:3},
{name:"Thika, Kenya", lat:-1.0333, lon:37.0693, pop:250000, timezone:3},
{name:"Malindi, Kenya", lat:-3.2175, lon:40.1191, pop:150000, timezone:3},
{name:"Kitale, Kenya", lat:1.0157, lon:35.0062, pop:150000, timezone:3},
{name:"Garissa, Kenya", lat:-0.4569, lon:39.6463, pop:150000, timezone:3},

{name:"Arusha, Tanzania", lat:-3.3869, lon:36.6830, pop:600000, timezone:3},
{name:"Mwanza, Tanzania", lat:-2.5164, lon:32.9175, pop:800000, timezone:3},
{name:"Dodoma, Tanzania", lat:-6.1630, lon:35.7516, pop:500000, timezone:3},
{name:"Mbeya, Tanzania", lat:-8.9000, lon:33.4500, pop:500000, timezone:3},
{name:"Morogoro, Tanzania", lat:-6.8200, lon:37.6700, pop:400000, timezone:3},
{name:"Tanga, Tanzania", lat:-5.0667, lon:39.1000, pop:300000, timezone:3},
{name:"Zanzibar City, Tanzania", lat:-6.1659, lon:39.2026, pop:500000, timezone:3},
{name:"Kigoma, Tanzania", lat:-4.8769, lon:29.6267, pop:200000, timezone:3},

{name:"Gulu, Uganda", lat:2.7746, lon:32.2989, pop:200000, timezone:3},
{name:"Mbarara, Uganda", lat:-0.6080, lon:30.6580, pop:250000, timezone:3},
{name:"Jinja, Uganda", lat:0.4370, lon:33.2030, pop:250000, timezone:3},
{name:"Mbale, Uganda", lat:1.0820, lon:34.1750, pop:150000, timezone:3},
{name:"Fort Portal, Uganda", lat:0.6710, lon:30.2750, pop:100000, timezone:3},

{name:"Dire Dawa, Ethiopia", lat:9.5931, lon:41.8660, pop:400000, timezone:3},
{name:"Mekelle, Ethiopia", lat:13.4967, lon:39.4753, pop:400000, timezone:3},
{name:"Gondar, Ethiopia", lat:12.6000, lon:37.4667, pop:400000, timezone:3},
{name:"Bahir Dar, Ethiopia", lat:11.5936, lon:37.3908, pop:350000, timezone:3},
{name:"Hawassa, Ethiopia", lat:7.0500, lon:38.4667, pop:350000, timezone:3},
{name:"Jimma, Ethiopia", lat:7.6667, lon:36.8333, pop:250000, timezone:3},
{name:"Dessie, Ethiopia", lat:11.1333, lon:39.6333, pop:200000, timezone:3},
{name:"Adama, Ethiopia", lat:8.5500, lon:39.2667, pop:400000, timezone:3},

{name:"Hargeisa, Somalia", lat:9.5600, lon:44.0650, pop:900000, timezone:3},
{name:"Bosaso, Somalia", lat:11.2842, lon:49.1816, pop:200000, timezone:3},
{name:"Kismayo, Somalia", lat:-0.3582, lon:42.5454, pop:200000, timezone:3},
{name:"Merca, Somalia", lat:1.7159, lon:44.7713, pop:150000, timezone:3},
{name:"Garowe, Somalia", lat:8.4021, lon:48.4823, pop:100000, timezone:3},

{name:"Asmara, Eritrea", lat:15.3381, lon:38.9318, pop:900000, timezone:3},
{name:"Keren, Eritrea", lat:15.7779, lon:38.4511, pop:100000, timezone:3},
{name:"Massawa, Eritrea", lat:15.6097, lon:39.4500, pop:50000, timezone:3},

{name:"Djibouti City, Djibouti", lat:11.5886, lon:43.1450, pop:600000, timezone:3},
{name:"Ali Sabieh, Djibouti", lat:11.1558, lon:42.7125, pop:50000, timezone:3},

// Southern Africa
{name:"Bulawayo, Zimbabwe", lat:-20.1500, lon:28.5833, pop:700000, timezone:2},
{name:"Chitungwiza, Zimbabwe", lat:-18.0127, lon:31.0756, pop:400000, timezone:2},
{name:"Mutare, Zimbabwe", lat:-18.9707, lon:32.6709, pop:200000, timezone:2},
{name:"Gweru, Zimbabwe", lat:-19.4500, lon:29.8167, pop:150000, timezone:2},
{name:"Kwekwe, Zimbabwe", lat:-18.9167, lon:29.8167, pop:100000, timezone:2},
{name:"Kadoma, Zimbabwe", lat:-18.3333, lon:29.9167, pop:100000, timezone:2},
{name:"Masvingo, Zimbabwe", lat:-20.0744, lon:30.8328, pop:100000, timezone:2},

{name:"Ndola, Zambia", lat:-12.9587, lon:28.6366, pop:500000, timezone:2},
{name:"Kitwe, Zambia", lat:-12.8024, lon:28.2132, pop:500000, timezone:2},
{name:"Chingola, Zambia", lat:-12.5290, lon:27.8821, pop:200000, timezone:2},
{name:"Mufulira, Zambia", lat:-12.5500, lon:28.2400, pop:150000, timezone:2},
{name:"Luanshya, Zambia", lat:-13.1333, lon:28.4000, pop:150000, timezone:2},
{name:"Livingstone, Zambia", lat:-17.8419, lon:25.8543, pop:150000, timezone:2},
{name:"Kasama, Zambia", lat:-10.2129, lon:31.1808, pop:150000, timezone:2},

{name:"Beira, Mozambique", lat:-19.8436, lon:34.8389, pop:600000, timezone:2},
{name:"Nampula, Mozambique", lat:-15.1165, lon:39.2666, pop:700000, timezone:2},
{name:"Matola, Mozambique", lat:-25.9622, lon:32.4589, pop:1200000, timezone:2},
{name:"Quelimane, Mozambique", lat:-17.8786, lon:36.8883, pop:250000, timezone:2},
{name:"Tete, Mozambique", lat:-16.1566, lon:33.5867, pop:250000, timezone:2},
{name:"Xai-Xai, Mozambique", lat:-25.0519, lon:33.6442, pop:150000, timezone:2},
{name:"Pemba, Mozambique", lat:-12.9740, lon:40.5178, pop:200000, timezone:2},
{name:"Lichinga, Mozambique", lat:-13.3128, lon:35.2406, pop:150000, timezone:2},

{name:"Francistown, Botswana", lat:-21.1700, lon:27.5100, pop:150000, timezone:2},
{name:"Molepolole, Botswana", lat:-24.4066, lon:25.4951, pop:70000, timezone:2},
{name:"Maun, Botswana", lat:-19.9833, lon:23.4167, pop:60000, timezone:2},
{name:"Serowe, Botswana", lat:-22.3833, lon:26.7100, pop:50000, timezone:2},

{name:"Walvis Bay, Namibia", lat:-22.9575, lon:14.5053, pop:100000, timezone:2},
{name:"Rundu, Namibia", lat:-17.9333, lon:19.7667, pop:80000, timezone:2},
{name:"Oshakati, Namibia", lat:-17.7833, lon:15.6833, pop:50000, timezone:2},
{name:"Swakopmund, Namibia", lat:-22.6833, lon:14.5333, pop:50000, timezone:2},

{name:"Blantyre, Malawi", lat:-15.7861, lon:35.0058, pop:1000000, timezone:2},
{name:"Lilongwe, Malawi", lat:-13.9626, lon:33.7741, pop:1200000, timezone:2},
{name:"Mzuzu, Malawi", lat:-11.4587, lon:34.0151, pop:200000, timezone:2},
{name:"Zomba, Malawi", lat:-15.3833, lon:35.3333, pop:150000, timezone:2},

{name:"Toamasina, Madagascar", lat:-18.1492, lon:49.4023, pop:300000, timezone:3},
{name:"Antsirabe, Madagascar", lat:-19.8667, lon:47.0333, pop:250000, timezone:3},
{name:"Fianarantsoa, Madagascar", lat:-21.4333, lon:47.0833, pop:200000, timezone:3},
{name:"Mahajanga, Madagascar", lat:-15.7167, lon:46.3167, pop:250000, timezone:3},
{name:"Toliara, Madagascar", lat:-23.3500, lon:43.6667, pop:150000, timezone:3},
{name:"Antsiranana, Madagascar", lat:-12.2787, lon:49.2917, pop:100000, timezone:3},

{name:"Port Louis, Mauritius", lat:-20.1609, lon:57.5012, pop:150000, timezone:4},
{name:"Beau Bassin-Rose Hill, Mauritius", lat:-20.2333, lon:57.4667, pop:100000, timezone:4},
{name:"Vacoas-Phoenix, Mauritius", lat:-20.3000, lon:57.5000, pop:100000, timezone:4},
{name:"Curepipe, Mauritius", lat:-20.3167, lon:57.5167, pop:80000, timezone:4},

{name:"Saint-Denis, Réunion", lat:-20.8789, lon:55.4481, pop:150000, timezone:4},
{name:"Saint-Paul, Réunion", lat:-21.0096, lon:55.2707, pop:100000, timezone:4},
{name:"Saint-Pierre, Réunion", lat:-21.3393, lon:55.4781, pop:80000, timezone:4},
{name:"Accra, Ghana", lat:5.6037, lon:-0.1870, pop:4200000, timezone:0},
{name:"Dakar, Senegal", lat:14.7167, lon:-17.4677, pop:3500000, timezone:0},
{name:"Bamako, Mali", lat:12.6392, lon:-8.0029, pop:2800000, timezone:0},
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
{name:"Sikasso, Mali", lat:11.3167, lon:-5.6667, pop:300000, timezone:0},
{name:"Ségou, Mali", lat:13.4317, lon:-6.2658, pop:200000, timezone:0},
{name:"Mopti, Mali", lat:14.4843, lon:-4.1820, pop:150000, timezone:0},
{name:"Kayes, Mali", lat:14.4500, lon:-11.4333, pop:150000, timezone:0},
{name:"Gao, Mali", lat:16.2667, lon:-0.0500, pop:100000, timezone:0},
{name:"Timbuktu, Mali", lat:16.7733, lon:-3.0074, pop:50000, timezone:0},
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
{name:"Bouaké, Ivory Coast", lat:7.6906, lon:-5.0303, pop:800000, timezone:0},
{name:"Daloa, Ivory Coast", lat:6.8774, lon:-6.4502, pop:300000, timezone:0},
{name:"Korhogo, Ivory Coast", lat:9.4581, lon:-5.6297, pop:250000, timezone:0},
{name:"San-Pédro, Ivory Coast", lat:4.7485, lon:-6.6363, pop:200000, timezone:0},
{name:"Yamoussoukro, Ivory Coast", lat:6.8276, lon:-5.2893, pop:300000, timezone:0},
{name:"Man, Ivory Coast", lat:7.4125, lon:-7.5539, pop:200000, timezone:0},
{name:"Gagnoa, Ivory Coast", lat:6.1333, lon:-5.9333, pop:200000, timezone:0},
{name:"Abengourou, Ivory Coast", lat:6.7297, lon:-3.4964, pop:150000, timezone:0},
{name:"Divo, Ivory Coast", lat:5.8372, lon:-5.3572, pop:150000, timezone:0},
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

{name:"Melbourne, Australia", lat:-37.8136, lon:144.9631, pop:5100000, timezone:10},
{name:"Brisbane, Australia", lat:-27.4698, lon:153.0251, pop:2600000, timezone:10},
{name:"Perth, Australia", lat:-31.9505, lon:115.8605, pop:2100000, timezone:8},
{name:"Adelaide, Australia", lat:-34.9285, lon:138.6007, pop:1400000, timezone:9.5},

{name:"Gold Coast, Australia", lat:-28.0167, lon:153.4000, pop:700000, timezone:10},

{name:"Canberra, Australia", lat:-35.2809, lon:149.1300, pop:450000, timezone:10},
{name:"Sunshine Coast, Australia", lat:-26.6500, lon:153.0667, pop:350000, timezone:10},
/* =========================
   🇦🇺 AUSTRALIA / OCEANIA ADDITIONS (+50)
========================= */

// Australia secondary
{name:"Newcastle, Australia", lat:-32.9283, lon:151.7817, pop:500000, timezone:10},
{name:"Wollongong, Australia", lat:-34.4278, lon:150.8931, pop:300000, timezone:10},
{name:"Geelong, Australia", lat:-38.1499, lon:144.3617, pop:280000, timezone:10},
{name:"Townsville, Australia", lat:-19.2589, lon:146.8169, pop:200000, timezone:10},
{name:"Cairns, Australia", lat:-16.9186, lon:145.7781, pop:180000, timezone:10},
{name:"Toowoomba, Australia", lat:-27.5598, lon:151.9507, pop:170000, timezone:10},
{name:"Ballarat, Australia", lat:-37.5622, lon:143.8503, pop:120000, timezone:10},
{name:"Bendigo, Australia", lat:-36.7570, lon:144.2794, pop:120000, timezone:10},
{name:"Launceston, Australia", lat:-41.4332, lon:147.1441, pop:90000, timezone:10},
{name:"Mackay, Australia", lat:-21.1411, lon:149.1860, pop:90000, timezone:10},
{name:"Rockhampton, Australia", lat:-23.3781, lon:150.5136, pop:80000, timezone:10},
{name:"Bunbury, Australia", lat:-33.3271, lon:115.6414, pop:80000, timezone:8},
{name:"Bundaberg, Australia", lat:-24.8661, lon:152.3489, pop:70000, timezone:10},
{name:"Hervey Bay, Australia", lat:-25.2882, lon:152.8709, pop:60000, timezone:10},
{name:"Wagga Wagga, Australia", lat:-35.1082, lon:147.3598, pop:60000, timezone:10},
{name:"Coffs Harbour, Australia", lat:-30.2963, lon:153.1135, pop:70000, timezone:10},
{name:"Gladstone, Australia", lat:-23.8485, lon:151.2565, pop:50000, timezone:10},
{name:"Mildura, Australia", lat:-34.1855, lon:142.1625, pop:50000, timezone:10},
{name:"Shepparton, Australia", lat:-36.3805, lon:145.3989, pop:50000, timezone:10},
{name:"Port Macquarie, Australia", lat:-31.4308, lon:152.9089, pop:50000, timezone:10},
{name:"Tamworth, Australia", lat:-31.0927, lon:150.9320, pop:45000, timezone:10},
{name:"Orange, Australia", lat:-33.2839, lon:149.1003, pop:40000, timezone:10},
{name:"Dubbo, Australia", lat:-32.2430, lon:148.6017, pop:40000, timezone:10},
{name:"Geraldton, Australia", lat:-28.7774, lon:114.6145, pop:40000, timezone:8},
{name:"Kalgoorlie, Australia", lat:-30.7489, lon:121.4658, pop:30000, timezone:8},
{name:"Albany, Australia", lat:-35.0228, lon:117.8814, pop:35000, timezone:8},
{name:"Mount Gambier, Australia", lat:-37.8284, lon:140.7807, pop:30000, timezone:9.5},
{name:"Whyalla, Australia", lat:-33.0333, lon:137.5833, pop:22000, timezone:9.5},
{name:"Broken Hill, Australia", lat:-31.9539, lon:141.4539, pop:18000, timezone:9.5},
{name:"Port Hedland, Australia", lat:-20.3107, lon:118.5861, pop:15000, timezone:8},
{name:"Karratha, Australia", lat:-20.7364, lon:116.8460, pop:17000, timezone:8},
{name:"Albury, Australia", lat:-36.0737, lon:146.9135, pop:55000, timezone:10},
{name:"Bathurst, Australia", lat:-33.4193, lon:149.5775, pop:37000, timezone:10},
{name:"Armidale, Australia", lat:-30.5016, lon:151.6662, pop:25000, timezone:10},
{name:"Lismore, Australia", lat:-28.8135, lon:153.2773, pop:30000, timezone:10},
{name:"Tweed Heads, Australia", lat:-28.1750, lon:153.5400, pop:60000, timezone:10},
{name:"Grafton, Australia", lat:-29.6911, lon:152.9330, pop:20000, timezone:10},
{name:"Nowra, Australia", lat:-34.8840, lon:150.6000, pop:35000, timezone:10},
{name:"Goulburn, Australia", lat:-34.7540, lon:149.7180, pop:24000, timezone:10},
{name:"Queanbeyan, Australia", lat:-35.3540, lon:149.2320, pop:40000, timezone:10},
{name:"Griffith, Australia", lat:-34.2880, lon:146.0480, pop:20000, timezone:10},
{name:"Warrnambool, Australia", lat:-38.3810, lon:142.4880, pop:35000, timezone:10},
{name:"Traralgon, Australia", lat:-38.1950, lon:146.5400, pop:25000, timezone:10},
{name:"Bairnsdale, Australia", lat:-37.8250, lon:147.6300, pop:15000, timezone:10},
{name:"Frankston, Australia", lat:-38.1440, lon:145.1230, pop:140000, timezone:10},
{name:"Cranbourne, Australia", lat:-38.1000, lon:145.2830, pop:60000, timezone:10},
{name:"Pakenham, Australia", lat:-38.0710, lon:145.4860, pop:50000, timezone:10},
{name:"Craigieburn, Australia", lat:-37.6000, lon:144.9410, pop:60000, timezone:10},
{name:"Melton, Australia", lat:-37.6830, lon:144.5830, pop:70000, timezone:10},
{name:"Werribee, Australia", lat:-37.9000, lon:144.6610, pop:50000, timezone:10},
{name:"Point Cook, Australia", lat:-37.9140, lon:144.7510, pop:60000, timezone:10},
{name:"Tarneit, Australia", lat:-37.8840, lon:144.6720, pop:50000, timezone:10},
{name:"Sunbury, Australia", lat:-37.5790, lon:144.7290, pop:40000, timezone:10},
{name:"Burnie, Australia", lat:-41.0550, lon:145.9070, pop:20000, timezone:10},
{name:"Devonport, Australia", lat:-41.1800, lon:146.3500, pop:25000, timezone:10},
{name:"Ulverstone, Australia", lat:-41.1570, lon:146.2370, pop:15000, timezone:10},
{name:"Whyalla, Australia", lat:-33.0333, lon:137.5833, pop:22000, timezone:9.5},
{name:"Port Augusta, Australia", lat:-32.4930, lon:137.7640, pop:14000, timezone:9.5},
{name:"Port Pirie, Australia", lat:-33.1860, lon:138.0170, pop:14000, timezone:9.5},
{name:"Murray Bridge, Australia", lat:-35.1200, lon:139.2750, pop:20000, timezone:9.5},
{name:"Mount Barker, Australia", lat:-35.0670, lon:138.8580, pop:18000, timezone:9.5},
{name:"Victor Harbor, Australia", lat:-35.5500, lon:138.6170, pop:15000, timezone:9.5},
{name:"Gawler, Australia", lat:-34.6000, lon:138.7330, pop:25000, timezone:9.5},
{name:"Mount Gambier, Australia", lat:-37.8284, lon:140.7807, pop:30000, timezone:9.5},
{name:"Broome, Australia", lat:-17.9614, lon:122.2359, pop:15000, timezone:8},
{name:"Alice Springs, Australia", lat:-23.6980, lon:133.8807, pop:25000, timezone:9.5},
{name:"Katherine, Australia", lat:-14.4652, lon:132.2635, pop:10000, timezone:9.5},

// New Zealand secondary
{name:"Hamilton, New Zealand", lat:-37.7870, lon:175.2793, pop:180000, timezone:12},
{name:"Tauranga, New Zealand", lat:-37.6878, lon:176.1651, pop:160000, timezone:12},
{name:"Dunedin, New Zealand", lat:-45.8742, lon:170.5036, pop:130000, timezone:12},
{name:"Palmerston North, New Zealand", lat:-40.3523, lon:175.6082, pop:90000, timezone:12},
{name:"Nelson, New Zealand", lat:-41.2706, lon:173.2840, pop:50000, timezone:12},
{name:"Rotorua, New Zealand", lat:-38.1368, lon:176.2497, pop:60000, timezone:12},
{name:"New Plymouth, New Zealand", lat:-39.0556, lon:174.0752, pop:60000, timezone:12},
{name:"Whangarei, New Zealand", lat:-35.7251, lon:174.3237, pop:55000, timezone:12},
{name:"Invercargill, New Zealand", lat:-46.4132, lon:168.3538, pop:50000, timezone:12},
{name:"Whanganui, New Zealand", lat:-39.9333, lon:175.0500, pop:40000, timezone:12},
{name:"Gisborne, New Zealand", lat:-38.6623, lon:178.0176, pop:37000, timezone:12},
{name:"Timaru, New Zealand", lat:-44.3969, lon:171.2536, pop:30000, timezone:12},
{name:"Napier, New Zealand", lat:-39.4928, lon:176.9120, pop:65000, timezone:12},
{name:"Hastings, New Zealand", lat:-39.6456, lon:176.8433, pop:50000, timezone:12},
{name:"Blenheim, New Zealand", lat:-41.5111, lon:173.9539, pop:30000, timezone:12},
{name:"Pukekohe, New Zealand", lat:-37.2000, lon:174.9000, pop:25000, timezone:12},
{name:"Cambridge, New Zealand", lat:-37.8833, lon:175.4333, pop:20000, timezone:12},
{name:"Te Awamutu, New Zealand", lat:-38.0167, lon:175.3167, pop:15000, timezone:12},
{name:"Masterton, New Zealand", lat:-40.9597, lon:175.6575, pop:25000, timezone:12},
{name:"Levin, New Zealand", lat:-40.6333, lon:175.2833, pop:20000, timezone:12},
{name:"Ashburton, New Zealand", lat:-43.9053, lon:171.7497, pop:20000, timezone:12},
{name:"Oamaru, New Zealand", lat:-45.0965, lon:170.9714, pop:14000, timezone:12},
{name:"Gore, New Zealand", lat:-46.1028, lon:168.9436, pop:10000, timezone:12},
{name:"Queenstown, New Zealand", lat:-45.0312, lon:168.6626, pop:16000, timezone:12},
{name:"Wanaka, New Zealand", lat:-44.7000, lon:169.1500, pop:10000, timezone:12},
{name:"Hobart, Australia", lat:-42.8821, lon:147.3272, pop:250000, timezone:10},
{name:"Darwin, Australia", lat:-12.4634, lon:130.8456, pop:150000, timezone:9.5},

/* =========================
   🌊 OCEANIA (30)
========================= */

/* =========================
   🌊 OCEANIA – 40 NEW CITIES (no Australia, no duplicates)
========================= */

// New Zealand secondary
{name:"Dunedin, New Zealand", lat:-45.8742, lon:170.5036, pop:130000, timezone:12},
{name:"Palmerston North, New Zealand", lat:-40.3523, lon:175.6082, pop:90000, timezone:12},
{name:"Nelson, New Zealand", lat:-41.2706, lon:173.2840, pop:50000, timezone:12},
{name:"Rotorua, New Zealand", lat:-38.1368, lon:176.2497, pop:60000, timezone:12},
{name:"New Plymouth, New Zealand", lat:-39.0556, lon:174.0752, pop:60000, timezone:12},
{name:"Whangarei, New Zealand", lat:-35.7251, lon:174.3237, pop:55000, timezone:12},
{name:"Invercargill, New Zealand", lat:-46.4132, lon:168.3538, pop:50000, timezone:12},
{name:"Whanganui, New Zealand", lat:-39.9333, lon:175.0500, pop:40000, timezone:12},
{name:"Gisborne, New Zealand", lat:-38.6623, lon:178.0176, pop:37000, timezone:12},
{name:"Timaru, New Zealand", lat:-44.3969, lon:171.2536, pop:30000, timezone:12},
{name:"Napier, New Zealand", lat:-39.4928, lon:176.9120, pop:65000, timezone:12},
{name:"Hastings, New Zealand", lat:-39.6456, lon:176.8433, pop:50000, timezone:12},
{name:"Blenheim, New Zealand", lat:-41.5111, lon:173.9539, pop:30000, timezone:12},
/* =========================
   MULTI-CIRCLE CITIES
   (City + surrounding areas)
========================= */

// ========== NEW YORK CITY ==========
{name:"NYC - Manhattan", lat:40.7831, lon:-73.9712, pop:1800000, timezone:-5},
{name:"NYC - Brooklyn", lat:40.6782, lon:-73.9442, pop:2600000, timezone:-5},
{name:"NYC - Queens", lat:40.7282, lon:-73.7949, pop:2400000, timezone:-5},
{name:"NYC - Bronx", lat:40.8448, lon:-73.8648, pop:1500000, timezone:-5},
{name:"NYC - Staten Island", lat:40.5795, lon:-74.1502, pop:500000, timezone:-5},
{name:"NYC - Jersey City", lat:40.7178, lon:-74.0431, pop:300000, timezone:-5},
{name:"NYC - Newark", lat:40.7357, lon:-74.1724, pop:310000, timezone:-5},
{name:"NYC - Yonkers", lat:40.9312, lon:-73.8987, pop:200000, timezone:-5},
{name:"NYC - New Rochelle", lat:40.9115, lon:-73.7823, pop:80000, timezone:-5},
{name:"NYC - White Plains", lat:41.0330, lon:-73.7629, pop:60000, timezone:-5},
{name:"NYC - Hempstead", lat:40.7062, lon:-73.6187, pop:80000, timezone:-5},
{name:"NYC - Long Beach", lat:40.5884, lon:-73.6579, pop:35000, timezone:-5},

// ========== LOS ANGELES ==========
{name:"LA - Downtown", lat:34.0407, lon:-118.2468, pop:600000, timezone:-8},
{name:"LA - Hollywood", lat:34.0928, lon:-118.3287, pop:350000, timezone:-8},
{name:"LA - Santa Monica", lat:34.0195, lon:-118.4912, pop:100000, timezone:-8},
{name:"LA - Long Beach", lat:33.7701, lon:-118.1937, pop:470000, timezone:-8},
{name:"LA - Pasadena", lat:34.1478, lon:-118.1445, pop:150000, timezone:-8},
{name:"LA - Glendale", lat:34.1425, lon:-118.2551, pop:200000, timezone:-8},
{name:"LA - Burbank", lat:34.1808, lon:-118.3090, pop:110000, timezone:-8},
{name:"LA - Torrance", lat:33.8358, lon:-118.3406, pop:150000, timezone:-8},
{name:"LA - Inglewood", lat:33.9617, lon:-118.3531, pop:110000, timezone:-8},
{name:"LA - Compton", lat:33.8958, lon:-118.2201, pop:100000, timezone:-8},
{name:"LA - Anaheim", lat:33.8366, lon:-117.9143, pop:350000, timezone:-8},
{name:"LA - Irvine", lat:33.6846, lon:-117.8265, pop:310000, timezone:-8},
{name:"LA - Santa Ana", lat:33.7455, lon:-117.8677, pop:320000, timezone:-8},
// ==========================
// 🌃 RESTORED METRO BASE CIRCLES
// ==========================

// North America
{name:"New York City, USA", lat:40.7128, lon:-74.0060, pop:7000000, timezone:-5},
{name:"Los Angeles, USA", lat:34.0522, lon:-118.2437, pop:4000000, timezone:-8},
{name:"San Francisco, USA", lat:37.7749, lon:-122.4194, pop:700000, timezone:-8},
{name:"Seattle, USA", lat:47.6062, lon:-122.3321, pop:100000, timezone:-8},
{name:"Las Vegas, USA", lat:36.1699, lon:-115.1398, pop:100000, timezone:-8},
{name:"Vancouver, Canada", lat:49.2827, lon:-123.1207, pop:700000, timezone:-8},
{name:"Boston, USA", lat:42.3601, lon:-71.0589, pop:700000, timezone:-5},

// Asia
{name:"Tokyo, Japan", lat:35.6762, lon:139.6503, pop:7000000, timezone:9},
{name:"Shanghai, China", lat:31.2304, lon:121.4737, pop:1000000, timezone:8},
{name:"Hong Kong, China", lat:22.3193, lon:114.1694, pop:7000000, timezone:8},
{name:"Singapore, Singapore", lat:1.3521, lon:103.8198, pop:900000, timezone:8},
{name:"Bangkok, Thailand", lat:13.7563, lon:100.5018, pop:7000000, timezone:7},
{name:"Manila, Philippines", lat:14.5995, lon:120.9842, pop:5000000, timezone:8},
{name:"Mumbai, India", lat:19.0760, lon:72.8777, pop:2000000, timezone:5.5},
{name:"Osaka, Japan", lat:34.6937, lon:135.5023, pop:7000000, timezone:9},

// Middle East
{name:"Dubai, UAE", lat:25.2048, lon:55.2708, pop:5000000, timezone:4},
{name:"Istanbul, Turkey", lat:41.0082, lon:28.9784, pop:10000000, timezone:3},
{name:"Las Vegas, USA", lat:36.1699, lon:-115.1398, pop:1000000, timezone:-8},

// Africa
{name:"Cape Town, South Africa", lat:-33.9249, lon:18.4241, pop:500000, timezone:2},
{name:"Cairo, Egypt", lat:30.0444, lon:31.2357, pop:2000000, timezone:2},
{name:"Alexandria, Egypt", lat:31.2001, lon:29.9187, pop:500000, timezone:2},

// South America
{name:"Rio de Janeiro, Brazil", lat:-22.9068, lon:-43.1729, pop:1000000, timezone:-3},
{name:"LA - Riverside", lat:33.9806, lon:-117.3755, pop:320000, timezone:-8},
{name:"LA - San Bernardino", lat:34.1083, lon:-117.2898, pop:220000, timezone:-8},
{name:"LA - Ontario", lat:34.0633, lon:-117.6509, pop:180000, timezone:-8},
{name:"LA - Pomona", lat:34.0551, lon:-117.7500, pop:150000, timezone:-8},
{name:"LA - Fullerton", lat:33.8704, lon:-117.9242, pop:140000, timezone:-8},
{name:"LA - Huntington Beach", lat:33.6595, lon:-117.9988, pop:200000, timezone:-8},
{name:"LA - Costa Mesa", lat:33.6411, lon:-117.9187, pop:110000, timezone:-8},

// ========== TOKYO ==========
{name:"Tokyo - Shinjuku", lat:35.6938, lon:139.7034, pop:900000, timezone:9},
{name:"Tokyo - Shibuya", lat:35.6618, lon:139.7041, pop:700000, timezone:9},
{name:"Tokyo - Ikebukuro", lat:35.7295, lon:139.7109, pop:600000, timezone:9},
{name:"Tokyo - Ginza", lat:35.6717, lon:139.7650, pop:400000, timezone:9},
{name:"Tokyo - Akihabara", lat:35.7023, lon:139.7745, pop:300000, timezone:9},
{name:"Tokyo - Roppongi", lat:35.6627, lon:139.7314, pop:300000, timezone:9},
{name:"Tokyo - Ueno", lat:35.7140, lon:139.7774, pop:300000, timezone:9},
{name:"Tokyo - Asakusa", lat:35.7148, lon:139.7967, pop:200000, timezone:9},
{name:"Tokyo - Shinagawa", lat:35.6284, lon:139.7387, pop:400000, timezone:9},
{name:"Tokyo - Yokohama Center", lat:35.4437, lon:139.6380, pop:1800000, timezone:9},
{name:"Tokyo - Kawasaki", lat:35.5308, lon:139.7029, pop:900000, timezone:9},
{name:"Tokyo - Chiba", lat:35.6074, lon:140.1065, pop:600000, timezone:9},
{name:"Tokyo - Saitama", lat:35.8617, lon:139.6455, pop:1300000, timezone:9},
{name:"Tokyo - Funabashi", lat:35.6947, lon:139.9826, pop:600000, timezone:9},
{name:"Tokyo - Kawaguchi", lat:35.8077, lon:139.7241, pop:600000, timezone:9},
{name:"Tokyo - Hachioji", lat:35.6559, lon:139.3239, pop:580000, timezone:9},
{name:"Tokyo - Machida", lat:35.5469, lon:139.4386, pop:430000, timezone:9},
{name:"Tokyo - Fuchu", lat:35.6694, lon:139.4778, pop:260000, timezone:9},
{name:"Tokyo - Chofu", lat:35.6506, lon:139.5406, pop:230000, timezone:9},
{name:"Tokyo - Mitaka", lat:35.6833, lon:139.5667, pop:190000, timezone:9},

// ========== DUBAI ==========
{name:"Dubai - Downtown", lat:25.1972, lon:55.2744, pop:500000, timezone:4},
{name:"Dubai - Marina", lat:25.0805, lon:55.1403, pop:350000, timezone:4},
{name:"Dubai - JBR", lat:25.0782, lon:55.1325, pop:180000, timezone:4},
{name:"Dubai - Business Bay", lat:25.1850, lon:55.2700, pop:250000, timezone:4},
{name:"Dubai - Deira", lat:25.2697, lon:55.3095, pop:450000, timezone:4},
{name:"Dubai - Bur Dubai", lat:25.2532, lon:55.2972, pop:350000, timezone:4},
{name:"Dubai - Jebel Ali", lat:25.0100, lon:55.0600, pop:250000, timezone:4},
{name:"Dubai - Palm Jumeirah", lat:25.1124, lon:55.1390, pop:120000, timezone:4},
{name:"Dubai - Al Barsha", lat:25.1110, lon:55.1980, pop:180000, timezone:4},
{name:"Dubai - International City", lat:25.1700, lon:55.4100, pop:180000, timezone:4},
{name:"Dubai - Al Quoz", lat:25.1400, lon:55.2300, pop:150000, timezone:4},
{name:"Dubai - Al Qusais", lat:25.2800, lon:55.3800, pop:200000, timezone:4},
{name:"Dubai - Mirdif", lat:25.2200, lon:55.4200, pop:150000, timezone:4},
{name:"Dubai - Silicon Oasis", lat:25.1200, lon:55.3800, pop:100000, timezone:4},
{name:"Dubai - Sports City", lat:25.0400, lon:55.2100, pop:80000, timezone:4},
// ========== SHANGHAI — ADDITIONAL COVERAGE ==========

{name:"Shanghai - Hongkou", lat:31.2640, lon:121.5050, pop:600000, timezone:8},
{name:"Shanghai - Putuo", lat:31.2500, lon:121.3950, pop:600000, timezone:8},
{name:"Shanghai - Changning", lat:31.2180, lon:121.4240, pop:500000, timezone:8},

{name:"Shanghai - Pudong South", lat:31.1700, lon:121.5200, pop:700000, timezone:8},
{name:"Shanghai - Pudong East", lat:31.1500, lon:121.6500, pop:700000, timezone:8},

{name:"Shanghai - Jiading East", lat:31.3400, lon:121.3200, pop:500000, timezone:8},

{name:"Shanghai - Kunshan East", lat:31.3700, lon:121.1000, pop:500000, timezone:8},
{name:"Suzhou - East", lat:31.3000, lon:120.7000, pop:700000, timezone:8},
// Shanghai (expanded metro)
{name:"Shanghai - Pudong", lat:31.2213, lon:121.5440, pop:3000000, timezone:8},
{name:"Shanghai - Puxi", lat:31.2304, lon:121.4737, pop:5000000, timezone:8},
{name:"Shanghai - Hongqiao", lat:31.1979, lon:121.3364, pop:1000000, timezone:8},
{name:"Shanghai - Xujiahui", lat:31.1880, lon:121.4365, pop:800000, timezone:8},
{name:"Shanghai - Lujiazui", lat:31.2397, lon:121.4998, pop:500000, timezone:8},
{name:"Shanghai - Jing'an", lat:31.2230, lon:121.4450, pop:700000, timezone:8},
{name:"Shanghai - Yangpu", lat:31.2600, lon:121.5200, pop:800000, timezone:8},
{name:"Shanghai - Minhang", lat:31.1120, lon:121.3800, pop:1500000, timezone:8},
{name:"Shanghai - Baoshan", lat:31.4000, lon:121.4800, pop:1200000, timezone:8},
{name:"Shanghai - Songjiang", lat:31.0300, lon:121.2200, pop:1000000, timezone:8},
// ========== TOKYO — EXPANDED ==========

{name:"Tokyo - Setagaya", lat:35.6466, lon:139.6532, pop:900000, timezone:9},
{name:"Tokyo - Nerima", lat:35.7356, lon:139.6517, pop:700000, timezone:9},
{name:"Tokyo - Edogawa", lat:35.7068, lon:139.8683, pop:700000, timezone:9},
{name:"Tokyo - Koto", lat:35.6728, lon:139.8170, pop:600000, timezone:9},
{name:"Tokyo - Katsushika", lat:35.7435, lon:139.8470, pop:500000, timezone:9},

{name:"Tokyo - Ota", lat:35.5614, lon:139.7161, pop:700000, timezone:9},
{name:"Tokyo - Itabashi", lat:35.7512, lon:139.7092, pop:600000, timezone:9},

{name:"Tokyo - Tachikawa", lat:35.7139, lon:139.4078, pop:400000, timezone:9},
{name:"Tokyo - Musashino", lat:35.7177, lon:139.5661, pop:300000, timezone:9},

{name:"Tokyo - Yokohama North", lat:35.5100, lon:139.5900, pop:600000, timezone:9},
{name:"Tokyo - Yokohama East", lat:35.4700, lon:139.6600, pop:500000, timezone:9},

{name:"Tokyo - Ichikawa", lat:35.7219, lon:139.9311, pop:500000, timezone:9},
{name:"Tokyo - Matsudo", lat:35.7877, lon:139.9031, pop:500000, timezone:9},
{name:"Tokyo - Kashiwa", lat:35.8676, lon:139.9757, pop:450000, timezone:9},

// Surrounding urban areas
{name:"Shanghai - Jiading", lat:31.3747, lon:121.2500, pop:800000, timezone:8},
{name:"Shanghai - Qingpu", lat:31.1510, lon:121.1240, pop:700000, timezone:8},
{name:"Shanghai - Fengxian", lat:30.9180, lon:121.4740, pop:700000, timezone:8},
{name:"Shanghai - Jinshan", lat:30.7410, lon:121.3410, pop:500000, timezone:8},
{name:"Shanghai - Pudong East", lat:31.1500, lon:121.6500, pop:700000, timezone:8},

// Nearby satellite cities
{name:"Kunshan", lat:31.3856, lon:120.9807, pop:800000, timezone:8},
{name:"Taicang", lat:31.4580, lon:121.1300, pop:500000, timezone:8},
{name:"Jiangyin", lat:31.9200, lon:120.2850, pop:700000, timezone:8},
{name:"Suzhou", lat:31.2989, lon:120.5853, pop:2500000, timezone:8},
{name:"Wuxi", lat:31.4912, lon:120.3119, pop:1800000, timezone:8},
// ========== ISTANBUL ==========
{name:"Istanbul - European Side", lat:41.0082, lon:28.9784, pop:9000000, timezone:3},
{name:"Istanbul - Asian Side", lat:41.0053, lon:29.0283, pop:7000000, timezone:3},
{name:"Istanbul - Beşiktaş", lat:41.0422, lon:29.0067, pop:450000, timezone:3},
{name:"Istanbul - Kadıköy", lat:40.9833, lon:29.0333, pop:550000, timezone:3},
{name:"Istanbul - Üsküdar", lat:41.0225, lon:29.0150, pop:550000, timezone:3},
{name:"Istanbul - Bakırköy", lat:40.9833, lon:28.8500, pop:350000, timezone:3},
{name:"Istanbul - Şişli", lat:41.0600, lon:28.9870, pop:350000, timezone:3},
{name:"Istanbul - Fatih", lat:41.0186, lon:28.9397, pop:450000, timezone:3},
{name:"Istanbul - Beyoğlu", lat:41.0370, lon:28.9850, pop:280000, timezone:3},
{name:"Istanbul - Maltepe", lat:40.9333, lon:29.1500, pop:550000, timezone:3},
{name:"Istanbul - Kartal", lat:40.8889, lon:29.1875, pop:500000, timezone:3},
{name:"Istanbul - Pendik", lat:40.8775, lon:29.2333, pop:750000, timezone:3},
{name:"Istanbul - Ataşehir", lat:40.9833, lon:29.1167, pop:400000, timezone:3},
{name:"Istanbul - Ümraniye", lat:41.0167, lon:29.1167, pop:700000, timezone:3},
{name:"Istanbul - Sarıyer", lat:41.1667, lon:29.0500, pop:350000, timezone:3},
{name:"Istanbul - Beykoz", lat:41.1333, lon:29.1000, pop:250000, timezone:3},
{name:"Istanbul - Büyükçekmece", lat:41.0167, lon:28.5833, pop:250000, timezone:3},
{name:"Istanbul - Esenyurt", lat:41.0333, lon:28.6833, pop:900000, timezone:3},

// ========== RIO DE JANEIRO ==========
{name:"Rio - Centro", lat:-22.9068, lon:-43.1729, pop:700000, timezone:-3},
{name:"Rio - Zona Sul", lat:-22.9711, lon:-43.1822, pop:600000, timezone:-3},
{name:"Rio - Copacabana", lat:-22.9711, lon:-43.1822, pop:150000, timezone:-3},
{name:"Rio - Ipanema", lat:-22.9838, lon:-43.2096, pop:100000, timezone:-3},
{name:"Rio - Barra da Tijuca", lat:-23.0000, lon:-43.3650, pop:300000, timezone:-3},
{name:"Rio - Jacarepaguá", lat:-22.9500, lon:-43.3700, pop:250000, timezone:-3},
{name:"Rio - Tijuca", lat:-22.9300, lon:-43.2400, pop:200000, timezone:-3},
{name:"Rio - Zona Norte", lat:-22.8800, lon:-43.2800, pop:800000, timezone:-3},
{name:"Rio - Niterói", lat:-22.8833, lon:-43.1036, pop:500000, timezone:-3},
{name:"Rio - São Gonçalo", lat:-22.8268, lon:-43.0539, pop:1000000, timezone:-3},
{name:"Rio - Duque de Caxias", lat:-22.7858, lon:-43.3117, pop:900000, timezone:-3},
{name:"Rio - Nova Iguaçu", lat:-22.7592, lon:-43.4511, pop:800000, timezone:-3},
{name:"Rio - Belford Roxo", lat:-22.7642, lon:-43.3994, pop:500000, timezone:-3},
{name:"Rio - São João de Meriti", lat:-22.8039, lon:-43.3722, pop:500000, timezone:-3},
{name:"Rio - Petrópolis", lat:-22.5050, lon:-43.1786, pop:300000, timezone:-3},
{name:"Rio - Volta Redonda", lat:-22.5231, lon:-44.1044, pop:250000, timezone:-3},

// ========== LAS VEGAS (SUPER BRIGHT) ==========
{name:"Las Vegas - The Strip", lat:36.1147, lon:-115.1728, pop:500000, timezone:-8},
{name:"Las Vegas - Downtown", lat:36.1699, lon:-115.1398, pop:100000, timezone:-8},
{name:"Las Vegas - Paradise", lat:36.1120, lon:-115.1400, pop:800000, timezone:-8},
{name:"Las Vegas - Spring Valley", lat:36.1080, lon:-115.2450, pop:500000, timezone:-8},
{name:"Las Vegas - Summerlin", lat:36.1800, lon:-115.3200, pop:400000, timezone:-8},
{name:"Las Vegas - Henderson", lat:36.0395, lon:-114.9817, pop:600000, timezone:-8},
{name:"Las Vegas - North Las Vegas", lat:36.1989, lon:-115.1175, pop:500000, timezone:-8},
{name:"Las Vegas - Enterprise", lat:36.0300, lon:-115.2200, pop:300000, timezone:-8},
{name:"Las Vegas - Whitney", lat:36.0700, lon:-115.0500, pop:200000, timezone:-8},

// ========== CAIRO + ALEXANDRIA + NILE DELTA ==========
{name:"Cairo - Downtown", lat:30.0444, lon:31.2357, pop:5000000, timezone:2},
{name:"Cairo - Giza", lat:30.0131, lon:31.2089, pop:4000000, timezone:2},
{name:"Cairo - Heliopolis", lat:30.0900, lon:31.3200, pop:1500000, timezone:2},
{name:"Cairo - Nasr City", lat:30.0500, lon:31.3400, pop:1500000, timezone:2},
{name:"Cairo - Maadi", lat:29.9600, lon:31.2700, pop:500000, timezone:2},
{name:"Cairo - 6th of October", lat:29.9300, lon:30.9200, pop:800000, timezone:2},
{name:"Cairo - New Cairo", lat:30.0300, lon:31.4700, pop:1000000, timezone:2},
{name:"Cairo - Shubra", lat:30.1100, lon:31.2400, pop:1000000, timezone:2},
{name:"Alexandria - Center", lat:31.2001, lon:29.9187, pop:3000000, timezone:2},
{name:"Alexandria - Montaza", lat:31.2800, lon:30.0100, pop:800000, timezone:2},
{name:"Alexandria - Agami", lat:31.1000, lon:29.7800, pop:400000, timezone:2},
{name:"Alexandria - Borg El Arab", lat:30.8500, lon:29.7000, pop:300000, timezone:2},

// Nile Delta corridor (the bright green strip)
{name:"Nile - Tanta", lat:30.7865, lon:31.0004, pop:500000, timezone:2},
{name:"Nile - Mansoura", lat:31.0364, lon:31.3807, pop:500000, timezone:2},
{name:"Nile - Zagazig", lat:30.5877, lon:31.5020, pop:350000, timezone:2},
{name:"Nile - Banha", lat:30.4591, lon:31.1786, pop:200000, timezone:2},
{name:"Nile - Shibin El Kom", lat:30.5500, lon:30.9990, pop:250000, timezone:2},
{name:"Nile - Mahalla", lat:30.9700, lon:31.1700, pop:500000, timezone:2},
{name:"Nile - Kafr El Sheikh", lat:31.1100, lon:30.9400, pop:150000, timezone:2},
{name:"Nile - Damanhur", lat:31.0341, lon:30.4682, pop:300000, timezone:2},
{name:"Nile - Damietta", lat:31.4167, lon:31.8200, pop:300000, timezone:2},
{name:"Nile - Port Said", lat:31.2653, lon:32.3019, pop:750000, timezone:2},
{name:"Nile - Ismailia", lat:30.5965, lon:32.2715, pop:400000, timezone:2},
{name:"Nile - Suez", lat:29.9668, lon:32.5498, pop:700000, timezone:2},
{name:"Nile - Beni Suef", lat:29.0667, lon:31.0833, pop:250000, timezone:2},
{name:"Nile - Minya", lat:28.1099, lon:30.7503, pop:300000, timezone:2},
{name:"Nile - Asyut", lat:27.1809, lon:31.1837, pop:450000, timezone:2},
{name:"Nile - Sohag", lat:26.5569, lon:31.6948, pop:250000, timezone:2},
{name:"Nile - Qena", lat:26.1551, lon:32.7160, pop:250000, timezone:2},
{name:"Nile - Luxor", lat:25.6872, lon:32.6396, pop:500000, timezone:2},
{name:"Nile - Aswan", lat:24.0889, lon:32.8998, pop:300000, timezone:2},

// ========== EXTRA HIGH-PRIORITY MULTI-CIRCLE CITIES ==========

// Singapore
{name:"Singapore - Central", lat:1.2897, lon:103.8501, pop:1500000, timezone:8},
{name:"Singapore - Jurong", lat:1.3329, lon:103.7436, pop:800000, timezone:8},
{name:"Singapore - Woodlands", lat:1.4382, lon:103.7890, pop:600000, timezone:8},
{name:"Singapore - Tampines", lat:1.3496, lon:103.9568, pop:500000, timezone:8},
{name:"Singapore - Bedok", lat:1.3236, lon:103.9273, pop:400000, timezone:8},
{name:"Singapore - Hougang", lat:1.3612, lon:103.8863, pop:300000, timezone:8},
{name:"Singapore - Sengkang", lat:1.3917, lon:103.8950, pop:300000, timezone:8},
{name:"Singapore - Punggol", lat:1.4050, lon:103.9020, pop:200000, timezone:8},
{name:"Singapore - Pasir Ris", lat:1.3721, lon:103.9493, pop:200000, timezone:8},
{name:"Singapore - Changi", lat:1.3500, lon:103.9900, pop:150000, timezone:8},

// Hong Kong
{name:"Hong Kong - Central", lat:22.2819, lon:114.1580, pop:800000, timezone:8},
{name:"Hong Kong - Kowloon", lat:22.3167, lon:114.1833, pop:2000000, timezone:8},
{name:"Hong Kong - Tsim Sha Tsui", lat:22.2975, lon:114.1722, pop:300000, timezone:8},
{name:"Hong Kong - Mong Kok", lat:22.3193, lon:114.1694, pop:400000, timezone:8},
{name:"Hong Kong - Sha Tin", lat:22.3800, lon:114.1900, pop:600000, timezone:8},
{name:"Hong Kong - Tuen Mun", lat:22.3900, lon:113.9700, pop:500000, timezone:8},
{name:"Hong Kong - Yuen Long", lat:22.4500, lon:114.0300, pop:600000, timezone:8},
{name:"Hong Kong - Tseung Kwan O", lat:22.3100, lon:114.2600, pop:400000, timezone:8},
{name:"Hong Kong - Tai Po", lat:22.4500, lon:114.1700, pop:300000, timezone:8},
{name:"Hong Kong - Lantau", lat:22.2700, lon:113.9500, pop:200000, timezone:8},

// San Francisco
{name:"SF - Downtown", lat:37.7749, lon:-122.4194, pop:800000, timezone:-8},
{name:"SF - Oakland", lat:37.8044, lon:-122.2712, pop:450000, timezone:-8},
{name:"SF - Berkeley", lat:37.8716, lon:-122.2727, pop:120000, timezone:-8},
{name:"SF - San Jose", lat:37.3382, lon:-121.8863, pop:1000000, timezone:-8},
{name:"SF - Sunnyvale", lat:37.3688, lon:-122.0363, pop:150000, timezone:-8},
{name:"SF - Palo Alto", lat:37.4419, lon:-122.1430, pop:70000, timezone:-8},
{name:"SF - Fremont", lat:37.5485, lon:-121.9886, pop:230000, timezone:-8},
{name:"SF - Hayward", lat:37.6688, lon:-122.0808, pop:160000, timezone:-8},
{name:"SF - Richmond", lat:37.9358, lon:-122.3477, pop:110000, timezone:-8},
{name:"SF - Daly City", lat:37.6879, lon:-122.4702, pop:110000, timezone:-8},
{name:"SF - South San Francisco", lat:37.6547, lon:-122.4077, pop:70000, timezone:-8},
{name:"SF - San Mateo", lat:37.5629, lon:-122.3255, pop:100000, timezone:-8},

// Sydney
{name:"Sydney - CBD", lat:-33.8688, lon:151.2093, pop:500000, timezone:10},
{name:"Sydney - North Shore", lat:-33.8200, lon:151.2000, pop:400000, timezone:10},
{name:"Sydney - Eastern Suburbs", lat:-33.9000, lon:151.2500, pop:300000, timezone:10},
{name:"Sydney - Inner West", lat:-33.8900, lon:151.1500, pop:300000, timezone:10},
{name:"Sydney - Parramatta", lat:-33.8150, lon:151.0010, pop:300000, timezone:10},
{name:"Sydney - Liverpool", lat:-33.9200, lon:150.9200, pop:200000, timezone:10},
{name:"Sydney - Blacktown", lat:-33.7700, lon:150.9000, pop:350000, timezone:10},
{name:"Sydney - Penrith", lat:-33.7500, lon:150.7000, pop:200000, timezone:10},
{name:"Sydney - Sutherland", lat:-34.0300, lon:151.0600, pop:200000, timezone:10},
{name:"Sydney - Manly", lat:-33.8000, lon:151.2800, pop:100000, timezone:10},
{name:"Sydney - Bondi", lat:-33.8900, lon:151.2700, pop:100000, timezone:10},
{name:"Sydney - Cronulla", lat:-34.0500, lon:151.1500, pop:100000, timezone:10},

// Boston
{name:"Boston - Downtown", lat:42.3601, lon:-71.0589, pop:700000, timezone:-5},
{name:"Boston - Cambridge", lat:42.3736, lon:-71.1097, pop:120000, timezone:-5},
{name:"Boston - Somerville", lat:42.3876, lon:-71.0995, pop:80000, timezone:-5},
{name:"Boston - Brookline", lat:42.3318, lon:-71.1212, pop:60000, timezone:-5},
{name:"Boston - Quincy", lat:42.2529, lon:-71.0023, pop:100000, timezone:-5},
{name:"Boston - Newton", lat:42.3370, lon:-71.2092, pop:90000, timezone:-5},
{name:"Boston - Waltham", lat:42.3765, lon:-71.2356, pop:60000, timezone:-5},
{name:"Boston - Medford", lat:42.4184, lon:-71.1062, pop:60000, timezone:-5},
{name:"Boston - Malden", lat:42.4251, lon:-71.0662, pop:60000, timezone:-5},
{name:"Boston - Everett", lat:42.4084, lon:-71.0537, pop:50000, timezone:-5},
{name:"Boston - Chelsea", lat:42.3918, lon:-71.0328, pop:40000, timezone:-5},
{name:"Boston - Revere", lat:42.4084, lon:-71.0120, pop:50000, timezone:-5},

// Seattle
{name:"Seattle - Downtown", lat:47.6062, lon:-122.3321, pop:700000, timezone:-8},
{name:"Seattle - Bellevue", lat:47.6101, lon:-122.2015, pop:150000, timezone:-8},
{name:"Seattle - Redmond", lat:47.6740, lon:-122.1215, pop:70000, timezone:-8},
{name:"Seattle - Kirkland", lat:47.6815, lon:-122.2087, pop:90000, timezone:-8},
{name:"Seattle - Renton", lat:47.4829, lon:-122.2171, pop:100000, timezone:-8},
{name:"Seattle - Kent", lat:47.3809, lon:-122.2348, pop:130000, timezone:-8},
{name:"Seattle - Federal Way", lat:47.3223, lon:-122.3126, pop:100000, timezone:-8},
{name:"Seattle - Tacoma", lat:47.2529, lon:-122.4443, pop:220000, timezone:-8},
{name:"Seattle - Everett", lat:47.9789, lon:-122.2021, pop:110000, timezone:-8},
{name:"Seattle - Bothell", lat:47.7601, lon:-122.2054, pop:50000, timezone:-8},

// Vancouver
{name:"Vancouver - Downtown", lat:49.2827, lon:-123.1207, pop:700000, timezone:-8},
{name:"Vancouver - Burnaby", lat:49.2488, lon:-122.9805, pop:250000, timezone:-8},
{name:"Vancouver - Richmond", lat:49.1666, lon:-123.1336, pop:200000, timezone:-8},
{name:"Vancouver - Surrey", lat:49.1913, lon:-122.8490, pop:550000, timezone:-8},
{name:"Vancouver - Coquitlam", lat:49.2838, lon:-122.7932, pop:150000, timezone:-8},
{name:"Vancouver - New Westminster", lat:49.2057, lon:-122.9110, pop:80000, timezone:-8},
{name:"Vancouver - North Vancouver", lat:49.3200, lon:-123.0700, pop:100000, timezone:-8},
{name:"Vancouver - West Vancouver", lat:49.3300, lon:-123.1600, pop:50000, timezone:-8},
{name:"Vancouver - Langley", lat:49.1040, lon:-122.6600, pop:150000, timezone:-8},
{name:"Vancouver - Delta", lat:49.0900, lon:-123.0000, pop:100000, timezone:-8},

// Osaka
{name:"Osaka - Center", lat:34.6937, lon:135.5023, pop:2500000, timezone:9},
{name:"Osaka - Sakai", lat:34.5733, lon:135.4831, pop:800000, timezone:9},
{name:"Osaka - Higashiosaka", lat:34.6794, lon:135.6000, pop:500000, timezone:9},
{name:"Osaka - Toyonaka", lat:34.7814, lon:135.4692, pop:400000, timezone:9},
{name:"Osaka - Suita", lat:34.7594, lon:135.5167, pop:350000, timezone:9},
{name:"Osaka - Takatsuki", lat:34.8461, lon:135.6172, pop:350000, timezone:9},
{name:"Osaka - Hirakata", lat:34.8144, lon:135.6506, pop:400000, timezone:9},
{name:"Osaka - Yao", lat:34.6269, lon:135.6008, pop:270000, timezone:9},
{name:"Osaka - Neyagawa", lat:34.7661, lon:135.6281, pop:230000, timezone:9},
{name:"Osaka - Moriguchi", lat:34.7375, lon:135.5642, pop:140000, timezone:9},

// Mumbai
{name:"Mumbai - South", lat:18.9388, lon:72.8354, pop:3000000, timezone:5.5},
{name:"Mumbai - Central", lat:19.0760, lon:72.8777, pop:4000000, timezone:5.5},
{name:"Mumbai - Western Suburbs", lat:19.1200, lon:72.8500, pop:5000000, timezone:5.5},
{name:"Mumbai - Eastern Suburbs", lat:19.0800, lon:72.9000, pop:3000000, timezone:5.5},
{name:"Mumbai - Navi Mumbai", lat:19.0330, lon:73.0297, pop:1500000, timezone:5.5},
{name:"Mumbai - Thane", lat:19.2183, lon:72.9781, pop:1800000, timezone:5.5},
{name:"Mumbai - Kalyan", lat:19.2403, lon:73.1305, pop:1500000, timezone:5.5},
{name:"Mumbai - Vasai-Virar", lat:19.4700, lon:72.8000, pop:1200000, timezone:5.5},
{name:"Mumbai - Mira-Bhayandar", lat:19.3000, lon:72.8500, pop:800000, timezone:5.5},
{name:"Mumbai - Bhiwandi", lat:19.3000, lon:73.0500, pop:700000, timezone:5.5},

// Manila
{name:"Manila - Center", lat:14.5995, lon:120.9842, pop:1800000, timezone:8},
{name:"Manila - Quezon City", lat:14.6760, lon:121.0437, pop:3000000, timezone:8},
{name:"Manila - Makati", lat:14.5547, lon:121.0244, pop:600000, timezone:8},
{name:"Manila - Taguig", lat:14.5176, lon:121.0509, pop:900000, timezone:8},
{name:"Manila - Pasig", lat:14.5764, lon:121.0851, pop:800000, timezone:8},
{name:"Manila - Caloocan", lat:14.6488, lon:120.9830, pop:1600000, timezone:8},
{name:"Manila - Parañaque", lat:14.4793, lon:121.0198, pop:700000, timezone:8},
{name:"Manila - Las Piñas", lat:14.4500, lon:120.9800, pop:600000, timezone:8},
{name:"Manila - Muntinlupa", lat:14.3800, lon:121.0500, pop:500000, timezone:8},
{name:"Manila - Marikina", lat:14.6500, lon:121.1000, pop:500000, timezone:8},
{name:"Manila - Valenzuela", lat:14.7000, lon:120.9800, pop:600000, timezone:8},
{name:"Manila - Antipolo", lat:14.6255, lon:121.1245, pop:900000, timezone:8},

// Bangkok
{name:"Bangkok - Center", lat:13.7563, lon:100.5018, pop:3000000, timezone:7},
{name:"Bangkok - Thonburi", lat:13.7200, lon:100.4800, pop:1500000, timezone:7},
{name:"Bangkok - Nonthaburi", lat:13.8622, lon:100.5140, pop:300000, timezone:7},
{name:"Bangkok - Pak Kret", lat:13.9100, lon:100.5000, pop:200000, timezone:7},
{name:"Bangkok - Samut Prakan", lat:13.5993, lon:100.5968, pop:500000, timezone:7},
{name:"Bangkok - Lat Krabang", lat:13.7200, lon:100.7500, pop:200000, timezone:7},
{name:"Bangkok - Minburi", lat:13.8100, lon:100.7200, pop:150000, timezone:7},
{name:"Bangkok - Bang Na", lat:13.6700, lon:100.6500, pop:150000, timezone:7},
{name:"Bangkok - Bang Kapi", lat:13.7700, lon:100.6400, pop:200000, timezone:7},
{name:"Bangkok - Rangsit", lat:14.0000, lon:100.6200, pop:200000, timezone:7},

// Cape Town
{name:"Cape Town - City Bowl", lat:-33.9249, lon:18.4241, pop:500000, timezone:2},
{name:"Cape Town - Southern Suburbs", lat:-33.9800, lon:18.4700, pop:400000, timezone:2},
{name:"Cape Town - Northern Suburbs", lat:-33.8500, lon:18.5500, pop:500000, timezone:2},
{name:"Cape Town - Atlantic Seaboard", lat:-33.9100, lon:18.3800, pop:150000, timezone:2},
{name:"Cape Town - False Bay", lat:-34.0800, lon:18.4500, pop:200000, timezone:2},
{name:"Cape Town - Mitchells Plain", lat:-34.0500, lon:18.6200, pop:300000, timezone:2},
{name:"Cape Town - Khayelitsha", lat:-34.0400, lon:18.6700, pop:400000, timezone:2},
{name:"Cape Town - Bellville", lat:-33.9000, lon:18.6300, pop:150000, timezone:2},
{name:"Cape Town - Somerset West", lat:-34.0800, lon:18.8500, pop:100000, timezone:2},
{name:"Cape Town - Stellenbosch", lat:-33.9300, lon:18.8600, pop:100000, timezone:2},
{name:"Masterton, New Zealand", lat:-40.9597, lon:175.6575, pop:25000, timezone:12},
{name:"Levin, New Zealand", lat:-40.6333, lon:175.2833, pop:20000, timezone:12},
{name:"Ashburton, New Zealand", lat:-43.9053, lon:171.7497, pop:20000, timezone:12},
{name:"Oamaru, New Zealand", lat:-45.0965, lon:170.9714, pop:14000, timezone:12},
{name:"Queenstown, New Zealand", lat:-45.0312, lon:168.6626, pop:16000, timezone:12},
{name:"Wanaka, New Zealand", lat:-44.7000, lon:169.1500, pop:10000, timezone:12},
{name:"Taupo, New Zealand", lat:-38.6850, lon:176.0700, pop:25000, timezone:12},

// Papua New Guinea
{name:"Lae, Papua New Guinea", lat:-6.7333, lon:146.9833, pop:100000, timezone:10},
{name:"Mount Hagen, Papua New Guinea", lat:-5.8667, lon:144.2167, pop:50000, timezone:10},
{name:"Madang, Papua New Guinea", lat:-5.2167, lon:145.8000, pop:30000, timezone:10},
{name:"Wewak, Papua New Guinea", lat:-3.5500, lon:143.6333, pop:25000, timezone:10},
{name:"Goroka, Papua New Guinea", lat:-6.0833, lon:145.3833, pop:25000, timezone:10},
{name:"Kimbe, Papua New Guinea", lat:-5.5500, lon:150.1500, pop:20000, timezone:10},
{name:"Kokopo, Papua New Guinea", lat:-4.3500, lon:152.2700, pop:20000, timezone:10},
{name:"Alotau, Papua New Guinea", lat:-10.3000, lon:150.4500, pop:15000, timezone:10},

// Fiji
{name:"Lautoka, Fiji", lat:-17.6167, lon:177.4500, pop:70000, timezone:12},
{name:"Labasa, Fiji", lat:-16.4333, lon:179.3667, pop:30000, timezone:12},
{name:"Ba, Fiji", lat:-17.5333, lon:177.6833, pop:20000, timezone:12},
{name:"Sigatoka, Fiji", lat:-18.1416, lon:177.5069, pop:10000, timezone:12},

// Solomon Islands
{name:"Gizo, Solomon Islands", lat:-8.1000, lon:156.8500, pop:7000, timezone:11},
{name:"Auki, Solomon Islands", lat:-8.7667, lon:160.7000, pop:7000, timezone:11},
{name:"Kirakira, Solomon Islands", lat:-10.4500, lon:161.9167, pop:5000, timezone:11},

// Vanuatu
{name:"Luganville, Vanuatu", lat:-15.5333, lon:167.1667, pop:15000, timezone:11},
{name:"Isangel, Vanuatu", lat:-19.5500, lon:169.2667, pop:2000, timezone:11},

// New Caledonia
{name:"Mont-Dore, New Caledonia", lat:-22.2667, lon:166.5667, pop:25000, timezone:11},
{name:"Dumbéa, New Caledonia", lat:-22.1500, lon:166.4500, pop:35000, timezone:11},
{name:"Païta, New Caledonia", lat:-22.1333, lon:166.3500, pop:20000, timezone:11},

// Samoa
{name:"Salelologa, Samoa", lat:-13.7333, lon:-172.2500, pop:5000, timezone:13},
{name:"Asau, Samoa", lat:-13.5167, lon:-172.6333, pop:2000, timezone:13},

// Tonga
{name:"Neiafu, Tonga", lat:-18.6500, lon:-173.9833, pop:6000, timezone:13},
{name:"Pangai, Tonga", lat:-19.8000, lon:-174.3500, pop:2000, timezone:13},

// French Polynesia
{name:"Punaauia, French Polynesia", lat:-17.6333, lon:-149.6000, pop:25000, timezone:-10},
{name:"Faaa, French Polynesia", lat:-17.5500, lon:-149.6000, pop:30000, timezone:-10},
{name:"Pirae, French Polynesia", lat:-17.5167, lon:-149.5333, pop:15000, timezone:-10},
{name:"Mahina, French Polynesia", lat:-17.5000, lon:-149.4833, pop:15000, timezone:-10},
{name:"Paea, French Polynesia", lat:-17.6833, lon:-149.5833, pop:12000, timezone:-10},

// Other Pacific
{name:"Rarotonga, Cook Islands", lat:-21.2333, lon:-159.7667, pop:10000, timezone:-10},
{name:"Aitutaki, Cook Islands", lat:-18.8500, lon:-159.7667, pop:2000, timezone:-10},
{name:"Pago Pago, American Samoa", lat:-14.2781, lon:-170.7025, pop:12000, timezone:-11},
{name:"Utulei, American Samoa", lat:-14.2833, lon:-170.6833, pop:3000, timezone:-11},
{name:"Kolonia, Micronesia", lat:6.9667, lon:158.2167, pop:6000, timezone:11},
{name:"Weno, Micronesia", lat:7.4500, lon:151.8500, pop:14000, timezone:10},
{name:"Tofol, Micronesia", lat:5.3167, lon:163.0000, pop:2000, timezone:11},
{name:"Ebeye, Marshall Islands", lat:8.7833, lon:167.7333, pop:10000, timezone:12},
{name:"Jaluit, Marshall Islands", lat:6.0000, lon:169.5333, pop:2000, timezone:12},
{name:"Koror, Palau", lat:7.3419, lon:134.4800, pop:11000, timezone:9},
{name:"Airai, Palau", lat:7.3667, lon:134.5500, pop:3000, timezone:9},
{name:"Bikenibeu, Kiribati", lat:1.3667, lon:173.1333, pop:6000, timezone:12},
{name:"Betio, Kiribati", lat:1.3500, lon:172.9333, pop:15000, timezone:12},
{name:"Banana, Kiribati", lat:1.9833, lon:157.4667, pop:2000, timezone:12},

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

cities.forEach(city => {

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
// 🌐 GEOFS-AFTER-DARK NATIVE MENU
// ==========================

// Hide all lights initially
cities.forEach(city => {
    if (city.entity) {
        city.entity.show = false;
    }
});

let afterDarkEnabled = false;
let afterDarkBrightness = 1;
let afterDarkAdvanced = false;

const afterDarkTimezones = [
    -12, -11, -10, -9, -8, -7, -6, -5, -4, -3,
    -2, -1, 0, 1, 2, 3, 3.5, 4, 5, 5.5,
    5.75, 6, 7, 8, 9, 9.5, 10, 11, 12, 13
];

let afterDarkSelectedTimezones = new Set();

// ==========================
// 🎨 AFTER DARK BRANDING
// ==========================

const AFTER_DARK_LOGO =
    "https://github.com/MVX-star/GeoFS-After-Dark/raw/main/image-removebg-preview%20(1).png";

const AFTER_DARK_ICON =
    "https://github.com/MVX-star/GeoFS-After-Dark/raw/main/After_dark__4_-removebg-preview.png";

// ==========================
// 💡 UPDATE LIGHTS
// ==========================

function updateAfterDarkLights() {

    if (!afterDarkEnabled) {

        cities.forEach(city => {

            if (city.entity) {
                city.entity.show = false;
            }

        });

        return;
    }

    // Advanced timezone mode
    if (afterDarkAdvanced) {

        cities.forEach(city => {

            if (!city.entity) {
                return;
            }

            city.entity.show =
                afterDarkSelectedTimezones.has(
                    city.timezone ?? 0
                );

        });

        return;
    }

    // Universal mode
    cities.forEach(city => {

        if (city.entity) {
            city.entity.show = true;
        }

    });
}


// ==========================
// 💡 UNIVERSAL ON/OFF
// ==========================

function toggleAfterDarkLights() {

    afterDarkEnabled =
        !afterDarkEnabled;

    // The main button is ALWAYS universal.
    // When turned on, show every light.
    if (afterDarkEnabled) {

        afterDarkAdvanced = false;

        if (typeof automaticCheckbox !== "undefined") {
            automaticCheckbox.checked = false;
        }

        cities.forEach(function (city) {

            if (city.entity) {
                city.entity.show = true;
            }

        });

    } else {

        cities.forEach(function (city) {

            if (city.entity) {
                city.entity.show = false;
            }

        });

    }

    updateAfterDarkUI();
}

// ==========================
// 🌐 FORMAT UTC
// ==========================

function formatAfterDarkTimezone(tz) {

    return "UTC" +
        (tz >= 0 ? "+" : "") +
        tz;
}


// ==========================
// 🌃 PANEL
// ==========================

const afterDarkPanel =
    document.createElement("div");

afterDarkPanel.id =
    "afterDarkPanel";

afterDarkPanel.className =
"geofs-list geofs-toggle-panel after-dark-panel";

afterDarkPanel.setAttribute(
    "data-noblur",
    "true"
);

afterDarkPanel.style.maxHeight =
    "90vh";

afterDarkPanel.style.overflowY =
    "auto";


// ==========================
// HEADER / BRANDING
// ==========================

const afterDarkTitle =
document.createElement("div");

const afterDarkLogo =
document.createElement("img");

afterDarkLogo.src =
AFTER_DARK_LOGO;

afterDarkLogo.alt =
"GeoFS: After Dark";

afterDarkLogo.style.width =
"calc(100% + 20px)";

afterDarkLogo.style.maxWidth =
"none";

afterDarkLogo.style.height =
"auto";

afterDarkLogo.style.display =
"block";

afterDarkLogo.style.margin =
"0 auto 10px auto";

afterDarkLogo.style.objectFit =
"contain";

afterDarkTitle.appendChild(
afterDarkLogo
);

afterDarkPanel.appendChild(
afterDarkTitle
);


// ==========================
// UNIVERSAL LIGHT BUTTON
// ==========================

const lightButton =
    document.createElement("button");

lightButton.id =
    "afterDarkLightButton";

lightButton.className =
    "mdl-button mdl-js-button mdl-button--raised mdl-button--colored";

lightButton.style.width =
    "100%";

lightButton.onclick =
    toggleAfterDarkLights;

afterDarkPanel.appendChild(
    lightButton
);

// ==========================
// CURRENT TIMEZONE
// ==========================

const timezoneStatus =
    document.createElement("div");

timezoneStatus.id =
    "afterDarkTimezoneStatus";

timezoneStatus.style.marginTop =
    "10px";

afterDarkPanel.appendChild(
    timezoneStatus
);

// ==========================
// CITY SEARCH
// ==========================

const searchBox =
    document.createElement("input");

searchBox.type =
    "text";

searchBox.placeholder =
    "Search city...";

// Prevent GeoFS keyboard shortcuts from
// receiving keys while searching.
[
    "keydown",
    "keyup",
    "keypress"
].forEach(function (eventName) {

    searchBox.addEventListener(
        eventName,
        function (event) {

            event.stopPropagation();

        },
        true
    );

});

searchBox.className =
    "mdl-textfield__input address-input";

searchBox.style.width =
    "100%";

searchBox.style.marginTop =
    "10px";

const searchResults =
    document.createElement("div");

searchResults.style.maxHeight =
    "120px";

searchResults.style.overflowY =
    "auto";

searchResults.style.marginTop =
    "5px";

searchBox.addEventListener(
    "input",
    function () {

        const query =
            this.value
                .trim()
                .toLowerCase();

        searchResults.innerHTML = "";

        if (!query) {
            return;
        }

        const matches =
            cities
                .filter(city =>
                    city.name
                        .toLowerCase()
                        .includes(query)
                )
                .slice(0, 6);

        matches.forEach(city => {

            const result =
                document.createElement("div");

            result.textContent =
                city.name +
                " (" +
                formatAfterDarkTimezone(
                    city.timezone ?? 0
                ) +
                ")";

            result.style.cursor =
                "pointer";

            result.style.padding =
                "5px";

            result.style.borderBottom =
                "1px solid rgba(255,255,255,0.1)";

            result.onclick = function () {

                afterDarkEnabled =
                    true;

                afterDarkAdvanced =
                    true;

                afterDarkSelectedTimezones.clear();

                afterDarkSelectedTimezones.add(
                    city.timezone ?? 0
                );

                updateAfterDarkLights();
                updateAfterDarkUI();

                searchBox.value =
                    "";

                searchResults.innerHTML =
                    "";

            };

            searchResults.appendChild(
                result
            );

        });

    }
);

afterDarkPanel.appendChild(
    searchBox
);

afterDarkPanel.appendChild(
    searchResults
);


// ==========================
// ⚙️ ADVANCED MODE BUTTON
// ==========================

const advancedButton =
    document.createElement("button");

advancedButton.className =
    "mdl-button mdl-js-button mdl-button--raised";

advancedButton.style.width =
    "100%";

advancedButton.style.marginTop =
    "12px";

advancedButton.textContent =
    "Advanced Mode";

advancedButton.onclick = function () {

    afterDarkAdvanced = true;

    afterDarkSelectedTimezones.clear();

    refreshTimezoneCheckboxes();

    showAdvancedPanel();

};

afterDarkPanel.appendChild(
    advancedButton
);

// ==========================
// ⚙️ ADVANCED PANEL
// ==========================

const advancedPanel =
    document.createElement("div");

advancedPanel.id =
    "afterDarkAdvancedPanel";

advancedPanel.style.display =
    "none";

advancedPanel.style.marginTop =
    "10px";

const advancedTitle =
    document.createElement("h5");

advancedTitle.textContent =
    "Advanced Mode";

advancedPanel.appendChild(
    advancedTitle
);


// Select all
const selectAll =
    document.createElement("button");

selectAll.className =
    "mdl-button mdl-js-button mdl-button--raised";

selectAll.textContent =
    "Select All";

selectAll.onclick =
    function () {

        afterDarkSelectedTimezones =
            new Set(
                afterDarkTimezones
            );

        refreshTimezoneCheckboxes();

        afterDarkEnabled =
            true;

        updateAfterDarkLights();
        updateAfterDarkUI();

    };

advancedPanel.appendChild(
    selectAll
);


// Clear all
const clearAll =
    document.createElement("button");

clearAll.className =
    "mdl-button mdl-js-button mdl-button--raised";

clearAll.textContent =
    "Clear All";

clearAll.style.marginLeft =
    "5px";

clearAll.onclick =
    function () {

        afterDarkSelectedTimezones.clear();

        refreshTimezoneCheckboxes();

        afterDarkEnabled =
            false;

        updateAfterDarkLights();
        updateAfterDarkUI();

    };

advancedPanel.appendChild(
    clearAll
);


// Timezone list
const timezoneList =
    document.createElement("div");

timezoneList.style.marginTop =
    "10px";

afterDarkTimezones.forEach(
    function (tz) {

        const label =
            document.createElement("label");

        label.style.display =
            "block";

        const checkbox =
            document.createElement("input");

        checkbox.type =
            "checkbox";

        checkbox.dataset.afterDarkTimezone =
            tz;

        checkbox.onchange =
            function () {

                if (this.checked) {

                    afterDarkSelectedTimezones.add(
                        tz
                    );

                } else {

                    afterDarkSelectedTimezones.delete(
                        tz
                    );

                }

                afterDarkEnabled =
                    afterDarkSelectedTimezones.size > 0;

                updateAfterDarkLights();
                updateAfterDarkUI();

            };

        label.appendChild(
            checkbox
        );

        label.appendChild(
            document.createTextNode(
                " " +
                formatAfterDarkTimezone(tz)
            )
        );

        timezoneList.appendChild(
            label
        );

    }
);

advancedPanel.appendChild(
    timezoneList
);


// ==========================
// ← BACK TO NORMAL MENU
// ==========================

const backButton =
document.createElement("button");

backButton.className =
"mdl-button mdl-js-button mdl-button--raised";

backButton.textContent =
"← Back";

backButton.style.marginTop =
"10px";

backButton.onclick =
function () {

    afterDarkAdvanced = false;

    advancedPanel.style.display =
        "none";

    // Restore normal menu controls
    afterDarkTitle.style.display = "";
    lightButton.style.display = "";
    timezoneStatus.style.display = "";
    searchBox.style.display = "";
    searchResults.style.display = "";
    advancedButton.style.display = "";

    updateAfterDarkLights();
    updateAfterDarkUI();

};

advancedPanel.appendChild(
    backButton
);

afterDarkPanel.appendChild(
    advancedPanel
);

// ==========================
// SHOW ADVANCED
// ==========================

function showAdvancedPanel() {

    afterDarkTitle.style.display = "none";
    lightButton.style.display = "none";
    timezoneStatus.style.display = "none";
    searchBox.style.display = "none";
    searchResults.style.display = "none";
    advancedButton.style.display = "none";

    advancedPanel.style.display = "block";

    updateAfterDarkLights();
    updateAfterDarkUI();
}


// ==========================
// REFRESH CHECKBOXES
// ==========================

function refreshTimezoneCheckboxes() {

    timezoneList
        .querySelectorAll(
            "input[data-afterdark-timezone]"
        )
        .forEach(function (checkbox) {

            const tz =
                parseFloat(
                    checkbox.dataset
                        .afterDarkTimezone
                );

            checkbox.checked =
                afterDarkSelectedTimezones
                    .has(tz);

        });
}


// ==========================
// UPDATE UI
// ==========================

function updateAfterDarkButton() {

    lightButton.textContent =
        afterDarkEnabled
            ? " LIGHTS ON"
            : " LIGHTS OFF";
}

function updateAfterDarkUI() {

    updateAfterDarkButton();

    if (afterDarkAdvanced) {

        timezoneStatus.textContent =
            "Advanced Mode • " +
            afterDarkSelectedTimezones.size +
            " timezone(s) selected";

    } else {

        timezoneStatus.textContent =
            afterDarkEnabled
                ? "Universal Mode • All lights"
                : "Lights off";

    }

}


// ==========================
// ADD PANEL TO GEOFS
// ==========================

const geofsLeft =
    document.querySelector(
        ".geofs-ui-left"
    );

if (geofsLeft) {

    geofsLeft.appendChild(
        afterDarkPanel
    );

}


// ==========================
// 🌃 GEOFS TOOLBAR BUTTON
// ==========================

const geofsBottom =
    document.querySelector(
        ".geofs-ui-bottom"
    );

if (
    geofsBottom &&
    !document.getElementById(
        "afterDarkButton"
    )
) {

    const afterDarkButton =
        document.createElement("button");

    afterDarkButton.id =
        "afterDarkButton";

    afterDarkButton.title =
        "GeoFS-After-Dark";

    afterDarkButton.className =
        "mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly";

    afterDarkButton.setAttribute(
        "data-toggle-panel",
        ".after-dark-panel"
    );

    afterDarkButton.setAttribute(
        "data-tooltip-classname",
        "mdl-tooltip--top"
    );

afterDarkButton.innerHTML =
    '<img src="' +
    AFTER_DARK_ICON +
    '" alt="GeoFS: After Dark" ' +
    'style="width:32px;height:32px;object-fit:contain;">';

    const insertPosition =
        geofs.version >= 3.6
            ? 4
            : 3;

    if (
        geofsBottom.children.length >
        insertPosition
    ) {

        geofsBottom.insertBefore(
            afterDarkButton,
            geofsBottom.children[
                insertPosition
            ]
        );

    } else {

        geofsBottom.appendChild(
            afterDarkButton
        );

    }

}


// ==========================
// 🕐 UPDATE WHILE FLYING
// ==========================

setInterval(
function () {

    if (afterDarkEnabled && afterDarkAdvanced) {

        updateAfterDarkLights();
        updateAfterDarkUI();

    }

},
5000
);

// ==========================
// INITIAL STATE
// ==========================

updateAfterDarkLights();
updateAfterDarkUI();

}

})();
