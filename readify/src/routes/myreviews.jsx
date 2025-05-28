import { getAuth } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import EditPopup from "../components/EditPopup";
import Header from "../components/header";
import ReviewPopup from "../components/ReviewPopup";
import { db } from "../config/firebaseConfig";

function Myreviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editReview, setEditReview] = useState(null); // For edit popup

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    async function fetchReviews() {
      const currentUser = getAuth().currentUser;

      if (!currentUser) {
        setReviews([]);
        setLoading(false);
        return;
      }

      try {
        const reviewsRef = collection(db, "users", currentUser.uid, "reviews");
        const reviewsSnapshot = await getDocs(reviewsRef);
        const userReviews = reviewsSnapshot.docs.map((doc) => ({
          reviewId: doc.id,
          userId: currentUser.uid,
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
    const user = getAuth().currentUser;
    if (!user) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      // Delete from user's reviews
      const userReviewRef = doc(db, "users", user.uid, "reviews", reviewId);
      await deleteDoc(userReviewRef);

      // Delete from allreview
      const globalReviewRef = doc(db, "allreview", reviewId);
      await deleteDoc(globalReviewRef);

      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
      console.log("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleUpdate = () => {
    // Refresh updated reviews (optional)
    setEditReview(null); // Close popup
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
                onClick={() => setSelectedReview(review)} // show view popup
              >
                <img
                  src={review.books_pics_url}
                  alt={review.title}
                  className="w-44 h-[250px] object-cover rounded-lg mb-4"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <div className="text-center w-full">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {review.title}
                  </h2>
                  <h4 className="text-sm text-gray-600 mb-2">
                    Category: {review.category}
                  </h4>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Don't open view popup
                        setEditReview(review); // open edit popup
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Don't open view popup
                        handleDelete(review.reviewId);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Popup */}
      {selectedReview && (
        <ReviewPopup
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}

      {/* Edit Popup */}
      {editReview && (
        <EditPopup
          review={editReview}
          onClose={() => setEditReview(null)}
          onSave={handleUpdate}
        />
      )}
    </>
  );
}

export default Myreviews;
