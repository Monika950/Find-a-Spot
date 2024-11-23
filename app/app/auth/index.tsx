import { ThemedText, ThemedView } from "../../components";
import { Redirect } from "expo-router";

export default function AuthIndexPage() {
    return <Redirect href="/auth/login" />;
}