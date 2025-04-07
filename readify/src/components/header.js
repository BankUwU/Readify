import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import "./header.css";
import {auth} from "../firebaseConfig"
import { onAuthStateChanged, signOut } from "firebase/auth";


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
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };


  return (
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
  );
};

export default Header;
