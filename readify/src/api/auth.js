import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await sendEmailVerification(user);
      return {
        success: false,
        error: "Please verify your email. A new verification link has been sent.",
      };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
