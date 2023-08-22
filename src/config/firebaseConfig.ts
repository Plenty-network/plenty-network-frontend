// firebaseConfig.js
import { getAnalytics, logEvent, Analytics } from "firebase/analytics";
import { initializeApp, FirebaseApp, FirebaseOptions } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyDmduEinqVM9g3Qbdcl-hPOK3D5ze7xWY0",
  authDomain: "app-plenty-network.firebaseapp.com",
  projectId: "app-plenty-network",
  storageBucket: "app-plenty-network.appspot.com",
  messagingSenderId: "969959832307",
  appId: "1:969959832307:web:7414b7f819c9b1492cd586",
  measurementId: "G-820H15VVZM",
};

let firebase: FirebaseApp;
let analytics: Analytics;

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  firebase = initializeApp(firebaseConfig);
  analytics = getAnalytics(firebase);
}
export { firebase, analytics };
