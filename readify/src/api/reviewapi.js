import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const uploadImageToStorage = async (file) => {
    if (!file) return "";
    const storage = getStorage();
    const imageRef = ref(storage, `review-images/${Date.now()}-${file.name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
};

export const saveReview = async (reviewData, imageFile) => {
    try {
        console.log("Saving review with data:", reviewData);
        const imageUrl = await uploadImageToStorage(imageFile);
        const reviewRef = doc(collection(db, "reviews"));
        await setDoc(reviewRef, {...reviewData,image: imageUrl,});

        return reviewRef.id;
    } catch (error) {
        console.error("Error saving review:", error);
        throw error;
    }
};
