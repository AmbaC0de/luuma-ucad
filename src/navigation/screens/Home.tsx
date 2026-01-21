import { useNavigation, useTheme } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { ImageBackground } from "expo-image";
import { useAppQuery } from "@src/hooks/useAppQuery";
import { api } from "@convex/_generated/api";
import { getScopeColor, getScopeLabel, NewsItem } from "@src/models/news";
import { HomeSkeleton } from "@src/components/skeletons/HomeSkeleton";

export function Home() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { data: news, isFetching: loadingNews } = useAppQuery(
    api.news.listNews,
  );
  const { data: sponsors } = useAppQuery(api.sponsors.getActive);
  const activeSponsor = sponsors && sponsors.length > 0 ? sponsors[0] : null;

  if (loadingNews) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <HomeSkeleton />
      </View>
    );
  }

  const renderSponsoredBanner = () => {
    if (!activeSponsor) return null;

    return (
      <>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          À la une
        </Text>
        <View
          style={[
            styles.bannerContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <ImageBackground
            source={{ uri: activeSponsor.imageUrl }}
            style={styles.bannerImage}
            contentFit="cover"
          >
            <View style={styles.bannerHeader}>
              <Text
                style={[styles.sponsoredLabel, { color: colors.textSecondary }]}
              >
                SPONSORISÉ
              </Text>
              <Text style={[styles.sponsorName, { color: colors.primary }]}>
                {activeSponsor.sponsor}
              </Text>
            </View>
          </ImageBackground>

          <View style={styles.bannerContent}>
            <Text style={[styles.bannerTitle, { color: colors.text }]}>
              {activeSponsor.title}
            </Text>
            <Text style={[styles.bannerText, { color: colors.text }]}>
              {activeSponsor.content}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <RectButton
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => navigation.navigate("NewsDetail", { ...item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badgesRow}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor:
                  getScopeColor(item.scope, colors.primary) + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: getScopeColor(item.scope, colors.primary) },
              ]}
            >
              {getScopeLabel(item.scope)}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text
            style={[
              styles.dateText,
              { color: colors.textSecondary, marginRight: 8 },
            ]}
          >
            {new Date(item.publishedAt).toLocaleDateString()}
          </Text>
        </View>
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
            {item.overview}
          </Text>
        </View>
        {item.isPinned && (
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
        data={news || []}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
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
    // marginTop: 24,
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
    backgroundColor: "rgba(0,0,0,0.3)",
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
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
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
