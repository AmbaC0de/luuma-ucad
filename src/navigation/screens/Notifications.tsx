import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import {
  markAsRead,
  NotificationItem,
  selectNotifications,
} from "@src/store/slices/notifications";

const getRelativeTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours} h`;
  if (days < 7) return `Il y a ${days} j`;
  return new Date(timestamp).toLocaleDateString("fr-FR");
};

export function Notifications() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { items: notifications } = useAppSelector(selectNotifications);

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return "warning";
      case "success":
        return "checkmark-circle";
      default:
        return "information-circle";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "alert":
        return colors.error; // Use error color from theme
      case "success":
        return "#16a34a"; // Green
      default:
        return colors.primary;
    }
  };

  const handlePress = (item: NotificationItem) => {
    if (!item.read) {
      dispatch(markAsRead(item.id));
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <RectButton
      style={[
        styles.notificationItem,
        {
          backgroundColor: item.read ? colors.background : colors.card,
          borderColor: colors.border,
        },
      ]}
      enabled={!item.read}
      onPress={() => handlePress(item)}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getIconColor(item.type) + "15" },
        ]}
      >
        <Ionicons
          name={getIcon(item.type)}
          size={24}
          color={getIconColor(item.type)}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              { color: colors.text, fontWeight: item.read ? "600" : "800" },
            ]}
          >
            {item.title}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {getRelativeTime(item.date)}
          </Text>
        </View>
        <Text
          style={[styles.message, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.message}
        </Text>
      </View>
      {!item.read && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}
    </RectButton>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color={colors.textSecondary}
              style={{ opacity: 0.5, marginBottom: 16 }}
            />
            <Text style={{ color: colors.textSecondary }}>
              Aucune notification
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
});
