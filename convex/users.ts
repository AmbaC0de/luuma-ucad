import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx); // null if not signed in
    if (userId === null) return null;

    return await ctx.db.get(userId); // Doc<"users">
  },
});

export const update = mutation({
  args: {
    matricule: v.optional(v.string()),
    facultyId: v.optional(v.id("faculties")),
    departmentId: v.optional(v.id("departments")),
    instituteId: v.optional(v.id("institutes")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }

    await ctx.db.patch(userId, args);
  },
});
