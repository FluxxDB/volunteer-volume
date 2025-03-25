import React, { useState } from "react";
import "../styles/ShiftsPage.css"; // Import styles for the page
import { volunteersData } from "./volunteersData"; // Import the volunteers data

const ShiftsPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control the visibility of the form
  const [newShift, setNewShift] = useState({
    name: "",
    role: "Front Desk Specialist", // Default role value
    startTime: "",
    duration: "",
    repeat: "once", // Default repeat value
    specificDate: "",
    startDate: "",
    endDate: "",
  });

  const handleAddShiftClick = () => {
    setIsFormVisible(!isFormVisible); // Toggle the visibility of the form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewShift((prevShift) => ({
      ...prevShift,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New shift added:", newShift); // Here, you can process the data and update your state or database
    setIsFormVisible(false); // Hide the form after submitting
  };

  return (
    <div className="shifts-content">
      {/* Title */}
      <h1>Upcoming Shifts</h1>

      {/* Add a new shift button */}
      <div className="add-shift-container">
        <button
          className="add-shift-button"
          onClick={handleAddShiftClick}
        >
          +
        </button>

        {/* Expandable form for adding a shift */}
        {isFormVisible && (
          <form className="add-shift-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Volunteer Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newShift.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                value={newShift.role}
                onChange={handleChange}
                required
              >
                <option value="Front Desk Specialist">Front Desk Specialist</option>
                <option value="Gallery Helper">Gallery Helper</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dayOfWeek">Day of Week</label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={newShift.dayOfWeek}
                onChange={handleChange}
                required
              >
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={newShift.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (hours):</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={newShift.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="repeat">Repeat:</label>
              <select
                id="repeat"
                name="repeat"
                value={newShift.repeat}
                onChange={handleChange}
                required
              >
                <option value="once">Once</option>
                <option value="every week">Every Week</option>
              </select>
            </div>

            {newShift.repeat === "once" && (
              <div className="form-group">
                <label htmlFor="specificDate">Specific Date:</label>
                <input
                  type="date"
                  id="specificDate"
                  name="specificDate"
                  value={newShift.specificDate}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {newShift.repeat === "every week" && (
              <>
                <div className="form-group">
                  <label htmlFor="startDate">Start Date:</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={newShift.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date:</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={newShift.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="submit-button">
              Add Shift
            </button>
          </form>
        )}
      </div>

      {/* Display existing shifts */}
      <div className="existing-shifts">
        <h2>Existing Shifts:</h2>
        {Object.values(volunteersData).map((volunteer, idx) => (
          <div key={idx} className="volunteer-shifts">
            <h3>{volunteer.name}</h3>
            <ul>
              {volunteer.shifts.map((shift, shiftIdx) => (
                <li key={shiftIdx}>
                  <p>{shift.dayOfWeek}: {shift.role} ({shift.startTime} - {parseInt(shift.startTime.split(":")[0]) + shift.duration}:00)</p>
                  {shift.repeat === "once" && shift.specificDate && (
                    <p>Specific Date: {shift.specificDate}</p>
                  )}
                  {shift.repeat === "every week" && shift.startDate && shift.endDate && (
                    <p>Repeats from {shift.startDate} to {shift.endDate}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftsPage;
