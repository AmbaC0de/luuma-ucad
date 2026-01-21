import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByFaculty = query({
  args: { facultyId: v.id("faculties") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("departments")
      .withIndex("by_facultyId", (q) => q.eq("facultyId", args.facultyId))
      .collect();
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});
