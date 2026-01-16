import { useThemeManager } from "@src/theme/themeManager";
import React from "react";
import * as SplashScreen from "expo-splash-screen";
import { createURL } from "expo-linking";
import { ThemeProvider } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Navigation } from ".";

SplashScreen.preventAutoHideAsync();

const prefix = createURL("/");

const RootNavigation = () => {
  const { appTheme } = useThemeManager();
  return (
    <ThemeProvider value={appTheme}>
      <SafeAreaProvider>
        <Navigation
          theme={appTheme}
          linking={{
            enabled: "auto",
            prefixes: [prefix],
          }}
          onReady={() => SplashScreen.hideAsync()}
        />
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default RootNavigation;
