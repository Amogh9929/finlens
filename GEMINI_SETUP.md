# 🤖 Gemini AI Integration - Setup Guide

## ✅ What's Been Implemented

Your Finlens AI agent now uses **Google Gemini Pro** for intelligent financial advice!

### Features:
- ✅ AI-powered personalized suggestions based on your spending patterns
- ✅ Context-aware responses using fuzzy logic data
- ✅ Fallback to rule-based suggestions if API fails
- ✅ Free tier (60 requests/minute)

---

## 🔑 Step 1: Get Your Gemini API Key

### Go to Google AI Studio:
1. Visit: https://aistudio.google.com/
2. Click **"Get API key"** in top right
3. Sign in with your Google account (use the same one you have Gemini Pro with)
4. Click **"Create API key"**
5. Select **"Create API key in new project"** (or use existing project)
6. **Copy the API key** (starts with `AIza...`)

**Important:** Keep this key secret! Don't share it or commit it to Git.

---

## 🔧 Step 2: Set Up Environment Variable

### On Windows (PowerShell):

**Option A: Set for current session only**
```powershell
$env:GEMINI_API_KEY = "YOUR_API_KEY_HERE"
```

**Option B: Set permanently (recommended)**
1. Press `Win + X` → System
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "User variables", click "New"
5. Variable name: `GEMINI_API_KEY`
6. Variable value: `YOUR_API_KEY_HERE`
7. Click OK

**Option C: Using .env file (easiest for development)**
1. Create file: `backend/.env`
2. Add this line:
   ```
   GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```
3. Install python-dotenv:
   ```bash
   cd backend
   pip install python-dotenv
   ```
4. Update `backend/app/main.py` to load .env:
   ```python
   from dotenv import load_dotenv
   load_dotenv()
   ```

---

## 🧪 Step 3: Test the Integration

### Start the backend:
```powershell
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Test the AI agent:
1. Open http://localhost:5173
2. Login to your app
3. Click the **💬 Ask Finlens** button (bottom center)
4. Ask questions like:
   - "How can I save more money?"
   - "Should I cut back on food spending?"
   - "Help me reduce my subscriptions"
   - "Tips to avoid impulse buying"

### Expected Response:
You should get personalized AI-generated tips based on your actual spending patterns!

---

## 📊 How It Works

### Before (Rule-Based):
```
User: "How can I save money?"
→ Generic rule-based tips
```

### After (AI-Powered):
```
User: "How can I save money?"
→ Gemini analyzes your:
   - Overspending: 72%
   - Late-night orders: 45%
   - Dining spike: 68%
→ Returns personalized advice:
   • "Set a weekly budget for dining out - aim for ₹1500 max"
   • "Batch cook meals on Sunday to avoid late-night food orders"
   • "Use a budgeting app to track daily spending in real-time"
```

---

## 🔍 Debugging

### Check if API key is loaded:
Add this to `agent.py` temporarily:
```python
print(f"Gemini API Key loaded: {bool(GEMINI_API_KEY)}")
print(f"Model initialized: {bool(model)}")
```

### Test Gemini directly:
```python
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')
response = model.generate_content("Say hello!")
print(response.text)
```

### Common Errors:

**"API key not valid"**
→ Check that you copied the full key
→ Make sure environment variable is set
→ Restart terminal/backend after setting env var

**"No response from AI"**
→ Check internet connection
→ Verify API key has Gemini API enabled
→ Check Google AI Studio quota

**"Fallback suggestions shown"**
→ This is normal if Gemini fails
→ Check console for error messages
→ Verify API key is set correctly

---

## 💰 Gemini API Pricing

### Free Tier (More than enough for development):
- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

### Example usage for Finlens:
- Each AI agent query = ~500 tokens
- You can make **~2,000 queries/month** for FREE
- That's 66 queries per day

**Your student app will easily stay in free tier!** 🎉

---

## 🎯 What the AI Agent Can Do Now

### Personalized Advice:
- Analyzes your fuzzy logic scores
- Considers behavioral patterns
- Gives specific, actionable tips

### Context-Aware:
- Knows your overspending level
- Understands your spending habits
- Provides relevant suggestions

### Smart Fallback:
- If Gemini fails → uses rule-based tips
- Never breaks, always gives suggestions
- Seamless user experience

---

## 🚀 Next Steps (Optional Enhancements)

### 1. Add Conversation Memory
Store chat history in Firestore for context:
```javascript
// In firestore.js
export const saveChatMessage = async (userId, message) => {
  await addDoc(collection(db, 'chat_history'), {
    userId,
    message,
    timestamp: new Date()
  })
}
```

### 2. Receipt Scanning
Gemini can analyze images! Add receipt upload:
```python
# Use gemini-pro-vision
model = genai.GenerativeModel('gemini-pro-vision')
response = model.generate_content([receipt_image, "Extract spending data"])
```

### 3. Budget Predictions
Ask Gemini to predict next month's spending:
```python
prompt = f"Based on this spending pattern: {data}, predict next month's expenses"
```

### 4. Multi-language Support
Gemini supports 100+ languages:
```python
prompt = f"Respond in Hindi: {user_question}"
```

---

## ✅ Quick Setup Checklist

- [ ] Get Gemini API key from https://aistudio.google.com/
- [ ] Set `GEMINI_API_KEY` environment variable
- [ ] Restart backend server
- [ ] Test AI agent with a question
- [ ] Verify personalized responses
- [ ] Check Firestore if using .env file
- [ ] Celebrate! 🎉

---

**Your AI agent is now powered by Gemini Pro!** 🚀

Test it out and see the difference in response quality!
