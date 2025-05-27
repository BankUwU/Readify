import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from "../config/firebaseConfig";

const CLOUD_NAME = "djxipn8kj";
const UPLOAD_PRESET = "Readify";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};

function EditPopup({ review, onClose, onSave }) {
  const [title, setTitle] = useState(review.title);
  const [category, setCategory] = useState(review.category);
  const [reviewText, setReviewText] = useState(review.review);
  const [imageUrl, setImageUrl] = useState(review.books_pics_url);
  const [imageFile, setImageFile] = useState(null);
  const inputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImageUrl(preview);
    }
  };

  const handleSave = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to edit a review.");
      return;
    }

    let finalImageUrl = imageUrl;

    try {
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }

      const updatedReview = {
        title,
        category,
        review: reviewText,
        books_pics_url: finalImageUrl,
        updatedAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };

      // Update user review
      const userReviewRef = doc(db, `users/${user.uid}/reviews/${review.reviewId}`);
      await updateDoc(userReviewRef, updatedReview);

      // Update global review
      const allReviewRef = doc(db, `allreview/${review.reviewId}`);
      await updateDoc(allReviewRef, updatedReview);

      if (onSave) onSave(); // notify parent to refresh data
      onClose();
    } catch (error) {
      console.error("🔥 Error updating review:", error);
      alert("Failed to update review.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-xl relative">
        <h2 className="text-2xl font-semibold mb-4">Edit Review</h2>

        <label>Book Title</label>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Category</label>
        <select
          className="w-full p-2 mb-4 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-Fiction</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="thriller">Thriller</option>
        </select>

        <label>Review</label>
        <textarea
          rows="5"
          className="w-full p-2 mb-4 border rounded"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <label>Book Cover Image</label>
        <div className="mb-4">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-40 h-60 object-cover rounded mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={inputRef}
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPopup;
