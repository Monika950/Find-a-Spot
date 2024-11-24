import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { ParkingProvider } from "../contexts/ParkingContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <ParkingProvider >

      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
                statusBarTranslucent: true,
                navigationBarHidden: true,
              }}
            />
            <Stack.Screen
              name="auth"
              options={{
                headerShown: false,
                statusBarTranslucent: true,
                navigationBarHidden: true,
              }}
            />
            <Stack.Screen
              name="map1"
              options={{
                headerShown: false,
                statusBarTranslucent: true,
                navigationBarHidden: true,
              }}
            />

          </Stack>
        </GestureHandlerRootView>
      </AuthProvider>
    </ParkingProvider >
  );
}