import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import Header from "../components/header";
import { db } from "../config/firebaseConfig";
import "./favorites.css";

function Myreviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const allReviews = [];

        for (const userDoc of usersSnapshot.docs) {
          const reviewsRef = collection(db, "Users", userDoc.id, "Reviews");
          const reviewsSnapshot = await getDocs(reviewsRef);

          reviewsSnapshot.forEach((reviewDoc) => {
            allReviews.push({ 
              reviewId: reviewDoc.id,  // Save reviewId separately
              userId: userDoc.id,       // Save userId separately
              ...reviewDoc.data() 
            });
          });
        }

        setReviews(allReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const handleDelete = async (userId, reviewId) => {
    try {
      const reviewRef = doc(db, "Users", userId, "Reviews", reviewId);
      await deleteDoc(reviewRef);
      setReviews((prevReviews) => prevReviews.filter((review) => review.reviewId !== reviewId));
      console.log("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="my-review-page">
        <h1>My Reviews</h1>

        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.reviewId} className="review-card">
                <img src={review.imageurl} alt={review.title} className="review-image" />
                <div className="review-details">
                  <h2>{review.title}</h2>
                  <h4>Category: {review.category}</h4>
                  <p>{review.review}</p>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(review.userId, review.reviewId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Myreviews;
