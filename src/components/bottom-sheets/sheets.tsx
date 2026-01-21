import {
  SheetDefinition,
  SheetManager,
  SheetRegister,
} from "react-native-actions-sheet";
import SelectionSheet from "./SelectionSheet";
import ProfileCompletionSheet from "./ProfileCompletionSheet";
import { SelectionSheetProps } from "./types";

declare module "react-native-actions-sheet" {
  interface Sheets {
    "selection-sheet": SheetDefinition<SelectionSheetProps>;
    "profile-completion-sheet": SheetDefinition;
  }
}

const Sheets = () => {
  return (
    <SheetRegister
      sheets={{
        "selection-sheet": SelectionSheet,
        "profile-completion-sheet": ProfileCompletionSheet,
      }}
    />
  );
};

export default Sheets;
