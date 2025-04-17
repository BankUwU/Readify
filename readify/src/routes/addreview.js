import React, {useRef, useEffect} from "react";
import Header from "../components/header";
import cloudIcon from "../img/cloud-upload-icon.png";
import "./addreview.css";
function AddReview() {
  const dropArea = useRef(null);
  const inputFile = useRef(null);
  const imageView = useRef(null);

  function uploadImage(file) {
    if (file) {
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
      area.classList.add("highlight"); // optional CSS effect
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


  return(<>
    <Header/>
    <div className="outer">
    <form className="input-review">
        <div for="input-file" id="drop-area" ref={dropArea}  onClick={() => inputFile.current.click()}>
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
          <input type="text" id="booktitle" name="booktitle"></input>
          <label>Category : </label>
          <select name="category" id="category">
            <option></option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="thriller">Thriller</option>
          </select>
          <label>Review :</label>
          <textarea id="review" rows="8"></textarea>
        </div>
    </form>
    <div className="button-container">
    <button className="Cancel-btn">Cancel</button>
    <button className="Save-btn">Save</button>
    </div>
    </div>
  </>
    );
}

export default AddReview;
