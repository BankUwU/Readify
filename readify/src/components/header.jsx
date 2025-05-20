import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/firebaseConfig";

const Header = () => {
  const [user, setUser] = useState(null);
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="flex items-center justify-between bg-blue-900 px-5 py-3 h-16 relative z-50">
        {/* Hamburger menu */}
        <div className="flex flex-col justify-between h-5 cursor-pointer" onClick={toggleSidebar}>
          <span className="block w-6 h-0.5 bg-white rounded"></span>
          <span className="block w-6 h-0.5 bg-white rounded"></span>
          <span className="block w-6 h-0.5 bg-white rounded"></span>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="font-bold text-white">
                {user.displayName || user.email || "User"}
              </span>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img
                  src="https://img.icons8.com/ios-glyphs/30/000000/user--v1.png"
                  alt="User Icon"
                  className="w-6 h-6"
                />
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="text-white font-bold text-xl px-4 py-2 hover:bg-blue-800 rounded transition"
            >
              LOGIN
            </Link>
          )}
        </div>
      </header>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col p-6 space-y-4`}
      >
        <Link to="/" className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100" onClick={closeSidebar}>
          Home
        </Link>
        <Link to="/edit-profile" className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100" onClick={closeSidebar}>
          User Setting
        </Link>
        <Link to="/achievements" className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100" onClick={closeSidebar}>
          Achievements
        </Link>
        <Link to="/favorite" className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100" onClick={closeSidebar}>
          Favorite
        </Link>
        <Link to="/my-reading" className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100" onClick={closeSidebar}>
          My Reading
        </Link>
        <Link to="/my-reviews" className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100" onClick={closeSidebar}>
          My Review
        </Link>
        <Link to="/add-review" className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100" onClick={closeSidebar}>
          Add Review
        </Link>
        {user && (
          <button
            onClick={() => {
              handleLogout();
              closeSidebar();
            }}
            className="text-left text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100"
          >
            Log Out
          </button>
        )}
      </div>
    </>
  );
};

export default Header;
