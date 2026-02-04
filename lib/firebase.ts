import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkH4O656pmi8z5mqRBX_7sb-okwSa57VQ",
  authDomain: "kirato-ai.firebaseapp.com",
  projectId: "kirato-ai",
  storageBucket: "kirato-ai.firebasestorage.app",
  messagingSenderId: "370924791028",
  appId: "1:370924791028:web:c52de70144f79f6a9f6aa1",
  measurementId: "G-PRVZBNRDZK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);