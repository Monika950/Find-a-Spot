import { ThemedText, ThemedView } from "../components";
import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "expo-router";
import { StyleSheet } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { enableScreens } from 'react-native-screens';

enableScreens();

export default function AuthIndexPage() {
    const {user} = useAuth();

   
    return (
        <ThemedView style={styles.map} viewColor="background">
            <ThemedText>
              
            </ThemedText>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    map:
    {
        flex: 1,
    }
});


