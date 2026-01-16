import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import { useAppSelector } from "@src/store/hooks";
import { selectThemeMode, ThemeMode } from "@src/store/slices/theme";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export const AppLightTheme: Theme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: "#ecb713",
    background: "#fff9eb",
    card: "#f9f3e6",
    tabBarDark: "#1c1c17",
    error: "#86070f",
    text: "#1d1c14",
    textSecondary: "#49473d",
    banner: "#030c0aff",
    iconContainer: "#384152",
    icon: "#e9f6f2",
    dark: "#000",
    white: "#fff",
    placeholder: "#3d4946b0",
  },
  fonts: {
    ...DefaultTheme.fonts,
  },
};

export const AppDarkTheme: Theme = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: "#ecb713",
    background: "#121212",
    card: "#1c1c17",
    tabBarDark: "#1c1c17",
    iconContainer: "#161d1b",
    error: "#86070f",
    text: "#e6e2da",
    textSecondary: "#c9c6be",
    banner: "#0d1513",
    icon: "#dce4e1",
    dark: "#000",
    white: "#fff",
    border: "#2b2a25",
    placeholder: "#c0c8c5b3",
  },
  fonts: {
    ...DarkTheme.fonts,
  },
};

export const useThemeManager = () => {
  const scheme = useColorScheme();
  const themeMode = useAppSelector(selectThemeMode);
  const [appTheme, setAppTheme] = useState<Theme>(
    scheme === "dark" ? AppDarkTheme : AppLightTheme
  );

  const getTheme = (value: ThemeMode) => {
    switch (value) {
      case "light":
        return AppLightTheme;
      case "dark":
        return AppDarkTheme;
      default:
        return scheme === "dark" ? AppDarkTheme : AppLightTheme;
    }
  };

  useEffect(() => {
    setAppTheme(getTheme(themeMode.value));
  }, [themeMode, scheme]);

  return { appTheme };
};
