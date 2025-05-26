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
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
