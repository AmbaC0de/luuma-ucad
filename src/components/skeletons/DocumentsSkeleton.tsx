import React from "react";
import { StyleSheet, View } from "react-native";
import { SkeletonItem } from "./SkeletonItem";
import { useTheme } from "@react-navigation/native";

const DocumentItemSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.docCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.iconContainer}>
        <SkeletonItem width={28} height={28} />
      </View>

      <View style={styles.docInfo}>
        <SkeletonItem width="70%" height={16} style={{ marginBottom: 8 }} />
        <View style={styles.metaRow}>
          <SkeletonItem width="40%" height={12} />
          <SkeletonItem width="30%" height={12} />
        </View>
      </View>

      <SkeletonItem width={24} height={24} borderRadius={12} />
    </View>
  );
};

export const DocumentsSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <SkeletonItem width={20} height={20} style={{ marginRight: 8 }} />
          <SkeletonItem width="60%" height={16} />
        </View>

        <View style={styles.filterList}>
          <SkeletonItem
            width={60}
            height={32}
            borderRadius={20}
            style={{ marginRight: 8 }}
          />
          <SkeletonItem
            width={80}
            height={32}
            borderRadius={20}
            style={{ marginRight: 8 }}
          />
          <SkeletonItem
            width={50}
            height={32}
            borderRadius={20}
            style={{ marginRight: 8 }}
          />
          <SkeletonItem width={70} height={32} borderRadius={20} />
        </View>
      </View>

      {/* List items */}
      <View style={styles.listContent}>
        <DocumentItemSkeleton />
        <DocumentItemSkeleton />
        <DocumentItemSkeleton />
        <DocumentItemSkeleton />
        <DocumentItemSkeleton />
        <DocumentItemSkeleton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterList: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  docCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "rgba(150, 150, 150, 0.1)",
  },
  docInfo: {
    flex: 1,
    marginRight: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingRight: 16,
  },
});
