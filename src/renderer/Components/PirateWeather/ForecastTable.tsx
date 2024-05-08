import React from 'react'
import { TableCell } from '../Display/Text'
import { dayArray, ExpectedWeatherUpdateJson, getTranslatedUnitsForCelciusValue, roundToZeroDecimals } from './utils'
import { BLUE, DULL_GREY, RED } from 'renderer/constants'
import { Alignment } from 'renderer/App'

const highTempColour = RED
const lowTempColour = BLUE
const spacing = 30

const precipThreshold = 0.2

const ForecastTable: React.FC<{
    weatherUpdateJson: ExpectedWeatherUpdateJson
    alignment?: Alignment
}> = (props) => {

    const alignment = props.alignment || 'right'
    const daily = props.weatherUpdateJson.daily.data

    let globalLow = Infinity
    let globalHigh = -1 * Infinity

    daily.forEach(d => {
        if (d.temperatureMin < globalLow) globalLow = d.temperatureMin
        if (d.temperatureMax > globalHigh) globalHigh = d.temperatureMax
    })

    const isPrecipitationHappeningThisWeek = daily.some(day => day.precipProbability >= precipThreshold)

    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

            <table style={{
                textAlign: alignment,
                marginLeft: alignment === 'right' ? 'auto' : undefined,
                marginRight: alignment === 'left' ? 'auto' : undefined
            }}>
                {
                    daily.map((day, index) => {

                        // console.log({day})

                        const highs = getTranslatedUnitsForCelciusValue(day.temperatureMax, roundToZeroDecimals);
                        const lows = getTranslatedUnitsForCelciusValue(day.temperatureMin, roundToZeroDecimals);      
                        
                        const displayDay = index === 0 ? "Today" : dayArray[new Date(day.time * 1000).getDay()];
                        const opacity = (1/5) * (daily.length - index)

                        const globalMinimumToDailyMinimumInterval = (day.temperatureMin - globalLow) / (globalHigh - globalLow) 
                        const dailyMinimumToDailyMaximumInterval = ( (day.temperatureMax - globalLow) / (globalHigh - globalLow) ) - globalMinimumToDailyMinimumInterval

                        return (
                            <tr
                                key={index}
                                style={{ opacity, fontSize: 25, fontWeight: 100 }}
                            >
                                <>
                                    <TableCell content={displayDay} />

                                    <span style={{ marginLeft: spacing / 2 }}/>

                                    {
                                        isPrecipitationHappeningThisWeek && (
                                            <TableCell 
                                                content={`${roundToZeroDecimals(day.precipProbability * 100)}%`} 
                                                colour={ day.precipProbability >= precipThreshold ? 'white' : DULL_GREY }
                                            />
                                        )
                                    }

                                    {
                                        isPrecipitationHappeningThisWeek 
                                            && day.precipProbability >= precipThreshold 
                                            && (<span className="material-symbols-outlined">rainy</span>)
                                    }

                                    {
                                        isPrecipitationHappeningThisWeek 
                                            && day.precipProbability < precipThreshold 
                                            && (<span className="material-symbols-outlined" style={{color: DULL_GREY}}>cloud_off</span>)
                                    }

                                    <span style={{ marginLeft: spacing / 2 }}/>

                                    <TableCell content={lows.f + '°F'} colour={lowTempColour} />
                                    <span style={{ marginLeft: spacing / 10}}/>
                                    <TableCell content={'/'} colour={lowTempColour} />
                                    <span style={{ marginLeft: spacing / 10 }}/>
                                    <TableCell content={lows.c + '°C'} colour={lowTempColour} />

                                    {/* <span style={{ marginLeft: spacing }}/> */}

                                    <span>

                                        <div
                                            style={{
                                                width: '200px',
                                                height: '6px',
                                                backgroundColor: DULL_GREY,
                                                marginBottom:'4.5px'
                                            }}
                                        >

                                            <div
                                                style={{
                                                    marginLeft: `${globalMinimumToDailyMinimumInterval * 100}%`,
                                                    width: `${dailyMinimumToDailyMaximumInterval * 100}%`,
                                                    height: '100%',
                                                    backgroundImage: `linear-gradient(to right , ${BLUE}, ${RED})`
                                                }}
                                            />

                                        </div>

                                    </span>

                                    {/* <span style={{ marginLeft: spacing }}/> */}

                                    <TableCell content={highs.f + '°F'} colour={highTempColour} />
                                    <span style={{ marginLeft: spacing / 10 }}/>
                                    <TableCell content={'/'} colour={highTempColour} />
                                    <span style={{ marginLeft: spacing / 10 }}/>
                                    <TableCell content={highs.c + '°C'} colour={highTempColour} />
                                </>
                            </tr>
                        )
                    })
                }
            </table>
        </>
    )
}

export default ForecastTable