import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./store";
import RootNavigation from "./navigation/RootNavigation";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Platform } from "react-native";
import secureStorage from "./storage-driver copy/secureStoreDriver";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
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
