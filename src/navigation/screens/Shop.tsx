import { Ionicons } from "@expo/vector-icons";
import { useTheme, useNavigation } from "@react-navigation/native";
import React, { useState, useMemo } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { formatPrice } from "@src/utils/format";
import { useAppQuery } from "@src/hooks/useAppQuery";
import { ShopSkeleton } from "@src/components/skeletons/ShopSkeleton";
import { ProductWithSeller } from "@convex/products";

export function Shop() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");

  const { data: products, isFetching: loadingProducts } = useAppQuery(
    api.products.get,
  );
  const { data: categories, isFetching: loadingCategories } = useAppQuery(
    api.productCategories.get,
  );

  const categoryList = useMemo(() => {
    if (!categories) return ["Tout"];
    return ["Tout", ...categories.map((c) => c.name)];
  }, [categories]);

  const getCategoryName = (categoryId: string) => {
    return categories?.find((c) => c._id === categoryId)?.name || "Inconnu";
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const categoryName = getCategoryName(product.category);
      const matchesCategory =
        selectedCategory === "Tout" || categoryName === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery, categories]);

  const renderCategoryItem = ({ item }: { item: string }) => {
    const isSelected = selectedCategory === item;
    return (
      <RectButton
        style={[
          styles.categoryChip,
          {
            backgroundColor: isSelected ? colors.primary : colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: 1,
          },
        ]}
        onPress={() => setSelectedCategory(item)}
      >
        <Text
          style={[
            styles.categoryText,
            { color: isSelected ? "#fff" : colors.text },
          ]}
        >
          {item}
        </Text>
      </RectButton>
    );
  };

  const renderProductItem = ({ item }: { item: ProductWithSeller }) => (
    <RectButton
      style={[
        styles.productCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() =>
        navigation.navigate("ProductDetail", {
          ...item,
          id: item._id,
          image: item.images?.[0] ?? "",
          category: getCategoryName(item.category),
          rating: 0, //TODO: Default rating, to be implemented
        })
      }
    >
      <Image
        source={{
          uri:
            item.images?.[0] ??
            "https://placehold.co/300x300/e9f6fc/185568/png?text=No+Image",
        }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productContent}>
        <View style={styles.productBadge}>
          <Text style={styles.productBadgeText}>
            {getCategoryName(item.category)}
          </Text>
        </View>
        <Text
          style={[styles.productName, { color: colors.text }]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <View style={styles.productFooter}>
          <Text style={[styles.productPrice, { color: colors.primary }]}>
            {formatPrice(item.price)}
          </Text>
        </View>
      </View>
    </RectButton>
  );

  if (loadingProducts || loadingCategories) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ShopSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <FlatList
          horizontal
          data={categoryList}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ color: colors.textSecondary }}>
              Aucun produit trouvé
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 8,
    zIndex: 1,
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
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontWeight: "600",
    fontSize: 14,
  },
  productList: {
    padding: 16,
    paddingTop: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#f0f0f0",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productContent: {
    padding: 12,
  },
  productBadge: {
    position: "absolute",
    top: -130,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  productBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    height: 40,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "800",
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
