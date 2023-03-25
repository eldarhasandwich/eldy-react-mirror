import React from 'react'
import { TableCell } from '../Display/Text'
import { dayArray, ExpectedWeatherUpdateJson, getTranslatedUnitsForCelciusValue } from './utils'

const highTempColour = 'coral'
const lowTempColour = '#6495ED'
const spacing = 15

const ForecastTable: React.FC<{
    weatherUpdateJson: ExpectedWeatherUpdateJson
}> = (props) => {
    const daily = props.weatherUpdateJson.daily.data

    return (
        <table style={{textAlign: 'right'}}>
            {
                daily.map((day, index) => {

                    const highs = getTranslatedUnitsForCelciusValue(day.temperatureMax);
                    const lows = getTranslatedUnitsForCelciusValue(day.temperatureMin);      
                    
                    const displayDay = index === 0 ? "Today" : dayArray[new Date(day.time * 1000).getDay()];
                    const opacity = (1/5) * (daily.length - index)

                    return (
                        <tr style={{ opacity, alignContent: 'end' }}>
                            <TableCell content={displayDay} />
                            <span style={{ marginLeft: spacing }}/>

                            <TableCell content={highs.f + '°F'} colour={highTempColour} />
                            <span style={{ marginLeft: spacing / 10 }}/>
                            <TableCell content={'/'} colour={highTempColour} />
                            <span style={{ marginLeft: spacing / 10 }}/>
                            <TableCell content={highs.c + '°C'} colour={highTempColour} />
                            <span style={{ marginLeft: spacing }}/>

                            <TableCell content={lows.f + '°F'} colour={lowTempColour} />
                            <span style={{ marginLeft: spacing / 10}}/>
                            <TableCell content={'/'} colour={lowTempColour} />
                            <span style={{ marginLeft: spacing / 10 }}/>
                            <TableCell content={lows.c + '°C'} colour={lowTempColour} />
                            <span style={{ marginLeft: spacing }}/>

                        </tr>
                    )
                })
            }
        </table>
    )
}

export default ForecastTable