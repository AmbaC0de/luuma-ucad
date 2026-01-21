import {
  SheetDefinition,
  SheetManager,
  SheetRegister,
} from "react-native-actions-sheet";
import SelectionSheet from "./SelectionSheet";
import { SelectionSheetProps } from "./types";

declare module "react-native-actions-sheet" {
  interface Sheets {
    "selection-sheet": SheetDefinition<SelectionSheetProps>;
  }
}

const Sheets = () => {
  return (
    <SheetRegister
      sheets={{
        "selection-sheet": SelectionSheet,
      }}
    />
  );
};

export default Sheets;
