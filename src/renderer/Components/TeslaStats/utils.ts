import { roundToOneDecimal } from "../PirateWeather/utils";

interface BatteryInfo {
    level: number;
    range: string;
    charge_limit_soc: number;
    charging_state: string;
    minutes_remaining: number;
    time_remaining: string;
    scheduled_charging_pending: boolean;
    scheduled_charging_start_time: string | null;
}

interface ClimateInfo {
    inside: number;
    outside: number;
}

export interface VehicleStatsResponse {
    battery: BatteryInfo
    climate: ClimateInfo
}

export const fahrenheitToCelcius = (f: number) => {
    // (32°F − 32) × 5/9 
	return roundToOneDecimal(
        (f - 32) * (5/9)
    );
};

const recursivelyReadStream = async (stream: ReadableStreamDefaultReader<Uint8Array>): Promise<Uint8Array | undefined> => {
	const output = await stream.read();
	if (output.done) {
		return output.value;
	}

	const nextValue = await recursivelyReadStream(stream);
	if (nextValue === undefined) {
		return output.value;
	}

	return new Uint8Array([...output.value, ...nextValue]);
};

export const fetchVehicleStats = async (publicId: string, apiKey?: string) => {

    const apiKeyParam = apiKey ? `?api_key=${apiKey}` : ''

    const requestUrl = `https://teslascope.com/api/vehicle/${publicId}` + apiKeyParam
    const result = await fetch(requestUrl)

    if (!result.body) return undefined

    const readBody = await recursivelyReadStream(result.body.getReader());
	const readBodyString = new TextDecoder("utf-8").decode(readBody);        
	const readBodyStringJson = JSON.parse(readBodyString);

    const vehicleStatsJson: VehicleStatsResponse = readBodyStringJson.response
    
    return vehicleStatsJson
}