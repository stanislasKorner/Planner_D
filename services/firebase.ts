import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5RKlRW5Cyqm1dD_3Hm9dVqk5FPVxUpUM",
  authDomain: "disney-c94b1.firebaseapp.com",
  projectId: "disney-c94b1",
  storageBucket: "disney-c94b1.firebasestorage.app",
  messagingSenderId: "283832808600",
  appId: "1:283832808600:web:ccdfb54ee8084db6ac4ced"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);