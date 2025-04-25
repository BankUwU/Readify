import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import Header from "../components/header";
import "./home.css"; // Don't forget to create this CSS file

function Home() {
  const [favorites, setFavorites] = useState([false, false]); // Example for two reviews

  const toggleFavorite = (index) => {
    const updatedFavorites = [...favorites];
    updatedFavorites[index] = !updatedFavorites[index];
    setFavorites(updatedFavorites);
  };

  return (
    <>
      <Header />
      <div className="home-container">
        <h2>Hello User :)</h2>

        <div className="section">
          <h3>My Reading List</h3>
          <div className="reading-list-box">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="book-item" key={index}>
                <div className="book-placeholder"></div>
                <p className="book-title">bookTitle</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Review</h3>
          {[1, 2].map((_, index) => (
            <div className="review-card" key={index}>
              <div className="review-img"></div>
              <div className="review-content">
                <p className="book-title">bookTitle</p>
                <p>User</p>
                <p>Description</p>
              </div>
              <button
                className="fav-btn"
                onClick={() => toggleFavorite(index)}
                aria-label="Favorite"
              >
                <FaStar
                  size={20}
                  color={favorites[index] ? "#000" : "#e0e0e0"}
                  style={{ stroke: "#000", strokeWidth: 1 }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
