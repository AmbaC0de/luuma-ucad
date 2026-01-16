import { useTheme } from "@react-navigation/native";
import React, { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";

type IconContainerProps = PropsWithChildren<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  rippleColor?: string;
}>;

const IconButton = ({
  children,
  onPress,
  style,
  disabled,
  rippleColor,
}: IconContainerProps) => {
  const { colors } = useTheme();
  return (
    <BorderlessButton
      onPress={onPress}
      style={[styles.container, style]}
      enabled={!disabled}
      rippleColor={rippleColor ?? colors.card}
    >
      {children}
    </BorderlessButton>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default IconButton;
