import AppContext, { AppContextType } from './AppContext';
import './App.css';

import Clock from './Components/Clock/Clock';
import PirateWeather from './Components/PirateWeather/PirateWeather';
import CountdownList from './Components/CountdownList/CountdownList';
import TeslaStats from './Components/TeslaStats/TeslaStats';

const secrets = require('../../secrets.json')

const appConfig: AppContextType = {
  secrets: {
    ...secrets
  },
  location: {
    coords: {
      long: -97.814625,
      lat: 30.493780
    }
  },
  countdownList: [
    {
      name: "Linlin Birthday",
      date: "May 28",
      repeatsAnnually: true
    },
    {
      name: "Eldy Birthday",
      date: "June 8",
      repeatsAnnually: true
    },
    {
      name: "Fly out to Kentucky",
      date: "June 21 2023"
    },
    {
      name: "FOB Concert",
      date: "June 28 2023"
    },
    { name: "Starfield Launch", date: "September 6 2023" },
    { name: "Cities: Skylines II Launch", date: "October 24 2023" },
    { name: "Payday 3 Launch", date: "September 21 2023" },
    { name: "Paramore Concert", date: "July 9 2023" },
    {
      name: "Marriage",
      date: "October 31 2023"
    },
    {
      name: "Halloween",
      date: "October 31",
      repeatsAnnually: true
    },
    {
      name: "Christmas",
      date: "December 25",
      repeatsAnnually: true
    },
    {
      name: "New Years",
      date: "January 1",
      repeatsAnnually: true
    },
    {
      name: "Valentines Day",
      date: "Febuary 14",
      repeatsAnnually: true
    }
  ],
  teslascope: {
    vehiclePublicId: 'GsNy'
  }
}

export default function App() {
  return (
    <AppContext.Provider value={appConfig}>

      <div style={{
        height: '45vh',
        paddingLeft: '2.5%',
        paddingRight: '2.5%',
        paddingBottom: '2.5%'
      }}>
      
        <div style={{
            width: '45vw',
            height: '100%',
            float: 'left'
        }}>
          <Clock/>
        </div>

        <div style={{
            width: '45vw',
            height: '100%',
            float: 'right',
            textAlign: 'right'
        }}>
          <TeslaStats/>

          <div style={{ 
            height: '1px',
            width: '100%',
            backgroundImage: 'linear-gradient(to right, transparent, #666)',
            margin: '30px 0',
          }}/>

          <PirateWeather/>
        </div>

      </div>

      <div style={{
        height: '45vh',
        padding: '2.5%'
      }}>

        <CountdownList/>

      </div>

    </AppContext.Provider>
  );
}
