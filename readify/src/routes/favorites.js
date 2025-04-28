import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { db } from "../config/firebaseConfig";
import "./favorites.css";

function Favorite() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const querySnapshot = await getDocs(collection(db, "reviews"));
        const reviewsArray = [];

        querySnapshot.forEach((doc) => {
          reviewsArray.push({ id: doc.id, ...doc.data() });
        });

        setReviews(reviewsArray);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  return (
    <>
    <Header />
    <div className="favorite-page">
    
      <h1>Favorite Books</h1>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No favorite reviews yet.</p>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <img src={review.imageurl} alt={review.title} className="review-image" />
              <div className="review-details">
                <h2>{review.title}</h2>
                <h4>Category: {review.category}</h4>
                <p>{review.review}</p>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
    </>
  );
}

export default Favorite;
