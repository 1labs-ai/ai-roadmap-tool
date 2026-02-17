import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import { verifyWebhook } from '@clerk/nextjs/webhooks';

// Lazy initialization to avoid build-time errors
function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL not configured');
  }
  return new ConvexHttpClient(url);
}

// Plan slug to internal plan name mapping
const PLAN_MAPPING: Record<string, string> = {
  'free': 'free',
  'starter': 'starter',
  'starter-monthly': 'starter',
  'starter-yearly': 'starter',
  'pro': 'pro',
  'pro-monthly': 'pro',
  'pro-yearly': 'pro',
  'unlimited': 'unlimited',
  'unlimited-monthly': 'unlimited',
  'unlimited-yearly': 'unlimited',
};

function getPlanFromSlug(slug: string): string {
  const normalizedSlug = slug.toLowerCase().replace(/[_\s]/g, '-');
  return PLAN_MAPPING[normalizedSlug] || 'free';
}

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook using Clerk's built-in verification
    const evt = await verifyWebhook(request);
    
    const eventType = evt.type;
    console.log(`[Clerk Webhook] Received event: ${eventType}`);

    // Handle subscription events
    if (eventType === 'subscription.created' || eventType === 'subscription.updated' || eventType === 'subscription.active') {
      const data = evt.data as {
        payer_id?: string;
        id?: string;
        status?: string;
      };
      
      const userId = data.payer_id;
      
      if (!userId) {
        console.error('[Clerk Webhook] No payer_id in subscription event');
        return NextResponse.json({ received: true, warning: 'No payer_id' }, { status: 200 });
      }

      console.log(`[Clerk Webhook] Subscription event for user: ${userId}`);
      
      // For now, we'll need to get the plan from subscription items
      // The actual plan slug would come from the subscription item's plan
      // This is a simplified implementation
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Handle subscription item events (these contain the actual plan info)
    if (eventType === 'subscriptionItem.active') {
      const data = evt.data as {
        subscription_id?: string;
        plan?: {
          slug?: string;
          name?: string;
        };
      };
      
      // Get the subscription to find the payer
      const subscriptionId = data.subscription_id;
      const planSlug = data.plan?.slug || 'free';
      const planName = getPlanFromSlug(planSlug);
      
      console.log(`[Clerk Webhook] Subscription item active - Plan: ${planSlug} -> ${planName}`);
      
      // Note: We need the user's clerkId to sync, which should come from the subscription
      // In a real implementation, you'd query the subscription to get the payer_id
      
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (eventType === 'subscriptionItem.canceled' || eventType === 'subscriptionItem.ended') {
      const data = evt.data as {
        subscription_id?: string;
        plan?: {
          slug?: string;
        };
      };
      
      console.log(`[Clerk Webhook] Subscription item ended/canceled`);
      
      // Handle cancellation - would need to get user from subscription
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Handle user events (for user creation/sync)
    if (eventType === 'user.created') {
      const data = evt.data as {
        id: string;
        email_addresses?: Array<{ email_address: string; id: string }>;
        first_name?: string;
        last_name?: string;
      };
      
      const clerkId = data.id;
      const email = data.email_addresses?.[0]?.email_address || '';
      const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || undefined;
      
      console.log(`[Clerk Webhook] User created: ${clerkId}`);
      
      try {
        const convex = getConvexClient();
        await convex.mutation(api.users.getOrCreateUser, {
          clerkId,
          email,
          name,
        });
        console.log(`[Clerk Webhook] User synced to Convex: ${clerkId}`);
      } catch (error) {
        console.error('[Clerk Webhook] Failed to sync user:', error);
      }
      
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (eventType === 'user.updated') {
      const data = evt.data as {
        id: string;
        email_addresses?: Array<{ email_address: string; id: string }>;
        first_name?: string;
        last_name?: string;
        public_metadata?: {
          plan?: string;
          stripe_customer_id?: string;
        };
      };
      
      const clerkId = data.id;
      const email = data.email_addresses?.[0]?.email_address || '';
      const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || undefined;
      
      console.log(`[Clerk Webhook] User updated: ${clerkId}`);
      
      // Check if plan was updated in metadata
      const planFromMetadata = data.public_metadata?.plan;
      const stripeCustomerId = data.public_metadata?.stripe_customer_id;
      
      try {
        const convex = getConvexClient();
        // First sync basic user info
        await convex.mutation(api.users.getOrCreateUser, {
          clerkId,
          email,
          name,
        });
        
        // If plan metadata changed, sync subscription
        if (planFromMetadata) {
          const planName = getPlanFromSlug(planFromMetadata);
          await convex.mutation(api.users.syncSubscription, {
            clerkId,
            plan: planName,
            stripeCustomerId,
          });
          console.log(`[Clerk Webhook] Subscription synced for ${clerkId}: ${planName}`);
        }
      } catch (error) {
        console.error('[Clerk Webhook] Failed to update user:', error);
      }
      
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Payment events
    if (eventType === 'paymentAttempt.updated') {
      const data = evt.data as {
        status?: string;
        subscription_item_id?: string;
        type?: string;
      };
      
      console.log(`[Clerk Webhook] Payment attempt ${data.status}: ${data.type}`);
      
      // Could track failed payments for alerting
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Log unhandled events for debugging
    console.log(`[Clerk Webhook] Unhandled event type: ${eventType}`);
    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error) {
    console.error('[Clerk Webhook] Error processing webhook:', error);
    
    // Return 400 for verification failures
    if (error instanceof Error && error.message.includes('verification')) {
      return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
    }
    
    // Return 500 for other errors (Clerk will retry)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Required for Clerk webhook verification
export async function GET() {
  return NextResponse.json({ message: 'Clerk webhook endpoint' }, { status: 200 });
}
