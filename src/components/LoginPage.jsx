import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    "profile name": "",
    email: "",
    "phone number": "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError(""); // Clear any previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Handle login
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate("/"); // Redirect to home page after successful login
      } else {
        // Handle account creation
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        // Create a new document in the volunteers collection
        await setDoc(doc(db, "volunteers", userCredential.user.uid), {
          name: formData["profile name"],
          email: formData.email,
          phoneNumber: formData["phone number"],
          shifts: [] // Initialize empty shifts array
        });

        navigate("/"); // Redirect to home page after successful registration
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message);
    }
  };
  return (
    <div className="login-page">
      <h2>{isLogin ? "Login" : "Create an Account"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="field-row">
              <input
                type="text"
                placeholder="*profile name*"
                value={formData["profile name"]}
                onChange={(e) => handleChange(e, "profile name")}
              />
            </div>
            <div className="field-row">
              <input
                type="tel"
                placeholder="*phone number*"
                value={formData["phone number"]}
                onChange={(e) => handleChange(e, "phone number")}
              />
            </div>
          </>
        )}
        <div className="field-row">
          <input
            type="email"
            placeholder="*email*"
            value={formData.email}
            onChange={(e) => handleChange(e, "email")}
          />
        </div>
        <div className="field-row">
          <input
            type="password"
            placeholder="*password*"
            value={formData.password}
            onChange={(e) => handleChange(e, "password")}
          />
        </div>
        <button className="submit-button" type="submit">
          {isLogin ? "Login" : "Create Account"}
        </button>
        {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
      <div className="toggle-text">
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <button onClick={() => setIsLogin(false)}>Create one</button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => setIsLogin(true)}>Log in</button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
