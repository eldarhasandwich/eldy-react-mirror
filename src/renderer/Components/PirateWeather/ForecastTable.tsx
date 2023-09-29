import React from 'react'
import { TableCell } from '../Display/Text'
import { dayArray, ExpectedWeatherUpdateJson, getTranslatedUnitsForFarenheitValues, roundToOneDecimal } from './utils'
import { BLUE, DULL_GREY, RED } from 'renderer/constants'

const highTempColour = RED
const lowTempColour = BLUE
const spacing = 30

const ForecastTable: React.FC<{
    weatherUpdateJson: ExpectedWeatherUpdateJson
}> = (props) => {
    const daily = props.weatherUpdateJson.daily.data

    let globalLow = Infinity
    let globalHigh = -1 * Infinity

    daily.forEach(d => {
        if (d.temperatureMin < globalLow) globalLow = d.temperatureMin
        if (d.temperatureMax > globalHigh) globalHigh = d.temperatureMax
    })

    return (
        <table style={{textAlign: 'right', marginLeft: 'auto'}}>
            {
                daily.map((day, index) => {

                    const highs = getTranslatedUnitsForFarenheitValues(day.temperatureMax, roundToOneDecimal);
                    const lows = getTranslatedUnitsForFarenheitValues(day.temperatureMin, roundToOneDecimal);      
                    
                    const displayDay = index === 0 ? "Today" : dayArray[new Date(day.time * 1000).getDay()];
                    const opacity = (1/5) * (daily.length - index)

                    const globalMinimumToDailyMinimumInterval = (day.temperatureMin - globalLow) / (globalHigh - globalLow) 
                    const dailyMinimumToDailyMaximumInterval = ( (day.temperatureMax - globalLow) / (globalHigh - globalLow) ) - globalMinimumToDailyMinimumInterval

                    return (
                        <tr
                            key={index}
                            style={{ opacity, fontSize: 25, fontWeight: 300 }}
                        >
                            <>
                                <TableCell content={displayDay} />

                                <span style={{ marginLeft: spacing }}/>

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
    )
}

export default ForecastTable