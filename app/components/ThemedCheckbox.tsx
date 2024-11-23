import React, {useState} from 'react';

import Checkbox, {CheckboxProps} from 'expo-checkbox';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

export type ThemedCheckboxProps = CheckboxProps & {
    viewType: 'background' | 'border';
    label?: string;
    ViewStyle?: any;
};

export function ThemedCheckbox({ViewStyle, label, ...otherProps}: ThemedCheckboxProps) {
    const [isChecked, setChecked] = useState(false);


    return (
        <ThemedView style={[{flexDirection:'row', alignItems:'center', gap:5},ViewStyle]} viewColor='transparent'>
            <Checkbox {...otherProps} value={isChecked} onValueChange={setChecked}/>
            <ThemedText>{label}</ThemedText>
        </ThemedView>
    );
}