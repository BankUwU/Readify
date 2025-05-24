import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/registerapi";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    const result = await registerUser(email, username, password);

    if (result.success) {
      await sendEmailVerification(result.user);
      navigate("/check-email");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/2 bg-blue-100 flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-bold mb-4">Readify</h1>
        <p className="mb-4">Already have an account?</p>
        <button
          className="px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>

      {/* Right Side (Form) */}
      <div className="w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium">Username</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium">Re-enter password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

/* 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/registerapi";
import { sendOtpEmail } from "../api/sendOTP"; // << เพิ่มไฟล์ส่ง OTP
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
      // หลังจากสมัครสำเร็จ → สุ่มเลข OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      try {
        // ส่ง OTP ไปที่ Email
        const emailResult = await sendOtpEmail(email, otp);

        if (emailResult.success) {
          // เก็บ OTP ไว้ใน localStorage
          localStorage.setItem("otp", otp);
          localStorage.setItem("emailForOtp", email);

          setSuccess("Registration successful! Please verify OTP sent to your email.");
          setError("");
          setTimeout(() => navigate("/otp"), 1500);
        } else {
          setError("Failed to send OTP. Please try again.");
          setSuccess("");
        }
      } catch (err) {
        console.error("Error sending OTP email:", err);
        setError("Error sending OTP. Try again.");
      }
    } else {
      setError(result.message);
      setSuccess("");
    }
  };

  return (
    <div className="register-container">
      
      <div className="left-section">
        <h1>Readify</h1>
        <p>Already have an account?</p>
        <button className="login-btn" onClick={() => navigate("/otp")}>
          Login
        </button>
      </div>

      
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
 */
