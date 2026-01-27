import { ProductWithSeller } from "@convex/products";
import { Ionicons } from "@expo/vector-icons";
import {
  StaticScreenProps,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import Button from "@src/components/ui/Button";
import IconButton from "@src/components/ui/IconButton";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Seller = {
  _id: string;
  fullName: string;
  phoneNumber: string;
  image?: string;
};

type Props = StaticScreenProps<
  Omit<ProductWithSeller, "category" | "_id"> & {
    id: string;
    category: string;
    rating: number;
    image: string;
  }
>;

export function ProductDetail({ route }: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { name, price, category, image, rating, description, seller } =
    route.params;
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback to multiple internal images for demo if only 1 is provided
  const images = route.params.images || [image, image, image];

  const handleBuy = async () => {
    if (!seller?.phoneNumber) {
      Alert.alert("Info", "Aucun contact vendeur disponible pour ce produit.");
      return;
    }
    const phoneNumber = seller.phoneNumber.replace(/\s/g, "");
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(`tel:${phoneNumber}`);
      }
    } catch (err) {
      console.error("An error occurred", err);
      // Fallback to phone call if checking support fails
      await Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const index = Math.round(x / width);
              setActiveIndex(index);
            }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={[styles.image, { width }]}
                resizeMode="cover"
              />
            )}
          />
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: index === activeIndex ? 16 : 8,
                    backgroundColor:
                      index === activeIndex
                        ? colors.primary
                        : colors.textSecondary,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View
          style={[
            styles.contentContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={styles.headerRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Text style={[styles.categoryText, { color: colors.primary }]}>
                {category}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {rating}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            {price} FCFA
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {description}
          </Text>
        </View>
      </ScrollView>

      <IconButton style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </IconButton>

      <View
        style={[
          styles.footer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Button style={{ width: "100%" }} onPress={handleBuy}>
          <Ionicons
            name="logo-whatsapp"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.addToCartText}>Contacter le vendeur</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: "100%",
    height: 350,
  },
  image: {
    height: "100%", // width is set in renderItem
  },
  pagination: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 50,
  },
  contentContainer: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontWeight: "700",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    gap: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 20,
    textAlign: "center",
  },
  addToCartButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
