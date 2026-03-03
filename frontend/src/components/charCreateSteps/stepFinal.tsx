import { View, Text } from 'react-native';
import { BASE_STATS_BY_CLASS, CLASS_LABELS_HU } from '../../constants';
import { useEffect } from 'react';
import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function StepFinal({
    finalStats, setFinalStats,
    selectedClass, name,
    pushups, runTime, agility }:

    {
        finalStats: any,
        setFinalStats: (stats: any) => void,
        selectedClass: string,
        name: string,
        pushups: number,
        runTime: number,
        agility: number
    }) {

    const {loading, token} = useAuthContext();
    const router = useRouter()

    useEffect(() => {
        let baseStats = BASE_STATS_BY_CLASS[selectedClass as keyof typeof BASE_STATS_BY_CLASS];

        const finalStats = { ...baseStats };

        finalStats.strength = baseStats.strength + (pushups ? Math.floor(pushups / 10) : 0);
        finalStats.constitution = baseStats.constitution //+ (runTime ? Math.floor((300 - runTime) / 30) : 0);
        finalStats.dexterity = baseStats.dexterity + (agility ? Math.floor(agility / 5) : 0);
        finalStats.intelligence = baseStats.intelligence;
        finalStats.wisdom = baseStats.wisdom;
        finalStats.charisma = baseStats.charisma;

        setFinalStats(finalStats);
        console.log("Final stats updated:", finalStats);
    }, [pushups, runTime, agility, selectedClass]);

    useEffect(() => {
        if (!loading && !token) {
            router.replace("/login");
        }
    }, [loading, token]);

    const stats = finalStats ?? {
        strength: 0,
        constitution: 0,
        dexterity: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
    };

    return (
        <View>
            <Text>Összegzés:</Text>
            <Text>Kiválasztott kaszt: {CLASS_LABELS_HU[selectedClass]}</Text>
            <Text>Karakter neve: {name}</Text>
            <Text>Alap statisztikák:</Text>
            <Text>Erő: {stats.strength}</Text>
            <Text>Állóképesség: {stats.constitution}</Text>
            <Text>Ügyesség: {stats.dexterity}</Text>
            <Text>Intelligencia: {stats.intelligence}</Text>
            <Text>Bölcsesség: {stats.wisdom}</Text>
            <Text>Karizma: {stats.charisma}</Text>
        </View>
    );
}