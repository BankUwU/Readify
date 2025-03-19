import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC5w6l1INDg_y8mjhku-3Uo9euynvbL0lw",
  authDomain: "readify-ad2d8.firebaseapp.com",
  projectId: "readify-ad2d8",
  storageBucket: "readify-ad2d8.firebasestorage.app",
  messagingSenderId: "240035693079",
  appId: "1:240035693079:web:2e5ada2e29fcb4e5ce9252",
  measurementId: "G-31DNL1MBN0"
};


export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);