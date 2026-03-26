import { Tabs } from "expo-router";
import { Building2, House, GraduationCap } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F47C20",
        tabBarInactiveTintColor: "#C9A387",
        tabBarStyle: {
          height: 68,
          borderTopWidth: 0,
          borderRadius: 24,
          marginHorizontal: 20,
          marginBottom: 16,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: "#FFFFFF",
          position: "absolute",
          shadowColor: "#1F1A17",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
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
      <Tabs.Screen
        name="departments"
        options={{
          title: "Phòng ban",
          tabBarIcon: ({ color, size }) => <Building2 color={color} size={size} />,
        }}
      />
       <Tabs.Screen
        name="courses"
        options={{
          title: "Khóa học",
          tabBarIcon: ({ color, size }) => <GraduationCap color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
