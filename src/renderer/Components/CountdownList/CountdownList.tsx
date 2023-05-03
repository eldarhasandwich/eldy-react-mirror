import React, { useContext, useEffect, useState } from 'react'
import AppContext, { CountdownListItem } from 'renderer/AppContext'
import { BLUE, GREEN } from 'renderer/constants';

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;

interface TimeUntil {
    millisecondsUntil: number;
    name: string;
    date: string;
}

const parseAndSetTimeUntils = (
    countdownList: CountdownListItem[], 
    setFn: React.Dispatch<React.SetStateAction<TimeUntil[]>>
) => {
    setFn(countdownList.map((item) => {
        const n = Date.now();
        const t = new Date(item.date)[Symbol.toPrimitive]("number");
        return {
            ...item,
            millisecondsUntil: t - n
        };
    }).sort((a, b) => a.millisecondsUntil - b.millisecondsUntil))
}

const CountdownList: React.FC = () => {

    const { countdownList } = useContext(AppContext)

    const [ timeUntils, setTimeUntils ] = useState<TimeUntil[]>([])

    useEffect(() => {
        parseAndSetTimeUntils(countdownList, setTimeUntils)

        const interval = setInterval(() => {

            parseAndSetTimeUntils(countdownList, setTimeUntils)

        }, MILLISECONDS_PER_HOUR);
        return () => clearInterval(interval)
    }, [])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            height: 'calc(100%)'
        }}>
            {
                timeUntils.map((item, index) => {

                    const name = item.name;
                    const time = Math.ceil(item.millisecondsUntil / MILLISECONDS_PER_DAY);
                    const dateHasPassed = time < 0;
                    const dayIsToday = time === 0;
        
                    let timeString = "";
                    let color = ""
                    if (dayIsToday) {
                        timeString = "Today!!!"
                        color = BLUE
                    } else if (dateHasPassed) {
                        timeString = `${time * -1} days ago`
                        color = GREEN
                    } else {
                        timeString = `${time} days`
                    }

                    const opacity = (1/5) * (timeUntils.length - index)

                    return (
                        <div style={{
                            opacity,
                            color,
                            fontSize: 30
                        }}>
                            <span>{name + ' >>> '}</span>
                            <span>{timeString}</span>
                        </div>
                    )
                })
            }
        </div>
    )

}

export default CountdownList