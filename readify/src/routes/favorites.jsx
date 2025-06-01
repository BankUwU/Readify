import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { auth, db } from "../config/firebaseConfig";
import { removeFromFavorites } from "../api/favorites"; 
import { FaStar } from "react-icons/fa";

function Favorite() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [removingId, setRemovingId] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchFavorites() {
      try {
        const favRef = collection(db, "users", user.uid, "favorites");
        const querySnapshot = await getDocs(favRef);

        const reviewsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews(reviewsArray);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user]);

  const handleUnfavorite = async (reviewId) => {
    if (!user) return;

    try {
      setRemovingId(reviewId);

      await removeFromFavorites(user.uid, reviewId);

      setTimeout(() => {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setRemovingId(null);
      }, 300);
    } catch (err) {
      console.error("Failed to unfavorite:", err);
      setRemovingId(null);
    }
  };


  return (
    <>
      <Header />
      <div className="px-10 py-10 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Favorite Books</h1>

        {loading ? (
          <p className="text-lg">Loading favorite reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-lg">No favorite reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="relative flex flex-row p-5 bg-white shadow hover:shadow-lg transition cursor-pointer rounded-3xl"
              >
                <img
                  src={review.imageurl || review.books_pics_url}
                  alt={review.title}
                  className="w-[150px] h-[220px] object-cover rounded-2xl"
                />
                <div className="ml-5 flex flex-col flex-grow text-gray-800">
                  <h2 className="text-xl font-semibold pr-8 break-words">{review.title}</h2>
                  <h4 className="text-md mt-1 text-purple-700">{review.category}</h4>
                  <div className="flex items-center mt-auto pt-4">
                    <img
                      src={review.photoURL}
                      alt="User"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="ml-2 text-sm font-medium">{review.createdBy}</span>
                  </div>
                </div>

                {/* Unfavorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnfavorite(review.id);
                  }}
                  aria-label="Unfavorite"
                  className="absolute top-4 right-4 bg-transparent border-none cursor-pointer z-10"
                >
                  <FaStar
                    size={22}
                    color={removingId === review.id ? "#e0e0e0" : "#000"}
                    style={{ stroke: "#000", strokeWidth: 1 }}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Favorite;
