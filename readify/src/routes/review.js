import React, { useState } from "react";
import { FaStar } from "react-icons/fa"; // Font Awesome star icon
import Header from "../components/header";
import "./review.css";

function ReviewPage() {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <>
      <Header />
      <div className="review-container">
        <div className="review-wrapper">
          <div className="book-cover"></div>

          <div className="review-content">
            <div className="review-header">
              <div>
                <h2 className="book-title">Book Title</h2>
                <p className="reviewer-name">reviewer's user</p>
              </div>

              {/* Clickable Star */}
              <button className="fav-button" onClick={toggleFavorite}>
                <FaStar
                  size={24}
                  color={isFavorite ? "black" : "transparent"}
                  style={{
                    stroke: "black",
                    strokeWidth: 20,
                  }}
                />
              </button>
            </div>

            <div className="review-box">
              <p className="review-text">Review goes here...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewPage;
