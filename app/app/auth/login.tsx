import React, { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { useRouter } from 'expo-router';

import {
    ThemedText,
    ThemedView,
    ThemedInput,
    ThemedCheckbox,
    ThemedButton,
} from "../../components";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { Redirect } from "expo-router";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState(""); // Email state
    const [password, setPassword] = useState(""); // Password state

    const router = useRouter();

    // Function to handle login
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in both email, password and phone.");
            return;
        }

        try {

            const response = await fetch(`${process.env.EXPO_PUBLIC_SERVERURL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful login (e.g., save token and navigate)
                Alert.alert("Success", "You are now logged in!");
                login({email,token: data.token})
                router.push('/');
            } else {
                // Handle error
                Alert.alert("Login Failed", data.message || "Invalid credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Error", "An error occurred while trying to log in.");
        }
    };

    const goToRegister = () => {
        router.push("auth/signup"); // Redirect to the signup page
    };

    return (
        <ThemedView style={styles.container} viewColor="background">
            <ThemedView style={styles.formContainer} viewColor="secondary">
                <ThemedText type="title">Login</ThemedText>
                <ThemedView style={styles.inputContainer} viewColor="transparent">
                    <ThemedInput
                        label="Email"
                        placeHolder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <ThemedInput
                        label="Password"
                        placeHolder="Enter your password"
                        secret
                        value={password}
                        onChangeText={setPassword}
                    />
                </ThemedView>
                <ThemedView style={styles.buttonContainer} viewColor="transparent">
                    <ThemedButton
                        text="Login"
                        icon="login"
                        iconSize={18}
                        containerStyles={styles.loginButton}
                        onPress={handleLogin}
                    />
                    <ThemedButton
                        text="Go to Register"
                        icon="login"
                        iconSize={18}
                        containerStyles={styles.registerButton}
                        onPress={goToRegister}
                    />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    formContainer: {
        width: "100%",
        padding: 20,
        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: "center",
    },
    inputContainer: {
        width: "100%",
        marginTop: 20,
        alignItems: "flex-start",
        gap: 10,
        paddingHorizontal: 15,
    },
    buttonContainer: {
        width: "100%",
        marginTop: 20,
        alignItems: "center",
        gap: 10,
        flexDirection: "column",
    },
    loginButton: {
        marginTop: 20,
        padding: 10,
        width: 250,
        alignItems: "center",
        borderRadius: 15,
        justifyContent: "space-between",
    },
    registerButton: {
        marginTop: 10,
        padding: 10,
        width: 250,
        alignItems: "center",
        borderRadius: 15,
        justifyContent: "space-between",
    },
});
