import { collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebaseConfig";

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

  return (
    <div className="flex flex-col items-center justify-center h-screen p-5 bg-white">
      <h2 className="text-3xl font-bold mb-2">Readify</h2>
      <h3 className="text-2xl font-semibold mb-8">Enter OTP</h3>
      <form
        onSubmit={handleOTPSubmit}
        className="flex flex-col w-full max-w-md"
      >
        <label className="text-base font-medium mb-2">OTP</label>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="p-3 mb-6 bg-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        <button
          type="submit"
          className="py-3 bg-white border border-black rounded-lg text-base font-medium hover:bg-gray-100 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default OTPPage;
