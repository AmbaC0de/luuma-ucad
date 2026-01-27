import { useMemo } from "react";
import { useAppQuery } from "@src/hooks/useAppQuery";
import { api } from "@convex/_generated/api";
import { useAppSelector } from "@src/store/hooks";
import { selectDownloadedDocuments } from "@src/store/slices/documents";
import { formatBytes, formatDate } from "@src/utils/format";
import { getDocumentTypeLabel, DocumentDisplay } from "@src/models/documents";
import { shallowEqual } from "react-redux";

export function useDocumentsData() {
  const { data: documentsQuery = [], isFetching: isQueryLoading } = useAppQuery(
    api.documents.get,
  );
  const downloadedDocs = useAppSelector(
    selectDownloadedDocuments,
    shallowEqual,
  );

  const { documents, downloadedDocumentsOnly } = useMemo(() => {
    const combinedDocs = new Map<string, DocumentDisplay>();

    // 1. Ajouter d'abord les documents téléchargés (offline)
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

    // 2. Fusionner/ajouter les documents distants (online)
    documentsQuery.forEach((doc) => {
      const isDownloaded = !!downloadedDocs[doc._id];
      const existingDoc = combinedDocs.get(doc._id);
      const {
        _id,
        _creationTime,
        type,
        size: docSize,
        description,
        ...docFields
      } = doc;

      combinedDocs.set(doc._id, {
        ...docFields,
        id: doc._id,
        type: getDocumentTypeLabel(type),
        ue: description || "N/A",
        size: formatBytes(docSize),
        date: formatDate(_creationTime),
        isDownloaded,
        // Préserver l'URL locale si le document est déjà téléchargé
        fileUrl: existingDoc?.fileUrl ?? doc.fileUrl,
        rawSize: docSize,
        rawDate: _creationTime,
      });
    });

    // 3. Trier par date décroissante
    const sortedDocs = Array.from(combinedDocs.values()).sort(
      (a, b) => b.rawDate - a.rawDate,
    );

    return {
      documents: sortedDocs,
      downloadedDocumentsOnly: sortedDocs.filter((doc) => doc.isDownloaded),
    };
  }, [documentsQuery, downloadedDocs]);

  return {
    documents,
    downloadedDocumentsOnly,
    loadingDocuments: isQueryLoading,
    documentsQuery,
  };
}
