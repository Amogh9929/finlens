# 🔧 Troubleshooting: Can't Move After Entering Budget Info

## Common Issue: Firestore Permission Denied

If you're stuck on the onboarding screen after entering your budget info, it's most likely a **Firestore security rules** issue.

---

## ✅ Quick Fix

### Step 1: Check Browser Console
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to **Console** tab
3. Look for errors like:
   - `FirebaseError: Missing or insufficient permissions`
   - `PERMISSION_DENIED`
   - Any red error messages

### Step 2: Update Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `finlens` project
3. Click **"Firestore Database"** in left sidebar
4. Click **"Rules"** tab at the top
5. Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users (TEST MODE - not for production!)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Click **"Publish"**
7. Try entering your budget info again

---

## 🔍 Debugging Steps

### Check if User is Authenticated
Open browser console and run:
```javascript
firebase.auth().currentUser
```
- If `null` → You're not logged in (logout and login again)
- If shows user object → Authentication is working

### Check Firestore Connection
In console, look for:
```
Saving profile for user: [some-user-id]
Save result: { success: true/false, ... }
```

### Test Firestore Write Manually
In browser console:
```javascript
import { db } from './firebase'
import { doc, setDoc } from 'firebase/firestore'

// Try to write a test document
const testRef = doc(db, 'test', 'test-doc')
setDoc(testRef, { test: 'hello' })
  .then(() => console.log('Write succeeded!'))
  .catch(err => console.error('Write failed:', err))
```

---

## 🚨 Common Errors & Solutions

### Error: "Missing or insufficient permissions"
**Cause:** Firestore security rules blocking write
**Solution:** Update rules to allow authenticated users (see Step 2 above)

### Error: "User must be logged in"
**Cause:** Auth state not loaded yet
**Solution:** Refresh the page, make sure you're logged in

### Error: "Failed to save profile"
**Cause:** Network issue or Firestore not enabled
**Solution:** 
- Check internet connection
- Verify Firestore Database is created in Firebase Console

### Stuck on "Saving..." forever
**Cause:** Request timing out, likely security rules
**Solution:** Check console for errors, update security rules

---

## 🔒 Production Security Rules (Use Later)

For production, use these more secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
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

---

## 🧪 Test the Fix

After updating security rules:

1. **Refresh the page** (Ctrl+R or Cmd+R)
2. **Login** if needed
3. **Enter budget info:**
   - Monthly Income: 30000
   - Spending Goal: 20000
   - Current Spend: 12000
4. **Click "Get Started"**
5. Should redirect to dashboard ✅

---

## 💡 Still Not Working?

### Check These:

1. **Firebase Config in `firebase.js`**
   - Make sure all fields are filled
   - No "YOUR_..." placeholders

2. **Firestore Database Created**
   - Go to Firebase Console → Firestore Database
   - Should show "Cloud Firestore" with collections

3. **Authentication Enabled**
   - Firebase Console → Authentication
   - Email/Password should be enabled

4. **Network Tab**
   - Open DevTools → Network tab
   - Look for failed requests to `firestore.googleapis.com`

5. **Logout and Login Again**
   - Sometimes auth state gets stale
   - Click logout, then login with same credentials

---

## 📊 Expected Console Logs

When onboarding works correctly, you should see:
```
Saving profile for user: abc123xyz
Save result: { success: true }
[Navigation to /app/dashboard]
```

When it fails, you'll see:
```
Saving profile for user: abc123xyz
Error saving user profile: [error details]
Save result: { success: false, error: "..." }
Onboarding error: [error details]
```

---

## 🆘 Last Resort

If nothing works:

1. **Delete and recreate Firestore Database:**
   - Firebase Console → Firestore Database → Settings
   - Delete database
   - Create new one in **test mode**

2. **Check Firebase Project Status:**
   - Make sure project is active (not suspended)
   - Check billing (free tier should be fine)

3. **Try a different browser:**
   - Sometimes browser extensions block Firebase

4. **Share the console error here** and I'll help debug!

---

**Most likely fix:** Update Firestore security rules to allow authenticated users to write. See Step 2 above! 🎯
