import React, { useContext, useEffect, useState } from 'react'
import AppContext from 'renderer/AppContext';
import { Heading } from '../Display/Text';
import ForecastTable from './ForecastTable';
import { 
    ExpectedWeatherUpdateJson,
    fetchPirateWeatherUpdate, 
    getActualAndFeelsLikeFromDatapoint, 
    getCurrentWeatherFromHourlyArray, 
    roundToOneDecimal,
} from './utils';

const ONE_HOUR_MS = 60 * 60 * 1000

const PirateWeather: React.FC = () => {

    const [ weatherUpdateJson, setWeatherUpdateJson ] = useState<ExpectedWeatherUpdateJson | undefined>(undefined)

    const { location } = useContext(AppContext)
    const { long, lat } = location.coords

    useEffect(() => {
        const fetchAndSetWeather = async () => {
            setWeatherUpdateJson(await fetchPirateWeatherUpdate(long, lat))
        }

        fetchAndSetWeather()
        const interval = setInterval(() => {
            fetchAndSetWeather()
        }, 3 * ONE_HOUR_MS);
        return () => clearInterval(interval);
    }, []);

    if (!weatherUpdateJson) return null

    const nowWeatherDatapoint = getCurrentWeatherFromHourlyArray(weatherUpdateJson);
    const { actual, feelsLike } = getActualAndFeelsLikeFromDatapoint(nowWeatherDatapoint)

    const locationTitle = `Weather | ${weatherUpdateJson.merry.location.name}`
    const actualTemperature = `${actual.f}°F / ${actual.c}°C /// ${nowWeatherDatapoint.summary}`
    const feelsLikeTemperature = `Feels like ${feelsLike.f}°F / ${feelsLike.c}°C`;
    const extraInfo = `
        ${roundToOneDecimal(weatherUpdateJson.currently.humidity * 100)}% Humidity /// ${roundToOneDecimal(weatherUpdateJson.currently.cloudCover * 100)}% Cloud cover`

    return (
        <>
            <Heading
                content={locationTitle}
                fontSize={14}
                fontWeight={400}
            />

            <Heading
                content={actualTemperature}
                fontSize={56}
                fontWeight={100}
            />

            <Heading
                content={feelsLikeTemperature}
                fontWeight={200}
            />

            <Heading
                content={extraInfo}
                fontSize={28}
                fontWeight={200}
            />

            <ForecastTable weatherUpdateJson={weatherUpdateJson}/>
        </>
    )

}

export default PirateWeather
