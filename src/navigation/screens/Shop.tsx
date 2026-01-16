import { Ionicons } from "@expo/vector-icons";
import { useTheme, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  description?: string;
}

const CATEGORIES = ["Tout", "Fournitures", "Vêtements", "Tech", "Services"];

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Cahier UCAD 200 pages",
    price: 1500,
    category: "Fournitures",
    image: "https://placehold.co/300x300/e9f6fc/185568/png?text=Cahier+UCAD",
    rating: 4.5,
    description:
      "Cahier de qualité supérieure aux couleurs de l'UCAD, idéal pour vos prises de notes. 200 pages lignées. Parfait pour les étudiants. Achetez-le dès maintenant et bénéficiez d'une remise spéciale étudiant ! Disponible en stock limité. Ne manquez pas cette opportunité d'ajouter une touche académique à votre matériel scolaire. ",
  },
  {
    id: "2",
    name: "T-shirt FST Promo 2026",
    price: 5000,
    category: "Vêtements",
    image: "https://placehold.co/300x300/e9f6fc/185568/png?text=T-Shirt+FST",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Clé USB 32Go",
    price: 3500,
    category: "Tech",
    image: "https://placehold.co/300x300/e9f6fc/185568/png?text=USB+32Go",
    rating: 4.2,
  },
  {
    id: "4",
    name: "Impression Mémoire (N&B)",
    price: 25,
    category: "Services",
    image: "https://placehold.co/300x300/e9f6fc/185568/png?text=Impression",
    rating: 5.0,
  },
  {
    id: "5",
    name: "Stylo 4 Couleurs",
    price: 500,
    category: "Fournitures",
    image: "https://placehold.co/300x300/e9f6fc/185568/png?text=Stylo",
    rating: 4.0,
  },
  {
    id: "6",
    name: "Sweatshirt UCAD",
    price: 12000,
    category: "Vêtements",
    image: "https://placehold.co/300x300/e9f6fc/185568/png?text=Sweat+UCAD",
    rating: 4.9,
  },
];

export function Shop() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tout");

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "Tout" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const renderProductItem = ({ item }: { item: Product }) => (
    <RectButton
      style={[
        styles.productCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => navigation.navigate("ProductDetail", { ...item })}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productContent}>
        <View style={styles.productBadge}>
          <Text style={styles.productBadgeText}>{item.category}</Text>
        </View>
        <Text
          style={[styles.productName, { color: colors.text }]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <View style={styles.productFooter}>
          <Text style={[styles.productPrice, { color: colors.primary }]}>
            {item.price} FCFA
          </Text>
        </View>
      </View>
    </RectButton>
  );

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
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
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
