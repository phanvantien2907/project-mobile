<<<<<<< HEAD
import { ThemeProvider } from "@/theme/theme-provider";
=======
>>>>>>> 03c3663 (update 08/03/2026)
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
<<<<<<< HEAD
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
=======
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
>>>>>>> 03c3663 (update 08/03/2026)
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
