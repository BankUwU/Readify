import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function EditProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header />
      <div className="flex items-center justify-around bg-[aliceblue] max-w-[80%] mt-12 mx-auto min-h-[70vh] rounded-[30px] text-left px-6">
        <div className="w-[350px] h-[350px] bg-white rounded-full flex items-center justify-center cursor-pointer">
          <img
            src="https://img.icons8.com/ios-glyphs/30/ffffff/user--v1.png"
            alt="User Icon"
            className="w-[150px] h-[150px] invert"
          />
        </div>
        <div className="flex-1 max-w-[500px] text-left">
          <h1 className="text-5xl mb-4">Readify Profile</h1>
          <h2 className="text-2xl mb-6">Username: {user?.displayName}</h2>
          {/* <h3>Bio : </h3> */}
          <button className="bg-blue-500 text-white px-8 py-3 text-base rounded-full mr-4 mb-4 transition duration-300 hover:bg-blue-700 hover:scale-105 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Edit Profile
          </button>
          <button className="bg-blue-500 text-white px-8 py-3 text-base rounded-full mb-4 transition duration-300 hover:bg-blue-700 hover:scale-105 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Change Password
          </button>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
