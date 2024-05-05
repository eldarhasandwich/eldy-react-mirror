import AppContext, { AppContextType, CountdownListItem } from './AppContext';
import './App.css';

import countdowntimerCsv from '../../config/countdowntimers.csv'

import Clock from './Components/Clock/Clock';
import PirateWeather from './Components/PirateWeather/PirateWeather';
import CountdownList from './Components/CountdownList/CountdownList';
import { useEffect, useState } from 'react';
import TimelyReminder from './Components/TimelyReminder/TimelyReminder';

export type Alignment = 'left' | 'right'

const secrets = require('../../secrets.json')

const countdownList = countdowntimerCsv.map((row: any) => {
    return {
        name: row.EVENT_NAME,
        date: row.EVENT_DATE,
        repeatsAnnually: row.EVENT_REPEATSANNUALLY === 'repeatsAnnually'
    }
})

// const countdownList: CountdownListItem[] = []

const baseAppConfig: AppContextType = {
  secrets: {
    ...secrets
  },
  location: {
    coords: {
      long: -97.814625,
      lat: 30.493780
    }
  },
  countdownList,
  currentTime: new Date(Date.now())
}

export default function App() {

    const [ currentTime, setCurrentTime ] = useState<Date>(new Date(Date.now()));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date(Date.now()))
        }, 1000);
        return () => clearInterval(interval);
    }, []);


  return (
    <AppContext.Provider value={{
        ...baseAppConfig,
        currentTime
    }}>

      <div style={{
        height: '45vh',
        paddingLeft: '1%',
        paddingRight: '1%',
        paddingBottom: '2.5%'
      }}>
      
        <div style={{
            width: '45vw',
            height: '100%',
            float: 'left'
        }}>
          <PirateWeather alignment={'left'} />
        </div>

        <div style={{
            width: '45vw',
            height: '100%',
            float: 'right',
            textAlign: 'right'
        }}>

          <Clock/>
          <TimelyReminder/>

          <div
            style={{
              height:'50px'
            }}
          />

          {/* <TeslaStats/> */}

        </div>

      </div>

      <div style={{
        height: '45vh',
        padding: '1%'
      }}>

        <CountdownList/>

      </div>

    </AppContext.Provider>
  );
}
