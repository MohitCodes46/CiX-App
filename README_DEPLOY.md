# 🚀 CiXApp Production Deployment Guide

## 1. Backend (Express API)

### Recommended: Deploy to [Render](https://render.com) or [Railway](https://railway.app)

- These platforms support persistent Node.js/Express servers (unlike Vercel).
- **Do NOT deploy your Express backend to Vercel.**

### Steps:
1. Go to [Render](https://render.com) or [Railway](https://railway.app)
2. Click "New Web Service" and connect your GitHub repo.
3. Set the root directory to `backend`.
4. Set the start command to:
   ```
   node src/server.js
   ```
5. Add all required environment variables from your `backend/.env.production` (do NOT use real secrets in the repo).
6. Deploy!

- Your backend will be available at `https://your-backend.onrender.com` (or similar).

---

## 2. Frontend (Expo/React/Next/Web)

### Deploy to [Vercel](https://vercel.com)

1. Go to [https://vercel.com/import/git](https://vercel.com/import/git)
2. Select your GitHub repo.
3. Set the root directory to the project root (not `backend`).
4. Add all required environment variables from `.env.production` in the Vercel dashboard.
   - Set `EXPO_PUBLIC_API_URL` to your deployed backend URL (e.g., `https://your-backend.onrender.com/api/v1`)
5. Deploy!

---

## 3. Environment Variables

- **Never commit real secrets to git.**
- Use `.env.example` files for templates.
- Add all secrets to the Render/Railway and Vercel dashboards.

---

## 4. After Deployment

- Test all endpoints: `/api/v1/health`, `/api/v1/products`, etc.
- Update your mobile app to use the new API URL.
- For Stripe webhooks, use your public backend URL in the Stripe dashboard.

---

## 5. Troubleshooting

- If you see "Network request failed", check:
  - Backend is running and public
  - API URL is correct in frontend
  - CORS is configured on backend
- If you see "Push declined due to secrets", remove secrets from git history and force push.

---

**For help, see the README or ask your devops/engineering team!** 