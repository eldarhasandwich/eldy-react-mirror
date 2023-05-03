
interface WeatherDatapoint {
    temperature: number
    apparentTemperature: number
    summary: string
    temperatureMax: number
    temperatureMin: number
    time: number
    humidity: number
    cloudCover: number
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

export const dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const celciusToFahrenheit = (c: number) => {
	return c * (9 / 5) + 32;
};

export const getTranslatedUnitsForCelciusValue = (c: number) => {
	return {
		c: roundToOneDecimal(c),
		f: roundToOneDecimal(celciusToFahrenheit(c))
	};
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

export const fetchPirateWeatherUpdate = async (long: number, lat: number) => {
	const requestUrl = `https://merry-sky.onrender.com/weather?q=${lat},%20${long}&source=pirateweather`;
	const result = await fetch(requestUrl);

    if (!result.body) return undefined

	const readBody = await recursivelyReadStream(result.body.getReader());
	const readBodyString = new TextDecoder("utf-8").decode(readBody);    
	const readBodyStringJson = JSON.parse(readBodyString);

	return readBodyStringJson;
};

export const getCurrentWeatherFromHourlyArray = (weatherUpdateJson: ExpectedWeatherUpdateJson) => {
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
		actual: getTranslatedUnitsForCelciusValue(currentActualTempurature),
		feelsLike: getTranslatedUnitsForCelciusValue(currentFeelsLikeTempurature)
	};
}