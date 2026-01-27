import { ActionSheetRef } from "react-native-actions-sheet";
import { Id } from "../../../convex/_generated/dataModel";

export interface SelectionItem {
  id: string;
  label: string;
  value: string;
}

export interface SelectionSheetProps {
  sheetId: string;
  payload: {
    title: string;
    items: SelectionItem[];
    onSelect: (item: SelectionItem) => void;
    showSearch?: boolean;
  };
}
