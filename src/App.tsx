import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./store";
import RootNavigation from "./navigation/RootNavigation";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Platform } from "react-native";
import secureStorage from "./storage-driver/secureStoreDriver";
import { CONVEX_DEPLOY_URL, CONVEX_DEV_URL } from "./config/env";

const convexDeploymentUrl =
  process.env.NODE_ENV === "development" ? CONVEX_DEV_URL! : CONVEX_DEPLOY_URL!;

const convex = new ConvexReactClient(convexDeploymentUrl, {
  unsavedChangesWarning: false,
});

export function App() {
  return (
    <ConvexAuthProvider
      client={convex}
      storage={
        Platform.OS === "android" || Platform.OS === "ios"
          ? secureStorage
          : undefined
      }
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <RootNavigation />
        </Provider>
      </GestureHandlerRootView>
    </ConvexAuthProvider>
  );
}
