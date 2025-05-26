// ProtectedRoute.jsx
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      alert("Please login to continue.");
    }
  }, [user]);

  if (!user) {
    // Not logged in: redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Logged in: show the children (protected page)
  return children;
};

export default ProtectedRoute;
