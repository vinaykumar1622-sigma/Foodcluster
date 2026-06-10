// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "foodcluster-food-delivery.firebaseapp.com",
  projectId: "foodcluster-food-delivery",
  storageBucket: "foodcluster-food-delivery.firebasestorage.app",
  messagingSenderId: "331647301643",
  appId: "1:331647301643:web:9bd5870e2feaf850146f0e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {app,auth}