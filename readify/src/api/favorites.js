import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const addToFavorites = async (userId, review) => {
  try {
    const reviewRef = doc(db, "users", userId, "favorites", review.id);
    await setDoc(reviewRef, review);
    console.log("Review added to favorites");
  } catch (error) {
    console.error("Error adding to favorites:", error);
  }
};

export const removeFromFavorites = async (userId, reviewId) => {
  try {
    const reviewRef = doc(db, "users", userId, "favorites", reviewId);
    await deleteDoc(reviewRef);
    console.log("Review removed from favorites");
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};
