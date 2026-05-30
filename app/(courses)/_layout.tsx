import { Stack, router } from "expo-router";
import { Pressable } from "react-native";
import { ArrowLeft } from "lucide-react-native";

export default function CoursesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#FFF8F2" },
        headerTitleStyle: { fontSize: 17, fontWeight: "700", color: "#1F1A17" },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            style={{
              height: 36, width: 36, borderRadius: 18,
              backgroundColor: "#FFEEDD",
              alignItems: "center", justifyContent: "center", marginLeft: 4,
            }}
          >
            <ArrowLeft size={18} color="#D96A15" />
          </Pressable>
        ),
      }}
    />
  );
}
