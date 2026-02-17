import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    credits: v.number(),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  transactions: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("credit"), v.literal("debit")),
    amount: v.number(),
    reason: v.string(),
    toolName: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
