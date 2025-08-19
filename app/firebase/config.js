// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ecommproject-ea39b.firebaseapp.com",
  projectId: "ecommproject-ea39b",
  storageBucket: "ecommproject-ea39b.firebasestorage.app",
  messagingSenderId: "939303065850",
  appId: "1:939303065850:web:0622c973a686644c50d143",
  measurementId: "G-M13P0LC716",
};

export default firebaseConfig;


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
