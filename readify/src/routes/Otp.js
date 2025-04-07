import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./otp.css";

function Otp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    alert(`OTP Entered: ${otp}`);
    // Add your OTP verification logic here
    navigate("/"); // Navigate to home or dashboard after verification
  };

  return (
    <div className="otp-container">
      <h1 className="otp-title">Readify</h1>
      <div className="otp-box">
        <label>OTP</label>
        <input
          type="text"
          className="otp-input"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        <button className="otp-btn" onClick={handleVerify}>Verify</button>
      </div>
    </div>
  );
}

export default Otp;
