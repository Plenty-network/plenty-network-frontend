// firebaseConfig.js
import { getAnalytics, logEvent, Analytics } from "firebase/analytics";
import { initializeApp, FirebaseApp, FirebaseOptions } from "firebase/app";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firebase: FirebaseApp;
let analytics: Analytics;

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  firebase = initializeApp(firebaseConfig);
  analytics = getAnalytics(firebase);
}
export { firebase, analytics };
