import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const CLOUD_NAME = "djxipn8kj";
const UPLOAD_PRESET = "Readify"; // replace with your Cloudinary preset

export const uploadToCloudinary = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "Readify"); // replace with your Cloudinary preset

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};

export const saveReview = async (reviewData, imageFile, uid) => {
  try {
    console.log("Uploading image...");
    const imageUrl = await uploadToCloudinary(imageFile);
    console.log("Image uploaded:", imageUrl);

    const review = {
      title: reviewData.title,
      category: reviewData.category,
      review: reviewData.review,
      timestamp: reviewData.timestamp || serverTimestamp(),
      books_pics_url: imageUrl,
      uid: uid,
    };

    console.log("Saving to allreview...");
    const allReviewRef = await addDoc(collection(db, "allreview"), review);
    await updateDoc(allReviewRef, { reviewId: allReviewRef.id });

    console.log("Saving to user subcollection...");
    const userReviewRef = doc(db, `users/${uid}/reviews/${allReviewRef.id}`);
    await setDoc(userReviewRef, { ...review, reviewId: allReviewRef.id });

    console.log("Updating user stats...");
    const statRef = doc(db, `users/${uid}/stats/progress`);
    await setDoc(statRef, { totalReviews: increment(1) }, { merge: true });

    console.log("Review saved successfully.");
    return allReviewRef.id;
  } catch (err) {
    console.error("🔥 Error in saveReview:", err.message, err);
    throw err;
  }
};
