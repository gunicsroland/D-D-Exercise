import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';

export default function StepRun({ runTime, setRunTime }:
    { runTime: number, setRunTime: (value: number) => void }
) {
    const { loading, token } = useAuthContext();
    const router = useRouter()

    useEffect(() => {
        if (!loading && !token) {
            router.replace("/login");
        }
    }, [loading, token]);

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
    )
}