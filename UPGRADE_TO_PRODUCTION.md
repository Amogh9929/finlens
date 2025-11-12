# 🚀 Upgrade Finlens to Production-Ready

## Current Limitations

### ❌ **No Database**
- User profiles stored in RAM (`_user_profiles = {}`)
- Data lost on server restart
- Can't scale to multiple servers

### ❌ **No Real Authentication**
- Hardcoded token: `'demo'`
- No password validation
- Everyone is the same user
- No security

---

## 🎯 Recommended Upgrades

### **Option 1: MongoDB + JWT Auth** (Best for Students)

#### Step 1: Install Dependencies
```bash
cd backend
pip install pymongo python-jose[cryptography] passlib[bcrypt]
```

#### Step 2: Set up MongoDB
```bash
# Free MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
# Or local MongoDB:
docker run -d -p 27017:27017 --name finlens-mongo mongo
```

#### Step 3: Create Database Service
**File**: `backend/app/services/database.py`
```python
from pymongo import MongoClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URL)
db = client.finlens

def get_user_collection():
    return db.users

def get_transactions_collection():
    return db.transactions
```

#### Step 4: Create Auth Service
**File**: `backend/app/services/auth.py`
```python
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode = {"sub": user_id, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None
```

#### Step 5: Update User Routes
**File**: `backend/app/routes/user.py`
```python
from starlette.requests import Request
from starlette.responses import JSONResponse
from app.services.database import get_user_collection
from app.services.auth import hash_password, verify_password, create_access_token, verify_token

async def register(request: Request) -> JSONResponse:
    """POST /api/auth/register"""
    body = await request.json()
    email = body.get("email")
    password = body.get("password")
    
    users = get_user_collection()
    if users.find_one({"email": email}):
        return JSONResponse({"error": "Email already exists"}, status_code=400)
    
    user = {
        "email": email,
        "password": hash_password(password),
        "profile": {
            "monthly_income": 0,
            "spending_goal": 0,
            "current_spend": 0,
            "onboarded": False
        }
    }
    result = users.insert_one(user)
    token = create_access_token(str(result.inserted_id))
    return JSONResponse({"token": token, "user_id": str(result.inserted_id)})

async def login(request: Request) -> JSONResponse:
    """POST /api/auth/login"""
    body = await request.json()
    email = body.get("email")
    password = body.get("password")
    
    users = get_user_collection()
    user = users.find_one({"email": email})
    
    if not user or not verify_password(password, user["password"]):
        return JSONResponse({"error": "Invalid credentials"}, status_code=401)
    
    token = create_access_token(str(user["_id"]))
    return JSONResponse({"token": token, "user_id": str(user["_id"])})

async def get_profile(request: Request) -> JSONResponse:
    """GET /api/user/profile (requires auth token)"""
    # Get token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    
    token = auth_header.split(" ")[1]
    user_id = verify_token(token)
    if not user_id:
        return JSONResponse({"error": "Invalid token"}, status_code=401)
    
    users = get_user_collection()
    user = users.find_one({"_id": user_id})
    if not user:
        return JSONResponse({"error": "User not found"}, status_code=404)
    
    return JSONResponse(user["profile"])

async def save_profile(request: Request) -> JSONResponse:
    """POST /api/user/profile (requires auth token)"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    
    token = auth_header.split(" ")[1]
    user_id = verify_token(token)
    if not user_id:
        return JSONResponse({"error": "Invalid token"}, status_code=401)
    
    body = await request.json()
    profile = {
        "monthly_income": float(body.get("monthly_income", 0)),
        "spending_goal": float(body.get("spending_goal", 0)),
        "current_spend": float(body.get("current_spend", 0)),
        "onboarded": True
    }
    
    users = get_user_collection()
    users.update_one({"_id": user_id}, {"$set": {"profile": profile}})
    return JSONResponse(profile)
```

#### Step 6: Update Frontend Login
**File**: `frontend/src/App.jsx`
```javascript
function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isRegister, setIsRegister] = useState(false)
    
    const onSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            setError('Enter email and password')
            return
        }
        
        try {
            const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            
            if (!res.ok) {
                const err = await res.json()
                setError(err.error || 'Authentication failed')
                return
            }
            
            const data = await res.json()
            localStorage.setItem('finlens_token', data.token)
            localStorage.setItem('finlens_user_id', data.user_id)
            window.location.href = '/app/dashboard'
        } catch (err) {
            setError(String(err))
        }
    }
    
    // ... rest of component with toggle for register/login
}
```

#### Step 7: Update API Calls to Include Token
**File**: `frontend/src/components/Dashboard.jsx`
```javascript
const token = localStorage.getItem('finlens_token')

fetch('/api/user/profile', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
```

---

### **Option 2: Firebase (Easiest Setup)**

#### Benefits:
- No server setup needed
- Built-in authentication
- Real-time database
- Free tier available

#### Setup:
```bash
npm install firebase
```

```javascript
// frontend/src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "finlens.firebaseapp.com",
    projectId: "finlens",
    // ... from Firebase Console
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

---

## 📊 Current vs Production Comparison

| Feature | Current | Production |
|---------|---------|------------|
| **Database** | In-memory dict | MongoDB/PostgreSQL/Firebase |
| **Data Persistence** | Lost on restart | Permanent |
| **Authentication** | Hardcoded 'demo' | JWT tokens / OAuth |
| **Password Security** | No passwords | Bcrypt hashing |
| **Multi-user** | Everyone is 'demo' | Unique user accounts |
| **API Security** | No token verification | Bearer token validation |
| **Scalability** | Single server only | Multi-server ready |
| **Sessions** | localStorage only | Secure HTTP-only cookies |

---

## 🔒 Security Checklist for Production

- [ ] Use environment variables for secrets (`.env` file)
- [ ] Hash passwords with bcrypt (never store plain text)
- [ ] Use HTTPS in production (not HTTP)
- [ ] Implement JWT token expiration (7 days max)
- [ ] Add rate limiting to prevent brute force attacks
- [ ] Validate all user inputs on backend
- [ ] Use HTTP-only cookies for tokens (more secure than localStorage)
- [ ] Implement CORS properly (not `allow_origins=["*"]`)
- [ ] Add refresh tokens for better UX
- [ ] Log authentication attempts for monitoring

---

## 🎯 Quick Start for MongoDB (5 Minutes)

1. **Sign up for MongoDB Atlas** (free): https://www.mongodb.com/cloud/atlas
2. **Create a cluster** (free tier M0)
3. **Get connection string**:
4. **Install dependencies**:
   ```bash
   cd backend
   pip install pymongo python-jose[cryptography] passlib[bcrypt]
   ```
5. **Create `.env` file**:
   ```
   MONGO_URL=your-connection-string-here
   SECRET_KEY=your-random-secret-key-here
   ```
6. **Implement the code** from Option 1 above

---

## 💡 Recommendation

For a **student project** or **portfolio piece**:
- Use **MongoDB Atlas (free tier)** + **JWT authentication**
- Takes ~30 minutes to implement
- Looks professional on resume
- Actually secure and production-ready

For **quick demo**:
- Current in-memory storage is fine
- Just add a warning: "Demo mode - data not persisted"
- Focus on showcasing the UI/UX and fuzzy logic features

---

Need help implementing any of these? Let me know which option you'd like to go with!
