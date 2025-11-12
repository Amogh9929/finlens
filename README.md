Finlens
=======

Overview
--------
Finlens is a personal finance assistant that analyzes spending behavior and provides personalized recommendations. It includes a React frontend, a Python Starlette backend, Firebase authentication and Firestore for persistence, and Google Gemini for AI-powered suggestions.

Repository layout
-----------------
- backend/ - Python Starlette backend
  - app/ - application code (routes, services, fuzzy logic)
  - requirements.txt - Python dependencies
  - .env.example - environment variable template (do not commit secrets)
- frontend/ - Vite + React frontend
  - frontend/ - React source
  - package.json / package-lock.json

Prerequisites
-------------
- Python 3.11+ and virtualenv
- Node.js 18+ and npm
- Git
- A GitHub account (optional: repo already pushed)
- Firebase project with Firestore and Email/Password authentication
- Google Cloud/AI Studio API key with access to Gemini (set as GEMINI_API_KEY)

Backend setup
-------------
1. Create and activate a virtual environment:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Create a `.env` file in `backend/` (copy from `.env.example`) and set:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Do not commit your `.env` file. It is included in `.gitignore`.

4. Run the backend:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Frontend setup
--------------
1. Install frontend dependencies and run the dev server:

```powershell
cd frontend
npm install
npm run dev
```

2. Open `http://localhost:5173` in your browser.

Firebase configuration
----------------------
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Email/Password authentication.
3. Create a Firestore database (start in test mode for development).
4. Copy the Firebase config into `frontend/frontend/src/firebase.js`. The app expects typical Firebase web config keys (apiKey, authDomain, projectId, etc.).

Google Gemini (AI) setup
------------------------
1. Ensure you have access to Google Gemini (AI Studio or Google Cloud).
2. Create an API key and enable the Generative Language API.
3. Place the API key in `backend/.env` as `GEMINI_API_KEY`.

Troubleshooting
---------------
- "Gemini AI error" or static responses:
  - Ensure `backend/.env` exists and contains a valid `GEMINI_API_KEY`.
  - Restart the backend so `load_dotenv()` picks up the variables.
  - Use the provided commands to test the model directly from the backend virtualenv.

- Frontend port already in use:
  - Kill the process using port 5173 or pick another port: `npm run dev -- --port 5174`.

- Firebase rules/permissions:
  - If Firestore reads/writes fail, ensure rules allow authenticated access or update rules appropriately for development.

Security notes
--------------
- Do not commit secrets (API keys, `.env`) to version control. The repository includes `.gitignore` rules to prevent this, but double-check before pushing.
- If any secret was accidentally committed, rotate the key immediately and remove it from history.

Contributing
------------
Open an issue or pull request on GitHub.

License
-------
This project is provided without license information. Add a LICENSE file if you intend to open-source it.
