import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "volunteers", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().isAdmin) {
          setUser(currentUser);
        } else {
          navigate("/"); // Redirect non-admin users
        }
      } else {
        navigate("/login"); // Redirect unauthenticated users
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "volunteers"));
        const volunteersList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Exclude admin users from the list
          if (!data.isAdmin) {
            volunteersList.push({
              id: doc.id,
              name: data.name,
              isAccepted: data.isAccepted,
              isDenied: data.isDenied,
            });
          }
        });
        setVolunteers(volunteersList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching volunteers:", err);
        setError("Error fetching volunteers");
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const handleApprove = async (id) => {
    try {
      const volunteerRef = doc(db, "volunteers", id);
      await updateDoc(volunteerRef, {
        isAccepted: true,
        isDenied: true,
      });
      setVolunteers((prevVolunteers) =>
        prevVolunteers.map((vol) =>
          vol.id === id ? { ...vol, isAccepted: true, isDenied: true } : vol
        )
      );
    } catch (err) {
      console.error("Error approving volunteer:", err);
      setError("Error approving volunteer");
    }
  };

  const handleDeny = async (id) => {
    try {
      const volunteerRef = doc(db, "volunteers", id);
      await updateDoc(volunteerRef, {
        isAccepted: false,
        isDenied: true,
      });
      setVolunteers((prevVolunteers) =>
        prevVolunteers.map((vol) =>
          vol.id === id ? { ...vol, isAccepted: false, isDenied: true } : vol
        )
      );
    } catch (err) {
      console.error("Error denying volunteer:", err);
      setError("Error denying volunteer");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="main-content">
      <h1>Pending Volunteer Approvals</h1>
      <ul className="volunteer-list">
        {volunteers.map((volunteer) => (
          <li key={volunteer.id} className="volunteer-item">
            <span>{volunteer.name}</span>
            <div className="button-group">
              {!volunteer.isAccepted && !volunteer.isDenied ? (
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
                <span className="approved-label">
                  {volunteer.isAccepted ? "Approved" : "Denied"}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
