
import React, { useContext, useEffect, useState } from 'react'
import { Heading } from '../Display/Text';
import { VehicleStatsResponse, fahrenheitToCelcius, fetchVehicleStats } from './utils';
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

    const { teslascope, secrets } = useContext(AppContext);

    const [ vehicleStats, setVehicleStats ] = useState<VehicleStatsResponse | undefined>(undefined);
    const [ lastFetchTime, setLastFetchTime ] = useState<Date>(new Date(Date.now()))

    const [ chargeAnimation, setChargeAnimation ] = useState<string>('')

    if (!teslascope) {
        return (<></>)
    }

    useEffect(() => {

        const animationFrames = [
            '',
            '<',
            '< <',
            '< < <',
            '< < < <',
            '< < < < <',
        ]

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
            let vehicleStats = await fetchVehicleStats(teslascope.vehiclePublicId, secrets.teslascopeApiKey)
            setLastFetchTime(new Date(Date.now()))
            setVehicleStats(vehicleStats)
        }

        fetchAndSetVehicleStats()
        const interval = setInterval(() => {
            fetchAndSetVehicleStats()
        }, 9 * ONE_MINUTE_MS);
        return () => clearInterval(interval);
    }, []);

    if (!vehicleStats) {
        return (
            <Heading
                content={'Teslascope | Failed to fetch vehicle stats'}
                fontSize={14}
                fontWeight={400}
            />
        )
    }

    const isCharging = vehicleStats.battery.charging_state === 'Charging'
    const isChargingComplete = vehicleStats.battery.charging_state === 'Complete'

    let chargeLevelString = `Battery | ${vehicleStats.battery.level}%`
    let chargeLevelColor = 'white'

    if (isCharging) {

        chargeLevelString = `${chargeAnimation} Charging | ${vehicleStats.battery.level}/${vehicleStats.battery.charge_limit_soc}%`
        chargeLevelColor = GREEN

    }

    if (isChargingComplete) {

        chargeLevelString = `Charge Complete | ${vehicleStats.battery.level}%`
        chargeLevelColor = BLUE
    
    }

    const temperatureString = `Interior: ${vehicleStats.climate.inside}°F / ${fahrenheitToCelcius(vehicleStats.climate.inside)}°C`

    return (
        <div style={{}} >
            <Heading
                content={`Teslascope | x Gemini x | Last fetch @ ${ get12HrTime(lastFetchTime) }`}
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
                            width: `${vehicleStats.battery.level}%`,
                            backgroundColor: chargeLevelColor,
                            float: 'right'
                        }}
                    />
                    <div
                        style={{
                            height: '100%',
                            width: `${vehicleStats.battery.charge_limit_soc - vehicleStats.battery.level}%`,
                            backgroundColor: 'black',
                            float: 'right'
                        }}
                    />
                </div>
            </div>
            { /* end charge bar */ }

            {
                isCharging && (
                    <Heading
                        content={`${vehicleStats.battery.minutes_remaining} minutes remaining`}
                        fontSize={26}
                        fontWeight={300}
                    />
                )
            }

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