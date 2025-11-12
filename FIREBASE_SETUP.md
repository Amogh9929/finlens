# 🔥 Firebase Setup Guide for Finlens

## ✅ What's Been Implemented

Firebase authentication and Firestore database have been fully integrated into Finlens! Here's what you have:

### Features
- ✅ **User Authentication** (Email/Password)
- ✅ **Sign Up & Login** with real validation
- ✅ **Firestore Database** for user profiles
- ✅ **Real-time data persistence**
- ✅ **Automatic auth state management**
- ✅ **Logout functionality**
- ✅ **Protected routes** (requires login)

---

## 🚀 Firebase Console Setup (5 Minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `finlens` (or your choice)
4. Disable Google Analytics (optional for this project)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"** switch
6. Click **"Save"**

### Step 3: Create Firestore Database

1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
   - **Important**: For production, use proper security rules
4. Choose location: Select closest to your users (e.g., `us-central`)
5. Click **"Enable"**

### Step 4: Get Firebase Config

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"**
4. Click the **web icon** (`</>`)
5. Register app:
   - App nickname: `finlens-web`
   - Don't check "Firebase Hosting"
   - Click **"Register app"**
6. **Copy the firebaseConfig object** (looks like this):
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "finlens-xxxxx.firebaseapp.com",
     projectId: "finlens-xxxxx",
     storageBucket: "finlens-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

### Step 5: Update Firebase Config in Code

1. Open `frontend/src/firebase.js`
2. Replace the placeholder config with your actual config:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "YOUR_ACTUAL_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_ACTUAL_PROJECT_ID",
     storageBucket: "YOUR_ACTUAL_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
     appId: "YOUR_ACTUAL_APP_ID"
   }
   ```

---

## 🧪 Testing the Integration

### Test Sign Up
1. Go to http://localhost:5173
2. Click **"Need an account? Sign Up"**
3. Enter:
   - Email: `test@example.com`
   - Password: `password123` (min 6 characters)
4. Click **"Sign Up"**
5. Should see onboarding modal

### Test Login
1. After signing up, logout (top right)
2. Click **"Already have an account? Sign In"**
3. Enter same credentials
4. Click **"Sign In"**
5. Should go straight to dashboard (already onboarded)

### Verify in Firebase Console
1. Go to **Authentication** → **Users** tab
2. You should see your test user listed
3. Go to **Firestore Database** → **Data** tab
4. You should see a `users` collection with your user document

---

## 📊 Firestore Data Structure

### Users Collection (`users/{userId}`)
```javascript
{
  userId: "firebase-auth-uid",
  monthly_income: 30000,
  spending_goal: 20000,
  current_spend: 12000,
  onboarded: true,
  updatedAt: "2025-11-10T14:30:00.000Z"
}
```

### Transactions Collection (Future) (`transactions/{transactionId}`)
```javascript
{
  userId: "firebase-auth-uid",
  amount: 500,
  category: "Food",
  description: "Lunch at cafe",
  date: "2025-11-10",
  createdAt: "2025-11-10T14:30:00.000Z"
}
```

---

## 🔒 Security Rules (Production)

Before deploying, update Firestore security rules:

1. Go to **Firestore Database** → **Rules** tab
2. Replace with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Users can only read/write their own transactions
       match /transactions/{transactionId} {
         allow read, write: if request.auth != null && 
           resource.data.userId == request.auth.uid;
       }
     }
   }
   ```
3. Click **"Publish"**

---

## 🎯 What Changed in the Code

### New Files Created
1. **`frontend/src/firebase.js`** - Firebase initialization
2. **`frontend/src/contexts/AuthContext.jsx`** - Auth state management
3. **`frontend/src/services/firestore.js`** - Database operations

### Modified Files
1. **`frontend/src/App.jsx`**:
   - Added `AuthProvider` wrapper
   - Updated `LoginPage` with real auth (sign up/login)
   - Added logout button to header
   - Updated `DashboardPage` to check Firebase

2. **`frontend/src/components/Dashboard.jsx`**:
   - Fetches user profile from Firestore
   - Uses `currentUser.uid` instead of hardcoded 'demo'

3. **`frontend/src/components/OnboardingModal.jsx`**:
   - Saves profile to Firestore
   - Uses `currentUser.uid` for user identification

---

## 🌐 API Endpoints (No Longer Needed!)

With Firebase, you **don't need** the backend API endpoints anymore:
- ❌ `/api/user/profile` (GET/POST) - Replaced by Firestore
- ❌ `/api/auth/login` - Replaced by Firebase Auth
- ❌ `/api/auth/register` - Replaced by Firebase Auth

**You can still keep the backend running for:**
- ✅ `/api/analytics/fuzzy-summary` (fuzzy logic)
- ✅ `/api/analytics/behavior-summary` (behavior analysis)
- ✅ `/api/agent/respond` (AI agent chat)

---

## 🚀 Deployment Options

### Option 1: Firebase Hosting (Recommended)
```bash
cd frontend
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Option 2: Vercel/Netlify
- Just connect your GitHub repo
- Set build command: `npm run build`
- Set publish directory: `dist`

---

## 🔍 Troubleshooting

### "Firebase not configured" Error
- Make sure you replaced the config in `firebase.js`
- Check that all fields are filled (no "YOUR_..." placeholders)

### "Permission denied" Error
- Check Firestore security rules
- Make sure user is logged in (`currentUser` exists)

### "Invalid email or password"
- Password must be at least 6 characters
- Check email format

### Can't see data in Firestore
- Wait a few seconds and refresh
- Check Console for errors
- Verify user is authenticated

---

## 📈 Next Steps

### Immediate
1. ✅ Configure Firebase in Console
2. ✅ Update `firebase.js` with real config
3. ✅ Test sign up/login flow
4. ✅ Verify data appears in Firestore

### Future Enhancements
- [ ] Add transaction tracking (save expenses to Firestore)
- [ ] Real category breakdown from actual transactions
- [ ] Password reset functionality
- [ ] Profile picture upload (Firebase Storage)
- [ ] Google Sign-In (OAuth)
- [ ] Email verification

---

## 💡 Benefits Over Previous Setup

| Feature | Before (In-Memory) | After (Firebase) |
|---------|-------------------|------------------|
| **Data Persistence** | Lost on restart | Permanent cloud storage |
| **Authentication** | Fake (hardcoded) | Real with password validation |
| **Multi-user** | Everyone is 'demo' | Unique accounts per user |
| **Security** | None | Built-in auth + security rules |
| **Scalability** | Single server | Google's infrastructure |
| **Deployment** | Complex | Firebase Hosting (1 command) |

---

## 🎉 You're Production-Ready!

Once you configure Firebase, your Finlens app will have:
- ✅ Real user authentication
- ✅ Cloud database storage
- ✅ Production-grade security
- ✅ Automatic scaling
- ✅ Free tier (generous limits)

**Firebase Free Tier Limits:**
- 50,000 document reads/day
- 20,000 document writes/day
- 1 GB storage
- More than enough for a student project!

---

Need help with Firebase setup? Check the [Firebase Docs](https://firebase.google.com/docs) or ask me! 🚀
