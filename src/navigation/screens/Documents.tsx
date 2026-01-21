import { Ionicons } from "@expo/vector-icons";
import { useTheme, useNavigation } from "@react-navigation/native";
import IconButton from "@src/components/ui/IconButton";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Linking,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useAppQuery } from "@src/hooks/useAppQuery";
import { api } from "@convex/_generated/api";
import { getDocumentTypeLabel, getIconColor } from "@src/models/documents";
import { formatBytes, formatDate } from "@src/utils/format";

interface Document {
  id: string;
  title: string;
  type: "Cours" | "TD" | "TP" | "Examen";
  ue: string;
  size: string;
  date: string;
  isDownloaded: boolean;
  fileUrl: string;
}

const FILTERS = ["Tout", "Cours", "TD", "TP", "Examen"] as const;

export function Documents() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tout");

  const { data: documentsQuery, isFetching } = useAppQuery(api.documents.get);

  const documents = (documentsQuery || []).map((doc) => ({
    id: doc._id,
    title: doc.title,
    type: getDocumentTypeLabel(doc.type),
    ue: doc.description || "N/A",
    size: formatBytes(doc.size),
    date: formatDate(doc._creationTime),
    isDownloaded: false,
    fileUrl: doc.fileUrl,
  }));

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter = activeFilter === "Tout" || doc.type === activeFilter;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.ue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderItem = ({ item }: { item: Document }) => (
    <RectButton
      style={[
        styles.docCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => item.fileUrl && Linking.openURL(item.fileUrl)}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getIconColor(item.type, colors.text) + "20" },
        ]}
      >
        <Ionicons
          name="document-text"
          size={28}
          color={getIconColor(item.type, colors.text)}
        />
      </View>

      <View style={styles.docInfo}>
        <Text
          style={[styles.docTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.docMeta, { color: colors.textSecondary }]}>
            {item.ue} • {item.type}
          </Text>
          <Text style={[styles.docMeta, { color: colors.textSecondary }]}>
            {item.size} • {item.date}
          </Text>
        </View>
      </View>

      <IconButton>
        {item.isDownloaded ? (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        ) : (
          <Ionicons
            name="cloud-download-outline"
            size={24}
            color={colors.textSecondary}
          />
        )}
      </IconButton>
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
            placeholder="Rechercher un cours, une UE..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <RectButton
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    activeFilter === item ? colors.primary : colors.card,
                  borderColor:
                    activeFilter === item ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setActiveFilter(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: activeFilter === item ? "#fff" : colors.text },
                ]}
              >
                {item}
              </Text>
            </RectButton>
          )}
        />
      </View>

      <FlatList
        data={filteredDocs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="library-outline"
              size={64}
              color={colors.textSecondary}
              style={{ opacity: 0.5, marginBottom: 16 }}
            />
            <Text style={{ color: colors.textSecondary }}>
              Aucun document trouvé
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
    paddingTop: 16,
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
  filterList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontWeight: "600",
    fontSize: 14,
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
  },
  docInfo: {
    flex: 1,
    marginRight: 8,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  docMeta: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
});
