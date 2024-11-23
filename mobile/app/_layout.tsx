import { Stack } from "expo-router";
import { useThemeColor } from "@/hooks/UseThemeColor";
import { AuthProvider } from "../contexts/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  return <GestureHandlerRootView>
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{
          headerShown: false,
          headerTitle: "FindSpot",
          statusBarTranslucent: true,
          navigationBarHidden: true,
        }} />
        <Stack.Screen name="auth" options={{
          headerShown: false,
          headerTitle: "FindSpot",
          statusBarBackgroundColor: useThemeColor('primary'),
          statusBarTranslucent: true,
          navigationBarHidden: true,
        }} />
      </Stack>
    </AuthProvider>
  </GestureHandlerRootView>;
}
