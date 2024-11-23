import React, { useState, useEffect } from "react";
import { StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

import {
    ThemedText,
    ThemedView,
    ThemedInput,
    ThemedButton,
} from "../../components";
import { useAuth } from "../../contexts/AuthContext";

export default function SignupPage() {
    const { user, register } = useAuth();
    const [email, setEmail] = useState(""); // Email state
    const [password, setPassword] = useState(""); // Password state
    const [rePassword, setRePassword] = useState(""); // Confirm password state
    const [phone, setPhone] = useState(""); // Phone number state

    const router = useRouter();

    useEffect(()=>{if(user)
        {
            router.push('/');
        }},[user]);

    // Function to handle signup
    const handleSignup = async () => {
        if (!email || !password || !rePassword || !phone) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        if (password !== rePassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_SERVERURL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    phoneNumber: phone,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful signup
                Alert.alert("Success", "Account created successfully!");
                register({ email, token: data.token }); // Log the user in
                router.push("/"); // Redirect to home page
            } else {
                // Handle error
                Alert.alert("Signup Failed", data.message || "Unable to create an account.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            Alert.alert("Error", "An error occurred while trying to sign up.");
        }
    };

    const goToLogin = () => {
        router.push("auth/login"); // Redirect to the signup page
    };
    

    return (
        <ThemedView style={styles.container} viewColor="background">
            <ThemedView style={styles.formContainer} viewColor="secondary">
                <ThemedText type="title">Sign Up</ThemedText>
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
                    <ThemedInput
                        label="Confirm Password"
                        placeHolder="Re-enter your password"
                        secret
                        value={rePassword}
                        onChangeText={setRePassword}
                    />
                    <ThemedInput
                        label="Phone Number"
                        placeHolder="Enter your phone number"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </ThemedView>
                <ThemedView style={styles.buttonContainer} viewColor="transparent">
                    <ThemedButton
                        text="Sign Up"
                        icon="login"
                        iconSize={18}
                        containerStyles={styles.signupButton}
                        onPress={handleSignup}
                    />
                    <ThemedButton
                        text="Go to Login"
                        icon="login"
                        iconSize={18}
                        containerStyles={styles.signinButton}
                        onPress={goToLogin}
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
    signupButton: {
        marginTop: 20,
        padding: 10,
        width: 250,
        alignItems: "center",
        borderRadius: 15,
        justifyContent: "space-between",
    },
    signinButton: {
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
