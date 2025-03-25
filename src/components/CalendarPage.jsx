import React, { useState } from "react";
import "../styles/CalendarPage.css";
import { volunteersData } from "./volunteersData"; // Update the import to use 'volunteersData'

const CalendarPage = () => {
  // Get the current date
  const getCurrentDate = () => new Date();

  // Function to get the start of the current week (Sunday)
  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek; // Get the difference from Sunday
    const startOfWeek = new Date(date.setDate(diff));
    return startOfWeek;
  };

  // Calculate the start of the current week
  const currentDate = getCurrentDate();
  const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(currentDate));

  // Generate the dates for the week (Sunday to Saturday)
  const getWeekDates = (startOfWeek) => {
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(startOfWeek);

  // Get the month name
  const getMonthName = (date) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[date.getMonth()];
  };

  const currentMonth = getMonthName(startOfWeek);

  // Create an array for each day of the week
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Initialize a structure to hold the shifts for each day of the week
  const shiftsByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});

  // Iterate over the volunteers' shifts and assign them to the correct day
  Object.values(volunteersData).forEach((volunteer) => {
    volunteer.shifts.forEach((shift) => {
      if (shift.repeat === "once" && shift.specificDate) {
        // For "once" shifts, check if the specificDate matches the current week
        const specificDate = new Date(shift.specificDate);
        if (weekDates.some(date => date.toLocaleDateString() === specificDate.toLocaleDateString())) {
          shiftsByDay[shift.dayOfWeek].push({
            name: volunteer.name,
            role: shift.role,
            startTime: shift.startTime,
            duration: shift.duration,
            repeat: shift.repeat,
            specificDate: shift.specificDate,
          });
        }
      } else if (shift.repeat === "every week" && shift.startDate && shift.endDate) {
        // For "every week" shifts, check if the current date is within the range
        const startDate = new Date(shift.startDate);
        const endDate = new Date(shift.endDate);
        if (currentDate >= startDate && currentDate <= endDate) {
          shiftsByDay[shift.dayOfWeek].push({
            name: volunteer.name,
            role: shift.role,
            startTime: shift.startTime,
            duration: shift.duration,
            repeat: shift.repeat,
            startDate: shift.startDate,
            endDate: shift.endDate,
          });
        }
      }
    });
  });

  // Sort shifts by startTime for each day
  Object.keys(shiftsByDay).forEach((day) => {
    shiftsByDay[day].sort((a, b) => {
      const [hourA, minuteA] = a.startTime.split(":").map(Number);
      const [hourB, minuteB] = b.startTime.split(":").map(Number);
      if (hourA === hourB) {
        return minuteA - minuteB;
      }
      return hourA - hourB;
    });
  });

  // Navigate to the previous or next week
  const changeWeek = (direction) => {
    const newStartOfWeek = new Date(startOfWeek);
    newStartOfWeek.setDate(startOfWeek.getDate() + direction * 7);
    setStartOfWeek(newStartOfWeek);
  };

  return (
    <div className="calendar-content">
      {/* Volunteer Calendar and Month Name Display */}
      <div className="calendar-header">
        <h1>Volunteer Calendar</h1>
        <h2>{currentMonth}</h2>
      </div>

      <div className="calendar-week">
        <div className="calendar-day button-container">
          <button onClick={() => changeWeek(-1)} className="week-button">{"←"}</button>
        </div>

        {weekDates.map((date, index) => (
          <div className="calendar-day" key={index}>
            <h3>{daysOfWeek[index]}</h3>
            <p>{date.toLocaleDateString()}</p> {/* Display the actual date */}
            {shiftsByDay[daysOfWeek[index]].length > 0 ? (
              shiftsByDay[daysOfWeek[index]].map((shift, idx) => (
                <div className="shift" key={idx}>
                  <p><strong>{shift.name}</strong></p>
                  <p>{shift.role}</p>
                  <p>{shift.startTime} - {parseInt(shift.startTime.split(":")[0]) + shift.duration}:00</p>
                  <p>Duration: {shift.duration} hours</p>
                  <p>Repeat: {shift.repeat}</p>
                  {shift.specificDate && <p>Specific Date: {shift.specificDate}</p>}
                  {shift.startDate && shift.endDate && (
                    <p>Repeats from {shift.startDate} to {shift.endDate}</p>
                  )}
                </div>
              ))
            ) : (
              <p>No shifts scheduled</p>
            )}
          </div>
        ))}

        <div className="calendar-day button-container">
          <button onClick={() => changeWeek(1)} className="week-button">{"→"}</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
