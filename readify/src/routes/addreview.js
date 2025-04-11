import React from "react";
import Header from "../components/header";
import "./addreview.css";
function AddReview() {
  return(<>
    <Header/>
    <h1>ADD REVIEW</h1>
    <form>
        <label>Book Title: </label>
        <input type="text" id="booktitle" name="booktitle"></input>
        <label>Review :</label>
        <textarea id="review" rows="8"></textarea>
    </form>
  </>
    );
}

export default AddReview;
