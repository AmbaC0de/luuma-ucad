import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    category: v.id("productCategories"),
    storageIds: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new Error("Unauthorized");
    }

    const { storageIds, ...rest } = args;
    const images: string[] = [];

    if (storageIds) {
      for (const storageId of storageIds) {
        const url = await ctx.storage.getUrl(storageId);
        if (url) {
          images.push(url);
        }
      }
    }

    const productId = await ctx.db.insert("products", {
      ...rest,
      storageIds,
      images,
      createdAt: Date.now(),
    });

    return productId;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
