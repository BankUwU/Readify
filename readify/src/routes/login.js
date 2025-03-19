import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Sign in with Firebase Authentication
      await auth.signInWithEmailAndPassword(email, password);
      alert("Login successful!");
      navigate("/"); // Redirect to home after successful login
    } catch (error) {
      alert(error.message); // Display Firebase error message
    }
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
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <a
            href="/forget-password"
            className="forgot-password"
            onClick={() => navigate("/forget-password")}
          >
            Forget password
          </a>

          <button className="login-btn" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
