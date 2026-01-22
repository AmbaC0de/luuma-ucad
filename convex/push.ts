import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { PushNotifications } from "@convex-dev/expo-push-notifications";
import { components } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

const pushNotifications = new PushNotifications(components.pushNotifications);

export const recordPushToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      // For now, only authenticated users can receive notifications
      return;
    }
    await pushNotifications.recordToken(ctx, {
      userId,
      pushToken: args.token,
    });
  },
});
