import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { PushNotifications } from "@convex-dev/expo-push-notifications";
import { components } from "./_generated/api";

const pushNotifications = new PushNotifications(components.pushNotifications);

export const postNews = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    overview: v.string(),
    facultyId: v.optional(v.id("faculties")),
    departmentId: v.optional(v.id("departments")),
    storageId: v.optional(v.id("_storage")),
    scope: v.union(
      v.literal("UNIVERSITY"),
      v.literal("FACULTY"),
      v.literal("DEPARTMENT"),
    ),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new Error("Unauthorized");
    }
    // const user = await ctx.db.query("users").take(userIdentity._id);
    const now = Date.now();
    const news = {
      title: args.title,
      overview: args.overview,
      content: args.content,
      scope: args.scope,
      facultyId: args.facultyId,
      departmentId: args.departmentId,
      isPinned: false,
      status: "PUBLISHED" as const,
      storageId: args.storageId,
      imageUrl: args.storageId
        ? await ctx.storage.getUrl(args.storageId)
        : undefined,
      publishedAt: now,
      // createdBy: userIdentity._id,
      createdAt: now,
    };
    const newsId = await ctx.db.insert("news", news);

    let targetUsers: Doc<"users">[] = [];

    if (args.scope === "DEPARTMENT" && args.departmentId) {
      targetUsers = await ctx.db
        .query("users")
        .withIndex("by_departmentId", (q) =>
          q.eq("departmentId", args.departmentId!),
        )
        .collect();
    } else if (args.scope === "FACULTY" && args.facultyId) {
      targetUsers = await ctx.db
        .query("users")
        .withIndex("by_facultyId", (q) => q.eq("facultyId", args.facultyId!))
        .collect();
    } else if (args.scope === "UNIVERSITY") {
      targetUsers = await ctx.db.query("users").collect();
    }

    await Promise.all(
      targetUsers.map(async (user) => {
        if (user._id === userIdentity.subject) return;

        const userStatus = await pushNotifications.getStatusForUser(ctx, {
          userId: user._id,
        });

        if (!userStatus.hasToken) return;

        await pushNotifications.sendPushNotification(ctx, {
          userId: user._id,
          notification: {
            title: args.title,
            body: args.overview,
            data: { newsId: newsId },
          },
        });
      }),
    );
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("news"),
    status: v.union(
      v.literal("DRAFT"),
      v.literal("PUBLISHED"),
      v.literal("ARCHIVED"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const deleteNews = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    const news = await ctx.db.get(args.id);
    if (news && news.storageId) {
      await ctx.storage.delete(news.storageId);
    }
    await ctx.db.delete(args.id);
  },
});

export const listNews = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not signed in");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    return await ctx.db
      .query("news")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "PUBLISHED"),
          q.eq(q.field("scope"), "UNIVERSITY"),
          q.eq(q.field("facultyId"), user.facultyId),
          q.eq(q.field("departmentId"), user.departmentId),
          q.eq(q.field("instituteId"), user.instituteId),
        ),
      )
      .order("desc")
      .take(50);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
