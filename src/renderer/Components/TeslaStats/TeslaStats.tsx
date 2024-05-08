
import React, { useContext, useEffect, useState } from 'react'
import { Heading } from '../Display/Text';
import { celcuisToFahrenheit, fahrenheitToCelcius, minutesToHoursAndMinutes, fetchVehicleStats, VehicleStatsResponse, getTemperaturesFromResponse } from './utils';
import AppContext from 'renderer/AppContext';
import { BLUE, DULL_GREY, GREEN } from 'renderer/constants';
import { get12HrTime } from '../Clock/utils';
import { SpanDecimalNumbers } from '../Display/SpanDecimalNumbers';
// import AppContext from 'renderer/AppContext'

export interface BatteryInfo {
    level: number;
    range: string;
    charge_limit_soc: number;
    charging_state: string;
    minutes_remaining: number;
    time_remaining: string;
    scheduled_charging_pending: boolean;
    scheduled_charging_start_time: string | null;
}

const ONE_MINUTE_MS = 60 * 1000;

const TeslaStats: React.FC = () => {

    const { secrets } = useContext(AppContext);

    const [ vehicleStats, setVehicleStats ] = useState<VehicleStatsResponse | undefined>(undefined);

    const [ lastFetchTime, setLastFetchTime ] = useState<Date>(new Date(Date.now()))
    const [ lastFetchCode, setLastFetchCode ] = useState<number>(-1)

    const [ chargeAnimation, setChargeAnimation ] = useState<string>('')

    useEffect(() => {

        const animationFrames = [
            '',
            '<',
            '< <',
            '< < <',
            '< < < <',
            '< < < < <',
        ]

        // const animationFrames = [
        //     '(⁀ᗢ⁀)',
        //     '(─‿─)'
        // ]

        const interval = setInterval(() => {
            // don't ask, but it works
            const n = 2
            const t = Math.floor(((Date.now() * n) / (1000 / n)))
            const i = t % animationFrames.length

            setChargeAnimation(animationFrames[i])

        }, 250);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchAndSetVehicleStats = async () => {
            console.log({secrets})

            let vehicleStats = await fetchVehicleStats(secrets.teslafiApiKey)
            setLastFetchTime(new Date(Date.now()))
            setVehicleStats(vehicleStats.response)
            setLastFetchCode(vehicleStats.responseCode)
        }

        fetchAndSetVehicleStats()
        const interval = setInterval(() => {
            fetchAndSetVehicleStats()
        }, 10 * ONE_MINUTE_MS);
    return () => clearInterval(interval);
    }, []);

    if (!vehicleStats) {
        return (
            <Heading
                content={`Teslafi | Failed to fetch vehicle status, code ${lastFetchCode}`}
                fontSize={14}
                fontWeight={400}
            />
        )
    }

    const chargingState = vehicleStats.charging_state;
    const batteryLevel = vehicleStats.battery_level;
    const chargeLimit = vehicleStats.charge_limit_soc;

    const isCharging = chargingState === 'Charging'
    const isChargingComplete = chargingState === 'Complete'

    let chargeLevelString = `Battery | ${batteryLevel}%`
    let chargeLevelColor = 'white'

    if (isCharging) {
        chargeLevelString = `${chargeAnimation} Charging | ${batteryLevel}/${chargeLimit}%`
        chargeLevelColor = GREEN
    }

    if (isChargingComplete) {
        chargeLevelString = `Charge Complete | ${batteryLevel}%`
        chargeLevelColor = BLUE
    }

    const temperatureString = `Interior: ${vehicleStats.inside_tempF}°F / ${vehicleStats.inside_temp}°C`

    // const chargeTimeRemaining = minutesToHoursAndMinutes(vehicleStats.battery.minutes_remaining);
    // const chargeTimeRemaingingString = (chargeTimeRemaining.hours !== 0 ? chargeTimeRemaining.hours.toString() + ` ${chargeTimeRemaining.hours === 1 ? 'hour' : 'hours'} ` : "")
    //     + (chargeTimeRemaining.minutes !== 0 ? chargeTimeRemaining.minutes.toString() + " minutes " : "")
    //     + "remaining"

    return (
        <div style={{}} >
            <Heading
                content={`Teslafi | x Gemini x | Last fetch @ ${ get12HrTime(lastFetchTime) }`}
                fontSize={12}
                fontWeight={400}
            />

            <div style={{
                color: chargeLevelColor,
                marginTop: '15px'
            }}>
                <Heading
                    content={chargeLevelString}
                    fontWeight={200}
                    disableMargins
                />
            </div>

            { /* This is the charge bar */ }
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <div style={{
                    width: '600px',
                    height: '6px',
                    backgroundColor: DULL_GREY,
                    marginTop: '5px',
                }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${batteryLevel}%`,
                            backgroundColor: chargeLevelColor,
                            float: 'right'
                        }}
                    />
                    <div
                        style={{
                            height: '100%',
                            width: `${parseInt(chargeLimit) - parseInt(batteryLevel)}%`,
                            backgroundColor: 'black',
                            float: 'right'
                        }}
                    />
                </div>
            </div>
            { /* end charge bar */ }

            {/* {
                isCharging && (
                    <Heading
                        content={chargeTimeRemaingingString}
                        fontSize={26}
                        fontWeight={300}
                    />
                )
            } */}

            <h1 style={{
                fontSize: 28,
                fontWeight: 200,
                // margin: 0
            }}>
                <SpanDecimalNumbers
                    text={temperatureString}
                    fontSize={20}
                />
            </h1>
            

        </div>
    )

}

export default TeslaStats