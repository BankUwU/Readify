import { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

function DeleteAccountPopup({ onClose, onDeleteSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setError("");
    setLoading(true);

    const user = auth.currentUser;

    if (!user || !user.email) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, password);

    try {
      await reauthenticateWithCredential(user, credential);
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      alert("Account deleted successfully.");
      onDeleteSuccess();
    } catch (err) {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Failed to delete account. Try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-[380px]">
        <h2 className="text-xl font-semibold mb-2 text-center text-red-600">Delete Account</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Please enter your password to confirm
        </p>

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border rounded px-3 py-2 mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            disabled={loading || password === ""}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountPopup;
