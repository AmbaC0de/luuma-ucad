import React, { useState } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { makeRedirectUri } from "expo-auth-session";
import { openAuthSessionAsync } from "expo-web-browser";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import Button from "@src/components/ui/Button";

const redirectTo = makeRedirectUri();

export const Welcome = ({ navigation }: any) => {
  const { signIn } = useAuthActions();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
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
      Alert.alert("Erreur", "Une erreur est survenue lors de la connexion.");
    } finally {
      setIsLoading(false);
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

        <View style={styles.form}>
          <Button
            onPress={handleGoogleSignIn}
            loading={isLoading}
            disabled={isLoading}
          >
            <Ionicons
              name="logo-google"
              size={24}
              color="#fff"
              style={styles.icon}
            />
            <Text style={[styles.buttonText, { color: "#fff" }]}>
              Continuer avec Google
            </Text>
          </Button>

          <Button
            onPress={() => navigation.navigate("Login")}
            variant="outlined"
          >
            <Ionicons
              name="mail-outline"
              size={24}
              color={colors.text}
              style={styles.icon}
            />
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Continuer avec email
            </Text>
          </Button>
        </View>
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
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  form: {
    width: "100%",
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginRight: 12,
  },
});
