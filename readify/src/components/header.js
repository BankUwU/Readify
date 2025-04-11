import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import "./header.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  
  return (
    <>
      <header className="custom-header">
        <div className="menu-icon" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="user-info">
          {user ? (
            <>
              <span className="username">{user.displayName}</span>
              <div className="avatar" onClick={toggleDropdown}>
                <img
                  src="https://img.icons8.com/ios-glyphs/30/ffffff/user--v1.png"
                  alt="User Icon"
                />
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/edit-profile" className="dropdown-item">Edit Profile</Link>
                    <button className="logout-button" onClick={handleLogout}>Log Out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="login-button">LOGIN</Link>
          )}
        </div>
      </header>

      {/* Overlay */}
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <div className={`side-panel ${isSidebarOpen ? "open" : ""}`}>
      <Link to="/" className="side-link">Home</Link>
        <Link to="/edit-profile" className="side-link">User Setting</Link>
        <Link to="/my-reading" className="side-link">My Reading</Link>
        <Link to="/achievements" className="side-link">Achievements</Link>
        <Link to="/web-theme" className="side-link">Web Theme</Link>
        <Link to="/favorite" className="side-link">Favorite</Link>
        <Link to="/add-review" className="side-link">Add Review</Link>
        <Link to="/login" className="side-link" onClick={handleLogout} >Log Out</Link>

      </div>
    </>
  );
};

export default Header;
