import { useTheme, StaticScreenProps } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getScopeColor, getScopeLabel, NewsItem } from "@src/models/news";
import RichTextViewer from "@src/components/dom-components/RichTextViewer";
import { ContentSkeleton } from "@src/components/skeletons/ContentSkeleton";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = StaticScreenProps<NewsItem>;

export function NewsDetail({ route }: Props) {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const newsDetail = route.params;
  const [viewerHeight, setViewerHeight] = useState(height * 0.35);
  const [isReady, setIsReady] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {newsDetail.imageUrl ? (
          <Image
            source={{ uri: newsDetail.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <View
            style={[styles.placeholderImage, { backgroundColor: colors.card }]}
          >
            <Ionicons
              name="newspaper-outline"
              size={80}
              color={colors.primary}
              style={{ opacity: 0.5 }}
            />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    getScopeColor(newsDetail.scope, colors.primary) + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: getScopeColor(newsDetail.scope, colors.primary) },
                ]}
              >
                {getScopeLabel(newsDetail.scope)}
              </Text>
            </View>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {new Date(newsDetail.publishedAt).toLocaleDateString()}
            </Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {newsDetail.title}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>
        <View style={{ minHeight: 100 }}>
          {!isReady && <ContentSkeleton style={{ paddingHorizontal: 20 }} />}
          <View
            style={{
              height: viewerHeight,
              opacity: isReady ? 1 : 0,
              paddingHorizontal: 10,
            }}
          >
            <RichTextViewer
              content={newsDetail.content}
              onHeightChange={(h) => {
                setViewerHeight(h);
                if (!isReady) {
                  setTimeout(() => setIsReady(true), 100);
                }
              }}
              style={{
                textColor: colors.text,
                accentColor: colors.primary,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 250,
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    backgroundColor: "transparent", // Will be overlaid by the container background if we don't set it, but we want the background from container to show.
    // Actually, to make a nice card effect over image, we might want background here.
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontWeight: "700",
    fontSize: 14,
  },
  date: {
    fontSize: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    lineHeight: 34,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
  },
});
