import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    credits: v.number(),
    plan: v.string(), // "free", "starter", "pro", "unlimited"
    creditsResetAt: v.optional(v.number()), // Timestamp for next credit reset
    stripeCustomerId: v.optional(v.string()), // Stripe customer ID from Clerk
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_plan", ["plan"])
    .index("by_credits_reset", ["creditsResetAt"]),

  transactions: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("credit"), v.literal("debit")),
    amount: v.number(),
    reason: v.string(),
    toolName: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
