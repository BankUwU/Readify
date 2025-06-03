import { getAuth } from "firebase/auth";
import { collection, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import EditPopup from "../components/EditPopup";
import Header from "../components/header";
import ReviewPopup from "../components/MyReviewPopup";
import { db } from "../config/firebaseConfig";
import editIcon from "../img/edit-icon.png"

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

  const handleUpdate = () => {
    // Refresh updated reviews (optional)
    setEditReview(null); // Close popup
  };



  return (
    <>
      <Header />
      <div className="px-10 py-10 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">My Reviews</h1>

        {loading ? (
          <p className="text-lg">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-lg">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 ">
            {reviews.map((review) => (
              <div
                key={review.reviewId}
                className="relative p-6 rounded-2xl shadow-md hover:-translate-y-1 transition duration-200 flex flex-row cursor-pointer "
                onClick={() => setSelectedReview(review)} // show view popup
              >
                <img
                  src={review.books_pics_url}
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

                  <h4 className="text-md  mt-1 text-purple-700 mb-2">
                    {review.category}
                  </h4>
                  <div className="absolute gap-2 top-6 right-4">
                    <label
                      onClick={(e) => {
                        e.stopPropagation(); // Don't open view popup
                        setEditReview(review); // open edit popup
                      }}
                      className="cursor-pointer"
                    >
                      <img
                        src={editIcon}
                        alt="Edit"
                        className="w-4 h-4"
                      />
                    </label>
                    
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
      <EditPopup
        review={editReview}
        onClose={() => setEditReview(null)}
        onSave={handleUpdate}
        onDelete={(deletedId) => {
          setReviews((prev) => prev.filter((r) => r.reviewId !== deletedId));
          setEditReview(null); 
        }}
      />

    </>
  );
}

export default Myreviews;
