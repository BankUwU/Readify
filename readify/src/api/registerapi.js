import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const registerUser = async (email, username, password) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user's displayName in Authentication
    await updateProfile(user, {
      displayName: username,
    });

    // Create the main user document
    await setDoc(doc(db, "Users", user.uid), {
      email: email,
    });

    // Create subcollection "UserID" under that user
    await setDoc(doc(collection(db, "Users", user.uid, "UserID")), {
      username: username,
      email: email,
      displayname: username,
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
