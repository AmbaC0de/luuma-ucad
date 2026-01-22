import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

interface InfoRowProps {
  label: string;
  value: string;
  icon: string;
}

export const InfoRow = ({ label, value, icon }: InfoRowProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.infoRow}>
      <View
        style={[styles.iconBox, { backgroundColor: colors.primary + "10" }]}
      >
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
});
