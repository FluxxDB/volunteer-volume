import React, { useState } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import "../styles/HomePage.css";

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="container">
      {/* Top Navigation Bar */}
      <div className="top-bar">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>
        <h2 className="site-title">Virginia Discovery Museum Volunteer Database</h2>
        <FaUserCircle className="profile-icon" />
      </div>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <nav>
          <a href="#home">Home</a>
          <a href="#apply">Apply!</a>
          <a href="#calendar">Calendar</a>
          <a href="#shifts">Shifts</a>
          <a href="#signin">Sign In/Sign Out</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2 className="site-title">Virginia Discovery Museum Volunteer Program</h2>
        <p>*some info and pics about the volunteering program*</p>
        <button className="apply-button">Apply Today!</button>
      </div>
    </div>
  );
};

export default HomePage;
