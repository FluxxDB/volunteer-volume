import React, { useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"; // Add onAuthStateChanged
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

const fields = [
  { label: "profile name", type: "text", fieldName: "name" },
  { label: "email", type: "email", fieldName: "email" },
  { label: "phone number", type: "tel", fieldName: "phoneNumber" }
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateJoined: "",
    totalHoursServed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Only fetch data once we confirm user is authenticated
        const fetchUserData = async () => {
          try {
            const userDoc = await getDoc(doc(db, "volunteers", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setFormData({
                name: userData.name || "",
                email: userData.email || "",
                phoneNumber: userData.phoneNumber || "",
                dateJoined: userData.dateJoined || new Date().toLocaleDateString(),
                totalHoursServed: userData.totalHoursServed || 0,
              });
            }
          } catch (err) {
            setError("Error fetching user data");
            console.error(err);
          } finally {
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
  }, []); // Remove auth dependency

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      setError("Error signing out");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>

      <h3 className="section-title">Your Account</h3>
      {fields.map(({ label, fieldName }) => (
        <div className="field-row" key={label}>
          <div className="readonly-field">{formData[fieldName] || `No ${label} set`}</div>
        </div>
      ))}

      <h3 className="section-title">Your Stats</h3>
      <div className="field-row">
        <div className="readonly-field">Date Joined: {formData.dateJoined}</div>
      </div>
      <div className="field-row">
        <div className="readonly-field">Total Hours Served: {formData.totalHoursServed}</div>
      </div>
      <button 
        className="submit-button" 
        style={{ 
          backgroundColor: '#d32f2f',
          marginBottom: '20px',
          width: '100%'
        }}
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
};

export default ProfilePage;
