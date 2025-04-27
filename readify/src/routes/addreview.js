import React, { useState, useRef, useEffect } from "react";
import Header from "../components/header";
import cloudIcon from "../img/cloud-upload-icon.png";
import "./addreview.css";
import { saveReview } from "../api/reviewapi";
import { useNavigate } from "react-router-dom";


function AddReview() {
  const dropArea = useRef(null);
  const inputFile = useRef(null);
  const imageView = useRef(null);

  const [bookTitle, setBookTitle] = useState("");
  const [category, setCategory] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [imageFile, setImageFile] = useState(null);


  function uploadImage(file) {
    if (file) {
      setImageFile(file);
      let imgLink = URL.createObjectURL(file);
      imageView.current.style.backgroundImage = `url(${imgLink})`;
      imageView.current.innerHTML = "";
      imageView.current.style.border = "none";
    }
  }

  useEffect(() => {
    const area = dropArea.current;

    const handleDragOver = (e) => {
      e.preventDefault();
      area.classList.add("highlight"); 
    };

    
    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        uploadImage(file);
      }
      area.classList.remove("highlight");
    };

    const handleDragLeave = () => {
      area.classList.remove("highlight");
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

  const navigate = useNavigate();

    const handleSave = async (e) => {
      e.preventDefault();

      const reviewData = {
        title: bookTitle,
        category: category,
        review: reviewText,
        timestamp: new Date(),
      };
  
      if (imageFile) {
        try {
          const id = await saveReview(reviewData, imageFile); 
          alert(`Review saved! ID: ${id}`);
          navigate("/");
        } catch (error) {
          alert("Error saving review.");
        }
       } //else {
      //   alert("Please upload an image before saving the review.");
      // }
    };
    
   



  return(<>
    <Header/>
    <div className="outer">
    <form className="input-review" onSubmit={handleSave}>
        <div id="drop-area" ref={dropArea}  onClick={() => inputFile.current.click()}>
          <input type="file" accept="image/*" id="input-file" hidden  ref={inputFile}
            onChange={(e) => uploadImage(e.target.files[0])}/>
          <div id="img-view" ref={imageView}>
            <img src={cloudIcon} alt="Upload Icon"/>
            <p>Drag and drop or click here <br/> to upload image</p>
            <span>Upload any images from the desktop</span>
          </div>
        </div>

        <div className="input-info">
          <h1>ADD REVIEW</h1>
          <label>Book Title: </label>
          <input type="text" id="booktitle" name="booktitle" value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}></input>
          <label>Category : </label>
          <select name="category" id="category" value={category}
          onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="thriller">Thriller</option>
          </select>
          <label>Review :</label>
          <textarea id="review" rows="8" value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}></textarea>
        </div>
    </form>
    <div className="button-container">
    <button className="Cancel-btn" type="button" onClick={() => navigate("/")}>Cancel</button>
    <button className="Save-btn" type="submit" onClick={handleSave}>Save</button>
    </div>

    
    </div>
  </>
    );
}

export default AddReview;
