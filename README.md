# 🤖 RAG Chatbot — Complete Setup & Deployment Guide

Chat with your PDF documents using AI! Upload any PDF and ask questions about it.

---

## 📁 Folder Structure

```
rag-chatbot/
├── backend/               ← Python API (deploy on Render)
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   ├── Procfile
│   └── .env.example
│
├── frontend/              ← React app (deploy on Vercel)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── package.json
│   └── .env.example
│
└── README.md              ← You are here!
```

---

## 🔑 STEP 0 — Get Your Free Groq API Key

1. Go to **https://console.groq.com**
2. Click **Sign Up** (it's free!)
3. After signing in, click **API Keys** in the left menu
4. Click **Create API Key**
5. Copy the key — it looks like: `gsk_xxxxxxxxxxxx`
6. Keep it safe — you'll need it in Step 2!

---

## 💻 STEP 1 — Run Locally (Test Before Deploying)

### Backend (Terminal 1)

```bash
# Go into the backend folder
cd rag-chatbot/backend

# Create a .env file with your API key
# On Mac/Linux:
echo "GROQ_API_KEY=your_key_here" > .env

# On Windows (Command Prompt):
echo GROQ_API_KEY=your_key_here > .env

# Install Python packages
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
```

You should see: `Uvicorn running on http://127.0.0.1:8000`
Test it: open http://localhost:8000 in your browser → you should see a JSON message!

### Frontend (Terminal 2)

```bash
# Go into the frontend folder
cd rag-chatbot/frontend

# Create a .env file (tells React where the backend is)
echo "VITE_API_URL=http://localhost:8000" > .env

# Install packages (takes 1-2 minutes)
npm install

# Start the app
npm run dev
```

Open http://localhost:5173 — you should see the chat interface! 🎉

---

## 🐙 STEP 2 — Push Code to GitHub

> ⚠️ IMPORTANT: Never commit your `.env` file! It contains your secret API key.
> The `.gitignore` files are already set up to prevent this.

```bash
# Go to the root folder
cd rag-chatbot

# Start git
git init

# Add all files (the .gitignore files will exclude .env automatically)
git add .

# Check what's being committed — make sure no .env files appear!
git status

# Save your files
git commit -m "Initial commit - RAG Chatbot"

# Go to GitHub.com → click "New Repository"
# Name it: rag-chatbot
# Keep it Public or Private (both work)
# DON'T add README or .gitignore (you already have them)
# Click "Create Repository"

# GitHub will show you two commands — copy the ones that say:
git remote add origin https://github.com/YOUR_USERNAME/rag-chatbot.git
git push -u origin main
```

✅ Your code is now on GitHub!

---

## 🚀 STEP 3 — Deploy Backend on Render (Free)

### 3.1 Create a Render Account
1. Go to **https://render.com**
2. Click **Get Started for Free**
3. Sign up with GitHub (easiest option)

### 3.2 Create a New Web Service
1. In the Render dashboard, click **New +**
2. Select **Web Service**
3. Click **Connect account** next to GitHub
4. Find and select your **rag-chatbot** repository
5. Click **Connect**

### 3.3 Configure the Service
Fill in these exact settings:

| Setting | Value |
|---------|-------|
| **Name** | `rag-chatbot-backend` |
| **Region** | Choose the closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | `Free` |

### 3.4 Add Your Secret API Key
⚠️ This is the most important step! Do NOT skip this!

1. Scroll down to **Environment Variables**
2. Click **Add Environment Variable**
3. Fill in:
   - **Key:** `GROQ_API_KEY`
   - **Value:** `your_groq_api_key_here` (paste your key from Step 0)
4. Click **Save**

### 3.5 Deploy!
1. Click **Create Web Service**
2. Wait 5-10 minutes (first deploy is slow)
3. Watch the logs for any errors
4. When you see `Application startup complete`, it's ready! 🎉

### 3.6 Save Your Backend URL
Render gives you a URL like:
```
https://rag-chatbot-backend.onrender.com
```
**Copy this URL** — you need it for the next step!

### 3.7 Test Your Backend
Open this in your browser:
```
https://rag-chatbot-backend.onrender.com/health
```
You should see: `{"status":"healthy","api":"online"}`

---

## 🎨 STEP 4 — Deploy Frontend on Vercel (Free)

### 4.1 Create a Vercel Account
1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Sign up with GitHub (easiest option)

### 4.2 Import Your Project
1. In Vercel dashboard, click **Add New...**
2. Select **Project**
3. Find your **rag-chatbot** repository
4. Click **Import**

### 4.3 Configure the Project
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 4.4 Add the Backend URL
1. Click **Environment Variables**
2. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://rag-chatbot-backend.onrender.com` ← your Render URL!
3. Make sure to select **All Environments** (Production, Preview, Development)

### 4.5 Deploy!
1. Click **Deploy**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://rag-chatbot.vercel.app`

### 4.6 Test Your App!
Open your Vercel URL and:
1. Upload a PDF
2. Ask a question about it
3. Get an AI answer! 🎉

---

## ❗ Common Problems & Fixes

### Problem: "Network Error" when uploading
**Fix:** Your frontend can't reach the backend.
1. Double-check the `VITE_API_URL` in Vercel matches your Render URL exactly
2. Make sure there's no trailing slash: ✅ `https://x.onrender.com` ❌ `https://x.onrender.com/`
3. In Vercel: Deployments → click latest → **Redeploy**

### Problem: Backend is very slow first time
**Fix:** Render's free tier "sleeps" after 15 minutes of no use.
The first request after sleeping takes ~30 seconds — this is normal!
Just wait and try again.

### Problem: "GROQ_API_KEY not found" error in logs
**Fix:** You forgot to add the environment variable in Render!
1. Go to Render dashboard → your service → **Environment**
2. Add `GROQ_API_KEY` with your key
3. Click **Save Changes** — Render will automatically redeploy

### Problem: Frontend build fails on Vercel
**Fix:** Root Directory might be wrong.
1. Vercel → Project → Settings → General
2. Set **Root Directory** to `frontend`
3. Save and redeploy

### Problem: Empty files on GitHub
**Fix:** Files were not staged properly. From the project root:
```bash
git add -A
git status   # check all files are listed
git commit -m "Add all files"
git push
```

---

## 🔄 Updating Your App

Every time you push code to GitHub, both Render and Vercel automatically redeploy!

```bash
# Make your changes, then:
git add .
git commit -m "Updated something"
git push
```

Render and Vercel detect the push and rebuild automatically ✨

---

## 📊 Free Tier Limits

| Service | Limit |
|---------|-------|
| **Render** | 750 hours/month, sleeps after 15min idle |
| **Vercel** | 100GB bandwidth, unlimited deployments |
| **Groq** | Very generous free tier for personal use |

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** FastAPI + Python
- **AI Model:** Llama 3.1 70B (via Groq)
- **Search:** FAISS vector similarity search
- **Embeddings:** HuggingFace sentence-transformers (free)
- **PDF Processing:** PyPDF

---

Built with ❤️ — 100% free to use and deploy!
