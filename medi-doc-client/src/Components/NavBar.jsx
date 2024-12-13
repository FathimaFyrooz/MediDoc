import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/details">New Patient</Link></li>
      <li><Link to="//listpatients">List Patients</Link></li>

    </ul>
  </nav>
);

export default Navbar;