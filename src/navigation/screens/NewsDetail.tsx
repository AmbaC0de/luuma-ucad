import { useTheme, StaticScreenProps } from "@react-navigation/native";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCategoryColor } from "@src/utils/overall";

type Props = StaticScreenProps<{
  id: string;
  title: string;
  category: "Université" | "Faculté" | "Département" | "Club";
  date: string;
  description: string;
  image?: string;
}>;

export function NewsDetail({ route }: Props) {
  const { colors } = useTheme();
  const { title, category, date, description, image } = route.params;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
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
                  getCategoryColor(category, colors.primary) + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getCategoryColor(category, colors.primary) },
              ]}
            >
              {category}
            </Text>
          </View>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {date}
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.description, { color: colors.text }]}>
          {description}
          {"\n\n"}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
          {"\n\n"}
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde
          omnis iste natus error sit voluptatem accusantium doloremque
          laudantium.
        </Text>
      </View>
    </ScrollView>
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
