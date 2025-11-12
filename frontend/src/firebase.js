// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//    apiKey: "AIzaSyDtui3MX41hQ5Gd62Vpd11_qUTuErn6PQ0",
//   authDomain: "myweb-899f0.firebaseapp.com",
//   projectId: "myweb-899f0",
//   storageBucket: "myweb-899f0.firebasestorage.app",
//   messagingSenderId: "499186048589",
//   appId: "1:499186048589:web:6a3b3ad989506789de4604",
//   measurementId: "G-MPGJECG698"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// // export const googleProvider = new GoogleAuthProvider();

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 🔹 Your Firebase configuration
// (replace with your actual keys from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyDtui3MX41hQ5Gd62Vpd11_qUTuErn6PQ0",
  authDomain: "myweb-899f0.firebaseapp.com",
  projectId: "myweb-899f0",
  storageBucket: "myweb-899f0.firebasestorage.app",
  messagingSenderId: "499186048589",
  appId: "1:499186048589:web:6a3b3ad989506789de4604",
  measurementId: "G-MPGJECG698"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Export Authentication + Google Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();