import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Clock from './Components/Clock/Clock';

import './App.css';

function Hello() {
  return (
    <>

      <div style={{
        height: '45vh',
        paddingLeft: '2.5%',
        paddingRight: '2.5%',
        paddingBottom: '2.5%'
      }}>
      
        <Clock/>

      </div>

      <div style={{
        height: '45vh',
        padding: '2.5%'
      }}>


      </div>

    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
