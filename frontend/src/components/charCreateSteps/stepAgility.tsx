import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useAuthContext } from '../../context/AuthContext';

export default function StepAgility({ agility, setAgility }:
    { agility: number, setAgility: (value: number) => void }
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
            <Text>Add meg mennyire vagy hajlékony:</Text>
            <TextInput
                placeholder="Hajlékonyság szintje"
                keyboardType="numeric"
                value={agility.toString()}
                onChangeText={text => setAgility(Number(text))}
            />
        </View>
    )
}