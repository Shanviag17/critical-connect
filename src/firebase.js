import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCY6T4esamTbH90NHeJ0NteJu0vA8VMgD8",
  authDomain: "critical-connect.firebaseapp.com",
  projectId: "critical-connect",
  storageBucket: "critical-connect.appspot.com",
  messagingSenderId: "812165216334",
  appId: "1:812165216334:web:fbdf64b14de2c97b84ab1f",
};

// 🔥 prevents duplicate init (MOST IMPORTANT FIX)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
console.log("Firebase loaded");
export const db = getFirestore(app);
export const auth = getAuth(app);