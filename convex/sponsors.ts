import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    sponsor: v.string(),
    storageId: v.id("_storage"),
    durationDays: v.number(),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new Error("Unauthorized");
    }

    const { storageId, durationDays, ...rest } = args;
    const imageUrl = await ctx.storage.getUrl(storageId);

    if (!imageUrl) {
      throw new Error("Failed to get file URL from storageId");
    }

    // Calculate expiration date
    const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;

    const sponsorId = await ctx.db.insert("sponsors", {
      ...rest,
      storageId,
      imageUrl,
      expiresAt,
      status: "active",
      // createdBy: userIdentity.subject,
      createdAt: Date.now(),
    });

    return sponsorId;
  },
});

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sponsors")
      .withIndex("by_status_expiresAt", (q) =>
        q.eq("status", "active").gt("expiresAt", Date.now()),
      )
      .order("asc")
      .collect();
  },
});

export const checkExpired = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredSponsors = await ctx.db
      .query("sponsors")
      .withIndex("by_status_expiresAt", (q) =>
        q.eq("status", "active").lt("expiresAt", now),
      )
      .collect();

    for (const sponsor of expiredSponsors) {
      await ctx.db.patch(sponsor._id, { status: "archived" });
    }
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
