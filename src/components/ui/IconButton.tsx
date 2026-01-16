import { useTheme } from "@react-navigation/native";
import React, { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
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
      <View style={styles.content}>{children}</View>
    </BorderlessButton>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 8,
    borderRadius: 24,
  },
});

export default IconButton;
