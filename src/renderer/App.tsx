import AppContext, { AppContextType } from './AppContext';
import './App.css';

import Clock from './Components/Clock/Clock';
import PirateWeather from './Components/PirateWeather/PirateWeather';
import CountdownList from './Components/CountdownList/CountdownList';
import TeslaStats from './Components/TeslaStats/TeslaStats';

export type Alignment = 'left' | 'right'

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
      name: "Valentines Day",
      date: "Febuary 14",
      repeatsAnnually: true
    },
    {
      name: "Dating Anniversary",
      date: "Febuary 21",
      repeatsAnnually: true
    },
    {
      name: "Linds Birthday",
      date: "May 28",
      repeatsAnnually: true
    },
    {
      name: "Eldy Birthday",
      date: "June 8",
      repeatsAnnually: true
    },
    {
      name: 'Wedding Anniversary',
      date: "October 13",
      repeatsAnnually: true
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
    { name: "Total Solar Eclipse", date: "April 8 2024" },
    { name: "Fall Out Boy Concert", date: "March 8 2024" },
    { name: "Poe Ballet", date: "March 22 2024" }
  ],
  teslascope: {
    vehiclePublicId: 'GsNy'
  }
}

// const LineBreak = () => {

//   return (
//     <div style={{ 
//       height: '1px',
//       width: '100%',
//       backgroundImage: 'linear-gradient(to right, transparent, #666)',
//       margin: '30px 0',
//     }}/>
//   )
// }

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
          <PirateWeather alignment={'left'} />
        </div>

        <div style={{
            width: '45vw',
            height: '100%',
            float: 'right',
            textAlign: 'right'
        }}>

          <Clock/>

          <div
            style={{
              height:'50px'
            }}
          />

          <TeslaStats/>

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
