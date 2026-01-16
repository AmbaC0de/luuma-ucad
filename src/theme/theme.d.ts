import "@react-navigation/native";

// Define the standard colors expected by React Navigation
type StandardThemeColors = {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
};

// Define your custom colors here
type CustomThemeColors = {
  error?: string;
  textSecondary?: string;
  banner?: string;
  icon?: string;
  iconContainer?: string;
  dark?: string;
  white?: string;
  placeholder?: string;
  tabBarDark?: string;
  // Add other custom colors here
};

const FontWeights = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
] as const;
type FontWeightsType = (typeof FontWeights)[number];

declare module "@react-navigation/native" {
  export interface Theme {
    dark: boolean;
    colors: StandardThemeColors & CustomThemeColors;
    fonts: {
      regular: {
        fontFamily: string;
        fontWeight: FontWeightsType;
      };
      medium: {
        fontFamily: string;
        fontWeight: FontWeightsType;
      };
      bold: {
        fontFamily: string;
        fontWeight: FontWeightsType;
      };
      heavy: {
        fontFamily: string;
        fontWeight: FontWeightsType;
      };
    };
  }

  export function useTheme(): Theme;
}
