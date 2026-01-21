import { DataModel } from "@convex/_generated/dataModel";
import { colors } from "react-native-keyboard-controller/lib/typescript/components/KeyboardToolbar/colors";

export type DocumentItem = DataModel["documents"]["document"];

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
): "Cours" | "TD" | "TP" | "Examen" => {
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
