import { getAuth } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Header from "../components/header";
import ReviewPopup from "../components/ReviewPopup";
import { db } from "../config/firebaseConfig";
function Myreviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    async function fetchReviews() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setReviews([]);
        setLoading(false);
        return;
      }

      try {
        const reviewsRef = collection(db, "users", user.uid, "reviews");
        const reviewsSnapshot = await getDocs(reviewsRef);
        const userReviews = reviewsSnapshot.docs.map(doc => ({
          reviewId: doc.id,
          userId: user.uid,
          ...doc.data(),
        }));
        setReviews(userReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this review?"
  );
  if (!confirmDelete) return;

  try {
    const userReviewRef = doc(db, "users", user.uid, "reviews", reviewId);
    const globalReviewRef = doc(db, "allreview", reviewId);

    await Promise.all([
      deleteDoc(userReviewRef),
      deleteDoc(globalReviewRef),
    ]);

    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.reviewId !== reviewId)
    );

    console.log("Review deleted successfully from both user and global collections");
  } catch (error) {
    console.error("Error deleting review:", error);
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
                className="bg-white p-6 rounded-2xl shadow-md hover:-translate-y-1 transition duration-200 flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedReview(review)}
              >
                <img
                  src={review.books_pics_url}
                  alt={review.title}
                  className="w-44 h-[250px] object-cover rounded-lg mb-4"
                  onError={(e) => (e.target.src = "/placeholder.png")} // fallback
                />
                <div className="text-center w-full">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {review.title}
                  </h2>
                  <h4 className="text-sm text-gray-600 mb-2">
                    Category: {review.category}
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
                    {review.review}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent opening popup
                      handleDelete(review.reviewId);
                    }}
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

      {selectedReview && (
        <ReviewPopup
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </>
  );
}

export default Myreviews;

