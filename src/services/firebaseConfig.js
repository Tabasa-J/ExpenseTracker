// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAZEj4lFAROpzBSdLXj6OocCpokZZvVR6w",
  authDomain: "myexpensetracker-9a1dd.firebaseapp.com",
  projectId: "myexpensetracker-9a1dd",
  storageBucket: "myexpensetracker-9a1dd.appspot.com",
  messagingSenderId: "198670879949",
  appId: "1:198670879949:web:001ce07578e3ed54416d84"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Social login providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
