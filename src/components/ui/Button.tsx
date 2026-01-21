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
          color={variant === "contained" ? colors.white : colors.primary}
          style={{ marginRight: 8 }}
        />
      )}
      {typeof children === "string" ? (
        <Text
          style={[
            styles.text,
            textStyle,
            { color: variant === "contained" ? colors.white : colors.primary },
          ]}
        >
          {children}
        </Text>
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
  },
  text: {
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
  },
});

export default Button;
