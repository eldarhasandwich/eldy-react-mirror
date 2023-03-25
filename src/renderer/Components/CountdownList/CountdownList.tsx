import React, { useContext } from 'react'
import AppContext from 'renderer/AppContext'

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const CountdownList: React.FC = () => {

    const { countdownList } = useContext(AppContext)

    const timeUntils = countdownList.map((item) => {
		const n = Date.now();
		const t = new Date(item.date)[Symbol.toPrimitive]("number");
		return {
			...item,
			millisecondsUntil: t - n
		};
	}).sort((a, b) => a.millisecondsUntil - b.millisecondsUntil);

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
                        color = '#6495ED'
                    } else if (dateHasPassed) {
                        timeString = `${time * -1} days ago`
                        color = '#90EE90'
                    } else {
                        timeString = `${time} days`
                    }

                    const opacity = (1/5) * (timeUntils.length - index)

                    return (
                        <div style={{
                            opacity,
                            color
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