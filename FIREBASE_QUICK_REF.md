# 🔥 Firebase Integration - Quick Reference

## ✅ Implementation Complete!

Firebase authentication and Firestore database are **fully integrated** into Finlens.

---

## 🚦 Current Status

### ✅ **Completed**
- Firebase SDK installed (`npm install firebase`)
- Authentication context created (`AuthContext.jsx`)
- Firestore service layer (`firestore.js`)
- Login/Sign up page with real auth
- User profile storage in Firestore
- Dashboard fetches from Firestore
- Onboarding saves to Firestore
- Logout functionality
- Protected routes

### ⚠️ **Requires Your Action**
You need to **configure Firebase** in the Firebase Console:

1. **Create Firebase Project** at https://console.firebase.google.com/
2. **Enable Email/Password Authentication**
3. **Create Firestore Database** (test mode)
4. **Copy your config** to `frontend/src/firebase.js`

**See detailed steps in:** `FIREBASE_SETUP.md`

---

## 📁 New Files

```
frontend/
├── src/
│   ├── firebase.js                    # Firebase config (NEEDS YOUR CONFIG!)
│   ├── contexts/
│   │   └── AuthContext.jsx           # Auth state management
│   └── services/
│       └── firestore.js              # Database operations
```

---

## 🔑 What to Update

**File:** `frontend/src/firebase.js`

**Replace this:**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                           // ⚠️ CHANGE THIS
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",    // ⚠️ CHANGE THIS
  projectId: "YOUR_PROJECT_ID",                     // ⚠️ CHANGE THIS
  storageBucket: "YOUR_PROJECT_ID.appspot.com",     // ⚠️ CHANGE THIS
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",    // ⚠️ CHANGE THIS
  appId: "YOUR_APP_ID"                              // ⚠️ CHANGE THIS
}
```

**With actual values from Firebase Console** (Project Settings > Your apps)

---

## 🧪 Testing After Firebase Setup

### 1. Sign Up (New User)
```
1. Go to http://localhost:5173
2. Click "Need an account? Sign Up"
3. Enter email: test@example.com
4. Enter password: password123 (min 6 chars)
5. Click "Sign Up"
6. Should show onboarding modal
7. Fill income/goal/spend
8. Should redirect to dashboard
```

### 2. Login (Existing User)
```
1. Click logout (top right)
2. Click "Already have an account? Sign In"
3. Enter same credentials
4. Should go straight to dashboard
```

### 3. Verify in Firebase
```
1. Go to Firebase Console > Authentication > Users
   → Should see test@example.com
   
2. Go to Firestore Database > Data
   → Should see users collection
   → Click user document
   → Should see monthly_income, spending_goal, etc.
```

---

## 🔄 Authentication Flow

```
User Opens App
    ↓
Not Logged In? → Login Page
    ↓
Sign Up / Login → Firebase Auth
    ↓
Success → Set currentUser in AuthContext
    ↓
Check Onboarding Status (Firestore)
    ↓
Not Onboarded? → Onboarding Modal
    ↓
Save Profile → Firestore
    ↓
Show Dashboard (fetch from Firestore)
```

---

## 💾 Data Storage

### Before (In-Memory)
```python
_user_profiles = {}  # Lost on restart ❌
```

### After (Firebase Firestore)
```javascript
// Permanent cloud storage ✅
users/{userId} = {
  monthly_income: 30000,
  spending_goal: 20000,
  current_spend: 12000,
  onboarded: true
}
```

---

## 🎯 Key Features

### Authentication
- ✅ Email/Password sign up
- ✅ Login with validation
- ✅ Logout functionality
- ✅ Auth state persistence
- ✅ Password minimum 6 characters
- ✅ Error messages for invalid credentials

### Database
- ✅ User profiles in Firestore
- ✅ Automatic user ID from Firebase Auth
- ✅ Real-time data sync
- ✅ Cloud-based storage
- ✅ Scalable infrastructure

### Security
- ✅ Firebase Auth handles encryption
- ✅ Firestore security rules (configurable)
- ✅ No passwords in code
- ✅ Protected API endpoints

---

## 🚀 Next Steps

### **Immediate (Required)**
1. ⚠️ **Configure Firebase** (see FIREBASE_SETUP.md)
2. ⚠️ **Update firebase.js** with your config
3. ✅ **Test sign up/login**
4. ✅ **Verify data in Firestore Console**

### **Optional Enhancements**
- Add transaction tracking (expenses)
- Real category breakdown from transactions
- Password reset via email
- Google Sign-In
- Profile picture upload
- Email verification

---

## 📝 Code Examples

### Sign Up
```javascript
const { signup } = useAuth()
await signup('user@example.com', 'password123')
```

### Login
```javascript
const { login } = useAuth()
await login('user@example.com', 'password123')
```

### Save Profile
```javascript
import { saveUserProfile } from '../services/firestore'
const { currentUser } = useAuth()

await saveUserProfile(currentUser.uid, {
  monthly_income: 30000,
  spending_goal: 20000,
  current_spend: 12000
})
```

### Get Profile
```javascript
import { getUserProfile } from '../services/firestore'
const result = await getUserProfile(currentUser.uid)
if (result.success) {
  console.log(result.data)
}
```

---

## 🆘 Common Issues

### "Firebase not configured"
→ Update `firebase.js` with actual config from Console

### "Permission denied"
→ Make sure Firestore is in **test mode** (or update security rules)

### "Invalid email or password"
→ Check password is at least 6 characters

### "Email already in use"
→ Use sign in instead of sign up

---

## 📚 Documentation Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Full Setup Guide](./FIREBASE_SETUP.md)

---

**Firebase is ready to use! Just configure it and start testing! 🎉**
