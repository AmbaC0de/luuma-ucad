import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx); // null if not signed in
    if (userId === null) return null;

    return await ctx.db.get(userId); // Doc<"users">
  },
});
