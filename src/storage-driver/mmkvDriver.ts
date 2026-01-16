import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV();

export const themeKey = "theme";
export const secureKeys: string[] = [];

export const mmkvDriver = {
  getItem: (key: string) => {
    return storage.getString(key);
  },
  setItem: (key: string, value: string) => {
    return storage.set(key, value);
  },
};
