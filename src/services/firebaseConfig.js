// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAZEj4lFAROpzBSdLXj6OocCpokZZvVR6w",
  authDomain: "myexpensetracker-9a1dd.firebaseapp.com",
  projectId: "myexpensetracker-9a1dd",
   storageBucket: "myexpensetracker-9a1dd.appspot.com",
  messagingSenderId: "198670879949",
  appId: "1:198670879949:web:001ce07578e3ed54416d84"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
