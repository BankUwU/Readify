import { addDoc, collection, doc, increment, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";

const CLOUD_NAME = "djxipn8kj";
const UPLOAD_PRESET = "Readify";

const uploadToCloudinary = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};

function BookLogPopup({ reading, user, onClose, refresh }) {
  const [pagesRead, setPagesRead] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState("");
  const [reviewData, setReviewData] = useState({
    title: reading.title || "",
    category: reading.category || "",
    review: "",
  });

  useEffect(() => {
    if (reading.progress === 100) {
      setShowReviewPrompt(true);
    }
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const readCount = parseInt(pagesRead, 10);
    if (isNaN(readCount) || readCount <= 0) {
      setError("Please enter a valid number.");
      return;
    }

    const newTotal = (reading.currentPage || 0) + readCount;
    if (newTotal > reading.numberOfPage) {
      setError("You cannot log more than the total number of pages.");
      return;
    }

    setLoading(true);
    setError("");

    const currentPage = newTotal;
    const totalPages = reading.numberOfPage;
    const progress = Math.min(Math.round((currentPage / totalPages) * 100), 100);

    const log = {
      date: today,
      pagesRead: readCount,
      newCurrentPage: currentPage,
      progress,
    };

    try {
      const logRef = collection(db, "users", user.uid, "myreading", reading.id, "logs");
      await addDoc(logRef, log);

      await updateDoc(doc(db, "users", user.uid, "myreading", reading.id), {
        progress,
        currentPage,
      });

      refresh();

      if (progress === 100) {
        setShowReviewPrompt(true);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error logging reading:", error);
      alert("Failed to save log.");
    } finally {
      setLoading(false);
    }
  };

  const saveReview = async () => {
    try {
      const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const review = {
        title: reviewData.title,
        category: reviewData.category,
        review: reviewData.review,
        createdAt: date,
        books_pics_url: reading.booksCover,
        uid: user.uid,
        createdBy: user.displayName || "Anonymous",
      };

      const allReviewRef = await addDoc(collection(db, "allreview"), review);
      await updateDoc(allReviewRef, { reviewId: allReviewRef.id });

      const userReviewRef = doc(db, `users/${user.uid}/reviews/${allReviewRef.id}`);
      await setDoc(userReviewRef, { ...review, reviewId: allReviewRef.id });

      const statRef = doc(db, `users/${user.uid}/stats/progress`);
      await setDoc(statRef, { totalReviews: increment(1) }, { merge: true });

      setShowReviewForm(false);
      onClose();
    } catch (err) {
      console.error("🔥 Error in saveReview:", err.message, err);
      alert("Failed to save review.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-xl">
          <h2 className="text-xl font-bold mb-4">Log Reading Progress</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <p>Date: <strong>{today}</strong></p>
            <p>Pages so far: {reading.currentPage || 0} / {reading.numberOfPage}</p>

            <input
              type="number"
              placeholder="Pages read today"
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              min={1}
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="text-gray-600">Cancel</button>
              <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                {loading ? "Saving..." : "Log"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showReviewPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">🎉 Book Completed!</h2>
            <p className="mb-4">Do you want to write a review?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReviewPrompt(false);
                  onClose();
                }}
                className="text-gray-600"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowReviewPrompt(false);
                  setShowReviewForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Review
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-xl space-y-4">
            <h2 className="text-xl font-bold">Write Review</h2>
            <input
              type="text"
              value={reviewData.title}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
            <input
              type="text"
              value={reviewData.category}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
            <textarea
              placeholder="Your review"
              value={reviewData.review}
              onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewForm(false)}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={saveReview}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookLogPopup;
