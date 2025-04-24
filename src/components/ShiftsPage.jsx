import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase-config";
import "../styles/ShiftsPage.css";


const ShiftsPage = () => {
  const auth = getAuth();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newShift, setNewShift] = useState({
    role: "Front Desk Specialist",
    dayOfWeek: "Sunday",
    startTime: "",
    duration: "",
    repeat: "once",
    specificDate: "",
    startDate: "",
    endDate: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("No user logged in");
        return;
      }

      // Create the shift object
      const shiftToAdd = {
        ...newShift,
        duration: parseInt(newShift.duration),
      };

      // Add the shift to Firestore
      await updateDoc(doc(db, "volunteers", user.uid), {
        shifts: arrayUnion(shiftToAdd)
      });

      // Update local state
      setUserData(prevData => ({
        ...prevData,
        shifts: [...prevData.shifts, shiftToAdd]
      }));

      // Reset form
      setIsFormVisible(false);
      setNewShift({
        role: "Front Desk Specialist",
        dayOfWeek: "Sunday",
        startTime: "",
        duration: "",
        repeat: "once",
        specificDate: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error adding shift:", error);
      setError("Error adding shift");
    }
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const sortedShifts = userData?.shifts
    .map(shift => ({
      ...shift,
      date: generateShiftDate(shift)
    }))
    .sort((a, b) => a.date - b.date) || [];

return (
    <div className="shifts-content">
      <h1>Your Upcoming Shifts</h1>

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
      {sortedShifts.map((shift, idx) => (
        <div key={idx} className="shift">
          <h3>{userData.name} - {shift.role}</h3>
          <p>{shift.dayOfWeek}: {shift.startTime} - {parseInt(shift.startTime.split(":")[0]) + shift.duration}:00</p>
          {shift.repeat === "once" && shift.specificDate && (
            <p>Specific Date: {shift.specificDate}</p>
          )}
          {shift.repeat === "every week" && shift.startDate && shift.endDate && (
            <p>Repeats from {shift.startDate} to {shift.endDate}</p>
          )}
          <button
            className="cancel-shift-button"
          >
          Cancel Shift
          </button>
        </div>
      ))}

      </div>
    </div>
  );
};

export default ShiftsPage;
