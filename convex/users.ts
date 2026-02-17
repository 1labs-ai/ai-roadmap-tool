import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const SIGNUP_BONUS_CREDITS = 50;

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

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      credits: SIGNUP_BONUS_CREDITS,
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
