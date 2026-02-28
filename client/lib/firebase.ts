// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

// Validate Firebase configuration
const isFirebaseConfigValid = () => {
  const requiredFields = ["apiKey", "authDomain", "projectId", "appId"];
  return requiredFields.every((field) => firebaseConfig[field as keyof typeof firebaseConfig]);
};

let app: any = null;
let analytics: any = null;

// Initialize Firebase only if config is valid
if (isFirebaseConfigValid()) {
  try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn("Firebase configuration is incomplete. Some Firebase features may not work.");
}

export { app, analytics };
