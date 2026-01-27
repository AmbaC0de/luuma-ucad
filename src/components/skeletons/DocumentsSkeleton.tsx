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
        <SkeletonItem width="70%" height={12} style={{ marginBottom: 8 }} />
        <SkeletonItem width="40%" height={8} style={{ marginBottom: 6 }} />
        <SkeletonItem width="30%" height={8} />
      </View>

      <SkeletonItem width={26} height={26} borderRadius={13} />
    </View>
  );
};

export const DocumentsSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* List items */}
      <View style={styles.listContent}>
        {Array.from({ length: 3 }).map((_, index) => (
          <DocumentItemSkeleton key={index} />
        ))}
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
    paddingHorizontal: 12,
    paddingVertical: 20,
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
