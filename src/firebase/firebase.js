// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For Authentication
import { getFirestore } from "firebase/firestore"; // For Firestore
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfyCbGK_zehEV__qK4vU2J03rvQq-fn8I",
  authDomain: "smart-event-planner-3a109.firebaseapp.com",
  projectId: "smart-event-planner-3a109",
  storageBucket: "smart-event-planner-3a109.firebasestorage.app",
  messagingSenderId: "51033424299",
  appId: "1:51033424299:web:f05bd1f455241f39d0d2ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize service references (backend services)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);