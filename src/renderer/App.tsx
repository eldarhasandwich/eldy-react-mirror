import AppContext, { AppContextType } from './AppContext';
import './App.css';

import Clock from './Components/Clock/Clock';
import PirateWeather from './Components/PirateWeather/PirateWeather';
import CountdownList from './Components/CountdownList/CountdownList';

const appConfig: AppContextType = {
  location: {
    coords: {
      long: -97.814625,
      lat: 30.493780
    }
  },
  countdownList: [
    { name: "Brand New Day", date: "May 3 2023" },
    { name: "Kyary Concert", date: "May 17 2023" },
    { name: "Eurovision Starts", date: "May 9 2023" },
    { name: "Paramore Concert", date: "July 9 2023" },
    {
      name: "Maddie Birthday",
      date: "May 28 2023"
    },
    {
      name: "Eldy Birthday",
      date: "June 8 2023"
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
    {
      name: "Halloween",
      date: "October 31 2023"
    },
    {
      name: "Christmas",
      date: "December 25 2023"
    },
    {
      name: "New Years",
      date: "January 1 2024"
    },
    {
      name: "Valentines Day",
      date: "Febuary 14 2024"
    },
    {
      name: "Maddie Birthday",
      date: "May 28 2024"
    },
    {
      name: "Eldy Birthday",
      date: "June 8 2024"
    }
  ]
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
