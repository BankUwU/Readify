import axios from "axios";
import { onAuthStateChanged, updateProfile, updateEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { auth, db } from "../config/firebaseConfig";
import editIcon from "../img/edit-icon.png";
import Longbg from "../img/longbg.jpg"

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

  // NEW STATES for editing username/email
  const [showEditInfoPopup, setShowEditInfoPopup] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email || "");
        setUsername(currentUser.displayName || "");

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPreviewUrl(data.photoURL || currentUser.photoURL || "");
          setUsername(data.username || currentUser.displayName || "");
          setEmail(data.email || currentUser.email || "");
        } else {
          setPreviewUrl(currentUser.photoURL || "");
          setUsername(currentUser.displayName || "");
          setEmail(currentUser.email || "");
        }
      } else {
        alert("Please Login to continue");
        navigate("/login", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleEditClick = () => {
    setNewPreviewUrl(previewUrl);
    setNewImageChosen(false); 
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

  // New handlers for editing username/email popup
  const openEditInfoPopup = () => {
    setEditUsername(username);
    setEditEmail(email);
    setShowEditInfoPopup(true);
  };

  const handleSaveInfo = async () => {
    if (!user) return;
    setSavingInfo(true);

    try {
      // Update Firebase Auth profile (username & email)
      if (editUsername !== username) {
        await updateProfile(user, { displayName: editUsername });
      }
      if (editEmail !== email) {
        await updateEmail(user, editEmail);
      }

      // Update Firestore user doc
      await setDoc(
        doc(db, "users", user.uid),
        { username: editUsername, email: editEmail },
        { merge: true }
      );

      // Update local state after successful save
      setUsername(editUsername);
      setEmail(editEmail);
      setShowEditInfoPopup(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile info. You might need to re-login.");
    } finally {
      setSavingInfo(false);
    }
  };

  return (
    <>
      <Header />
      <div className="w-full relative">
        <img
          src={Longbg}
          alt="background"
          className="w-full object-cover h-[200px]"
        />

        <div className="absolute inset-0 top-[80px] flex bg-white w-[250px] h-[250px] mx-auto rounded-full items-center justify-center">
        <div className="relative w-[230px] h-[230px]">
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
            className="absolute bottom-1 right-5 bg-blue-600 flex rounded-full cursor-pointer shadow-md w-10 h-10 items-center justify-center"
          >
            <img
              src={editIcon}
              alt="Edit"
              className="w-6 h-6 invert brightness-0"
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
        </div>
    </div>
      {showEditInfoPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile Info</h2>
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowEditInfoPopup(false)}
                className="px-4 py-2 rounded-full border bg-gray-200 hover:bg-gray-300"
                disabled={savingInfo}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInfo}
                disabled={savingInfo || !editUsername || !editEmail}
                className={`px-6 py-2 rounded-full text-white ${
                  !editUsername || !editEmail || savingInfo
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700"
                }`}
              >
                {savingInfo ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border relative mt-40 items-center bg-white shadow-xl w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 mx-auto rounded-3xl p-8">
          <div>
             <label
              onClick={openEditInfoPopup}
              className="cursor-pointer absolute right-6 top-6"
            >
            <img
              src={editIcon}
              alt="Edit"
              className="w-7 h-7 right-0"
            />
        </label>
            <h1 className="text-4xl font-bold text-gray-800">Edit Profile</h1>
            <p className="text-lg text-gray-700">
              <strong>Username:</strong> {username || "Not set"}
            </p>
            <p className="text-lg text-gray-700 mb-8">
              <strong>Email:</strong> {email || "Not set"}
            </p>
          </div>
        </div>
          
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] text-center">
                <h2 className="text-xl mb-4 font-semibold">Change Profile Image</h2>
                {newPreviewUrl ? (
                  <img
                    src={newPreviewUrl}
                    alt="New Preview"
                    className="w-48 h-48 rounded-full mx-auto object-cover mb-4"
                  />
                ) : (
                  <p>No image selected yet.</p>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="underline text-gray-600"
                >
                  Select Image
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />


                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      setImage(null);
                      setNewImageChosen(false);
                      setNewPreviewUrl("");
                    }}
                    disabled={uploading}
                    className="px-4 py-2 rounded-full border border-gray-400 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={uploading || !newImageChosen}
                    className={`px-6 py-2 rounded-full text-white ${
                      uploading || !newImageChosen
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        
    
    </>
  );
}

export default EditProfile;
