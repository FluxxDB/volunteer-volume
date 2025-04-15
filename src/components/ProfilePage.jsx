import React, { useState } from "react";
import "../styles/ProfilePage.css";

const fields = [
  { label: "profile name", type: "text" },
  { label: "email", type: "email" },
  { label: "phone number", type: "tel" },
  { label: "password", type: "password" },
];

const stats = ["date of birth", "date joined", "total hours served"];

const ProfilePage = () => {
  const [editFields, setEditFields] = useState({});
  const [formData, setFormData] = useState({
    "profile name": "",
    email: "",
    "phone number": "",
    password: "",
    "date of birth": "",
    "date joined": "",
    "total hours served": "",
  });

  const toggleEdit = (field) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>

      <h3 className="section-title">Your Account</h3>
      {fields.map(({ label, type }) => (
        <div className="field-row" key={label}>
          {editFields[label] ? (
            <input
              type={type}
              value={formData[label]}
              onChange={(e) => handleInputChange(e, label)}
              placeholder={`*${label}*`}
            />
          ) : (
            <div className="readonly-field">{formData[label] || `*${label}*`}</div>
          )}
          <button className="change-button" onClick={() => toggleEdit(label)}>
            {editFields[label] ? "done" : "change"}
          </button>
        </div>
      ))}

      <h3 className="section-title">Your Stats</h3>
      {stats.map((label) => (
        <div className="field-row" key={label}>
          <div className="readonly-field">{`*${label}*: ${formData[label]}`}</div>
        </div>
      ))}
    </div>
  );
};

export default ProfilePage;
