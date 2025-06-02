import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../config/firebaseConfig"

function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          const data = docSnap.data();
          setIsAdmin(data?.role === "admin");
        }
        setLoading(false);
      });
      return () => unsubscribe();
    };

    checkAdmin();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default AdminRoute;
