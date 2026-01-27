import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export type ProductWithSeller = Doc<"products"> & {
  seller?: Doc<"sellers"> | null;
};

export const get = query({
  args: {},
  handler: async (ctx): Promise<ProductWithSeller[]> => {
    const products = await ctx.db.query("products").order("desc").collect();

    return Promise.all(
      products.map(async (product) => {
        const seller = product.sellerId
          ? await ctx.db.get(product.sellerId)
          : null;
        return { ...product, seller };
      }),
    );
  },
});

export const getBySellerId = query({
  args: { sellerId: v.id("sellers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_sellerId", (q) => q.eq("sellerId", args.sellerId))
      .collect();
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    // Optionally check authorization
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.id("productCategories")),
    storageIds: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const { id, storageIds, ...rest } = args;
    const images: string[] = [];

    if (storageIds) {
      for (const storageId of storageIds) {
        const url = await ctx.storage.getUrl(storageId);
        if (url) {
          images.push(url);
        }
      }
    }

    // If storageIds is provided, we update images field too
    const updateFields = {
      ...rest,
      ...(storageIds ? { storageIds, images } : {}),
    };

    await ctx.db.patch(id, updateFields);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    category: v.id("productCategories"),
    sellerId: v.optional(v.id("sellers")),
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
