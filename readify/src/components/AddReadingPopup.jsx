import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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

function ReadingPopup({ user, onClose, onReadingAdded }) {
  const [title, setTitle] = useState("");
  const [booksCover, setBooksCover] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [numberOfPage, setNumberOfPage] = useState("");

  const predefinedCategories = ["Fiction", "Non-fiction", "Sci-fi", "Biography", "Other"];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setBooksCover(url);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!booksCover) {
      alert("Please upload a book cover image.");
      return;
    }

    const readingId = uuidv4();
    const finalCategory = category === "Other" ? customCategory : category;
    const createDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const readingData = {
      title,
      booksCover,
      createDate,
      category: finalCategory,
      numberOfPage: parseInt(numberOfPage, 10),
      progress: 0,
    };

    try {
      await setDoc(doc(db, "users", user.uid, "myreading", readingId), readingData);
      onReadingAdded();
      onClose();
    } catch (error) {
      console.error("Error saving reading:", error);
      alert("Failed to save reading. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Add New Reading</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <input
            type="text"
            placeholder="Book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />

          {/* Image Upload */}
          <input type="file" accept="image/*" onChange={handleImageUpload} required />
          {imageUploading && <p className="text-sm text-gray-500">Uploading...</p>}
          {booksCover && <img src={booksCover} alt="Preview" className="w-32 mt-2 rounded" />}

          {/* Category */}
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="" disabled>Select category</option>
              {predefinedCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {category === "Other" && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Custom category"
                className="mt-2 w-full border rounded px-3 py-2"
                required
              />
            )}
          </div>

          {/* Number of Pages */}
          <input
            type="number"
            placeholder="Number of pages"
            value={numberOfPage}
            onChange={(e) => setNumberOfPage(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            min={1}
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="text-gray-600">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Reading
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReadingPopup;
