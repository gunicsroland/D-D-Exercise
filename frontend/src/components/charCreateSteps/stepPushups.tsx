import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';

export default function StepPushups({ pushups, setPushups }:
    { pushups: number, setPushups: (value: number) => void }) {

    const { loading, token } = useAuthContext();
    const router = useRouter()

    useEffect(() => {
        if (!loading && !token) {
            router.replace("/login");
        }
    }, [loading, token]);

    return (
        <View>
            <Text>Add meg, hogy hány fekvőtámaszt tudsz megcsinálni egy perc alatt:</Text>
            <TextInput
                placeholder="Fekvőtámaszok száma"
                keyboardType="numeric"
                value={pushups.toString()}
                onChangeText={text => setPushups(Number(text))}
            />
        </View>
    )
}