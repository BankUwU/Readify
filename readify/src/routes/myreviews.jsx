import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddReviewPopup from "../components/AddReviewPopup";
import EditPopup from "../components/EditPopup";
import Header from "../components/header";
import ReviewPopup from "../components/MyReviewPopup";
import Toast from "../components/Toast";
import { db } from "../config/firebaseConfig";
import editIcon from "../img/edit-icon.png";

function Myreviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showAddPopup, setShowAddPopup] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const fetchReviews = async () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      const reviewsRef = collection(db, "users", currentUser.uid, "reviews");
      const snapshot = await getDocs(reviewsRef);
      const userReviews = snapshot.docs.map((doc) => ({
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
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdate = () => {
    setEditReview(null);
    fetchReviews(); // Refresh updated reviews
  };

  return (
    <>
      <Header />
      <div className="px-10 py-10 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Reviews</h1>
          <button
            onClick={() => setShowAddPopup(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Review
          </button>
        </div>

        {loading ? (
          <p className="text-lg text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-lg text-gray-400">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div
                key={review.reviewId}
                className="relative p-6 rounded-2xl shadow-md hover:-translate-y-1 transition duration-200 flex flex-row cursor-pointer"
                onClick={() => setSelectedReview(review)}
              >
                <img
                  src={review.booksCover || review.books_pics_url}
                  alt={review.title}
                  className="w-[150px] h-[220px] object-cover rounded-lg"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <div className="w-full ml-5">
                  <h2
                    className="text-xl font-semibold text-gray-800 line-clamp-6 break-words overflow-hidden"
                    title={review.title}
                  >
                    {review.title}
                  </h2>
                  <h4 className="text-md mt-1 text-purple-700 mb-2">
                    {review.category}
                  </h4>
                  <p className="text-sm text-gray-500">
                    by {review.displayName || "Unknown"}
                  </p>
                </div>

                <div className="absolute gap-2 top-6 right-4">
                  <label
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditReview(review);
                    }}
                    className="cursor-pointer"
                  >
                    <img src={editIcon} alt="Edit" className="w-4 h-4" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popups */}
      {selectedReview && (
        <ReviewPopup
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}

      {editReview && (
        <EditPopup
          review={editReview}
          onClose={() => setEditReview(null)}
          onSave={handleUpdate}
          onDelete={(deletedId) => {
            setReviews((prev) =>
              prev.filter((r) => r.reviewId !== deletedId)
            );
            setEditReview(null);
          }}
          showToast={(message, type = "success") => {
            setToastMessage(message);
            setToastType(type);
          }}
        />
      )}

      {showAddPopup && (
        <AddReviewPopup
          onClose={() => setShowAddPopup(false)}
          onSuccess={() => {
            setShowAddPopup(false);
            fetchReviews();
            setToastMessage("Review added successfully");
            setToastType("success");
          }}
        />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      )}
    </>
  );
}

export default Myreviews;
