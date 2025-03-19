import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmailAndPassword } from "../api/auth"; // Import the login API
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");  // State for email input
  const [password, setPassword] = useState("");  // State for password input
  const [error, setError] = useState("");  // State for error handling
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await loginWithEmailAndPassword(email, password);

    if (response.success) {
      alert("Login successful!");
      navigate("/"); // Redirect to home after successful login
    } else {
      setError(response.error); // Set error message if login fails
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
          <label>Email</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          {error && <div className="error-message">{error}</div>} {/* Display error message if login fails */}

          <button className="login-btn" onClick={handleLogin}>Login</button>

          <a href="/forgot-password" className="forgot-password" onClick={() => navigate("/forgot-password")}>Forget password</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
