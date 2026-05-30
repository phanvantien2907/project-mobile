import { ThemeProvider } from "@/theme/theme-provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import "../services/firebase";
import AppToast from "@/components/ui/app-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { Appearance } from "react-native";

Appearance.setColorScheme("light");

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(students)" />
          <Stack.Screen name="(departments)" />
          <Stack.Screen name="(courses)" />
        </Stack>
        <AppToast />
        <StatusBar style="dark" />
      </AuthProvider>
    </ThemeProvider>
  );
}
