
import React, { useEffect, useState } from 'react'
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
        fontWeight={200}
        opacity={countdownText.includes("ago") ? 0.4 : 1 }
    />
}

const Clock: React.FC = () => {

    const [ currentTime, setCurrentTime ] = useState<Date>(new Date(Date.now()))

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date(Date.now()))
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const { sunrise, sunset } = getTimes(currentTime, 30.266666, -97.73333); // austin coords

    return (
        <>
            <Heading
                fontWeight={200}
                content={currentTime.toDateString()}
            />
            <Heading
                fontSize={108}
                fontWeight={100}
                disableMargins
                content={get12HrTime(currentTime)}
            />
            <Heading 
                fontSize={56}
                fontWeight={100}
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
        </>
    )
}

export default Clock