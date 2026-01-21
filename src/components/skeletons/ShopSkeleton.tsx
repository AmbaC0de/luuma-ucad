import React from "react";
import { StyleSheet, View } from "react-native";
import { SkeletonItem } from "./SkeletonItem";
import { useTheme } from "@react-navigation/native";

const ProductItemSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.productCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <SkeletonItem width="100%" height={140} borderRadius={0} />
      <View style={styles.productContent}>
        <SkeletonItem width="80%" height={14} style={{ marginBottom: 4 }} />
        <SkeletonItem width="60%" height={14} style={{ marginBottom: 12 }} />

        <SkeletonItem width="40%" height={16} />
      </View>
    </View>
  );
};

export const ShopSkeleton = () => {
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
          <SkeletonItem width="40%" height={16} />
        </View>

        <View style={styles.categoriesList}>
          <SkeletonItem
            width={60}
            height={32}
            borderRadius={20}
            style={{ marginRight: 8 }}
          />
          <SkeletonItem
            width={70}
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
          <SkeletonItem width={80} height={32} borderRadius={20} />
        </View>
      </View>

      {/* Grid items */}
      <View style={styles.productList}>
        <View style={styles.columnWrapper}>
          <ProductItemSkeleton />
          <ProductItemSkeleton />
        </View>
        <View style={styles.columnWrapper}>
          <ProductItemSkeleton />
          <ProductItemSkeleton />
        </View>
        <View style={styles.columnWrapper}>
          <ProductItemSkeleton />
          <ProductItemSkeleton />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  categoriesList: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  productList: {
    padding: 16,
    paddingTop: 8,
  },
  columnWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  productContent: {
    padding: 12,
  },
});
