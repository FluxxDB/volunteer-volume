import React, { useState } from "react";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    "profile name": "",
    email: "",
    "phone number": "",
    password: "",
  });

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Logging in with:", formData.email, formData.password);
    } else {
      console.log("Creating account with:", formData);
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
