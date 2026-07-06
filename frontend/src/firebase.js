import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBzFEi_9qSO60De2A4lzmT3cRTkfxFBMKY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-daily-list.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-daily-list",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-daily-list.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || "688162614024",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:688162614024:web:c7a6bc6a68430bb1aa1abd",
};

// Debug: log config to check if env vars are loaded
console.log('Firebase Config:', firebaseConfig);
console.log('VITE_FIREBASE_API_KEY from env:', import.meta.env.VITE_FIREBASE_API_KEY);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize reCAPTCHA verifier for email link auth
let recaptchaVerifier = null;

export const getRecaptchaVerifier = (containerId) => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
    });
  }
  return recaptchaVerifier;
};

export const clearRecaptchaVerifier = () => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
};
