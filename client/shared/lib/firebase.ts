import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

const isFirebaseConfigValid = () => {
  const requiredFields = ["apiKey", "authDomain", "projectId", "appId"];
  return requiredFields.every((field) => firebaseConfig[field as keyof typeof firebaseConfig]);
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;

if (isFirebaseConfigValid()) {
  try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }

  if (app) {
    isSupported()
      .then((supported) => {
        if (supported) {
          try {
            messaging = getMessaging(app);
          } catch (error) {
            console.warn("Firebase Messaging init failed:", error);
          }
        }
      })
      .catch((err) => {
        console.warn("Firebase Messaging support check failed:", err);
      });
  }
} else {
  console.warn("Firebase configuration is incomplete. Some Firebase features may not work.");
}

export { app, analytics, messaging };
