import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { saveReview } from "../api/addreviewapi";
import cloudIcon from "../img/cloud-upload-icon.png";
import Toast from "./Toast";

function AddReviewPopup({ onClose, onSuccess }) {
  const dropArea = useRef(null);
  const inputFile = useRef(null);
  const imageView = useRef(null);

  const [bookTitle, setBookTitle] = useState("");
  const [category, setCategory] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const auth = getAuth();

  const uploadImage = (file) => {
    if (file) {
      setImageFile(file);
      const imgLink = URL.createObjectURL(file);
      imageView.current.style.backgroundImage = `url(${imgLink})`;
      imageView.current.innerHTML = "";
      imageView.current.style.border = "none";
    }
  };

  useEffect(() => {
    const area = dropArea.current;
    const handleDragOver = (e) => {
      e.preventDefault();
      area.classList.add("ring", "ring-indigo-300");
    };
    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) uploadImage(file);
      area.classList.remove("ring", "ring-indigo-300");
    };
    const handleDragLeave = () => {
      area.classList.remove("ring", "ring-indigo-300");
    };

    area.addEventListener("dragover", handleDragOver);
    area.addEventListener("drop", handleDrop);
    area.addEventListener("dragleave", handleDragLeave);

    return () => {
      area.removeEventListener("dragover", handleDragOver);
      area.removeEventListener("drop", handleDrop);
      area.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    if (!bookTitle || !category || !reviewText || !imageFile) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const reviewData = {
      title: bookTitle,
      category,
      review: reviewText,
      displayName: user.displayName,
      timestamp: serverTimestamp(),
    };

    setLoading(true);
    try {
      await saveReview(reviewData, imageFile, user);
      onSuccess();
      setToastMessage("Review added successfully!");
    } catch (error) {
      console.error("Error saving review:", error);
      setToastMessage("Failed to add review.");
      setToastType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-4xl h-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}

        <button onClick={onClose} className="absolute top-4 right-6 text-xl font-bold">×</button>
        <h2 className="text-3xl mb-6 font-semibold text-gray-700">Add Review</h2>

        <form className="flex gap-6" onSubmit={handleSave}>
          {/* Image Upload */}
          <div
            className="w-[200px] h-[300px] bg-gray-100 rounded-2xl flex items-center justify-center text-center cursor-pointer border-2 border-dashed"
            ref={dropArea}
            onClick={() => inputFile.current.click()}
          >
            <input
              type="file"
              accept="image/*"
              hidden
              ref={inputFile}
              onChange={(e) => uploadImage(e.target.files[0])}
            />
            <div
              ref={imageView}
              className="w-full h-full bg-center bg-cover flex flex-col items-center justify-center"
            >
              <img src={cloudIcon} alt="Upload" className="h-12" />
              <p className="text-sm mt-2 text-gray-500">Click or drag image here</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1">
            <label>Book Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded mb-3"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />

            <label>Category</label>
            <select
              className="w-full border p-2 rounded mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Romance">Romance</option>
              <option value="Historical">Historical</option>
              <option value="Others">Others</option>
            </select>

            <label>Review</label>
            <textarea
              rows="5"
              className="w-full border p-2 rounded mb-4"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </form>

        {toastMessage && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage("")}
          />
        )}
      </div>
    </div>
  );
}

export default AddReviewPopup;
