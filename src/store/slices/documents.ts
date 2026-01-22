import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalDocument } from "@src/models/documents";

interface DocumentsState {
  downloaded: Record<string, LocalDocument>;
}

const initialState: DocumentsState = {
  downloaded: {},
};

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    addDownloadedDocument(state, action: PayloadAction<LocalDocument>) {
      state.downloaded[action.payload.id] = action.payload;
    },
    removeDownloadedDocument(state, action: PayloadAction<string>) {
      delete state.downloaded[action.payload];
    },
    // Action optionnelle pour synchroniser si nécessaire, par exemple nettoyer les fichiers inexistants
    syncDownloadedDocuments(
      state,
      action: PayloadAction<Record<string, LocalDocument>>,
    ) {
      state.downloaded = action.payload;
    },
  },
});

export const {
  addDownloadedDocument,
  removeDownloadedDocument,
  syncDownloadedDocuments,
} = documentsSlice.actions;

export const selectDownloadedDocuments = (state: {
  documents: DocumentsState;
}) => state.documents.downloaded;

export const selectDownloadedDocumentById =
  (id: string) => (state: { documents: DocumentsState }) =>
    state.documents.downloaded[id];

export default documentsSlice.reducer;
