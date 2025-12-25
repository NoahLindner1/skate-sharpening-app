// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCh7FObXx7jto6wr7nrFu_n18Uba2orj5k",
  authDomain: "skate-sharpening-app.firebaseapp.com",
  projectId: "skate-sharpening-app",
  storageBucket: "skate-sharpening-app.firebasestorage.app",
  messagingSenderId: "1036375017158",
  appId: "1:1036375017158:web:29bed2b67bb7a5049c79c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
