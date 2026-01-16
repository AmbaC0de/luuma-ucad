import { useTheme } from "@react-navigation/native";
import React, { PropsWithChildren } from "react";
import { Text as RNText, TextStyle, StyleProp } from "react-native";

type TextProps = PropsWithChildren<{ style?: StyleProp<TextStyle> }>;
const Text = ({ children, style }: TextProps) => {
  const { colors } = useTheme();
  return <RNText style={[{ color: colors.text }, style]}>{children}</RNText>;
};

export default Text;
