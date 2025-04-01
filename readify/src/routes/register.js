import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/registerapi"; // Import API function
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
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Readify</h2>
      <div className="register-box">
        <form onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <label>Email</label>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Username</label>
          <input type="text" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label>Re-enter password</label>
          <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

          <button type="submit" className="register-btn" onClick={() => navigate("/register/otp")}>Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
