
import React, { useContext, useEffect, useState } from 'react'
import { Heading } from '../Display/Text';
import { VehicleStatsResponse, fahrenheitToCelcius, fetchVehicleStats } from './utils';
import AppContext from 'renderer/AppContext';
import { BLUE, GREEN } from 'renderer/constants';
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

    if (!teslascope) {
        return (<></>)
    }

    useEffect(() => {
        const fetchAndSetVehicleStats = async () => {
            let vehicleStats = await fetchVehicleStats(teslascope.vehiclePublicId, secrets.teslascopeApiKey)

            // vehicleStats = { ...vehicleStats, battery: { ...vehicleStats?.battery, level: 59, charging_state: 'Complete' } }

            // console.log({vehicleStats})

            setVehicleStats(vehicleStats)
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

        chargeLevelString = `${vehicleStats.battery.charging_state} | ${vehicleStats.battery.level}%/${vehicleStats.battery.charge_limit_soc}%`
        chargeLevelColor = GREEN

    }

    if (isChargingComplete) {

        chargeLevelString = `Charge Complete | ${vehicleStats.battery.level}%`
        chargeLevelColor = BLUE
    
    }

    const temperatureString = `Interior: ${vehicleStats.climate.inside}°F / ${fahrenheitToCelcius(vehicleStats.climate.inside)}°C`

    return (
        <div style={{marginBottom: '100px'}} >
            <Heading
                content={'Teslascope | Orange Eye Gemini'}
                fontSize={14}
                fontWeight={400}
            />

            <div style={{
                color: chargeLevelColor
            }}>
                <Heading
                    content={chargeLevelString}
                    fontSize={56}
                    fontWeight={100}
                    disableMargins
                />
            </div>

            { /* This is the charge bar */ }
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <div style={{
                    width: '500px',
                    height: '15px',
                    backgroundColor: '#222',
                    marginTop: '20px',
                }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${vehicleStats.battery.level}%`,
                            backgroundColor: chargeLevelColor
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
                fontWeight={200}
            />

        </div>
    )

}

export default TeslaStats