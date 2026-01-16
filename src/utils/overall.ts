export const getCategoryColor = (cat: string, defaultColor: string) => {
  switch (cat) {
    case "Université":
      return "#dc2626";
    case "Faculté":
      return "#2563eb";
    case "Département":
      return "#16a34a";
    default:
      return defaultColor;
  }
};
