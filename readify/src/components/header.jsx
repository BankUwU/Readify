import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebaseConfig";
import defaultProfilePic from "../img/profilepic.png";


const Header = () => {
  const [user, setUser] = useState(() => auth.currentUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); 
  const location = useLocation();


  useEffect(() => {
    // If user exists synchronously, fetch extra profile data immediately
    if (auth.currentUser) {
      fetchUserProfile(auth.currentUser);
    }

    // Listen for auth state changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserProfile(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [location]);

  // Helper function to get Firestore user profile and set user state
  const fetchUserProfile = async (currentUser) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser({
          ...currentUser,
          displayName: userData.username || currentUser.displayName,
          photoURL: userData.photoURL || currentUser.photoURL || null,
        });
      } else {
        setUser({
          ...currentUser,
          photoURL: currentUser.photoURL || null,
        });
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
      setUser({
        ...currentUser,
        photoURL: currentUser.photoURL || null,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsSidebarOpen(false);
      navigate("/login");  // Redirect immediately after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout, please try again.");
    }
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
        <div
          className="flex flex-col justify-between h-5 cursor-pointer"
          onClick={toggleSidebar}
        >
          <span className="block w-6 h-0.5 bg-white rounded"></span>
          <span className="block w-6 h-0.5 bg-white rounded"></span>
          <span className="block w-6 h-0.5 bg-white rounded"></span>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="w-10 h-10  rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
                <Link
                  to="/edit-profile"
                  className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  <img
                    src={
                      user.photoURL || defaultProfilePic}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="text-white font-bold text-lg px-4 py-1 bg-blue-700 hover:bg-blue-800 rounded-full transition"
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
        } flex flex-col p-6`}
      >
        <div className="flex flex-col space-y-4">
        <Link
          to="/"
          className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100"
          onClick={closeSidebar}
        >
          Home
        </Link>
        <Link
          to="/edit-profile"
          className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100"
          onClick={closeSidebar}
        >
          User Profile
        </Link>
        <Link
          to="/achievements"
          className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100"
          onClick={closeSidebar}
        >
          Achievements
        </Link>
        <Link
          to="/favorite"
          className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100"
          onClick={closeSidebar}
        >
          Favorites
        </Link>
        <Link
          to="/my-reading"
          className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100"
          onClick={closeSidebar}
        >
          My Readings
        </Link>
        <Link
          to="/my-reviews"
          className="text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100"
          onClick={closeSidebar}
        >
          My Reviews
        </Link>
        </div>

        {user && (
          <button
            onClick={() => {
              handleLogout();
              closeSidebar();
            }}
            className="mt-auto text-left text-blue-900 font-bold px-3 py-2 rounded hover:bg-blue-100"
          >
            LOG OUT
          </button>
        )}
      </div>
    </>
  );
};

export default Header;
