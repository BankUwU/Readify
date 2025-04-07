import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const registerUser = async (email, username, password) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    //Update the user's displayName in Firebase Auth
    await updateProfile(user, {
      displayName: username,
    });

    // Store additional user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
