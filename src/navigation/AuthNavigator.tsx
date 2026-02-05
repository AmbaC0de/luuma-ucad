import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Welcome } from "./screens/auth/Welcome";
import { Login } from "./screens/auth/Login";
import { SignUp } from "./screens/auth/SignUp";
import { NavigationContainer } from "@react-navigation/native";
import { useThemeManager } from "@src/theme/themeManager";

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  const { appTheme } = useThemeManager();

  return (
    <NavigationContainer theme={appTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
