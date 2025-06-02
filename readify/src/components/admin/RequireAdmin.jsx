// src/components/RequireAdmin.jsx
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { db } from "../../config/firebaseConfig"

function RequireAdmin({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        setUserRole(userDoc.data().role || "user");
      } else {
        setUserRole("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) return <div>Loading...</div>;

  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireAdmin;
