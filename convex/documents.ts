import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("COURSE"),
      v.literal("TD"),
      v.literal("TP"),
      v.literal("EXAM"),
    ),
    scope: v.union(
      v.literal("UNIVERSITY"),
      v.literal("FACULTY"),
      v.literal("DEPARTMENT"),
      v.literal("INSTITUTE"),
    ),
    facultyId: v.optional(v.id("faculties")),
    departmentId: v.optional(v.id("departments")),
    instituteId: v.optional(v.id("institutes")),
    storageId: v.id("_storage"),
    mimeType: v.string(),
    size: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new Error("Unauthorized");
    }

    const { storageId, ...rest } = args;
    const fileUrl = await ctx.storage.getUrl(storageId);

    if (!fileUrl) {
      throw new Error("Failed to get file URL from storageId");
    }

    const documentId = await ctx.db.insert("documents", {
      ...rest,
      storageId,
      fileUrl,
      // createdBy: userIdentity.subject,
      createdAt: Date.now(),
    });

    return documentId;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
