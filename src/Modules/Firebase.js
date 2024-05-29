import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // auth instance
export const db = getFirestore(app); // db instance

export const createUser = httpsCallable(getFunctions(app), "createUser");
export const getLecturerUID = httpsCallable(
  getFunctions(app),
  "getLecturerUID"
);
export const bindLessonToLecturer = httpsCallable(
  getFunctions(app),
  "bindLessonToLecturer"
);
export const getUsers = httpsCallable(getFunctions(app), "getUsers");
export const getUser = httpsCallable(getFunctions(app), "getUser");
export const getDisplayNameFromUID = httpsCallable(
  getFunctions(app),
  "getDisplayNameFromUID"
);
export const deleteUser = httpsCallable(getFunctions(app), "deleteUser");
