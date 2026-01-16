import React, { PropsWithChildren } from "react";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";

type ButtonProps = PropsWithChildren<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  disabled?: boolean;
  variant?: "contained" | "outlined";
}>;

const Button = ({
  children,
  onPress,
  style,
  textStyle,
  loading,
  disabled,
  variant = "contained",
}: ButtonProps) => {
  const { colors } = useTheme();

  return (
    <RectButton
      onPress={onPress}
      enabled={!disabled && !loading}
      style={[
        styles.container,
        variant === "contained" && { backgroundColor: colors.primary },
        disabled && { opacity: 0.6 },
        variant === "outlined" && {
          ...styles.outlined,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {loading && (
        <ActivityIndicator
          color={variant === "contained" ? colors.dark : colors.text}
          style={{ marginRight: 8 }}
        />
      )}
      {typeof children === "string" ? (
        <Text style={[styles.text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </RectButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  outlined: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
});

export default Button;
