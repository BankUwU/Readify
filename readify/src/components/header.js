import React, { useState } from "react";
import "./header.css";

const Header = ({ username = "User0909" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header className="custom-header">
        <div className="menu-icon" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="user-info">
          <span className="username">{username}</span>
          <div className="avatar">
            <img
              src="https://img.icons8.com/ios-glyphs/30/ffffff/user--v1.png"
              alt="User Icon"
            />
          </div>
        </div>
      </header>

      {/* Side Panel */}
      <div className={`side-panel ${isOpen ? "open" : ""}`}>
        <h3>Menu</h3>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/settings">Settings</a></li>
          
          <li><a href="/login">Logout</a></li>
        </ul>
      </div>

      {/* Overlay (Click to Close) */}
      {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </>
  );
};

export default Header;
