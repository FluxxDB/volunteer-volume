import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import "../styles/Layout.css";
import { NavLink } from "react-router-dom";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "volunteers", currentUser.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="layout-container">
      <div className="top-bar">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>
        <h2 className="site-title">Virginia Discovery Museum Volunteer Database</h2>

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

      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <nav>
          <NavLink to="/" className="clickable">Home</NavLink>
          <NavLink to="/apply" className="clickable">Apply!</NavLink>
          <NavLink to="/calendar" className="clickable">Calendar</NavLink>
          <NavLink to="/shifts" className="clickable">Shifts</NavLink>
          {isAdmin && <NavLink to="/admin-panel" className="clickable">Admin Panel</NavLink>}
        </nav>
      </div>

      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
