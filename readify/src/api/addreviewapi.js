import {
  addDoc,
  collection,
  doc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";


const CLOUD_NAME = "djxipn8kj";
const UPLOAD_PRESET = "Readify";

export const uploadToCloudinary = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};

export const saveReview = async (reviewData, imageFile, user) => {
  try {
    const imageUrl = await uploadToCloudinary(imageFile);

    // Format date only (e.g., May 27, 2025)
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const review = {
      title: reviewData.title,
      category: reviewData.category,
      review: reviewData.review,
      createdAt: date,
      books_pics_url: imageUrl,
      uid: user.uid,
      createdBy: user.displayName || "Anonymous",
    };

    // Save to global collection
    const allReviewRef = await addDoc(collection(db, "allreview"), review);
    await updateDoc(allReviewRef, { reviewId: allReviewRef.id });

    // Save to user's personal subcollection
    const userReviewRef = doc(db, `users/${user.uid}/reviews/${allReviewRef.id}`);
    await setDoc(userReviewRef, { ...review, reviewId: allReviewRef.id });

    // Update user's stats
    const statRef = doc(db, `users/${user.uid}/stats/progress`);
    await setDoc(statRef, { totalReviews: increment(1) }, { merge: true });

    return allReviewRef.id;
  } catch (err) {
    console.error("🔥 Error in saveReview:", err.message, err);
    throw err;
  }
};
