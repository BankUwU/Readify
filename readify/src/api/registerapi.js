import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig"; // Make sure db is imported too

export const registerUser = async (email, username, password) => {
  try {

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: username });

    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      displayName: username,
      photoURL: "",
      review: "",
      createdAt: serverTimestamp(),
      role: "user", 
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
