import { useState } from "react";

function ChangePasswordPopup({ onClose, onSubmit }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }
    setError("");
    onSubmit(newPassword); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-[380px]">
        <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border rounded px-3 py-2 mb-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border rounded px-3 py-2 mb-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-center gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPopup;
