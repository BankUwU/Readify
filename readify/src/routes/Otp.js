import { collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import "./otp.css";

function OTPPage() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user is currently logged in.");
      }

      // Save user data to Firestore
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
      });

      await setDoc(doc(collection(db, "Users", user.uid, "UserID")), {
        username: user.displayName,
        email: user.email,
        displayname: user.displayName,
      });

      console.log("User info saved to Firestore!");
      navigate("/");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return React.createElement(
    "div",
    { className: "otp-container" },
    React.createElement("h2", { className: "otp-title" }, "Readify"),
    React.createElement("h3", { className: "otp-subtitle" }, "Enter OTP"),
    React.createElement(
      "form",
      { onSubmit: handleOTPSubmit, className: "otp-form" },
      React.createElement("label", { className: "otp-label" }, "OTP"),
      React.createElement("input", {
        type: "text",
        placeholder: "Enter OTP",
        value: otp,
        onChange: (e) => setOtp(e.target.value),
        className: "otp-input",
        required: true,
      }),
      React.createElement(
        "button",
        { type: "submit", className: "otp-button" },
        "Submit"
      )
    )
  );
}

export default OTPPage;

