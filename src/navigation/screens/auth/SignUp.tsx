import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import Text from "@src/components/ui/Text";
import Button from "@src/components/ui/Button";
import FormTextInput from "@src/components/form/FormTextInput";

export const SignUp = ({ navigation }: any) => {
  const { signIn } = useAuthActions();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await signIn("password", {
        email: data.email,
        password: data.password,
        flow: "signUp",
      });
    } catch (error: any) {
      console.log("Sign up error:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Créer un compte
        </Text>
        <Text style={[styles.subtitle, { color: colors.text + "80" }]}>
          Remplissez le formulaire pour continuer
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
            onPress={handleSubmit(handleSignUp)}
            loading={isLoading}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>S'inscrire</Text>
          </Button>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={[styles.toggleText, { color: colors.primary }]}>
              Déjà un compte ? Se connecter
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
    color: "#fff",
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
