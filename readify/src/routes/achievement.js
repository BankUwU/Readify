import { getAuth, onAuthStateChanged } from "firebase/auth"; // ใช้ firebase auth
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ต้องมี react-router-dom
import Header from "../components/header";
import "./achievement.css";

function Achievement() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("Please login to continue.");
        navigate("/login");
      }
    });
  }, []);

  return (
    <>
      <Header />
      <div className="achievement-container">
        <div className="achievement-header">
          <img
            src="https://img.icons8.com/emoji/48/trophy-emoji.png"
            alt="trophy"
            className="trophy-icon"
          />
          <h2 className="achievement-title">Achievements</h2>
        </div>
        <div className="filter-buttons">
          <button>Show Done</button>
          <button>Show not done</button>
        </div>
        <div className="achievement-list">
          <div className="achievement-card"></div>
          <div className="achievement-card"></div>
          <div className="achievement-card"></div>
          <div className="achievement-card"></div>
        </div>
      </div>
    </>
  );
}

export default Achievement;
