import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-content">
      <h2 className="site-title">Virginia Discovery Museum Volunteer Program</h2>
      <p>*some info and pics about the volunteering program*</p>
      
      {/* Button that navigates to the Apply page */}
      <button className="apply-button" onClick={() => navigate("/apply")}>
        Apply Today!
      </button>
    </div>
  );
};

export default HomePage;
