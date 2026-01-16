import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { Settings } from "./screens/Settings";
import { Updates } from "./screens/Updates";
import { NotFound } from "./screens/NotFound";
import { Documents } from "./screens/Documents";
import { Boutique } from "./screens/Boutique";
import { Compte } from "./screens/Compte";

const HomeTabs = createBottomTabNavigator({
  screenOptions: ({ theme, navigation }) => ({
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.text,
    headerTintColor: theme.colors.text,
    headerTitleStyle: { fontSize: 25, fontWeight: "600" },
    tabBarStyle: {
      backgroundColor: theme.colors.background,
      borderTopWidth: 0,
      elevation: 0,
    },
    headerStyle: {
      backgroundColor: theme.colors.background,
      shadowColor: "transparent",
      borderBottomWidth: 0,
      elevation: 0,
    },

    headerRight: () => (
      <View style={{ flexDirection: "row", marginRight: 15, gap: 15 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Updates")}
          hitSlop={10}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Compte")}
          hitSlop={10}
        >
          <Ionicons name="person-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    ),
  }),
  screens: {
    Home: {
      screen: Home,
      options: {
        title: "Infos",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="newspaper-outline" size={size} color={color} />
        ),
      },
    },
    Documents: {
      screen: Documents,
      options: {
        title: "Documents",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="library-outline" size={size} color={color} />
        ),
      },
    },
    Boutique: {
      screen: Boutique,
      options: {
        title: "Boutique",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="cart-outline" size={size} color={color} />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screenOptions: ({ theme }) => ({
    headerStyle: {
      backgroundColor: theme.colors.background,
      shadowColor: "transparent",
      borderBottomWidth: 0,
      elevation: 0,
    },
  }),
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    Updates: {
      screen: Updates,
      options: {
        title: "Notifications",
      },
    },
    Compte: {
      screen: Compte,
      options: {
        title: "Compte",
      },
    },
    Profile: {
      screen: Profile,
      linking: {
        path: ":user(@[a-zA-Z0-9-_]+)",
        parse: {
          user: (value) => value.replace(/^@/, ""),
        },
        stringify: {
          user: (value) => `@${value}`,
        },
      },
    },
    Settings: {
      screen: Settings,
      options: ({ navigation }) => ({
        presentation: "modal",
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
