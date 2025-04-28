import React from "react";
import "./myreadinglist.css";
import PlusSign from "../img/plus-sign.svg";

function Plus() {
  return (
    <div className="reading-list-page">
      <div className="reading-grid">
        <div className="reading-card">
        <img src={PlusSign} className="plus-icon"></img>
        </div>
      </div>
    </div>
  );
}

export default Plus;
