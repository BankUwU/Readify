import axios from "axios";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
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
  const [showPopup, setShowPopup] = useState(false);
  const [newImageChosen, setNewImageChosen] = useState(false);
  const [newPreviewUrl, setNewPreviewUrl] = useState(""); 


  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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

  const handleEditClick = () => {
    setShowPopup(true);
    setTimeout(() => {
      fileInputRef.current?.click();
    }); 
  };


  const handleImageChange = (e) => {
  const file = e.target.files[0];
  setImage(file);
  if (file) {
    setNewPreviewUrl(URL.createObjectURL(file));
    setNewImageChosen(true);
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

      setShowPopup(false);
      setImage(null);
      setPreviewUrl(imageUrl); 
      setNewImageChosen(false);
      setNewPreviewUrl("");
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
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile Picture</h2>
            {(newPreviewUrl || previewUrl) && (
              <img
                src={newPreviewUrl || previewUrl}
                alt="Preview"
                className="w-40 h-40 mx-auto rounded-full object-cover mb-4"
              />
            )}

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => document.getElementById("imageUpload").click()}
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={handleSave}
                disabled={!newImageChosen || uploading}
                className={`px-6 py-2 rounded-full text-white ${
                  newImageChosen && !uploading
                  ? "bg-green-500 hover:bg-green-700" 
                  : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Save
              </button>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 text-sm text-gray-600 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-around bg-[aliceblue] max-w-[75%] mt-12 mx-auto min-h-[65vh] rounded-[30px] text-left px-6">
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
              onClick={handleEditClick}
              className="absolute bottom-4 right-8 bg-blue-500 flex rounded-full cursor-pointer shadow-md w-12 h-12 items-center justify-center"
            >
              <img
                src={editIcon}
                alt="Edit"
                className="w-7 h-7 invert brightness-0"
              />
            </label>

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

          </div>

        

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

