import { Stack, router } from "expo-router";
import { Pressable } from "react-native";
import { ArrowLeft } from "lucide-react-native";

export default function DepartmentsLayout() {
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
            className="ml-1 h-9 w-9 items-center justify-center rounded-full bg-[#FFEEDD]"
          >
            <ArrowLeft size={18} color="#D96A15" />
          </Pressable>
        ),
      }}
    />
  );
}
