import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../components/header";
import MyReadingList from "../components/myreadinglist";
import Plus from "../components/plus";
import { auth, db } from "../config/firebaseConfig";
import Bookreview from "../components/bookreview";

import "./home.css";
import "../components/plus.css";
import "../components/bookreview.css"; 

function Home() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([false, false]);
  const [readingList, setReadingList] = useState([]);
  const [bookreview, setBookReview] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchReadingList() {
      try {
        const querySnapshot = await getDocs(collection(db, "reviews"));  // <-- collection name
        const booksArray = [];

        querySnapshot.forEach((doc) => {
          booksArray.push({ id: doc.id, ...doc.data() });
        });

        setReadingList(booksArray);
      } catch (error) {
        console.error("Error fetching reading list:", error);
      } 
    }

    async function fetchBookReviews() {
      try {
        const querySnapshot = await getDocs(collection(db, "allreviews"));  // <-- collection name for reviews
        const reviewsArray = [];

        querySnapshot.forEach((doc) => {
          reviewsArray.push({ id: doc.id, ...doc.data() });
        });

        setBookReview(reviewsArray);
      } catch (error) {
        console.error("Error fetching book reviews:", error);
      }
    }

    fetchReadingList();
    fetchBookReviews();
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
              <h3><Link to="/my-readding">My Review</Link></h3>
              <div className="reading-list-box">
                <MyReadingList readingList={readingList} />
                <Plus/>
              </div>
            </div>

            <div className="section">
              <h3>Review</h3>
              {bookreview.map((_, index) => (
                <div className="review-card" key={index}>
                  <Bookreview bookreview={bookreview} />
                  
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
