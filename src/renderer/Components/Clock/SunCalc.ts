
/*
 (c) 2011-2015, Vladimir Agafonkin
 SunCalc is a JavaScript library for calculating sun/moon position and light phases.
 https://github.com/mourner/suncalc
*/

var PI = Math.PI,
    sin = Math.sin,
    cos = Math.cos,
    tan = Math.tan,
    asin = Math.asin,
    atan = Math.atan2,
    acos = Math.acos,
    rad = PI / 180;

var dayMs = 1000 * 60 * 60 * 24,
    J1970 = 2440588,
    J2000 = 2451545;

var times = [
    [-0.833, "sunrise", "sunset"],
    [-0.3, "sunriseEnd", "sunsetStart"],
    [-6, "dawn", "dusk"],
    [-12, "nauticalDawn", "nauticalDusk"],
    [-18, "nightEnd", "night"],
    [6, "goldenHourEnd", "goldenHour"]
];

var e = rad * 23.4397; // obliquity of the Earth

var J0 = 0.0009;

function julianCycle(d: number, lw: number) {
    return Math.round(d - J0 - lw / (2 * PI));
}

function approxTransit(Ht: number, lw: number, n: number) {
    return J0 + (Ht + lw) / (2 * PI) + n;
}
function solarTransitJ(ds: number, M: number, L: number) {
    return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L);
}

function observerAngle(height: number) {
    return (-2.076 * Math.sqrt(height)) / 60;
}

function toJulian(date: Date) {
    return date.valueOf() / dayMs - 0.5 + J1970;
}
function fromJulian(j: number) {
    return new Date((j + 0.5 - J1970) * dayMs);
}
function toDays(date: Date) {
    return toJulian(date) - J2000;
}

function solarMeanAnomaly(d: number) {
    return rad * (357.5291 + 0.98560028 * d);
}

function eclipticLongitude(M: number) {
    var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)), // equation of center
        P = rad * 102.9372; // perihelion of the Earth

    return M + C + P + PI;
}

function declination(l: number, b: number) {
    return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
}

function hourAngle(h: number, phi: number, d: number) { return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d))); }

function getSetJ(h: number, lw: number, phi: number, dec: number, n: number, M: number, L: number) {

    var w = hourAngle(h, phi, dec),
        a = approxTransit(w, lw, n);
    return solarTransitJ(a, M, L);
}

export const getTimes = (date: Date, lat: number, lng: number, height?: number) => {
    height = height || 0;

    var lw = rad * -lng,
        phi = rad * lat,
        dh = observerAngle(height),
        d = toDays(date),
        n = julianCycle(d, lw),
        ds = approxTransit(0, lw, n),
        M = solarMeanAnomaly(ds),
        L = eclipticLongitude(M),
        dec = declination(L, 0),
        Jnoon = solarTransitJ(ds, M, L),
        i,
        len,
        time,
        h0,
        Jset,
        Jrise;


    var result = {
        solarNoon: fromJulian(Jnoon),
        nadir: fromJulian(Jnoon - 0.5),
        sunrise: fromJulian(0),
        sunset: fromJulian(0)
    };

    for (i = 0, len = times.length; i < len; i += 1) {
        time = times[i];
        h0 = (time[0] + dh) * rad;

        Jset = getSetJ(h0, lw, phi, dec, n, M, L);
        Jrise = Jnoon - (Jset - Jnoon);

        result[time[1]] = fromJulian(Jrise);
        result[time[2]] = fromJulian(Jset);
    }

    return result;
};