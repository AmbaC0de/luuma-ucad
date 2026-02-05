import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "../ui/IconButton";

type FormTextInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  style?: TextStyle;
  placeholder?: string;
  rules?: Omit<
    RegisterOptions<T, any>,
    "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate"
  >;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  startIcon?: keyof typeof Ionicons.glyphMap;
};

const FormTextInput = <T extends FieldValues>({
  control,
  name,
  style,
  placeholder,
  rules,
  multiline = false,
  numberOfLines,
  keyboardType = "default",
  secureTextEntry = false,
  startIcon,
}: FormTextInputProps<T>) => {
  const { colors } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View>
          <View
            style={[
              styles.inputContainer,
              {
                borderColor: error ? colors.error : colors.border,
              },
            ]}
          >
            {startIcon && (
              <Ionicons
                name={startIcon}
                size={20}
                color={colors.textSecondary}
              />
            )}

            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder={placeholder}
              placeholderTextColor={colors.textSecondary}
              multiline={multiline}
              keyboardType={keyboardType}
              numberOfLines={numberOfLines}
              secureTextEntry={secureTextEntry && !isPasswordVisible}
              style={[
                styles.input,
                {
                  color: colors.text,
                },
                style,
              ]}
              cursorColor={colors.text}
            />
            {secureTextEntry && (
              <IconButton
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textSecondary}
                />
              </IconButton>
            )}
          </View>
          {error && (
            <Text style={{ color: colors.error, marginTop: 4, marginLeft: 4 }}>
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 10,
    height: 55,
    fontSize: 16,
  },
});

export default FormTextInput;
