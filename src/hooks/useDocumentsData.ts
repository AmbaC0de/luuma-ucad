import { useEffect, useState } from "react";
import { useAppQuery } from "@src/hooks/useAppQuery";
import { api } from "@convex/_generated/api";
import { useAppSelector } from "@src/store/hooks";
import { selectDownloadedDocuments } from "@src/store/slices/documents";
import { formatBytes, formatDate } from "@src/utils/format";
import { getDocumentTypeLabel, DocumentDisplay } from "@src/models/documents";

export function useDocumentsData() {
  const { data: documentsQuery, isFetching: isQueryLoading } = useAppQuery(
    api.documents.get,
  );
  const downloadedDocs = useAppSelector(selectDownloadedDocuments);

  const [documents, setDocuments] = useState<DocumentDisplay[]>([]);
  const [downloadedDocumentsOnly, setDownloadedDocumentsOnly] = useState<
    DocumentDisplay[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    setIsProcessing(true);

    const processData = async () => {
      // Simulation d'un traitement asynchrone pour ne pas bloquer le thread principal
      await new Promise((resolve) => setTimeout(resolve, 0));

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
            isDownloaded: isDownloaded,
            fileUrl:
              isDownloaded && existingDoc ? existingDoc.fileUrl : doc.fileUrl,
            rawSize: docSize,
            rawDate: _creationTime,
          });
        });
      }

      const sortedDocs = Array.from(combinedDocs.values()).sort(
        (a, b) => b.rawDate - a.rawDate,
      );

      setDocuments(sortedDocs);
      setDownloadedDocumentsOnly(sortedDocs.filter((doc) => doc.isDownloaded));
      setIsProcessing(false);
    };

    processData();
  }, [documentsQuery, downloadedDocs]);

  return {
    documents,
    downloadedDocumentsOnly,
    loadingDocuments: isQueryLoading || isProcessing,
    documentsQuery,
  };
}
