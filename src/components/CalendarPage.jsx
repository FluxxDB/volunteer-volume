import React, { useState, useEffect, useMemo } from "react";
import "../styles/CalendarPage.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

const CalendarPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const volunteersCollection = collection(db, "volunteers");
        const volunteersSnapshot = await getDocs(volunteersCollection);
        const volunteersData = volunteersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVolunteers(volunteersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching volunteers data:", error);
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const currentDate = useMemo(() => new Date(), []);

  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = dayOfWeek;
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - diff);
    return startOfWeek;
  };


  const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(currentDate));

  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [startOfWeek]);

  const getMonthName = (date) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[date.getMonth()];
  };

  const currentMonth = getMonthName(startOfWeek);
  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const [shiftsByDay, setShiftsByDay] = useState({});

  useEffect(() => {
    if (loading || volunteers.length === 0) return;

    const newShiftsByDay = daysOfWeek.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {});

    volunteers.forEach((volunteer) => {
      volunteer.shifts.forEach((shift) => {
        if (shift.repeat === "once" && shift.specificDate) {
          const specificDate = new Date(shift.specificDate);
          if (
            weekDates.some(
              date =>
                date.toLocaleDateString() === specificDate.toLocaleDateString()
            )
          ) {
            newShiftsByDay[shift.dayOfWeek].push({
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
            newShiftsByDay[shift.dayOfWeek].push({
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
        if (hourA === hourB) {
          return minuteA - minuteB;
        }
        return hourA - hourB;
      });
    });

    setShiftsByDay(newShiftsByDay);
  }, [volunteers, weekDates, loading, currentDate]);

  const changeWeek = (direction) => {
    const newStartOfWeek = new Date(startOfWeek);
    newStartOfWeek.setDate(startOfWeek.getDate() + direction * 7);
    setStartOfWeek(newStartOfWeek);
  };

  if (loading) {
    return <div className="loading">Loading volunteer schedule...</div>;
  }

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
            {shiftsByDay[daysOfWeek[index]]?.length > 0 ? (
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
