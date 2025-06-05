import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig"; // Make sure db is imported too

export const registerUser = async (email, username, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update both displayName and photoURL for Firebase Authentication user
    await updateProfile(user, { 
      displayName: username,
      photoURL: "https://res.cloudinary.com/djxipn8kj/image/upload/v1749103684/a9wmneb0ad0kfwd3kaqr.png"
    });

    // Save user data in Firestore 'users' collection
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      displayName: username,
      photoURL: "https://res.cloudinary.com/djxipn8kj/image/upload/v1749103684/a9wmneb0ad0kfwd3kaqr.png",
      createdAt: serverTimestamp(),
      role: "user",
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
