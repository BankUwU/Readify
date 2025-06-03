import { getAuth } from "firebase/auth";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../config/firebaseConfig";
// import deleteIcon from "../img/delete-icon.png";
import { FiTrash2 } from "react-icons/fi";


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

function EditPopup({ review, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    if (review) {
      setTitle(review.title || "");
      setCategory(review.category || "");
      setReviewText(review.review || "");
      setImageUrl(review.books_pics_url || "");
    }
  }, [review]);

  if (!review) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImageUrl(preview);
    }
  };

  const handleDelete = async (reviewId) => {
    const user = getAuth().currentUser;
    if (!user) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      const userReviewRef = doc(db, "users", user.uid, "reviews", reviewId);
      await deleteDoc(userReviewRef);

      const globalReviewRef = doc(db, "allreview", reviewId);
      await deleteDoc(globalReviewRef);

      console.log("Review deleted successfully");

      if (typeof onDelete === "function") {
        onDelete(reviewId);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleSave = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to edit a review.");
      return;
    }

    let userInfo = {
      displayName: user.displayName || "Anonymous",
      email: user.email || "no-email@example.com",
      photoURL: user.photoURL || "",
      userPhoto: user.photoURL || "",
    };

    // Check Firestore user doc for missing fields
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const existingData = userSnapshot.data();
        const updateData = {};

        if (!existingData.displayName && user.displayName) {
          updateData.displayName = user.displayName;
        }
        if (!existingData.email && user.email) {
          updateData.email = user.email;
        }
        if (!existingData.photoURL && user.photoURL) {
          updateData.photoURL = user.photoURL;
        }
        if (!existingData.userPhoto && user.photoURL) {
          updateData.userPhoto = user.photoURL;
        }

        if (Object.keys(updateData).length > 0) {
          await updateDoc(userDocRef, updateData);
          console.log("Auto-completed missing user profile fields.");
        }

        userInfo = {
          ...userInfo,
          ...existingData,
          ...updateData,
        };
      }
    } catch (err) {
      console.error("Failed to check/update user profile:", err);
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
        displayName: userInfo.displayName,
        email: userInfo.email,
        photoURL: userInfo.photoURL,
        userPhoto: userInfo.userPhoto,
      };

      // Save to user review
      const userReviewRef = doc(db, `users/${user.uid}/reviews/${review.reviewId}`);
      await updateDoc(userReviewRef, updatedReview);

      // Save to global review
      const globalReviewRef = doc(db, `allreview/${review.reviewId}`);
      await updateDoc(globalReviewRef, updatedReview);

      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[95%] max-w-2xl relative">
        <h2 className="text-2xl font-semibold mb-4 ">Edit Review</h2>

      <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-start mt-3 min-w-[160px]">

          <div className="relative group w-40 h-60 mb-4 rounded overflow-hidden shadow-md">
            <img
              src={imageUrl}
              alt="Book Cover Preview"
              className="w-full h-full object-cover rounded transition duration-300 group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black bg-opacity-50">
              <button
                onClick={() => inputRef.current.click()}
                className="text-white px-4 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm"
              >
                Change Image
              </button>
            </div>
          </div>


          </div>

        <label
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(review.reviewId);
          }}
          className="absolute  text-red-500 hover:text-red-700 w-12 h-12 flex justify-center items-center cursor-pointer rounded-full transition duration-300 right-5 top-4"
        >
          <FiTrash2 size={22} />
        </label>

        <div>
        
          <div className="flex-grow">
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

            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPopup;
