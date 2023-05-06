
import React, { useContext, useEffect, useState } from 'react'
import { Heading } from '../Display/Text';
import { VehicleStatsResponse, fahrenheitToCelcius, fetchVehicleStats } from './utils';
import AppContext from 'renderer/AppContext';
import { BLUE, GREEN } from 'renderer/constants';
import { get12HrTime } from '../Clock/utils';
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

    if (!teslascope) {
        return (<></>)
    }

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

        chargeLevelString = `${vehicleStats.battery.charging_state} | ${vehicleStats.battery.level}/${vehicleStats.battery.charge_limit_soc}%`
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
                content={`Teslascope | Orange Eye Gemini | Last fetch @ ${ get12HrTime(lastFetchTime) }`}
                fontSize={14}
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
                    backgroundColor: '#555',
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
                </div>
            </div>

            {
                isCharging && (
                    <Heading
                        content={`${vehicleStats.battery.minutes_remaining} minutes remaining`}
                        fontSize={26}
                        fontWeight={300}
                    />
                )
            }

            <Heading
                content={temperatureString}
                fontSize={26}
                fontWeight={300}
            />

        </div>
    )

}

export default TeslaStats