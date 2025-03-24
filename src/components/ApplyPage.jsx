import React from "react";
import "../styles/ApplyPage.css";

const ApplyPage = () => {
  return (
    <div className="apply-content">
      <h2 className="title">Volunteer</h2>
      <h3 className="subtitle">Enrich the Lives of Our Community's Children</h3>
      <p className="description">
        Volunteers play an invaluable role in helping the Virginia Discovery Museum
        fulfill its mission through their time and talents. From interacting with
        visitors and making their experiences fun and memorable to keeping exhibit
        spaces clean and safe, volunteers are vital to creating a Museum that is
        engaging and accessible to all.
      </p>

      <div className="info-boxes">
        <div className="info-box">
          <h4>Requirements</h4>
          <ul>
            <li>Be at Least 13 or Older</li>
            <li>Be Vaccinated Against COVID</li>
            <li>Complete an <a href="#application">Application</a> Online</li>
            <li>Meet Marketing & Outreach Manager</li>
          </ul>
        </div>
        <div className="info-box">
          <h4>Benefits</h4>
          <ul>
            <li>Free <a href="#parking">Parking</a> & VDM Passes</li>
            <li>Opportunities to Meet New People</li>
            <li>School Service Credit</li>
            <li>Valuable Training & Work Experience</li>
          </ul>
        </div>
      </div>

      <button className="apply-button">Apply Online</button>
    </div>
  );
};

export default ApplyPage;
