import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
// Get this from: Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "Your Key",
  authDomain: "Your Domain",
  projectId: "Your ID",
  storageBucket: "Your Storage",
  messagingSenderId: "Your ID",
  appId: "Your ID",
  measurementId: "Your ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
