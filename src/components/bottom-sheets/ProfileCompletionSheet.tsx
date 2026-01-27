import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { useTheme } from "@react-navigation/native";
import Text from "../ui/Text";
import Button from "../ui/Button";
import { useAppQuery } from "@src/hooks/useAppQuery";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import BottomActionSheet from "./BottomActionSheet";

const ProfileCompletionSheet = (
  props: SheetProps<"profile-completion-sheet">,
) => {
  const { colors } = useTheme();
  const updateProfile = useMutation(api.users.update);

  const [matricule, setMatricule] = useState("");
  const [level, setLevel] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<{
    id: Id<"faculties">;
    label: string;
  } | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<{
    id: Id<"departments">;
    label: string;
  } | null>(null);
  const [selectedInstitute, setSelectedInstitute] = useState<{
    id: Id<"institutes">;
    label: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const { data: faculties } = useAppQuery(api.faculties.get);
  const { data: departments } = useAppQuery(
    api.departments.getByFaculty,
    selectedFaculty ? { facultyId: selectedFaculty.id } : "skip",
  );
  const { data: institutes } = useAppQuery(
    api.institutes.getByFaculty,
    selectedFaculty ? { facultyId: selectedFaculty.id } : "skip",
  );

  useEffect(() => {
    setSelectedDepartment(null);
    setSelectedInstitute(null);
  }, [selectedFaculty]);

  const openLevelSelection = () => {
    SheetManager.show("selection-sheet", {
      payload: {
        title: "Choisir votre niveau",
        items: [
          "Licence 1",
          "Licence 2",
          "Licence 3",
          "Master 1",
          "Master 2",
        ].map((l) => ({
          id: l,
          label: l,
          value: l,
        })),
        onSelect: (item) => {
          setLevel(item.value as string);
        },
        showSearch: false,
      },
    });
  };

  const openFacultySelection = () => {
    if (!faculties) return;

    SheetManager.show("selection-sheet", {
      payload: {
        title: "Choisir une faculté",
        items: faculties.map((f) => ({
          id: f._id,
          label: f.name,
          value: f._id,
        })),
        onSelect: (item) => {
          setSelectedFaculty({
            id: item.value as Id<"faculties">,
            label: item.label,
          });
        },
      },
    });
  };

  const openDepartmentSelection = () => {
    if (!departments) return;
    SheetManager.show("selection-sheet", {
      payload: {
        title: "Choisir un département",
        items: departments.map((d) => ({
          id: d._id,
          label: d.name,
          value: d._id,
        })),
        onSelect: (item) => {
          setSelectedDepartment({
            id: item.value as Id<"departments">,
            label: item.label,
          });
          setSelectedInstitute(null);
        },
      },
    });
  };

  const openInstituteSelection = () => {
    if (!institutes) return;
    SheetManager.show("selection-sheet", {
      payload: {
        title: "Choisir un institut",
        items: institutes.map((i) => ({
          id: i._id,
          label: i.name,
          value: i._id,
        })),
        onSelect: (item) => {
          setSelectedInstitute({
            id: item.value as Id<"institutes">,
            label: item.label,
          });
          setSelectedDepartment(null);
        },
      },
    });
  };

  const hasDepartments = departments && departments.length > 0;
  const hasInstitutes = institutes && institutes.length > 0;

  const handleSubmit = async () => {
    if (!matricule) {
      Alert.alert("Erreur", "Veuillez renseigner votre matricule");
      return;
    }
    if (!level) {
      Alert.alert("Erreur", "Veuillez sélectionner votre niveau");
      return;
    }
    if (!selectedFaculty) {
      Alert.alert("Erreur", "Veuillez sélectionner votre faculté");
      return;
    }

    // Validation logic: if departments exist, must select one. If institutes exist, must select one.
    // Simplify: if both exist, user can pick either.
    let valid = true;
    if (hasDepartments && !selectedDepartment && !hasInstitutes) valid = false;
    if (hasInstitutes && !selectedInstitute && !hasDepartments) valid = false;
    if (
      hasDepartments &&
      hasInstitutes &&
      !selectedDepartment &&
      !selectedInstitute
    )
      valid = false;

    if (!valid) {
      Alert.alert(
        "Erreur",
        "Veuillez sélectionner votre département ou institut",
      );
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        matricule,
        level,
        facultyId: selectedFaculty.id,
        departmentId: selectedDepartment?.id,
        instituteId: selectedInstitute?.id,
      });
      SheetManager.hide(props.sheetId);
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible de mettre à jour le profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomActionSheet
      id={props.sheetId}
      defaultOverlayOpacity={0.8}
      closable={false}
      gestureEnabled={false}
    >
      <View style={{ marginTop: 20 }}>
        <Text style={[styles.title, { color: colors.text }]}>
          Complétez votre profil
        </Text>
        <Text style={[styles.subtitle, { color: colors.text + "80" }]}>
          Ces informations sont nécessaires pour personnaliser votre expérience.
        </Text>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Matricule</Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="Ex: 20260127AB"
            placeholderTextColor={colors.text + "80"}
            value={matricule}
            onChangeText={setMatricule}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Niveau</Text>
          <RectButton
            style={[
              styles.selector,
              {
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
            onPress={openLevelSelection}
          >
            <Text
              style={{
                color: level ? colors.text : colors.text + "80",
              }}
            >
              {level ?? "Sélectionner votre niveau"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={colors.textSecondary}
            />
          </RectButton>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Faculté</Text>
          <RectButton
            style={[
              styles.selector,
              {
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
            onPress={openFacultySelection}
          >
            <Text
              style={{
                color: selectedFaculty ? colors.text : colors.text + "80",
              }}
            >
              {selectedFaculty
                ? selectedFaculty.label
                : "Sélectionner une faculté"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={colors.textSecondary}
            />
          </RectButton>
        </View>

        {selectedFaculty && (hasDepartments || hasInstitutes) && (
          <View>
            {hasDepartments && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Département
                </Text>
                <RectButton
                  style={[
                    styles.selector,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    },
                  ]}
                  onPress={openDepartmentSelection}
                >
                  <Text
                    style={{
                      color: selectedDepartment
                        ? colors.text
                        : colors.text + "80",
                    }}
                  >
                    {selectedDepartment
                      ? selectedDepartment.label
                      : "Sélectionner un département"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={colors.textSecondary}
                  />
                </RectButton>
              </View>
            )}

            {hasInstitutes && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Institut
                </Text>
                <RectButton
                  style={[
                    styles.selector,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    },
                  ]}
                  onPress={openInstituteSelection}
                >
                  <Text
                    style={{
                      color: selectedInstitute
                        ? colors.text
                        : colors.text + "80",
                    }}
                  >
                    {selectedInstitute
                      ? selectedInstitute.label
                      : "Sélectionner un institut"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={colors.textSecondary}
                  />
                </RectButton>
              </View>
            )}
          </View>
        )}

        <Button
          onPress={handleSubmit}
          loading={loading}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Enregistrer
          </Text>
        </Button>
      </View>
    </BottomActionSheet>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    height: 55,
  },
  selector: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ProfileCompletionSheet;
