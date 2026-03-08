import { Tabs } from "expo-router";
import { House } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F47C20",
        tabBarInactiveTintColor: "#C9A387",
        tabBarStyle: {
          height: 72,
          borderTopWidth: 0,
          borderRadius: 26,
          marginHorizontal: 16,
          marginBottom: 18,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: "#FFFFFF",
          position: "absolute",
          shadowColor: "#B55A11",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 12,
        },
        sceneStyle: {
          backgroundColor: "#FFF8F2",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
