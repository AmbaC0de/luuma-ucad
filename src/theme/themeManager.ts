import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import { useAppSelector } from "@src/store/hooks";
import { selectThemeMode, ThemeMode } from "@src/store/slices/theme";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export const AppLightTheme: Theme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: "#c0ba22",
    background: "#fcfcdb",
    card: "#f5f4e5",
    tabBarDark: "#1c1c17",
    error: "#86070f",
    text: "#1b1c13",
    textSecondary: "#46483dc1",
    banner: "#030c0aff",
    iconContainer: "#384152",
    icon: "#e9f6f2",
    dark: "#000",
    white: "#fff",
    placeholder: "#3d4946b0",
    border: "#eae9da",
  },
  fonts: {
    ...DefaultTheme.fonts,
  },
};

export const AppDarkTheme: Theme = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: "#c0ba22",
    background: "#0d0c01",
    card: "#1b1c16",
    tabBarDark: "#1c1c17",
    iconContainer: "#161d1b",
    error: "#86070f",
    text: "#e3e3d9",
    textSecondary: "#c7c7beba",
    banner: "#0d1513",
    icon: "#dce4e1",
    dark: "#000",
    white: "#fff",
    placeholder: "#c0c8c5b3",
    border: "#292b24",
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
