import { roundToOneDecimal } from "../PirateWeather/utils";

// interface BatteryInfo {
//     level: number;
//     range: string;
//     charge_limit_soc: number;
//     charging_state: string;
//     minutes_remaining: number;
//     time_remaining: string;
//     scheduled_charging_pending: boolean;
//     scheduled_charging_start_time: string | null;
// }

// interface ClimateInfo {
//     inside: number;
//     outside: number;
// }

// export interface VehicleStatsResponse {
//     battery: BatteryInfo
//     climate: ClimateInfo
// }

export interface VehicleStatsResponse {
    battery_level: string;
    charging_state: string;
    charge_limit_soc: string;
    inside_temp: string;
    inside_tempF: string;
    measure: string;
}

export const fahrenheitToCelcius = (f: number) => {
    // (32°F − 32) × 5/9 
	return roundToOneDecimal(
        (f - 32) * (5/9)
    );
};

export const celcuisToFahrenheit = (c: number): number => {
    // (0°C × 9/5) + 32
    return roundToOneDecimal(
        (c * (9/5)) + 32
    )
}

// export const getTemperaturesFromResponse = (response: VehicleStatsResponse): { c: number, f: number } => {

//     if (response.measure === 'imperial') {
//         return {
//             c: fahrenheitToCelcius(parseFloat(response.inside_temp)),
//             f: parseFloat(response.inside_temp)
//         }
//     }

//     return {
//         c: parseFloat(response.inside_temp),
//         f: celcuisToFahrenheit(parseFloat(response.inside_temp))
//     }
// }

export const minutesToHoursAndMinutes = (m: number): { hours: number, minutes: number } => {
    return {
        hours: Math.floor(m / 60),
        minutes: m % 60
    }
}

interface FetchVehicleStatsOutput {
    responseCode: number;
    response?: VehicleStatsResponse
}

export const fetchVehicleStats = async (apiKey?: string): Promise<FetchVehicleStatsOutput> => {
    console.log({
        apiKey
    })

    if (!apiKey) return { responseCode: -1 };
 
    const requestUrl = new URL('/feed.php', 'https://www.teslafi.com')
    requestUrl.search = new URLSearchParams({ token: apiKey }).toString()
    const result = await fetch(requestUrl)

    if (!result.body) return { responseCode: result.status }

    const jsonBody = await result.json()

    console.log({
        result,
        json: jsonBody
    })

    return { responseCode: result.status, response: jsonBody };
}