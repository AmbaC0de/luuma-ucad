import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeModeLabel = "Clair" | "Sombre" | "Système";

interface ThemeState {
  mode: { value: ThemeMode; label: ThemeModeLabel };
}
const initialState: ThemeState = {
  mode: { value: "system", label: "Système" },
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode(
      state,
      action: PayloadAction<{ value: ThemeMode; label: ThemeModeLabel }>,
    ) {
      state.mode = action.payload;
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export const selectThemeMode = (state: { theme: ThemeState }) =>
  state.theme.mode;
export default themeSlice.reducer;
