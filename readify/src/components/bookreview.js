import React from "react";
import "./bookreview.css"; 

function Bookreview({ bookreview }) {
  return (
    <div className="book-list-page">
      <div className="book-grid">
        {bookreview.map((item) => (
          <div key={item.id} className="book-card">
            <img src={item.imageurl} alt={item.title} className="book-image" />
            <div className="book-details">
              <h2>{item.title}</h2>
              <h2>{item.category}</h2>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookreview;
