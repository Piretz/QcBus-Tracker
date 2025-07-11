// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDC5QCbktWzgw4SBaZv417geZOfp3M3z68",
  authDomain: "qc-bus-tracker.firebaseapp.com",
  projectId: "qc-bus-tracker",
  storageBucket: "qc-bus-tracker.firebasestorage.app",
  messagingSenderId: "5223833288",
  appId: "1:5223833288:web:8ef2753358a13d1830cffd",
  measurementId: "G-YPEC3Y2BVF"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
