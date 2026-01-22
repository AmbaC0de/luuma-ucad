import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: number;
  type: "info" | "alert" | "success";
  read: boolean;
  data?: any;
}

interface NotificationsState {
  items: NotificationItem[];
}

const initialState: NotificationsState = {
  items: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      // Add new notification to the beginning of the list
      state.items.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(
        (item) => item.id === action.payload,
      );
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        item.read = true;
      });
    },
    clearNotifications: (state) => {
      state.items = [];
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  removeNotification,
} = notificationsSlice.actions;

export const selectNotifications = (state: RootState) => state.notifications;
export default notificationsSlice.reducer;
