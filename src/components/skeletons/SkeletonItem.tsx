import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle, DimensionValue, StyleProp } from "react-native";

interface SkeletonItemProps {
  width?: DimensionValue;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
}

export const SkeletonItem = ({
  width = "100%",
  height = 16,
  color,
  style,
  borderRadius = 4,
}: SkeletonItemProps) => {
  const { colors } = useTheme();
  const defaultColor = color ?? colors.textSecondary;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: defaultColor,
          opacity,
          borderRadius,
        },
        style,
      ]}
    />
  );
};
