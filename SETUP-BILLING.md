# Clerk Billing Setup Guide

This guide walks through setting up Clerk Billing for 1Labs Tools subscription model.

## Prerequisites

- Clerk account with the 1Labs Tools app configured
- Stripe account (test mode for development)

## Step 1: Connect Stripe to Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your app: **quiet-bug-27**
3. Navigate to **Configure** → **Billing** → **Settings**
4. Click **Connect Stripe Account**
5. Follow the OAuth flow to connect your Stripe account
   - For development: Use Stripe test mode
   - For production: You'll need a separate production Stripe account

## Step 2: Create Subscription Plans

Navigate to **Billing** → **Plans** in Clerk Dashboard and create:

### Plan 1: Free (Default)
- **Name:** Free
- **Slug:** `free`
- **Price:** $0/month
- **Set as default plan:** ✅
- **Features:**
  - `tools_access` (Display: "Access to all tools")

### Plan 2: Starter
- **Name:** Starter
- **Slug:** `starter`
- **Monthly Price:** $9/month
- **Annual Price:** $90/year (save $18)
- **Features:**
  - `tools_access` (Display: "Access to all tools")
  - `credits_100` (Display: "100 credits per month")
  - `monthly_reset` (Display: "Monthly credit reset")

### Plan 3: Pro
- **Name:** Pro
- **Slug:** `pro`
- **Monthly Price:** $29/month
- **Annual Price:** $290/year (save $58)
- **Features:**
  - `tools_access` (Display: "Access to all tools")
  - `credits_500` (Display: "500 credits per month")
  - `monthly_reset` (Display: "Monthly credit reset")
  - `priority_support` (Display: "Priority support")

### Plan 4: Unlimited
- **Name:** Unlimited
- **Slug:** `unlimited`
- **Monthly Price:** $79/month
- **Annual Price:** $790/year (save $158)
- **Features:**
  - `tools_access` (Display: "Access to all tools")
  - `unlimited_generations` (Display: "Unlimited generations")
  - `priority_support` (Display: "Priority support")
  - `no_credit_limits` (Display: "No credit limits")

## Step 3: Configure Webhook

1. Go to **Configure** → **Webhooks** in Clerk Dashboard
2. Click **Add Endpoint**
3. Enter the endpoint URL:
   - Development: Use ngrok URL + `/api/webhooks/clerk`
   - Production: `https://roadmap.1labs.app/api/webhooks/clerk`
4. Select events to subscribe:
   - `user.created`
   - `user.updated`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.active`
   - `subscriptionItem.active`
   - `subscriptionItem.canceled`
   - `subscriptionItem.ended`
   - `paymentAttempt.updated`
5. Copy the **Signing Secret**
6. Add to `.env.local`:
   ```
   CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxxxxxxxxxxxx
   ```

## Step 4: Test the Integration

### Local Development Testing

1. Install ngrok: `brew install ngrok`
2. Start ngrok: `ngrok http 3000`
3. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
4. Update webhook endpoint in Clerk to: `https://abc123.ngrok.io/api/webhooks/clerk`
5. Start local dev server: `npm run dev`

### Test Flow

1. Sign up as a new user → Should get 50 free credits
2. Navigate to `/pricing` → Should see 4 plans
3. Subscribe to Starter ($9/mo) → Use Stripe test card: `4242 4242 4242 4242`
4. After successful payment:
   - User should have `starter` plan
   - Credits should be 100
   - Header should show "STARTER" badge
5. Generate a roadmap → Should deduct 5 credits
6. Check Convex dashboard to verify transactions logged

### Stripe Test Cards

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Declined |
| 4000 0000 0000 3220 | Requires 3DS (will fail in Clerk) |

## Step 5: Deploy to Production

1. Create a production Stripe account
2. Connect production Stripe to Clerk production instance
3. Create the same 4 plans in production
4. Add production webhook endpoint: `https://roadmap.1labs.app/api/webhooks/clerk`
5. Update production environment variables in Vercel:
   - `CLERK_WEBHOOK_SIGNING_SECRET` (production secret)

## Credit System Overview

| Plan | Credits | Reset |
|------|---------|-------|
| Free | 50 (one-time) | Never |
| Starter | 100/month | Monthly |
| Pro | 500/month | Monthly |
| Unlimited | ∞ | N/A |

### Credit Costs
- Roadmap generation: 5 credits

## Convex Schema

```typescript
users: {
  clerkId: string,
  email: string,
  name?: string,
  credits: number,
  plan: "free" | "starter" | "pro" | "unlimited",
  creditsResetAt?: number,
  stripeCustomerId?: string,
  createdAt: number
}
```

## Troubleshooting

### Webhook not receiving events
- Check ngrok is running and URL is correct
- Verify webhook secret matches
- Check Clerk Dashboard → Webhooks → Message Attempts for errors

### Credits not updating after subscription
- Check browser console for errors
- Verify Convex mutations are executing
- Check Convex Dashboard for transaction logs

### PricingTable not showing plans
- Ensure plans are created in Clerk Dashboard
- Check billing is enabled for the app
- Verify Stripe is connected

## Files Modified

- `convex/schema.ts` - Added plan, creditsResetAt fields
- `convex/users.ts` - Added subscription sync, plan-aware credit logic
- `convex/crons.ts` - Monthly credit reset cron job
- `app/pricing/page.tsx` - New pricing page with PricingTable
- `app/api/webhooks/clerk/route.ts` - Webhook handler
- `app/page.tsx` - Updated with plan badge, improved upgrade flow
- `middleware.ts` - Made webhook routes public
