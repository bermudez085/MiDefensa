import { Ionicons } from "@expo/vector-icons";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons: any = {
              news: "newspaper",
              plan: "document-text",
              report: "alert-circle",
              index: "home",
              rights: "book",
            };
            return (
              <Ionicons name={icons[route.name]} size={size} color={color} />
            );
          },
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#ccc",
          },
          headerShown: false,
        })}
      />
    </ThemeProvider>
  );
}
