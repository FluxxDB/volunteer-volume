import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPanel.css";

const sampleVolunteers = [
  { id: 1, name: "volunteer1", approved: false },
  { id: 2, name: "volunteer2", approved: false },
  { id: 3, name: "volunteer3", approved: false },
];

const AdminPanel = () => {
  const navigate = useNavigate();

  const [volunteers, setVolunteers] = useState(sampleVolunteers);

  const handleApprove = (id) => {
    setVolunteers((prevVolunteers) =>
      prevVolunteers.map((vol) =>
        vol.id === id ? { ...vol, approved: true } : vol
      )
    );
  };

  const handleDeny = (id) => {
    setVolunteers((prevVolunteers) =>
      prevVolunteers.filter((vol) => vol.id !== id)
    );
  };

  return (
    <div className="main-content">
      <h1>Pending Volunteer Approvals</h1>
      <ul className="volunteer-list">
        {volunteers.map((volunteer) => (
          <li key={volunteer.id} className="volunteer-item">
            <span>{volunteer.name}</span>
            <div className="button-group">
              {!volunteer.approved ? (
                <>
                  <button
                    className="approve-button"
                    onClick={() => handleApprove(volunteer.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="deny-button"
                    onClick={() => handleDeny(volunteer.id)}
                  >
                    Deny
                  </button>
                </>
              ) : (
                <span className="approved-label">Approved</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
