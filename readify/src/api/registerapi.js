import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; // adjust if needed

export const registerUser = async (email, username, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });

    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
