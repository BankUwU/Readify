import React from "react";
import "./plus.css"; 

function MyReadingList({ readingList }) {
  return (
    <div className="reading-list-page">
      <div className="reading-grid">
        {readingList.map((item) => (
          <div key={item.id} className="reading-card">
            <img src={item.imageurl} alt={item.title} className="reading-image" />
            <div className="reading-details">
              <h2>{item.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyReadingList;
