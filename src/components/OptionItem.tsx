import { useTheme } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Text from "./ui/Text";
import { Ionicons } from "@expo/vector-icons";

type OptionItemProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isDestructive?: boolean;
  onPress?: () => void;
};

const OptionItem = ({
  label,
  icon,
  isDestructive = false,
  onPress,
}: OptionItemProps) => {
  const { colors } = useTheme();
  return (
    <RectButton
      style={[
        styles.optionItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.optionLeft}>
        <Ionicons
          name={icon}
          size={22}
          color={isDestructive ? colors.error : colors.text}
        />
        <Text
          style={[
            styles.optionLabel,
            { color: isDestructive ? colors.error : colors.text },
          ]}
        >
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </RectButton>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    gap: 12,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default OptionItem;
