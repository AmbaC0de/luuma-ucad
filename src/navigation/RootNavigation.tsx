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
import { SheetProvider } from "react-native-actions-sheet";
import Sheets from "@src/components/bottom-sheets/sheets";

SplashScreen.preventAutoHideAsync();

const prefix = createURL("/");

const RootNavigation = () => {
  const { appTheme } = useThemeManager();
  const { isLoading } = useConvexAuth();

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
