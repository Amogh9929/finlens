import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
// Get this from: Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBelYBTVkRsalId8D4MYcmHcn19bWNzx-4",
  authDomain: "finlens-73ec8.firebaseapp.com",
  projectId: "finlens-73ec8",
  storageBucket: "finlens-73ec8.firebasestorage.app",
  messagingSenderId: "943773055781",
  appId: "1:943773055781:web:d01911437c142a34b9f8cc",
  measurementId: "G-RHGFS1FF08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
