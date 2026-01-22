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
import {
  DocumentItem,
  getDocumentTypeLabel,
  getIconColor,
  LocalDocument,
} from "@src/models/documents";
import { formatBytes, formatDate } from "@src/utils/format";
import { DocumentsSkeleton } from "@src/components/skeletons/DocumentsSkeleton";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import {
  addDownloadedDocument,
  removeDownloadedDocument,
  selectDownloadedDocuments,
} from "@src/store/slices/documents";
import { DocumentCard } from "@src/components/DocumentCard";
import { DocumentDisplay } from "@src/models/documents";

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

  const handleDownload = async (item: DocumentDisplay) => {
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
        // On récupère le document original de la BD pour avoir toutes les propriétés
        const originalDoc = documentsQuery?.find((d) => d._id === item.id);
        if (originalDoc) {
          const { _id, _creationTime, ...docFields } = originalDoc;
          dispatch(
            addDownloadedDocument({
              ...docFields,
              id: item.id,
              localUri: outputDirInfo.uri,
              date: Date.now(),
              ue: item.ue,
            }),
          );
        }
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

  const documents: DocumentDisplay[] = useMemo(() => {
    const combinedDocs = new Map<string, DocumentDisplay>();

    // 1. Documents téléchargés (Offline)
    Object.values(downloadedDocs).forEach((doc) => {
      const {
        type,
        size: docSize,
        date: docDate,
        ue,
        localUri,
        ...docFields
      } = doc;
      combinedDocs.set(doc.id, {
        ...docFields,
        id: doc.id,
        type: getDocumentTypeLabel(type),
        ue,
        size: formatBytes(docSize),
        date: formatDate(docDate),
        isDownloaded: true,
        fileUrl: localUri,
        rawSize: docSize,
        rawDate: docDate,
      });
    });

    // 2. Documents distants (Online) - Met à jour ou ajoute
    if (documentsQuery) {
      documentsQuery.forEach((doc) => {
        const isDownloaded = !!downloadedDocs[doc._id];
        const existingDoc = combinedDocs.get(doc._id);
        const {
          _id,
          _creationTime,
          type,
          description,
          size: docSize,
          ...docFields
        } = doc;

        combinedDocs.set(doc._id, {
          ...docFields,
          id: doc._id,
          type: getDocumentTypeLabel(type),
          ue: description || "N/A",
          size: formatBytes(docSize),
          date: formatDate(_creationTime),
          isDownloaded: isDownloaded,
          fileUrl:
            isDownloaded && existingDoc ? existingDoc.fileUrl : doc.fileUrl,
          rawSize: docSize,
          rawDate: _creationTime,
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

  const renderItem = ({ item }: { item: DocumentDisplay }) => (
    <DocumentCard
      document={item}
      isDownloading={downloadingIds.has(item.id)}
      onPress={() => {
        if (item.fileUrl) {
          navigation.navigate("PDFViewer", {
            url: item.fileUrl,
            title: item.title,
          });
        }
      }}
      onDownload={() => handleDownload(item)}
    />
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
