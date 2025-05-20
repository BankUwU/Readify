import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import Header from "../components/header";
import { db } from "../config/firebaseConfig";

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
              reviewId: reviewDoc.id,
              userId: userDoc.id,
              ...reviewDoc.data(),
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (confirmDelete) {
      try {
        const reviewRef = doc(db, "Users", userId, "Reviews", reviewId);
        await deleteDoc(reviewRef);
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.reviewId !== reviewId)
        );
        console.log("Review deleted successfully");
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="px-10 py-10 text-center min-h-screen bg-[aliceblue]">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Reviews</h1>

        {loading ? (
          <p className="text-lg">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-lg">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div
                key={review.reviewId}
                className="bg-white p-6 rounded-2xl shadow-md hover:-translate-y-1 transition duration-200 flex flex-col items-center"
              >
                <img
                  src={review.imageurl}
                  alt={review.title}
                  className="w-44 h-[250px] object-cover rounded-lg mb-4"
                />
                <div className="text-center w-full">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {review.title}
                  </h2>
                  <h4 className="text-sm text-gray-600 mb-2">
                    Category: {review.category}
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {review.review}
                  </p>
                  <button
                    onClick={() => handleDelete(review.userId, review.reviewId)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full transition duration-300"
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
