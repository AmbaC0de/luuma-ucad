import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { StyleSheet, Text, TextInput, TextStyle, View } from "react-native";

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
};

const FormTextInput = <T extends FieldValues>({
  control,
  name,
  style,
  placeholder,
  rules,
  multiline = false,
  numberOfLines,
}: FormTextInputProps<T>) => {
  const { colors } = useTheme();
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            multiline={multiline}
            numberOfLines={numberOfLines}
            style={[
              styles.input,
              {
                borderColor: error ? colors.error : colors.border,
                color: colors.text,
              },
              style,
            ]}
            cursorColor={colors.text}
          />
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
  },
  input: {
    borderWidth: 1,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 55,
    fontSize: 16,
  },
});

export default FormTextInput;
