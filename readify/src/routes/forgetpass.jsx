import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmailAndPassword } from "../api/auth";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

function Sendotp() {
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate("");};
  const [email, setEmail] = useState("");

  return (
    <div className="login-container">


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

          <button className="send-otp-btn" onClick={handleVerify}>Send OTP</button>
        </div>
      </div>
    </div>
  );
}

export default Sendotp;
