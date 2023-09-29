// import { fahrenheitToCelcius } from "../TeslaStats/utils"

export interface WeatherDatapoint {
    temperature: number
    apparentTemperature: number
    summary: string
    temperatureMax: number
    temperatureMin: number
    time: number
    humidity: number
    cloudCover: number
}

export const NullWeatherDatapoint: WeatherDatapoint = {
	temperature: 0,
	apparentTemperature: 0,
	summary: 'NA',
	temperatureMax: 0,
	temperatureMin: 0,
	time: 0,
	humidity: 0, 
	cloudCover: 0
}

export interface ExpectedWeatherUpdateJson {
    daily: {
        data: WeatherDatapoint[]
    },
    hourly: {
        data: WeatherDatapoint[]
    },
    merry: {
        location: {
            name: string
        }
    },
    currently: WeatherDatapoint
}

export const roundToOneDecimal = (n: number) => Math.round(n * 10) / 10;

export const roundToTwoDecimals = (n: number) => Math.round(n * 100) / 100;

export const roundToThreeDecimals = (n: number) => Math.round(n * 1000) / 1000;

export const dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const celciusToFahrenheit = (c: number) => {
	return c * (9 / 5) + 32;
};

const fahrenheitToCelcius = (f: number) => {
	return (f - 32) * (5/9)
};

export const getTranslatedUnitsForCelciusValue = (c: number, roundingFn: (n: number) => number) => {
	return {
		c: roundingFn(c),
		f: roundingFn(celciusToFahrenheit(c))
	};
};

export const getTranslatedUnitsForFarenheitValues = (f: number, roundingFn: (n: number) => number) => {
	return {
		f: roundingFn(f),
		c: roundingFn(fahrenheitToCelcius(f))
	}
}

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

export const fetchPirateWeatherUpdate = async (long: number, lat: number) => {
	const requestUrl = `https://merry-sky.onrender.com/weather?q=${lat},%20${long}&source=pirateweather`;
	const result = await fetch(requestUrl);

    if (!result.body) return undefined

	const readBody = await recursivelyReadStream(result.body.getReader());
	const readBodyString = new TextDecoder("utf-8").decode(readBody);    
	const readBodyStringJson = JSON.parse(readBodyString);

	return readBodyStringJson;
};

export const getCurrentWeatherFromHourlyArray = (weatherUpdateJson: ExpectedWeatherUpdateJson): WeatherDatapoint => {
	const currentTimestampSeconds = Math.ceil(Date.now() / 1000);
	const hourlySorted = [...weatherUpdateJson.hourly.data].sort((a, b) => {
		return a.time - b.time;
	});

	const currentDatapoint = hourlySorted.find((d) => d.time > currentTimestampSeconds);

    if (!currentDatapoint) {
        return hourlySorted[0]
    }

	return currentDatapoint;
};

export const getActualAndFeelsLikeFromDatapoint = (weather: WeatherDatapoint) => {
	const currentActualTempurature = weather.temperature;
	const currentFeelsLikeTempurature = weather.apparentTemperature;

	return {
		actual: getTranslatedUnitsForFarenheitValues(currentActualTempurature, roundToTwoDecimals),
		feelsLike: getTranslatedUnitsForFarenheitValues(currentFeelsLikeTempurature, roundToTwoDecimals)
	};
}

const interpolate = (value1: number, value2: number, t0: number, t1: number, currentTime: number): number => {
	const range = t1 - t0;
	const ratio = (currentTime - t0) / range;
	const interpolatedValue = value1 + (value2 - value1) * ratio;
	return interpolatedValue;
  }

export const getInterpolatedDatapoint = (weatherUpdateJson?: ExpectedWeatherUpdateJson): WeatherDatapoint => {
	if (!weatherUpdateJson) return NullWeatherDatapoint

	const currentTime = Math.ceil(Date.now() / 1000);
	const hourlySorted = [...weatherUpdateJson.hourly.data].sort((a, b) => {
		return a.time - b.time;
	});

	const currentDatapointIndex = hourlySorted.findIndex((d) => d.time > currentTime);

	if (currentDatapointIndex === -1) {
		return hourlySorted[0]
	}

	const currentDatapoint = hourlySorted[currentDatapointIndex]
	const nextDatapoint = hourlySorted[currentDatapointIndex + 1]

	const t0 = currentDatapoint.time
	const t1 = nextDatapoint.time
	
	return {
		temperature: interpolate(currentDatapoint.temperature, nextDatapoint.temperature, t0, t1, currentTime),
		apparentTemperature: interpolate(currentDatapoint.apparentTemperature, nextDatapoint.apparentTemperature, t0, t1, currentTime),
		summary: currentDatapoint.summary !== nextDatapoint.summary ? `${currentDatapoint.summary} -> ${nextDatapoint.summary}` : currentDatapoint.summary,
		temperatureMax: interpolate(currentDatapoint.temperatureMax, nextDatapoint.temperatureMax, t0, t1, currentTime),
		temperatureMin: interpolate(currentDatapoint.temperatureMin, nextDatapoint.temperatureMin, t0, t1, currentTime),
		time: currentTime,
		humidity: interpolate(currentDatapoint.humidity, nextDatapoint.humidity, t0, t1, currentTime),
		cloudCover: interpolate(currentDatapoint.cloudCover, nextDatapoint.cloudCover, t0, t1, currentTime)
	} 
}

export function spanDecimalNumbers(text: string, fontSize: number): string {
	// Regular expression to match decimal numbers
	const regex = /(\d+\.\d+)/g;
	// Split the text by decimal numbers
	const parts = text.split(regex);
	// Map each part to a span if it is a decimal number
	const spans = parts.map((part) => {
	  if (part.match(regex)) {
		return `<span style={{fontSize:"${fontSize}px"}}>${part}</span>`;
	  }
	  return part;
	});
	// Join the spans and parts back into a single string
	return spans.join("");
  }