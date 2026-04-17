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
    const g = ctx.createRadialGradient(size/2, size/2, size*0.05, size/2, size/2, size/2);
    g.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},${0.7*intensity})`);
g.addColorStop(0.5, `rgba(${color[0]},${color[1]},${color[2]},${0.25*intensity})`);
    g.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},0)`);
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

    const size = Math.min(Math.max(city.pop / 1000000, 5), 30);
    const intensity = Math.min(Math.max(city.pop / 12000000, 0.5), 2.3);

    const color = getRegionColor(city.lat, city.lon);
city.color = color; // 🔥 IMPORTANT FIX

city.entity = geofs.api.viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat, 2000),
    ellipse: {
        semiMajorAxis: size * 2000,
        semiMinorAxis: size * 2000,
        material: new Cesium.ImageMaterialProperty({
            image: glowCanvas(intensity, city.pop, color),
            transparent: true
        })
    }
});
    // ✅ ADD IT HERE
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
