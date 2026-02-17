import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

const SIGNUP_BONUS_CREDITS = 50;

// Plan configuration
export const PLANS = {
  free: { credits: 50, isOneTime: true },
  starter: { credits: 100, isOneTime: false },
  pro: { credits: 500, isOneTime: false },
  unlimited: { credits: Infinity, isOneTime: false },
} as const;

export type PlanType = keyof typeof PLANS;

// Helper to get next month reset timestamp
function getNextMonthTimestamp(): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return nextMonth.getTime();
}

export const getOrCreateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      if (existing.email !== args.email || existing.name !== args.name) {
        await ctx.db.patch(existing._id, {
          email: args.email,
          name: args.name,
        });
      }
      return { user: existing, isNew: false };
    }

    // New user gets free plan with signup bonus
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      credits: SIGNUP_BONUS_CREDITS,
      plan: "free",
      createdAt: Date.now(),
    });

    await ctx.db.insert("transactions", {
      userId,
      type: "credit",
      amount: SIGNUP_BONUS_CREDITS,
      reason: "signup_bonus",
      createdAt: Date.now(),
    });

    const user = await ctx.db.get(userId);
    return { user, isNew: true };
  },
});

export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    return user;
  },
});

export const getCredits = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    return user?.credits ?? 0;
  },
});

export const getUserPlan = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    return {
      plan: user?.plan ?? "free",
      credits: user?.credits ?? 0,
      creditsResetAt: user?.creditsResetAt,
    };
  },
});

export const deductCredits = mutation({
  args: {
    clerkId: v.string(),
    amount: v.number(),
    reason: v.string(),
    toolName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) throw new Error("User not found");
    
    // Unlimited plan users don't deduct credits
    if (user.plan === "unlimited") {
      // Still log the transaction for tracking
      await ctx.db.insert("transactions", {
        userId: user._id,
        type: "debit",
        amount: 0, // No actual deduction
        reason: args.reason + " (unlimited plan)",
        toolName: args.toolName,
        createdAt: Date.now(),
      });
      return { success: true, newBalance: Infinity };
    }
    
    if (user.credits < args.amount) throw new Error("Insufficient credits");

    await ctx.db.patch(user._id, {
      credits: user.credits - args.amount,
    });

    await ctx.db.insert("transactions", {
      userId: user._id,
      type: "debit",
      amount: args.amount,
      reason: args.reason,
      toolName: args.toolName,
      createdAt: Date.now(),
    });

    return { success: true, newBalance: user.credits - args.amount };
  },
});

export const addCredits = mutation({
  args: {
    clerkId: v.string(),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      credits: user.credits + args.amount,
    });

    await ctx.db.insert("transactions", {
      userId: user._id,
      type: "credit",
      amount: args.amount,
      reason: args.reason,
      createdAt: Date.now(),
    });

    return { success: true, newBalance: user.credits + args.amount };
  },
});

// Sync subscription from Clerk Billing webhook
export const syncSubscription = mutation({
  args: {
    clerkId: v.string(),
    plan: v.string(),
    stripeCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      console.error("User not found for subscription sync:", args.clerkId);
      return { success: false, error: "User not found" };
    }

    const planKey = args.plan.toLowerCase() as PlanType;
    const planConfig = PLANS[planKey] || PLANS.free;
    
    const oldPlan = user.plan;
    const isUpgrade = getPlanRank(planKey) > getPlanRank(oldPlan as PlanType);
    
    // Calculate new credits
    let newCredits = user.credits;
    let creditsResetAt = user.creditsResetAt;
    
    if (planKey === "unlimited") {
      // Unlimited plan doesn't need credits tracking
      newCredits = 999999; // Display purposes
      creditsResetAt = undefined;
    } else if (planConfig.isOneTime) {
      // Free plan - one-time bonus already given at signup
      // Don't reset credits
    } else {
      // Paid plan - set monthly credits
      if (isUpgrade || oldPlan === "free") {
        // Give full credits on upgrade or first subscription
        newCredits = planConfig.credits;
        creditsResetAt = getNextMonthTimestamp();
      }
      // If downgrade, credits reset at next billing cycle (handled by cron)
    }

    await ctx.db.patch(user._id, {
      plan: planKey,
      credits: newCredits,
      creditsResetAt,
      stripeCustomerId: args.stripeCustomerId,
    });

    // Log the subscription change
    await ctx.db.insert("transactions", {
      userId: user._id,
      type: "credit",
      amount: planKey === "unlimited" ? 0 : planConfig.credits,
      reason: `subscription_${isUpgrade ? "upgrade" : "change"}_to_${planKey}`,
      createdAt: Date.now(),
    });

    return { 
      success: true, 
      oldPlan, 
      newPlan: planKey,
      credits: newCredits 
    };
  },
});

// Cancel subscription - revert to free plan
export const cancelSubscription = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Keep current credits but mark plan as free
    // Credits will naturally deplete and not reset
    await ctx.db.patch(user._id, {
      plan: "free",
      creditsResetAt: undefined,
    });

    await ctx.db.insert("transactions", {
      userId: user._id,
      type: "credit",
      amount: 0,
      reason: "subscription_canceled",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Monthly credit reset for paid subscribers (called by cron)
export const resetMonthlyCredits = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    // Find users with creditsResetAt <= now
    const usersToReset = await ctx.db
      .query("users")
      .withIndex("by_credits_reset")
      .filter((q) => 
        q.and(
          q.neq(q.field("plan"), "free"),
          q.neq(q.field("plan"), "unlimited"),
          q.lte(q.field("creditsResetAt"), now)
        )
      )
      .collect();

    let resetCount = 0;
    for (const user of usersToReset) {
      const planKey = user.plan as PlanType;
      const planConfig = PLANS[planKey];
      
      if (planConfig && !planConfig.isOneTime) {
        await ctx.db.patch(user._id, {
          credits: planConfig.credits,
          creditsResetAt: getNextMonthTimestamp(),
        });

        await ctx.db.insert("transactions", {
          userId: user._id,
          type: "credit",
          amount: planConfig.credits,
          reason: "monthly_credit_reset",
          createdAt: Date.now(),
        });
        
        resetCount++;
      }
    }

    return { resetCount };
  },
});

// Helper function to rank plans for upgrade detection
function getPlanRank(plan: PlanType): number {
  const ranks: Record<PlanType, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    unlimited: 3,
  };
  return ranks[plan] ?? 0;
}

// Check if user can perform action (has sufficient credits or unlimited plan)
export const canPerformAction = query({
  args: { 
    clerkId: v.string(),
    cost: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) return { canPerform: false, reason: "not_found" };
    
    if (user.plan === "unlimited") {
      return { canPerform: true, reason: "unlimited_plan" };
    }
    
    if (user.credits >= args.cost) {
      return { canPerform: true, reason: "sufficient_credits" };
    }
    
    return { 
      canPerform: false, 
      reason: "insufficient_credits",
      credits: user.credits,
      plan: user.plan,
    };
  },
});
