import React, { useState } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import { NavLink } from "react-router-dom";


const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="layout-container">
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
          <NavLink to="/" className="clickable">Home</NavLink>
          <NavLink to="/apply" className="clickable">Apply!</NavLink>
          <NavLink to="/calendar" className="clickable">Calendar</NavLink>
          <NavLink to="/shifts" className="clickable">Shifts</NavLink>
          <NavLink to="/signin" className="clickable">Sign In/Sign Out</NavLink>
        </nav>

      </div>

      {/* Main Content */}
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
