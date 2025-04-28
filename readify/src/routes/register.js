import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/registerapi";
import "./register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const result = await registerUser(email, username, password);

    if (result.success) {
      setSuccess("Registration successful! You can now log in.");
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(result.message);
      setSuccess("");
    }
  };

  return (
    <div className="register-container">
      {/* Left Section */}
      <div className="left-section">
        <h1>Readify</h1>
        <p>Already have an account?</p>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="register-box">
          <form onSubmit={handleRegister}>
            <label>Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <label>Username</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />

            <label>Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <label>Re-enter password</label>
            <input
              type="password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="register-submit-btn">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
