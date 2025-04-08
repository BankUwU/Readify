import React, { useEffect, useState } from "react";
import Header from "../components/header";
import "./editprofile.css";
import {auth} from "../firebaseConfig"
import { onAuthStateChanged } from "firebase/auth";

function EditProfile() {
  const [user, setUser] = useState(null)

  useEffect(()=> {
      const unsubscribe = onAuthStateChanged(auth,(currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }, []);
  
  return(<>
    <Header/>
    <div className="content">
      <div className="main-avatar">
          <img
            src="https://img.icons8.com/ios-glyphs/30/ffffff/user--v1.png"
            alt="User Icon"
          />
        </div>
        <div className="info">
          <h1>Readify Profile</h1>
          <h2>Username : {user?.displayName}</h2>
          {/* <h3>Bio : </h3> */}
          <button>Edit Profile</button>
          <button>Change password</button>
        </div>
    </div>
  </>
    );
}

export default EditProfile;
