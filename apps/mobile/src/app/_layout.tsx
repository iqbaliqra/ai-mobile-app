import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { SplashScreenController } from "@/components/splash-screen-controller";
import { SessionProvider, useSession } from "@/context/auth-context";

export default function RootLayout() {
  return (
    <SessionProvider>
      <SplashScreenController />
      <StatusBar style="auto" />
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
