import { Ionicons } from "@expo/vector-icons";
import { useTheme, useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useDocumentsData } from "@src/hooks/useDocumentsData";
import { DocumentCard } from "@src/components/DocumentCard";
import { DocumentDisplay } from "@src/models/documents";
import { useDocumentActions } from "@src/hooks/useDocumentActions";

export function MyDocuments() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { downloadedDocumentsOnly } = useDocumentsData();
  const { deleteDocument } = useDocumentActions();

  const renderItem = ({ item }: { item: DocumentDisplay }) => (
    <DocumentCard
      document={item}
      onPress={() => {
        if (item.fileUrl) {
          navigation.navigate("PDFViewer", {
            url: item.fileUrl,
            title: item.title,
          });
        }
      }}
      onDelete={() => deleteDocument(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={downloadedDocumentsOnly}
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
              Aucun document téléchargé
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
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
});
