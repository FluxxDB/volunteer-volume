import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/Layout.css";
import { NavLink } from "react-router-dom";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="layout-container">
      <div className="top-bar">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>
        <h2 className="site-title">Virginia Discovery Museum Volunteer Database</h2>

        {/* Only show login button if no user is logged in */}
        {!user && (
          <button 
            className="login-button" 
            onClick={() => navigate("/login")}
          >
            Login / Create Account
          </button>
        )}

        <FaUserCircle 
          className="profile-icon"
          onClick={() => navigate("/profile")} 
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <nav>
          <NavLink to="/" className="clickable">Home</NavLink>
          <NavLink to="/apply" className="clickable">Apply!</NavLink>
          <NavLink to="/calendar" className="clickable">Calendar</NavLink>
          <NavLink to="/shifts" className="clickable">Shifts</NavLink>
          <NavLink to="/admin-panel" className="clickable">Admin Panel</NavLink>
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
