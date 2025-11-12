import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
// Get this from: Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "Your Key",
  authDomain: "finlens-e828f.firebaseapp.com",
  projectId: "finlens-e828f",
  storageBucket: "finlens-e828f.firebasestorage.app",
  messagingSenderId: "455260920995",
  appId: "1:455260920995:web:a52d5674a95de4771d7316",
  measurementId: "G-NP49KJ44J0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
