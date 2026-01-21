import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { makeRedirectUri } from "expo-auth-session";
import { openAuthSessionAsync } from "expo-web-browser";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../../components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import Button from "@src/components/ui/Button";

const redirectTo = makeRedirectUri();

export const SignIn = () => {
  const { signIn } = useAuthActions();
  const { colors } = useTheme();

  const handleSignIn = async () => {
    try {
      const { redirect } = await signIn("google", { redirectTo });
      if (Platform.OS === "web") {
        return;
      }
      if (!redirect) return;

      const result = await openAuthSessionAsync(
        redirect.toString(),
        redirectTo,
      );
      if (result.type === "success") {
        const { url } = result;
        const code = new URL(url).searchParams.get("code")!;
        await signIn("google", { code });
      }
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Bienvenue</Text>
        <Text style={[styles.subtitle, { color: colors.text + "80" }]}>
          Connectez-vous pour continuer
        </Text>
        <Button onPress={handleSignIn}>
          <Ionicons
            name="logo-google"
            size={24}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Continuer avec Google</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    maxWidth: 300,
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
