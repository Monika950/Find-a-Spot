import { ThemedText, ThemedView } from "../components";
import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "expo-router";
import { StyleSheet } from "react-native";
import { enableScreens } from 'react-native-screens';

enableScreens();

export default function AuthIndexPage() {
    const {user} = useAuth();

    if (!user) {
        return <Redirect href="/auth" />;
    }

    return (
        <ThemedView viewColor="background">
            <ThemedText>
                actuals index
            </ThemedText>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
});