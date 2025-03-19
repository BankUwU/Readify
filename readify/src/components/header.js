import React from "react";
import "./header.css";

const Header = ({ username = "User0909" }) => {
  const handleMenuClick = () => {
    alert("Menu clicked! You can implement sidebar or dropdown.");
  };

  return (
    <header className="custom-header">
      {/* Hamburger Menu */}
      <div className="menu-icon" onClick={handleMenuClick}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Username & Avatar */}
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
  );
};

export default Header;
