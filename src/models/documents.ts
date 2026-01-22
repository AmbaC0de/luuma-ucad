import { DataModel } from "@convex/_generated/dataModel";

export type DocumentItem = DataModel["documents"]["document"];

export type DocumentTypeDisplay = "Cours" | "TD" | "TP" | "Examen";

// Type pour les documents téléchargés en local
// Hérite automatiquement de toutes les propriétés de DocumentItem
export type LocalDocument = Omit<DocumentItem, "_id" | "_creationTime"> & {
  id: string;
  localUri: string;
  date: number; // timestamp de téléchargement
  ue: string; // alias pour description (compatibilité UI)
};

// Type pour l'affichage dans l'UI
// Transforme uniquement les propriétés qui nécessitent un formatage
export type DocumentDisplay = Omit<
  DocumentItem,
  "_id" | "_creationTime" | "type" | "size" | "description"
> & {
  id: string;
  type: DocumentTypeDisplay;
  ue: string;
  size: string; // formaté
  date: string; // formaté
  isDownloaded: boolean;
  fileUrl: string;
  rawSize?: number | null;
  rawDate: number;
};

export type DocumentScopeType = DocumentItem["scope"];

export type DocumentType = DocumentItem["type"];

export const getIconColor = (type: string, defaultColor: string) => {
  switch (type) {
    case "Cours":
      return "#2563eb"; // Blue
    case "TD":
      return "#16a34a"; // Green
    case "TP":
      return "#d97706"; // Amber
    case "Examen":
      return "#dc2626"; // Red
    default:
      return defaultColor;
  }
};

export const getDocumentTypeLabel = (
  type: DocumentType,
): DocumentTypeDisplay => {
  switch (type) {
    case "COURSE":
      return "Cours";
    case "TD":
      return "TD";
    case "TP":
      return "TP";
    case "EXAM":
      return "Examen";
    default:
      return "Cours";
  }
};
