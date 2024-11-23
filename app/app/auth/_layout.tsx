import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{
                headerShown: false,
                statusBarTranslucent: true,
                navigationBarHidden: true,
            }} />

            <Stack.Screen name="signup" options={{
                headerShown: false,
                statusBarTranslucent: true,
                navigationBarHidden: true,
            }} />
        </Stack>
    )
}