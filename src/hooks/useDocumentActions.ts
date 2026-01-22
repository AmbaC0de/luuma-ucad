import { useState } from "react";
import { File, Directory, Paths } from "expo-file-system";
import { useAppDispatch } from "@src/store/hooks";
import {
  addDownloadedDocument,
  removeDownloadedDocument,
} from "@src/store/slices/documents";
import { DocumentDisplay, DocumentItem } from "@src/models/documents";

export function useDocumentActions(documentsQuery?: DocumentItem[]) {
  const dispatch = useAppDispatch();
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const deleteDocument = async (item: DocumentDisplay) => {
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
      // Force remove from state
      dispatch(removeDownloadedDocument(item.id));
    }
  };

  const downloadDocument = async (item: DocumentDisplay) => {
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

  const handleAction = async (item: DocumentDisplay) => {
    if (item.isDownloaded) {
      await deleteDocument(item);
    } else {
      await downloadDocument(item);
    }
  };

  return {
    handleAction,
    deleteDocument,
    isDownloading: (id: string) => downloadingIds.has(id),
  };
}
