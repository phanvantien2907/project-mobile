import { ThemeProvider } from "@/theme/theme-provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import "../services/firebase";
import AppToast from "@/components/ui/app-toast";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <AppToast />
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
