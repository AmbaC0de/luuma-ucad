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
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();

const prefix = createURL("/");

const ProfileCheck = () => {
  const user = useQuery(api.users.currentUser);

  useEffect(() => {
    // Wait for user to be loaded
    if (user === undefined) return;

    // If user is logged in (user != null) and missing info
    if (user && (!user.matricule || !user.facultyId || !user.level)) {
      // Delay slightly to ensure navigation is ready or sheet provider is ready
      setTimeout(() => {
        const sheet = SheetManager.get("profile-completion-sheet");
        if (!sheet) {
          SheetManager.show("profile-completion-sheet");
        }
      }, 500);
    }
  }, [user]);

  return null;
};

const RootNavigation = () => {
  const { appTheme } = useThemeManager();
  const { isLoading, isAuthenticated } = useConvexAuth();

  console.log("is authenticated", isAuthenticated);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <ThemeProvider value={appTheme}>
      <KeyboardProvider>
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
      </KeyboardProvider>
    </ThemeProvider>
  );
};

export default RootNavigation;
