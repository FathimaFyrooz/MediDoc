import { useState,React } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './Components/Home';
import PatientList from './Components/PatientList';
import Details from './Components/Details'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      {/* <Navbar /> A common navigation bar */}
      <Routes>
        <Route path="/*" element={<Home />} /> 
        <Route path="/details" element={<Details />} /> 
        <Route path="/list_patients" element={<PatientList />} /> 
       
      </Routes>
    </Router>
  );
}

export default App
