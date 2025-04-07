<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
=======
import React, { useState } from "react";
>>>>>>> 6ac74835f1c99295e69feaf33f896d62561b3185
import "./header.css";
import {auth} from "../firebaseConfig"
import { onAuthStateChanged, signOut } from "firebase/auth";

<<<<<<< HEAD

const Header = () => {
  const [user, setUser] = useState(null)

  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth,(currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
=======
const Header = ({ username = "User0909" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
>>>>>>> 6ac74835f1c99295e69feaf33f896d62561b3185
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };


  return (
<<<<<<< HEAD
    <header className="custom-header">
      {/* Hamburger Menu */}
      <div className="menu-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="user-info">
        { user ? (
          <>
          <span className="username">{user.displayName}</span>
        </>
          
        ):(
          <Link to="/login" className="login-button">Login</Link>)
          }
        
       {user&& (
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
       )}
        
      </div>
    </header>
=======
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
>>>>>>> 6ac74835f1c99295e69feaf33f896d62561b3185
  );
};

export default Header;
