import { TouchableOpacity } from "react-native-gesture-handler";
import React from "react";

import { ThemedText } from "./ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "../hooks/UseThemeColor";

export interface ThemedButtonProps {
    text?: string;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    textStyles?: any;
    iconStyles?: any;
    iconSize?: number;
    containerStyles?: any;
    onPress?: () => void;
}

export function ThemedButton({ text, icon, textStyles, iconStyles, containerStyles, onPress, iconSize }: ThemedButtonProps) {
    let color = useThemeColor("text");
    
    return (
        <TouchableOpacity style={[{flexDirection:"row", alignItems:"center", gap:5}, containerStyles]} onPress={onPress}>
            {text && <ThemedText style={textStyles}>{text}</ThemedText>}
            {icon && <MaterialCommunityIcons name={icon} style={iconStyles} color={color} size={iconSize}/>}
        </TouchableOpacity>
    )
}