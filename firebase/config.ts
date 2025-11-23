// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3FCFsN7zANBv9-gB05pkVWXKNKxEL7FE",
  authDomain: "life-os-69991.firebaseapp.com",
  projectId: "life-os-69991",
  storageBucket: "life-os-69991.firebasestorage.app",
  messagingSenderId: "104216750527",
  appId: "1:104216750527:web:7beb009ff11fbab46d190a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



// ✅ تصدير الخدمات
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
