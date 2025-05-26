import axios from "axios";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Header from "../components/header";
import { auth, db } from "../config/firebaseConfig";

function EditProfile() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setImageUrl(currentUser?.photoURL || "");
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await handleImageUpload(file);
      setImageUrl(url);
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        photoURL: imageUrl,
      });

      // Optional: Update Firestore user profile (if you store extra user data)
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL: imageUrl,
      });

      alert("Profile updated!");
    } catch (err) {
      alert("Error saving profile");
      console.error(err);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Readify");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/djxipn8kj/image/upload",
      formData
    );
    return response.data.secure_url;
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-around bg-[aliceblue] max-w-[80%] mt-12 mx-auto min-h-[70vh] rounded-[30px] text-left px-6">
        <div className="w-[350px] h-[350px] bg-white rounded-full flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <p>No Image</p>
          )}
        </div>

        <div className="flex-1 max-w-[500px] text-left">
          <h1 className="text-5xl mb-4">Edit Profile</h1>

          <label className="block mb-2 font-medium">Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          {uploading && <p className="text-blue-500 mb-2">Uploading...</p>}

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-8 py-3 text-base rounded-full mb-4 hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
