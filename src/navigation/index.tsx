import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { Settings } from "./screens/Settings";
import { Notifications } from "./screens/Notifications";
import { NotFound } from "./screens/NotFound";
import { Documents } from "./screens/Documents";
import { Shop } from "./screens/Shop";
import { NewsDetail } from "./screens/NewsDetail";
import { ProductDetail } from "./screens/ProductDetail";
import { PDFViewer } from "./screens/PDFViewer";
import { MyDocuments } from "./screens/MyDocuments";
import IconButton from "@src/components/ui/IconButton";

const HomeTabs = createBottomTabNavigator({
  screenOptions: ({ theme, navigation }) => ({
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.text,
    headerTintColor: theme.colors.text,
    headerTitleStyle: { fontSize: 24, fontWeight: "600" },
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
        <IconButton onPress={() => navigation.navigate("Updates")}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={theme.colors.text}
          />
        </IconButton>
        <IconButton onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={24} color={theme.colors.text} />
        </IconButton>
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
    Shop: {
      screen: Shop,
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
    headerTitleStyle: { fontSize: 24, fontWeight: "600" },
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
      screen: Notifications,
      options: {
        title: "Notifications",
      },
    },
    Profile: {
      screen: Profile,
      options: {
        title: "Profil",
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
    NewsDetail: {
      screen: NewsDetail,
      options: {
        title: "Détails",
      },
    },
    ProductDetail: {
      screen: ProductDetail,
      options: {
        headerShown: false, // Custom header in component
      },
    },
    PDFViewer: {
      screen: PDFViewer,
      options: ({ theme }) => ({
        title: "",
        // headerBackTitle: "Retour",
      }),
    },
    MyDocuments: {
      screen: MyDocuments,
      options: {
        title: "Mes documents",
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
