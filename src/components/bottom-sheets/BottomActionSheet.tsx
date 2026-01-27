import { useTheme } from "@react-navigation/native";
import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import ActionSheet, { ActionSheetProps } from "react-native-actions-sheet";

type BottomActionSheetProps = PropsWithChildren & ActionSheetProps;

const BottomActionSheet = (props: BottomActionSheetProps) => {
  const { colors } = useTheme();

  return (
    <ActionSheet
      id={props?.id}
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
      {...props}
    >
      <View style={styles.container}>{props.children}</View>
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
