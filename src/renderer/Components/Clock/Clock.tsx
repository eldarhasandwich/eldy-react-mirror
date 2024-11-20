
import React, { useContext, useEffect, useState } from 'react'
import AppContext from 'renderer/AppContext';
import { Heading } from '../Display/Text';
import { getTimes } from './SunCalc';
import { get12HrTime, get24HrTime, getDeltaTime } from './utils';

const DailyCountdown: React.FC<{
    title: string,
    time: Date,
    currentTime: Date
}> = (props) => {
    const countdownText = `${props.title}: ${getDeltaTime(props.time, props.currentTime)} (${get12HrTime(props.time)})`;

    return <Heading
        content={countdownText}
        fontSize={24}
        fontWeight={200}
        opacity={countdownText.includes("ago") ? 0.4 : 1 }
    />
}

const TimezoneClock: React.FC<{
    locationName: string,
    timezone: string
}> = (props) => {

    const { currentTime } = useContext(AppContext);

    const timeString = currentTime.toLocaleTimeString('en-US', {
        timeZone: props.timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).replace('AM', 'am').replace('PM', 'pm')

    const dateInTimezone = new Date(currentTime.toLocaleString('en-US', { timeZone: props.timezone }))
    const hour = dateInTimezone.getHours();
    const isNight = hour >= 22 || hour < 6;
    
    return (
        <div
            style={{
                marginTop: '50px',
                marginLeft: '50px'
            }}
        >
            <Heading
                fontSize={20}
                fontWeight={200}
                content={props.locationName}
                disableMargins
            />
            <Heading
                fontSize={50}
                fontWeight={100}
                content={timeString}
                disableMargins
                opacity={isNight ? 0.5 : 1}
            />
        </div>
    )
}

const Clock: React.FC = () => {
    
    const { currentTime } = useContext(AppContext);

    const { location } = useContext(AppContext)
    const { long, lat } = location.coords

    const { sunrise, sunset } = getTimes(currentTime, lat, long);

    return (
        <>
            <Heading
                fontSize={40}
                fontWeight={300}
                // disableMargins
                content={currentTime.toDateString()}
            />
            <Heading
                fontSize={160}
                fontWeight={100}
                disableMargins
                content={get12HrTime(currentTime)}
            />
            <Heading 
                fontSize={80}
                fontWeight={100}
                disableMargins
                content={get24HrTime(currentTime)}
            />
            <DailyCountdown 
                title='Sunrise' 
                time={sunrise} 
                currentTime={currentTime}
            />
            <DailyCountdown 
                title='Sunset' 
                time={sunset} 
                currentTime={currentTime}
            />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}
            >
                <TimezoneClock
                    locationName='AZ USA'
                    timezone='America/Phoenix'
                />
                <TimezoneClock
                    locationName='VIC Aust.'
                    timezone='Australia/Melbourne'
                />
                <TimezoneClock
                    locationName='Bosnia'
                    timezone='Europe/Sarajevo'
                />
            </div>
        </>
    )
}

export default Clock
