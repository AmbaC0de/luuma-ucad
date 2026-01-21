import { DataModel } from "@convex/_generated/dataModel";

export type NewsItem = DataModel["news"]["document"];

export type NewsScopeType = NewsItem["scope"];

export const getScopeLabel = (scope: NewsScopeType): string => {
  switch (scope) {
    case "UNIVERSITY":
      return "Université";
    case "FACULTY":
      return "Faculté";
    case "DEPARTMENT":
      return "Département";
    default:
      return "Inconnu";
  }
};

export const getScopeColor = (scope: NewsScopeType, defaultColor: string) => {
  switch (scope) {
    case "UNIVERSITY":
      return "#dc2626";
    case "FACULTY":
      return "#2563eb";
    case "DEPARTMENT":
      return "#16a34a";
    default:
      return defaultColor;
  }
};

export type StatusType = NewsItem["status"];

export const getStatusLabel = (status: StatusType): string => {
  switch (status) {
    case "DRAFT":
      return "Brouillon";
    case "PUBLISHED":
      return "Publié";
    case "ARCHIVED":
      return "Archivé";
    default:
      return status;
  }
};

export const getStatusColor = (status: StatusType) => {
  switch (status) {
    case "DRAFT":
      return "#64748b"; // Slate 500
    case "PUBLISHED":
      return "#16a34a"; // Green 600
    case "ARCHIVED":
      return "#dc2626"; // Red 600
    default:
      return "#64748b";
  }
};
