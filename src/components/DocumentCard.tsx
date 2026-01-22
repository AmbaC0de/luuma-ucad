import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import IconButton from "./ui/IconButton";
import { getIconColor, DocumentDisplay } from "../models/documents";

interface DocumentCardProps {
  document: DocumentDisplay;
  isDownloading: boolean;
  onPress: () => void;
  onDownload: () => void;
  onDelete?: () => void;
  containerStyle?: ViewStyle;
}

export const DocumentCard = ({
  document,
  isDownloading,
  onPress,
  onDownload,
  onDelete,
  containerStyle,
}: DocumentCardProps) => {
  const { title, ue, type, size, date, isDownloaded } = document;
  const { colors } = useTheme();

  // Logique d'action simplifiée
  const handleActionPress = isDownloaded ? onDelete : onDownload;

  // Déterminer l'icône à afficher
  const getActionIcon = () => {
    if (isDownloading) return null;
    if (isDownloaded) return "checkmark-outline";
    return onDelete ? "trash-outline" : "cloud-download-outline";
  };

  // Déterminer la couleur de l'icône
  const getActionIconColor = () => {
    if (isDownloaded) return colors.primary;
    if (onDelete) return colors.error;
    return colors.textSecondary;
  };

  const actionIcon = getActionIcon();
  const actionIconColor = getActionIconColor();

  return (
    <RectButton
      style={[
        styles.docCard,
        { backgroundColor: colors.card, borderColor: colors.border },
        containerStyle,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getIconColor(type, colors.text) + "20" },
        ]}
      >
        <Ionicons
          name="document-text"
          size={28}
          color={getIconColor(type, colors.text)}
        />
      </View>

      <View style={styles.docInfo}>
        <Text
          style={[styles.docTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.docMeta, { color: colors.textSecondary }]}>
            {ue} • {type}
          </Text>
          <Text style={[styles.docMeta, { color: colors.textSecondary }]}>
            {size} • {date}
          </Text>
        </View>
      </View>

      <IconButton onPress={handleActionPress}>
        {isDownloading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          actionIcon && (
            <Ionicons
              name={actionIcon as any}
              size={24}
              color={actionIconColor}
            />
          )
        )}
      </IconButton>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  docCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  docInfo: {
    flex: 1,
    marginRight: 8,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  docMeta: {
    fontSize: 12,
  },
});
