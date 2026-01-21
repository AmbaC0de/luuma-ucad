import { useTheme } from "@react-navigation/native";
import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

type BottomActionSheetProps = PropsWithChildren<{ id: string }>;

const BottomActionSheet = ({ children, id }: BottomActionSheetProps) => {
  const { colors } = useTheme();

  return (
    <ActionSheet
      id={id}
      gestureEnabled
      containerStyle={[
        { backgroundColor: colors.card },
        styles.actionSheetContainer,
      ]}
      indicatorStyle={{
        backgroundColor: colors.textSecondary,
        width: 60,
        marginTop: 20,
      }}
      keyboardHandlerEnabled={true}
    >
      <View style={styles.container}>{children}</View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  actionSheetContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  container: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
});

export default BottomActionSheet;
