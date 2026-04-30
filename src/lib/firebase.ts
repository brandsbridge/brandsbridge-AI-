import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmDBgp5wMV8ODEVuilcrhZk5zHcYJZZQU",
  authDomain: "brandsbridge-ai.firebaseapp.com",
  projectId: "brandsbridge-ai",
  storageBucket: "brandsbridge-ai.firebasestorage.app",
  messagingSenderId: "1034578874641",
  appId: "1:1034578874641:web:9dd1e7fdb3d73d52b37cb0",
  measurementId: "G-1VG5T7Z4NX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, "us-central1");
export const storage = getStorage(app);
export default app;
