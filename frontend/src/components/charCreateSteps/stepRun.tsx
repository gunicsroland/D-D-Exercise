import React from 'react';
import { View, Text, TextInput } from 'react-native';

export default function StepRun({runTime, setRunTime} :
    {runTime: number, setRunTime: (value: number) => void}
) {
    return (
        <View>
            <Text>Add meg, hogy hány percig tudsz futni megállás nélkül:</Text>
            <TextInput
                placeholder="Futási idő percben"
                keyboardType="numeric"
                value={runTime.toString()}
                onChangeText={text => setRunTime(Number(text))}
            />
        </View>
    )}