import { Ionicons } from "@expo/vector-icons";
import { useTheme, useNavigation } from "@react-navigation/native";
import IconButton from "@src/components/ui/IconButton";
import React, { useMemo, useState } from "react";
import { File, Directory, Paths } from "expo-file-system";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useAppQuery } from "@src/hooks/useAppQuery";
import { api } from "@convex/_generated/api";
import { getDocumentTypeLabel, getIconColor } from "@src/models/documents";
import { formatBytes, formatDate } from "@src/utils/format";
import { DocumentsSkeleton } from "@src/components/skeletons/DocumentsSkeleton";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import {
  addDownloadedDocument,
  removeDownloadedDocument,
  selectDownloadedDocuments,
} from "@src/store/slices/documents";

interface Document {
  id: string;
  title: string;
  type: "Cours" | "TD" | "TP" | "Examen";
  ue: string;
  size: string;
  date: string;
  isDownloaded: boolean;
  fileUrl: string;
  rawSize?: number | null;
  rawDate: number;
}

const FILTERS = ["Tout", "Cours", "TD", "TP", "Examen"] as const;

export function Documents() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const downloadedDocs = useAppSelector(selectDownloadedDocuments);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tout");
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const { data: documentsQuery, isFetching: loadingDocuments } = useAppQuery(
    api.documents.get,
  );

  const handleDownload = async (item: Document) => {
    // Si déjà téléchargé, suppression
    if (item.isDownloaded) {
      try {
        if (item.fileUrl) {
          const file = new File(item.fileUrl);
          if (file.exists) {
            file.delete();
          }
        }
        dispatch(removeDownloadedDocument(item.id));
      } catch (e) {
        console.error("Error deleting file:", e);
        dispatch(removeDownloadedDocument(item.id));
      }
      return;
    }

    // Nouveau téléchargement
    const destinationDir = new Directory(Paths.document, "pdfDocuments");
    try {
      setDownloadingIds((prev) => new Set(prev).add(item.id));
      if (!destinationDir.exists) {
        destinationDir.create();
      }

      const outputDirInfo = await File.downloadFileAsync(
        item.fileUrl,
        destinationDir,
      );

      if (outputDirInfo.exists) {
        dispatch(
          addDownloadedDocument({
            id: item.id,
            title: item.title,
            type: item.type,
            ue: item.ue,
            size: item.rawSize,
            date: item.rawDate,
            remoteUrl: item.fileUrl,
            localUri: outputDirInfo.uri,
          }),
        );
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors du téléchargement");
    } finally {
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const documents: Document[] = useMemo(() => {
    const combinedDocs = new Map<string, Document>();

    // 1. Documents téléchargés (Offline)
    Object.values(downloadedDocs).forEach((doc) => {
      combinedDocs.set(doc.id, {
        id: doc.id,
        title: doc.title,
        type: doc.type as any,
        ue: doc.ue,
        size: formatBytes(doc.size),
        date: formatDate(doc.date),
        isDownloaded: true,
        fileUrl: doc.localUri,
        rawSize: doc.size,
        rawDate: doc.date,
      });
    });

    // 2. Documents distants (Online) - Met à jour ou ajoute
    if (documentsQuery) {
      documentsQuery.forEach((doc) => {
        const isDownloaded = !!downloadedDocs[doc._id];
        const existingDoc = combinedDocs.get(doc._id);

        combinedDocs.set(doc._id, {
          id: doc._id,
          title: doc.title,
          type: getDocumentTypeLabel(doc.type),
          ue: doc.description || "N/A",
          size: formatBytes(doc.size),
          date: formatDate(doc._creationTime),
          isDownloaded: isDownloaded,
          fileUrl:
            isDownloaded && existingDoc ? existingDoc.fileUrl : doc.fileUrl,
          rawSize: doc.size,
          rawDate: doc._creationTime,
        });
      });
    }

    return Array.from(combinedDocs.values()).sort(
      (a, b) => b.rawDate - a.rawDate,
    );
  }, [documentsQuery, downloadedDocs]);

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter = activeFilter === "Tout" || doc.type === activeFilter;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.ue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loadingDocuments) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <DocumentsSkeleton />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Document }) => (
    <RectButton
      style={[
        styles.docCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => {
        if (item.fileUrl) {
          navigation.navigate("PDFViewer", {
            url: item.fileUrl,
            title: item.title,
          });
        }
      }}
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

      <IconButton
        onPress={() => {
          if (!item.isDownloaded) {
            handleDownload(item);
          }
        }}
      >
        {downloadingIds.has(item.id) ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons
            name={
              item.isDownloaded
                ? "checkmark-circle-outline"
                : "cloud-download-outline"
            }
            size={24}
            color={item.isDownloaded ? colors.primary : colors.textSecondary}
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
