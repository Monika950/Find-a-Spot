import { TextInput, type TextInputProps, StyleSheet } from "react-native";
import React, { useState } from "react";


import { useThemeColor } from "../hooks/UseThemeColor";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export type ThemedInputProps = TextInputProps & {
    label: string;
    placeHolder: string;
    InputContainerStyle?: any;
    secret?: boolean;
};

export function ThemedInput({
    style,
    label,
    placeHolder,
    InputContainerStyle,
    secret,
    onChangeText,
}: ThemedInputProps) {
    const textColor = useThemeColor("text");
    const secondaryTextColor = useThemeColor("secondaryText");

    const [isSecret, setIsSecret] = useState(secret);
        

    return (
        <ThemedView style={[InputContainerStyle, styles.textEntry]} viewColor="transparent">
            {label && <ThemedText>{label}</ThemedText>}
            <TextInput style={[
                { color: textColor, flex: 1 },
                style,
            ]} placeholder={placeHolder} placeholderTextColor={secondaryTextColor} secureTextEntry={isSecret} onChangeText={onChangeText} />
            <TouchableOpacity onPress={() => setIsSecret(!isSecret)}>
                {secret && 
                    <MaterialCommunityIcons name={isSecret ? "eye" : "eye-off"} size={24} color={textColor} />
                }
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    textEntry: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        gap: 10,
    },
});