import { useNavigation, useTheme } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { getCategoryColor } from "@src/utils/overall";
import { Image } from "expo-image";

// Types
interface NewsItem {
  id: string;
  title: string;
  category: "Université" | "Faculté" | "Département" | "Club";
  date: string;
  description: string;
  image?: string;
}

interface SponsorItem {
  id: string;
  title: string;
  content: string;
  sponsor: string;
  image: string;
}

// Mock Data
const SPONSORED_DATA: SponsorItem = {
  id: "promo-1",
  title: "Partenaire Officiel",
  content: "Découvrez les forfaits étudiants Orange : 10Go à 1000 FCFA !",
  sponsor: "Orange Sénégal",
  image:
    "https://images.unsplash.com/photo-1768269378478-2c48665c0e51?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    title: "Reprise des cours en présentiel",
    category: "Université",
    date: "15 Jan 2026",
    description:
      "Le recteur informe les étudiants que les cours reprendront ce lundi 20 janvier dans tous les amphis.",
    image: "https://placehold.co/100x100/png",
  },
  {
    id: "2",
    title: "Calendrier des examens - FST",
    category: "Faculté",
    date: "14 Jan 2026",
    description:
      "Le calendrier provisoire des examens du premier semestre pour la FST est disponible au tableau d'affichage.",
  },
  {
    id: "3",
    title: "Hackathon Luuma Tech",
    category: "Club",
    date: "12 Jan 2026",
    description:
      "Le club informatique organise un hackathon de 48h. Inscriptions ouvertes au foyer.",
  },
  {
    id: "4",
    title: "Bourses : Paiement des allocations",
    category: "Université",
    date: "10 Jan 2026",
    description:
      "La direction des bourses annonce le début des paiements pour le mois de Janvier.",
  },
];

export function Home() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const renderSponsoredBanner = () => (
    <View
      style={[
        styles.bannerContainer,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.bannerHeader}>
        <Text style={[styles.sponsoredLabel, { color: colors.textSecondary }]}>
          SPONSORISÉ
        </Text>
        <Text style={[styles.sponsorName, { color: colors.primary }]}>
          {SPONSORED_DATA.sponsor}
        </Text>
      </View>
      <Image
        source={{ uri: SPONSORED_DATA.image }}
        style={styles.bannerImage}
        contentFit="cover"
      />
      <View style={styles.bannerContent}>
        <Text style={[styles.bannerTitle, { color: colors.text }]}>
          {SPONSORED_DATA.title}
        </Text>
        <Text style={[styles.bannerText, { color: colors.text }]}>
          {SPONSORED_DATA.content}
        </Text>
      </View>
    </View>
  );

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <RectButton
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => navigation.navigate("NewsDetail", { ...item })}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor:
                getCategoryColor(item.category, colors.primary) + "20",
            },
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              { color: getCategoryColor(item.category, colors.primary) },
            ]}
          >
            {item.category}
          </Text>
        </View>
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
          {item.date}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.textContainer}>
          <Text
            style={[styles.cardTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text
            style={[styles.cardDescription, { color: colors.textSecondary }]}
            numberOfLines={3}
          >
            {item.description}
          </Text>
        </View>
        {item.image && (
          <Ionicons
            name="newspaper-outline"
            size={40}
            color={colors.primary}
            style={{ opacity: 0.5 }}
          />
        )}
      </View>
    </RectButton>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={NEWS_DATA}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              À la une
            </Text>
            {renderSponsoredBanner()}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Fil d'actualité
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },
  // Advertisement Banner
  bannerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  bannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  sponsoredLabel: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  sponsorName: {
    fontSize: 10,
    fontWeight: "600",
  },
  bannerImage: {
    width: "100%",
    height: 150,
  },
  bannerContent: {
    padding: 12,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
  },
  // News Card
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    // elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
