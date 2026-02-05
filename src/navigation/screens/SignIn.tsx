import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { makeRedirectUri } from "expo-auth-session";
import { openAuthSessionAsync } from "expo-web-browser";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import Text from "../../components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import Button from "@src/components/ui/Button";
import FormTextInput from "../../components/form/FormTextInput";

const redirectTo = makeRedirectUri();

export const SignIn = () => {
  const { signIn } = useAuthActions();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState<
    Record<"google" | "password", boolean>
  >({
    google: false,
    password: false,
  });
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading((prev) => ({ ...prev, google: true }));
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
      setIsLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleEmailAuth = async (data: { email: string; password: string }) => {
    setIsLoading((prev) => ({ ...prev, password: true }));
    try {
      await signIn("password", {
        email: data.email,
        password: data.password,
        flow: step,
      });
    } catch (error: any) {
      console.log("Sign in error:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue. Vérifiez vos identifiants ou réessayez.",
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, password: false }));
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {step === "signIn" ? "Bienvenue" : "Créer un compte"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.text + "80" }]}>
          {step === "signIn"
            ? "Connectez-vous pour continuer"
            : "Remplissez le formulaire pour continuer"}
        </Text>

        <View style={styles.form}>
          <FormTextInput
            control={control}
            name="email"
            placeholder="Email institutionnel"
            keyboardType="email-address"
            startIcon="mail-outline"
            rules={{ required: "L'email est requis" }}
          />
          <FormTextInput
            control={control}
            name="password"
            placeholder="Mot de passe"
            secureTextEntry
            startIcon="lock-closed-outline"
            rules={{
              required: "Le mot de passe est requis",
              minLength: {
                value: 8,
                message: "Le mot de passe doit faire au moins 8 caractères",
              },
            }}
          />
          <Button
            onPress={handleSubmit(handleEmailAuth)}
            loading={isLoading.password}
            disabled={isLoading.password}
            variant="outlined"
          >
            <Text style={styles.buttonText}>
              {step === "signIn" ? "Se connecter" : "S'inscrire"}
            </Text>
          </Button>
        </View>

        <View style={styles.dividerContainer}>
          <View
            style={[styles.dividerLine, { backgroundColor: colors.border }]}
          />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
            OU BIEN
          </Text>
          <View
            style={[styles.dividerLine, { backgroundColor: colors.border }]}
          />
        </View>

        <View style={styles.form}>
          <Button
            onPress={handleGoogleSignIn}
            loading={isLoading.google}
            disabled={isLoading.google}
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

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setStep(step === "signIn" ? "signUp" : "signIn")}
          >
            <Text style={[styles.toggleText, { color: colors.primary }]}>
              {step === "signIn"
                ? "Pas encore de compte ? S'inscrire"
                : "Déjà un compte ? Se connecter"}
            </Text>
          </TouchableOpacity>
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  icon: {
    marginRight: 12,
  },
  toggleButton: {
    marginTop: 10,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
