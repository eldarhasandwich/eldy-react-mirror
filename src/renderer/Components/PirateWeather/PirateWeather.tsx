import React, { useContext, useEffect, useState } from 'react'
import AppContext from 'renderer/AppContext';
import { Heading } from '../Display/Text';
import ForecastTable from './ForecastTable';
import { 
    ExpectedWeatherUpdateJson,
    NullWeatherDatapoint,
    WeatherDatapoint,
    fetchPirateWeatherUpdate, 
    getActualAndFeelsLikeFromDatapoint, 
    getCurrentWeatherFromHourlyArray, 
    getInterpolatedDatapoint, 
    roundToOneDecimal,
    spanDecimalNumbers,
} from './utils';

import { get12HrTime } from '../Clock/utils'

const ONE_HOUR_MS = 60 * 60 * 1000

interface SpanDecimalNumbersProps {
    text: string;
    fontSize: number;
  }
  
  function SpanDecimalNumbers({ text, fontSize }: SpanDecimalNumbersProps): JSX.Element {
    const regex = /(\d+\.\d+)/g;
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          part.match(regex) ? (
            <span key={index}>
              <span>{part.split(".")[0]}</span>
              <span style={{ fontSize: `${fontSize}px` }}>
                .{part.split(".")[1]}
              </span>
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  }

const PirateWeather: React.FC = () => {

    const [ weatherUpdateJson, setWeatherUpdateJson ] = useState<ExpectedWeatherUpdateJson | undefined>(undefined)
    const [ interpolatedWeatherDatapoint, setInterpolatedWeatherDatapoint ] = useState<WeatherDatapoint | undefined>(undefined)
    const [ lastFetchTime, setLastFetchTime ] = useState<Date>(new Date(Date.now()))

    const { location } = useContext(AppContext)
    const { long, lat } = location.coords

    // fetch weather data loop
    useEffect(() => {
        const fetchAndSetWeather = async () => {
            setWeatherUpdateJson(await fetchPirateWeatherUpdate(long, lat))
            setLastFetchTime(new Date(Date.now()))
        }

        fetchAndSetWeather()
        const interval = setInterval(() => {
            fetchAndSetWeather()
        }, 6.4 * ONE_HOUR_MS);
        return () => clearInterval(interval);
    }, []);

    // UI update loop
    useEffect(() => {
        const getAndSetInterpolatedDatapoint = () => {
            setInterpolatedWeatherDatapoint(
                getInterpolatedDatapoint(
                    weatherUpdateJson
                )
            )
        }

        getAndSetInterpolatedDatapoint()
        const interval = setInterval(() => {
            getAndSetInterpolatedDatapoint()
        }, 1000)
        return () => clearInterval(interval)
    }, [weatherUpdateJson])

    if (!weatherUpdateJson) return null

    const nowWeatherDatapoint = interpolatedWeatherDatapoint || NullWeatherDatapoint
    const { actual, feelsLike } = getActualAndFeelsLikeFromDatapoint(nowWeatherDatapoint)

    const locationTitle = `PirateWeather | Cedar Park, TX | Last fetch @ ${ get12HrTime(lastFetchTime) }`
    const summary = nowWeatherDatapoint.summary
    const actualTemperature = `${actual.f}°F / ${actual.c}°C`
    const feelsLikeTemperature = `Feels like ${feelsLike.f}°F / ${feelsLike.c}°C`;
    const extraInfo = `
        ${roundToOneDecimal(weatherUpdateJson.currently.humidity * 100)}% Humidity / ${roundToOneDecimal(weatherUpdateJson.currently.cloudCover * 100)}% Cloud cover`

    return (
        <>
            <Heading
                content={locationTitle}
                fontSize={14}
                fontWeight={400}
            />

            <Heading
                content={summary}
                fontSize={28}
                fontWeight={200}
            />
            
            <h1 style={{
                fontSize: 56,
                fontWeight: 100,
                margin: 0
            }}>
                <SpanDecimalNumbers
                    text={actualTemperature}
                    fontSize={40}
                />
            </h1>

            <h1 style={{
                fontSize: 40,
                fontWeight: 200,
                // margin: 0
            }}>
                <SpanDecimalNumbers
                    text={feelsLikeTemperature}
                    fontSize={28}
                />
            </h1>

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
