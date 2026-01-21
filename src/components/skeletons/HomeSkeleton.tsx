import React from "react";
import { StyleSheet, View } from "react-native";
import { SkeletonItem } from "./SkeletonItem";
import { useTheme } from "@react-navigation/native";

const NewsItemSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <SkeletonItem width={80} height={24} borderRadius={6} />
        <SkeletonItem width={60} height={14} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.textContainer}>
          <SkeletonItem width="100%" height={20} style={{ marginBottom: 6 }} />
          <SkeletonItem width="40%" height={20} style={{ marginBottom: 12 }} />

          <SkeletonItem width="90%" height={14} style={{ marginBottom: 4 }} />
          <SkeletonItem width="95%" height={14} style={{ marginBottom: 4 }} />
          <SkeletonItem width="85%" height={14} />
        </View>
      </View>
    </View>
  );
};

export const HomeSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Banner Skeleton */}
      <View style={{ marginBottom: 16 }}>
        <SkeletonItem width={150} height={34} style={{ marginBottom: 16 }} />
        <View
          style={[
            styles.bannerContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <SkeletonItem width="100%" height={150} borderRadius={0} />
          <View style={{ padding: 12 }}>
            <SkeletonItem width="80%" height={24} style={{ marginBottom: 8 }} />
            <SkeletonItem
              width="100%"
              height={16}
              style={{ marginBottom: 4 }}
            />
            <SkeletonItem width="90%" height={16} />
          </View>
        </View>
      </View>

      {/* Feed Title */}
      <SkeletonItem width={120} height={24} style={{ marginBottom: 12 }} />

      {/* List items */}
      <NewsItemSkeleton />
      <NewsItemSkeleton />
      <NewsItemSkeleton />
      <NewsItemSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  bannerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
});
