import { Doc, getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { DataModel } from "./_generated/dataModel";
type UserWithAcademicInfo = DataModel["users"]["document"] & {
  faculty: DataModel["faculties"]["document"] | null;
  department: DataModel["departments"]["document"] | null;
  institute?: DataModel["institutes"]["document"] | null;
};

export const currentUser = query({
  args: {},
  handler: async (ctx): Promise<UserWithAcademicInfo | null> => {
    const userId = await getAuthUserId(ctx); // null if not signed in
    if (userId === null) return null;

    const user = await ctx.db.get(userId); // Doc<"users">
    if (!user) {
      return null;
    }

    const faculty = user.facultyId ? await ctx.db.get(user.facultyId) : null;

    const department = user.departmentId
      ? await ctx.db.get(user.departmentId)
      : null;

    const institute = user.instituteId
      ? await ctx.db.get(user.instituteId)
      : null;

    return {
      ...user,
      faculty,
      department,
      institute,
    };
  },
});

export const update = mutation({
  args: {
    matricule: v.optional(v.string()),
    level: v.optional(v.string()),
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
