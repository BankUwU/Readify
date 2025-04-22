import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";

export const registerUser = async (email, username, password) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user's displayName in Authentication
    await updateProfile(user, {
      displayName: username,
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
