import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import auth methods
import { db } from "../firebase-config";
import "../styles/CalendarPage.css";

const CalendarPage = () => {
  const [volunteersData, setVolunteersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Track the authenticated user

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setLoading(false); // Stop loading if no user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  useEffect(() => {
    if (!user) return; // Only fetch data if a user is logged in

    const fetchAllVolunteers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "volunteers"));
        const allVolunteers = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allVolunteers.push({
            id: doc.id,
            name: data.name,
            shifts: data.shifts || [],
          });
        });
        setVolunteersData(allVolunteers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching volunteers data:", error);
        setError("Error fetching volunteers data");
        setLoading(false);
      }
    };

    fetchAllVolunteers();
  }, [user]);

  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek;
    return new Date(date.setDate(diff));
  };

  const currentDate = useMemo(() => new Date(), []);
  const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(currentDate));

  const getWeekDates = (startOfWeek) => {
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = useMemo(() => getWeekDates(startOfWeek), [startOfWeek]);

  const getMonthName = (date) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
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
    if (loading || !volunteersData.length) return;

    const newShiftsByDay = daysOfWeek.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {});

    volunteersData.forEach((volunteer) => {
      volunteer.shifts.forEach((shift) => {
        if (shift.repeat === "once" && shift.specificDate) {
          const specificDate = new Date(shift.specificDate + "T00:00");
          if (weekDates.some((date) => date.toLocaleDateString() === specificDate.toLocaleDateString())) {
            newShiftsByDay[shift.dayOfWeek]?.push({
              name: volunteer.name,
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

    Object.keys(newShiftsByDay).forEach((day) => {
      newShiftsByDay[day].sort((a, b) => {
        const [hourA, minuteA] = a.startTime.split(":").map(Number);
        const [hourB, minuteB] = b.startTime.split(":").map(Number);
        if (hourA === hourB) return minuteA - minuteB;
        return hourA - hourB;
      });
    });

    setShiftsByDay(newShiftsByDay);
  }, [volunteersData, weekDates, loading, currentDate]);

  const changeWeek = (direction) => {
    const newStartOfWeek = new Date(startOfWeek);
    newStartOfWeek.setDate(startOfWeek.getDate() + direction * 7);
    setStartOfWeek(newStartOfWeek);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div className="error">No user logged in</div>; // Display message if no user is logged in
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="calendar-content">
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
            <p>{date.toLocaleDateString()}</p>
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
