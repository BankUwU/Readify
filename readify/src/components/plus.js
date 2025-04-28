import React from "react";
import "./myreadinglist.css";
import { ReactComponent as PlusSign } from "../img/plus-sign.svg";

function Plus() {
  return (
    <div className="reading-list-page">
      <div className="reading-grid">
        <div className="reading-card">
        <PlusSign className="plus-icon" />
        </div>
      </div>
    </div>
  );
}

export default Plus;
