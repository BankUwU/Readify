import axios from "axios";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { auth, db } from "../config/firebaseConfig";
import editIcon from "../img/edit-icon.png"

function EditProfile() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      setEmail(currentUser.email || "");

      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPreviewUrl(data.photoURL || currentUser.photoURL || "");
        setUsername(data.username || currentUser.displayName || "");
      } else {
        setPreviewUrl(currentUser.photoURL || "");
        setUsername(currentUser.displayName || "");
      }
    } else {
      alert("Please Login to continue");
      navigate("/login", { replace: true });
    }
  });

  return () => unsubscribe();
}, [navigate]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setUploading(true);
    let imageUrl = previewUrl;

    try {
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "Readify");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/djxipn8kj/image/upload",
          formData
        );
        imageUrl = response.data.secure_url;
      }

      await updateProfile(user, {
        photoURL: imageUrl,
      });

      await setDoc(
        doc(db, "users", user.uid),
        { photoURL: imageUrl },
        { merge: true }
      );

      alert("Profile updated!");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-around bg-[aliceblue] max-w-[80%] mt-12 mx-auto min-h-[70vh] rounded-[30px] text-left px-6">
          <div className="relative w-[350px] h-[350px]">
            <div className="w-full h-full bg-white rounded-full overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p>No Image</p>
              )}
            </div>

            <label
              htmlFor="imageUpload"
              className="absolute top-4 right-8 bg-blue-900 p-2 rounded-full cursor-pointer shadow-md w-12 h-12"
            >
              <img
                src={editIcon}
                alt="Edit"
                className="w-8 h-8 invert"
              />
            </label>

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>


        <label className="block mb-2 font-medium">Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          {uploading && <p className="text-blue-500 mb-2">Uploading...</p>}

          <button
            onClick={handleSave}
            disabled={uploading}
            className="bg-blue-500 text-white px-8 py-3 text-base rounded-full mb-4 hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Saving..." : "Save Changes"}
          </button>

  

        

        <div className="flex-1 max-w-[500px] text-left">
          <h1 className="text-5xl mb-4">Edit Profile</h1>
          <p className="text-lg">
            <strong>Username:</strong> {username || "Not set"}
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {email}
          </p>



    
        </div>
      </div>
    </>
  );
}

export default EditProfile;

