import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2qt6OBmzkCjh1T-5Cj7dl7RWyK4r8U78",
  authDomain: "uniqo-e4ccb.firebaseapp.com",
  projectId: "uniqo-e4ccb",
  storageBucket: "uniqo-e4ccb.firebasestorage.app",
  messagingSenderId: "74580740609",
  appId: "1:74580740609:web:a04749746981dfbc744e00"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/** @type {import("firebase/auth").Auth} */
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (_error) {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

