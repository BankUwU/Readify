import React from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    alert("Login successful!");
    navigate("/"); // Redirect to home after login
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="left-section">
        <h1>Readify</h1>
        <p>Don’t have an account?</p>
        <button className="register-btn" onClick={() => navigate("/register")}>Register</button>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="login-box">
          <label>Username/email</label>
          <input type="text" className="input-field" />

          <label>Password</label>
          <input type="password" className="input-field" />

          <a href="/forgot-password" className="forgot-password">Forget password</a>

          <button className="login-btn" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;

