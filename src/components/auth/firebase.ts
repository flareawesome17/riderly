// firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6TC_hQLA9AWZv5pnTUIoSvYqMiqQ0_68",
  authDomain: "riderly-code-crusher.firebaseapp.com",
  databaseURL: "https://riderly-code-crusher-default-rtdb.firebaseio.com",
  projectId: "riderly-code-crusher",
  storageBucket: "riderly-code-crusher.firebasestorage.app",
  messagingSenderId: "622235169860",
  appId: "1:622235169860:web:697824462c91e74a0a3811",
  measurementId: "G-0X3D8NR9QB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Optional: Only initialize analytics if supported (avoids issues in SSR)
let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});

export { app, auth, db, analytics };
