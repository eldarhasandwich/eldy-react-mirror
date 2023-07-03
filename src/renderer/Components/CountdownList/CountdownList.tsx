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
        let t = new Date(item.date)[Symbol.toPrimitive]("number");

        if (item.repeatsAnnually) {
            while ((t - n) < (MILLISECONDS_PER_DAY * -10)) {
                const t_Date = new Date(t)
                t_Date.setFullYear(t_Date.getFullYear() + 1)
                t = t_Date[Symbol.toPrimitive]("number");
            }
        }

        return {
            ...item,
            millisecondsUntil: t - n
        };
    }).sort((a, b) => a.millisecondsUntil - b.millisecondsUntil)
        .filter((item) => {
            if (!item.repeatsAnnually && item.millisecondsUntil < (MILLISECONDS_PER_DAY * -10)) {

                console.warn(`NOTE!: count down list item '${item.name}' is not repeatable and has occured more than 10 days ago. Ideally clean this up.`)

                return false
            }
            return true
        })
    )
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
                        color = GREEN
                    } else if (dateHasPassed) {
                        timeString = `${time * -1} days ago`
                        color = BLUE
                    } else {
                        timeString = `${time} days`
                    }

                    const opacity = (1/5) * (timeUntils.length - index)

                    return (
                        <div style={{
                            opacity,
                            color,
                            fontSize: 24,
                            fontWeight: 300
                        }}>
                            <span>{name + ' -> '}</span>
                            <span>{timeString}</span>

                            <span style={{
                                fontSize: 14,
                                fontWeight: 600,
                                marginLeft: '20px',
                                opacity: 0.6
                            }}>
                                {item.date}
                            </span>
                        </div>
                    )
                })
            }
        </div>
    )

}

export default CountdownList