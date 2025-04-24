import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase-config";
import "../styles/CalendarPage.css";

const CalendarPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Only fetch data once we confirm user is authenticated
        const fetchUserData = async () => {
          try {
            const userDoc = await getDoc(doc(db, "volunteers", user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserData({
                id: user.uid,
                name: data.name,
                shifts: data.shifts || [],
              });
            }
            setLoading(false);
          } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Error fetching user data");
            setLoading(false);
          }
        };
        fetchUserData();
      } else {
        setError("No user logged in");
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Function to get the start of the current week (Sunday)
  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek; // Get the difference from Sunday
    const startOfWeek = new Date(date.setDate(diff));
    return startOfWeek;
  };

  // Calculate the start of the current week
  const currentDate = useMemo(() => new Date(), []);
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

  // Memoize weekDates calculation
  const weekDates = useMemo(() => {
    return getWeekDates(startOfWeek);
  }, [startOfWeek]);

  // Get the month name
  const getMonthName = (date) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[date.getMonth()];
  };

  const currentMonth = getMonthName(startOfWeek);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [shiftsByDay, setShiftsByDay] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {})
  );
  
  
  useEffect(() => {
    if (loading || !userData) return;
  
    const newShiftsByDay = daysOfWeek.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {});
  
    // Only process shifts for the current user
    userData.shifts.forEach(shift => {
      if (shift.repeat === "once" && shift.specificDate) {
        const specificDate = new Date(shift.specificDate + "T00:00");
        if (weekDates.some(date => date.toLocaleDateString() === specificDate.toLocaleDateString())) {
          newShiftsByDay[shift.dayOfWeek]?.push({
            name: userData.name,
            role: shift.role,
            startTime: shift.startTime,
            duration: shift.duration,
            repeat: shift.repeat,
            specificDate: shift.specificDate,
          });
        }
      } else if (shift.repeat === "every week" && shift.startDate && shift.endDate) {
        const startDate = new Date(shift.startDate);
        const endDate = new Date(shift.endDate);
        if (currentDate >= startDate && currentDate <= endDate) {
          newShiftsByDay[shift.dayOfWeek]?.push({
            name: userData.name,
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
  
    // Sort shifts for each day
    Object.keys(newShiftsByDay).forEach(day => {
      newShiftsByDay[day].sort((a, b) => {
        const [hourA, minuteA] = a.startTime.split(":").map(Number);
        const [hourB, minuteB] = b.startTime.split(":").map(Number);
        if (hourA === hourB) return minuteA - minuteB;
        return hourA - hourB;
      });
    });
  
    setShiftsByDay(newShiftsByDay);
  }, [userData, weekDates, loading, startOfWeek, currentDate]);
  

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
