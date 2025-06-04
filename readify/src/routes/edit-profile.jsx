import axios from "axios";
import { onAuthStateChanged, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordPopup from "../components/ChangePasswordPopup";
import DeleteAccountPopup from "../components/DeleteAccountPopup";
import Header from "../components/header";
import { auth, db } from "../config/firebaseConfig";
import editIcon from "../img/edit-icon.png";
import Longbg from "../img/longbg.webp";
import defaultProfilePic from "../img/profilepic.png";
import Toast from "../components/Toast"; 




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
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

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

  const handlePasswordChange = (newPassword) => {
  const currentUser = auth.currentUser;
  updatePassword(currentUser, newPassword)
    .then(() => {
      setToast({ message: "Password changed successfully.", type: "success" });
      setShowChangePasswordPopup(false);
    })
    .catch((err) => {
      console.error(err);
      setToast({ message: "Error changing password. You may need to re-login.", type: "error" });
    });
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

        <div className="absolute top-[80px] left-1/2 transform -translate-x-1/2 flex bg-white w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] rounded-full items-center justify-center">
        <div className="relative w-[160px] h-[160px] sm:w-[230px] sm:h-[230px]">
          <div className="w-full h-full bg-white rounded-full overflow-hidden">
              <img
                src={previewUrl || defaultProfilePic}
                alt="Profile"
                className="w-full h-full object-center object-cover"
              />
          </div>
          

          <label
            onClick={handleEditClick}
            className="absolute bottom-1 right-2 sm:right-6 bg-blue-600 flex rounded-full cursor-pointer shadow-md w-9 h-9 items-center justify-center"
          >
            <img
              src={editIcon}
              alt="Edit"
              className="w-5 h-5 invert brightness-0"
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
          <div className="bg-white p-4 sm:p-6 mx-4 rounded-2xl shadow-lg text-center w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
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
                className="px-4 py-2 rounded-xl border bg-gray-200 hover:bg-gray-300"
                disabled={savingInfo}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInfo}
                disabled={savingInfo || !editUsername || !editEmail}
                className={`px-6 py-2 rounded-xl text-white ${
                  !editUsername || !editEmail || savingInfo
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

      <div className="border relative mt-40 items-center bg-white shadow-xl w-[90%] max-w-2xl grid grid-cols-1 md:grid-cols-2 mx-auto rounded-3xl p-8">
          <div>
             <label
              onClick={openEditInfoPopup}
              className="cursor-pointer absolute right-6 top-6"
            >
            <img
              src={editIcon}
              alt="Edit"
              className="w-4 h-4 right-0"
            />
        </label>
            <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
            <div className="mt-3 space-y-2">
            <div className="grid grid-cols-[120px_1fr] gap-x-2">
              <span className="font-medium text-gray-700">Username </span>
              <span>{username || "Not set"}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-x-2">
              <span className="font-medium text-gray-700">Email </span>
              <span>{email || "Not set"}</span>
            </div>
          </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center mt-10 gap-4 text-white">
          <button
            onClick={() => setShowChangePasswordPopup(true)}
             className="text-sm sm:text-base px-3 py-2 sm:px-5 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition duration-300"
          >
            Change Password
          </button>
          <button
            onClick={() => setShowDeletePopup(true)}
            className="text-sm sm:text-base px-5 py-2 sm:px-6 sm:py-2 bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition duration-300"
          >
            Delete Account
          </button>
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
                  <img
                    src={defaultProfilePic}
                    alt="Default Profile"
                    className="w-48 h-48 rounded-full mx-auto object-cover mb-4"
                  />
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
                    className="px-4 py-2 rounded-xl border border-gray-400 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={uploading || !newImageChosen}
                    className={`px-6 py-2 rounded-xl text-white ${
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
          {showChangePasswordPopup && (
            <ChangePasswordPopup
              onClose={() => setShowChangePasswordPopup(false)}
              onSubmit={handlePasswordChange}
            />
          )}
          {showDeletePopup && (
          <DeleteAccountPopup
            onClose={() => setShowDeletePopup(false)}
            onDeleteSuccess={() => {
              setShowDeletePopup(false);
              navigate("/login"); 
            }}
          />
        )}
        {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      )}

    </>
  );
}

export default EditProfile;
  