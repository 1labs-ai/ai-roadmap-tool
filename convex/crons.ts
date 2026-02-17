import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Reset credits for paid subscribers daily at midnight UTC
// This checks if creditsResetAt has passed and resets credits accordingly
crons.daily(
  "reset-monthly-credits",
  { hourUTC: 0, minuteUTC: 0 },
  internal.users.resetMonthlyCredits
);

export default crons;
