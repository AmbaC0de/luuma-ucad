import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import Pdf from "react-native-pdf";
import { useRoute, useNavigation, useTheme } from "@react-navigation/native";
import { StaticScreenProps } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@src/components/ui/Text";
import IconButton from "@src/components/ui/IconButton";
import Button from "@src/components/ui/Button";

type PdfViewerProps = StaticScreenProps<{
  url: string;
  title?: string;
}>;

export const PDFViewer = ({ route }: PdfViewerProps) => {
  const { url, title } = route.params;
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const source = { uri: url, cache: true };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || "Document PDF",
    });
  }, [navigation, title]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {error ? (
        <View style={styles.centerContainer}>
          <Text style={{ color: colors.error, marginBottom: 10 }}>{error}</Text>
          <Button variant="outlined" onPress={() => setError(null)}>
            <Ionicons name="refresh" size={24} color={colors.text} />
            <Text style={{ marginLeft: 8 }}>Réessayer</Text>
          </Button>
        </View>
      ) : (
        <Pdf
          trustAllCerts={false}
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            setLoading(false);
          }}
          onPageChanged={(page, numberOfPages) => {
            // console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
            setError("Impossible de charger le document PDF");
            setLoading(false);
          }}
          style={[styles.pdf, { backgroundColor: colors.background }]}
          renderActivityIndicator={() => (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: 20 }}
            />
          )}
        />
      )}

      {loading && !error && (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: colors.background },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16 }}>Chargement du document...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
