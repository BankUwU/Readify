import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { db } from "../config/firebaseConfig";

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
      <div className="px-10 py-10 text-center min-h-screen ">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Favorite Books</h1>

        {loading ? (
          <p className="text-lg">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-lg">No favorite reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-2xl shadow-md hover:-translate-y-1 transition duration-200 flex flex-col items-center"
              >
                <img
                  src={review.imageurl}
                  alt={review.title}
                  className="w-44 h-[250px] object-cover rounded-lg mb-4"
                />
                <div className="text-center w-full">
                  <h2 className="text-xl font-semibold text-gray-800">{review.title}</h2>
                  <h4 className="text-sm text-gray-600 mb-2">Category: {review.category}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{review.review}</p>
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
