import React from "react";
import { View, ViewStyle } from "react-native";
import { SkeletonItem } from "./SkeletonItem";

interface ContentSkeletonProps {
  style?: ViewStyle;
}

export const ContentSkeleton = ({ style }: ContentSkeletonProps) => {
  return (
    <View style={[{ paddingVertical: 10 }, style]}>
      {/* Simulate paragraphs */}
      <SkeletonItem style={{ marginBottom: 10 }} />
      <SkeletonItem width="90%" style={{ marginBottom: 10 }} />
      <SkeletonItem width="95%" style={{ marginBottom: 10 }} />
      <SkeletonItem width="80%" style={{ marginBottom: 24 }} />

      <SkeletonItem width="98%" style={{ marginBottom: 10 }} />
      <SkeletonItem width="85%" style={{ marginBottom: 10 }} />
      <SkeletonItem width="92%" style={{ marginBottom: 10 }} />
    </View>
  );
};
