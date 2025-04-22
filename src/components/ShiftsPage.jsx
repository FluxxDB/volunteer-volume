import React, { useState } from "react";
import "../styles/ShiftsPage.css"; 
import { volunteersData } from "./volunteersData";

const ShiftsPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newShift, setNewShift] = useState({
    //name: "",
    role: "Front Desk Specialist",
    startTime: "",
    duration: "",
    repeat: "once", 
    specificDate: "",
    startDate: "",
    endDate: "",
  });

  const handleAddShiftClick = () => {
    setIsFormVisible(!isFormVisible); 
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
    console.log("New shift added:", newShift);
    setIsFormVisible(false); 
  };

  
  const generateShiftDate = (shift) => {
    if (shift.repeat === "once") {
      return new Date(shift.specificDate + "T" + shift.startTime + ":00");
    } else if (shift.repeat === "every week") {
      const startDate = new Date(shift.startDate);
      const timeParts = shift.startTime.split(":");
      startDate.setHours(timeParts[0]);
      startDate.setMinutes(timeParts[1]);
      return startDate;
    }
    return null;
  };

  
  const allShifts = Object.values(volunteersData).flatMap(volunteer =>
    volunteer.shifts.map(shift => ({
      ...shift,
      name: volunteer.name,
      date: generateShiftDate(shift)
    }))
  ).sort((a, b) => a.date - b.date); 

  return (
    <div className="shifts-content">
      <h1>Upcoming Shifts</h1>

      <div className="add-shift-container">
        <button
          className="add-shift-button"
          onClick={handleAddShiftClick}
        >
          +
        </button>

        {isFormVisible && (
          <form className="add-shift-form" onSubmit={handleSubmit}>
            {/* <div className="form-group">
              <label htmlFor="name">Volunteer Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newShift.name}
                onChange={handleChange}
                required
              />
            </div> */}

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

      <div className="existing-shifts">
        {allShifts.map((shift, idx) => (
          <div key={idx} className="shift">
            <h3>{shift.name} - {shift.role}</h3>
            <p>{shift.dayOfWeek}: {shift.startTime} - {parseInt(shift.startTime.split(":")[0]) + shift.duration}:00</p>
            {shift.repeat === "once" && shift.specificDate && (
              <p>Specific Date: {shift.specificDate}</p>
            )}
            {shift.repeat === "every week" && shift.startDate && shift.endDate && (
              <p>Repeats from {shift.startDate} to {shift.endDate}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftsPage;
