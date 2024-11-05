// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDGj3B7JIGCocBhbR4EmnpEdHSk-6IcvlY",
    authDomain: "maintenace-request-database.firebaseapp.com",
    projectId: "maintenace-request-database",
    storageBucket: "maintenace-request-database.firebasestorage.app",
    messagingSenderId: "419662230859",
    appId: "1:419662230859:web:c05dc698c3ea4ba6b2a4ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };