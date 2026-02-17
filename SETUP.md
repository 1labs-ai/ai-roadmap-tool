# 1Labs Roadmap Tool - Setup Guide

## Step 1: Set up Clerk (Authentication)

1. Go to [clerk.com](https://clerk.com) and sign in
2. Create a new application named **"1Labs Tools"**
3. Enable sign-in methods:
   - Email (with verification)
   - Google OAuth
4. Go to **Settings → Domains** and add:
   - `https://roadmap.1labs.app`
   - `http://localhost:3000`
5. Copy your API keys from **Settings → API Keys**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
   - `CLERK_SECRET_KEY` (starts with `sk_`)

## Step 2: Set up Convex (Database)

1. Go to [convex.dev](https://convex.dev) and sign in
2. Run in this directory:
   ```bash
   npx convex dev
   ```
3. Follow the prompts:
   - Create a new project: **"1labs-tools"**
   - This will generate the `convex/_generated` folder
4. Copy your Convex URL from the dashboard:
   - `NEXT_PUBLIC_CONVEX_URL` (looks like `https://xxx.convex.cloud`)

## Step 3: Update Environment Variables

Edit `.env.local` with your keys:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx

# Convex
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud

# OpenAI (already set)
OPENAI_API_KEY=sk-proj-xxx
```

## Step 4: Run Development Server

```bash
# Terminal 1: Convex backend
npx convex dev

# Terminal 2: Next.js frontend
npm run dev
```

## Step 5: Deploy to Vercel

```bash
# Deploy Convex to production
npx convex deploy

# Push to GitHub and deploy via Vercel
git add .
git commit -m "Add Clerk + Convex auth"
git push

# Or deploy directly
vercel --prod
```

Add these env vars in Vercel dashboard:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CONVEX_URL`
- `OPENAI_API_KEY`

## Test the Flow

1. Visit your app
2. Fill in the form fields
3. Click "Generate My Roadmap"
4. Sign up (should get 50 credits)
5. Generate roadmap (should use 5 credits)
6. Check Convex dashboard for user + transaction records

## Credit Costs

- Roadmap generation: 5 credits
- New users: 50 free credits
