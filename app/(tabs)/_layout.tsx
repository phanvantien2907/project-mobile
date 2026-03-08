import { Tabs } from "expo-router";
<<<<<<< HEAD
import { House } from "lucide-react-native";
=======
>>>>>>> 03c3663 (update 08/03/2026)

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
<<<<<<< HEAD
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
=======
>>>>>>> 03c3663 (update 08/03/2026)
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
<<<<<<< HEAD
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
=======
          title: "Home",
>>>>>>> 03c3663 (update 08/03/2026)
        }}
      />
    </Tabs>
  );
}
