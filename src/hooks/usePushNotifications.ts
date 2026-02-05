import { useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAppDispatch } from "../store/hooks";
import { addNotification } from "../store/slices/notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(
    undefined,
  );

  const dispatch = useAppDispatch();
  const { isAuthenticated } = useConvexAuth();
  const recordPushToken = useMutation(api.push.recordPushToken);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      registerForPushNotificationsAsync()
        .then((token) => {
          setExpoPushToken(token);
          console.log("Registered for push notifications with token:", token);
        })
        .catch((error: any) => setExpoPushToken(`${error}`));
    }, 10000);

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        // Map Expo Notification to our NotificationItem
        const { date, request } = notification;
        const { content, identifier } = request;

        dispatch(
          addNotification({
            id: identifier,
            title: content.title || "Notification",
            message: content.body || "",
            date: date,
            type: (content.data?.type as any) || "info",
            read: false,
            data: content.data,
          }),
        );
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      clearTimeout(timeoutId);
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && expoPushToken) {
      recordPushToken({ token: expoPushToken }).catch((err) =>
        console.log("Error recording push token:", err),
      );
    }
  }, [isAuthenticated, expoPushToken]);

  return {
    expoPushToken,
  };
}

// Ensure the token is sent when the token changes AND the user is likely authenticated.
// A better approach is to have a component that calls `usePushNotifications` and listens to auth state.

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // WAS: token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig?.extra?.eas?.projectId })).data;
    // But often just getExpoPushTokenAsync() works if setup correctly in app.json
    try {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })
      ).data;

      // console.log("Push notification token:", token);
    } catch (e) {
      console.error("Error getting token", e);
    }
  } else {
    // alert('Must use physical device for Push Notifications');
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}
