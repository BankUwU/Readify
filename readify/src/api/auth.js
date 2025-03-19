import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase Auth methods
import { auth } from "../firebaseConfig"; // Import Firebase auth

// Login Function
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user }; // Return user object if successful
  } catch (error) {
    return { success: false, error: "Please Check Your Email or Password" }; // Return error message if failed
  }
};
