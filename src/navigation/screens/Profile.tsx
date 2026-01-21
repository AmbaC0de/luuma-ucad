import { useAuthActions } from "@convex-dev/auth/react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import OptionItem from "@src/components/OptionItem";
import IconButton from "@src/components/ui/IconButton";
import { useAppQuery } from "@src/hooks/useAppQuery";
import { api } from "convex/_generated/api";
import { useConvexAuth } from "convex/react";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";

export function Profile() {
  const { colors } = useTheme();
  const { signOut } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const { data: user, isFetching } = useAppQuery(
    api.users.currentUser,
    isAuthenticated ? {} : "skip",
  );

  const options: {
    label: string;
    icon: string;
    isDestructive?: boolean;
    onPress?: () => void;
  }[] = [
    { label: "Mes documents", icon: "folder-open-outline" },
    { label: "Notifications", icon: "notifications-outline" },
    { label: "Sécurité", icon: "shield-checkmark-outline" },
    { label: "Aide & Support", icon: "help-circle-outline" },
    {
      label: "Se déconnecter",
      icon: "log-out-outline",
      isDestructive: true,
      onPress: () => signOut(),
    },
  ];

  const renderInfoRow = (label: string, value: string, icon: string) => (
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { borderColor: colors.card }]}>
          <Image source={{ uri: user?.image }} style={styles.avatar} />
          <IconButton
            contientStyle={[
              styles.editBadge,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons name="pencil" size={14} color="#fff" />
          </IconButton>
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>
          {user?.name}
        </Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
          {user?.email}
        </Text>
        <View
          style={[
            styles.idBadge,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.idText, { color: colors.textSecondary }]}>
            Carte: {user?.matricule}
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionHeader, { color: colors.text }]}>
        Informations Académiques
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {/* {renderInfoRow("Niveau", user?.level, "school-outline")}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        {renderInfoRow("Faculté", user?.facultyId, "business-outline")}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        {renderInfoRow("Département", user?.department, "library-outline")} */}
      </View>

      <Text style={[styles.sectionHeader, { color: colors.text }]}>
        Paramètres
      </Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <OptionItem {...option} key={index} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    marginBottom: 16,
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 12,
  },
  idBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  idText: {
    fontSize: 14,
    fontFamily: "monospace",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
  divider: {
    height: 1,
    marginLeft: 72,
  },
  optionsContainer: {
    gap: 12,
  },
});
