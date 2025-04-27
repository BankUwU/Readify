import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Header from "../components/header";
import { auth } from "../firebaseConfig";
import "./home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([false, false]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleFavorite = (index) => {
    const updatedFavorites = [...favorites];
    updatedFavorites[index] = !updatedFavorites[index];
    setFavorites(updatedFavorites);
  };

  return (
    <>
      <Header />
      <div className="home-container">
        {user ? (
          <>
            <h2>Hello {user.displayName} :)</h2>

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
                    <p>{user.displayName}</p>
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
          </>
        ) : (
          <h2>Please Login</h2>
        )}
      </div>
    </>
  );
}

export default Home;
