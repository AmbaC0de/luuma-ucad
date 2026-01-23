import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sellers").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    fullName: v.string(),
    image: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    let imageUrl: string | undefined;
    if (args.storageId) {
      imageUrl = (await ctx.storage.getUrl(args.storageId)) ?? undefined;
    }

    const sellerId = await ctx.db.insert("sellers", {
      ...args,
      image: imageUrl,
      createdAt: Date.now(),
    });
    return sellerId;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
