import { getAuth } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveReview } from "../api/reviewapi";
import Header from "../components/header";
import cloudIcon from "../img/cloud-upload-icon.png";

function AddReview() {
  const dropArea = useRef(null);
  const inputFile = useRef(null);
  const imageView = useRef(null);

  const [bookTitle, setBookTitle] = useState("");
  const [category, setCategory] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();

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

    if (!user) {
      alert("You must be logged in to add a review.");
      navigate("/login");
      return;
    }

    if (!bookTitle || !category || !reviewText || !imageFile) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    const reviewData = {
      title: bookTitle,
      category: category,
      review: reviewText,
      timestamp: new Date(),
    };

    try {
      const id = await saveReview(reviewData, imageFile, user.uid);
      alert(`Review saved! ID: ${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Error saving review.");
    }
  };

  return (
    <>
      <Header />
      <div className="bg-[aliceblue] rounded-2xl max-w-[85%] min-h-[80vh] mx-auto">
        <form
          className="flex flex-row justify-center gap-24 mt-12"
          onSubmit={handleSave}
        >
          <div
            className="w-[400px] h-[500px] p-8 bg-white text-center rounded-2xl mt-6 cursor-pointer"
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
              className="w-full h-full rounded-2xl border-2 border-dashed border-[#bbb5ff] bg-[#f7f8f7] bg-center bg-cover flex flex-col items-center justify-center"
            >
              <img src={cloudIcon} alt="Upload Icon" className="h-[100px] mt-6" />
              <p className="mt-4">
                Drag and drop or click here <br /> to upload image
              </p>
              <span className="text-xs text-gray-500 mt-3">
                Upload any images from the desktop
              </span>
            </div>
          </div>

          <div className="w-[500px] flex flex-col mt-4">
            <h1 className="text-left text-4xl cursor-default mb-4">ADD REVIEW</h1>

            <label className="mt-4">Book Title:</label>
            <input
              type="text"
              className="mt-2 mb-2 p-2 rounded border border-gray-300 w-full"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />

            <label className="mt-4">Category:</label>
            <select
              className="mt-2 mb-2 p-2 rounded border border-gray-300 w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="thriller">Thriller</option>
            </select>

            <label className="mt-4">Review:</label>
            <textarea
              rows="8"
              className="mt-2 mb-2 p-2 rounded border border-gray-300 w-full"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
        </form>

        <div className="w-full flex justify-center gap-5 mt-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-12 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSave}
            className="px-12 py-2 rounded-lg bg-[#00BFFF] text-white hover:bg-[#01abe3] transition"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default AddReview;
