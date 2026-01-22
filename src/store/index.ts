import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  mmkvDriver,
  secureKeys,
  themeKey,
} from "@src/storage-driver/mmkvDriver";
import { rememberEnhancer, rememberReducer } from "redux-remember";
import { rtkApi } from "./apiService";
import themeReducer from "./slices/theme";
import documentsReducer from "./slices/documents";
import notificationsReducer from "./slices/notifications";

const reducers = {
  [rtkApi.reducerPath]: rtkApi.reducer,
  theme: themeReducer,
  documents: documentsReducer,
  notifications: notificationsReducer,
};

const rememberedKeys = [
  themeKey,
  ...secureKeys,
  rtkApi.reducerPath,
  "documents",
  "notifications",
];
const rememberedReducer = rememberReducer(reducers);

export const store = configureStore({
  reducer: rememberedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkApi.middleware),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(
      rememberEnhancer(mmkvDriver, rememberedKeys, { prefix: "" }),
    ),
});

// Used for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
