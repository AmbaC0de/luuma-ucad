import { useThemeManager } from "@src/theme/themeManager";
import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { createURL } from "expo-linking";
import { ThemeProvider } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Navigation } from ".";
import { StatusBar } from "expo-status-bar";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { SignIn } from "./screens/SignIn";
import { SheetProvider, SheetManager } from "react-native-actions-sheet";
import Sheets from "@src/components/bottom-sheets/sheets";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { usePushNotifications } from "@src/hooks/usePushNotifications";

SplashScreen.preventAutoHideAsync();

const prefix = createURL("/");

const ProfileCheck = () => {
  const user = useQuery(api.users.currentUser);

  useEffect(() => {
    // Wait for user to be loaded
    if (user === undefined) return;

    // If user is logged in (user != null) and missing info
    if (user && (!user.matricule || !user.facultyId)) {
      // Delay slightly to ensure navigation is ready or sheet provider is ready
      setTimeout(() => {
        SheetManager.show("profile-completion-sheet");
      }, 500);
    }
  }, [user]);

  return null;
};

const RootNavigation = () => {
  const { appTheme } = useThemeManager();
  const { isLoading } = useConvexAuth();

  usePushNotifications();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <ThemeProvider value={appTheme}>
      <SafeAreaProvider>
        <StatusBar style={appTheme.dark ? "light" : "dark"} />
        <SheetProvider>
          <Sheets />
          <Authenticated>
            <ProfileCheck />
            <Navigation
              theme={appTheme}
              linking={{
                enabled: "auto",
                prefixes: [prefix],
              }}
            />
          </Authenticated>
          <Unauthenticated>
            <SignIn />
          </Unauthenticated>
        </SheetProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default RootNavigation;
