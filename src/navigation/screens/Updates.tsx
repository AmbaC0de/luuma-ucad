import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "info" | "alert" | "success";
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Changement de salle",
    message:
      "Le cours de MATH101 aura lieu en salle A203 au lieu de l'amphi B.",
    date: "Il y a 10 min",
    type: "info",
    read: false,
  },
  {
    id: "2",
    title: "Résultats disponibles",
    message: "Les notes du partiel de Physique sont publiées.",
    date: "Il y a 2h",
    type: "success",
    read: false,
  },
  {
    id: "3",
    title: "Urgent : Date limite bourses",
    message: "N'oubliez pas de renouveler votre dossier avant ce soir minuit.",
    date: "Hier",
    type: "alert",
    read: true,
  },
  {
    id: "4",
    title: "Conférence annulée",
    message: "La conférence sur l'IA est reportée à une date ultérieure.",
    date: "Hier",
    type: "info",
    read: true,
  },
  {
    id: "5",
    title: "Nouvelle ressource ajoutée",
    message: "Le support de cours pour le chapitre 3 est en ligne.",
    date: "2 jours",
    type: "info",
    read: true,
  },
];

export function Updates() {
  const { colors } = useTheme();

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

  const renderItem = ({ item }: { item: Notification }) => (
    <RectButton
      style={[
        styles.notificationItem,
        {
          backgroundColor: item.read ? colors.background : colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getIconColor(item.type) + "15" },
        ]}
      >
        <Ionicons
          name={getIcon(item.type) as any}
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
            {item.date}
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
        data={NOTIFICATIONS}
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
