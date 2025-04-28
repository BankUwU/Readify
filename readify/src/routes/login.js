import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmailAndPassword } from "../api/auth";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await loginWithEmailAndPassword(email, password);

    if (response.success) {
      alert("Login successful!");
      navigate("/"); // Redirect to home ถ้า login ผ่านฃ
    } else {
      setError(response.error);
    }
  };

  return (
    <div className="login-container">
  <div className="background-left"></div>

  <div className="login-center">
    <h1>Readify</h1>
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

      {error && <div className="error-message">{error}</div>}

      <button className="login-btn" onClick={handleLogin}>Login</button>

      <div className="register-link">
        <p>Don’t have an account?</p>
        <button className="register-btn" onClick={() => navigate("/register")}>
          Register
        </button>
        <a className="forgot-password" onClick={() => navigate("/forgot-password")}>
          Forgot password?
        </a>
      </div>
    </div>
  </div>

  <div className="background-right"></div>
</div>

  );
}

export default Login;
