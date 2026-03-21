import { View, Text } from 'react-native';
import { BASE_STATS_BY_CLASS } from '../../constants';
import { CLASS_LABELS_HU } from "../../text_labels";
import { useEffect } from 'react';
import React from 'react';
import { creation_styles } from '../../styles/creation';

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

    useEffect(() => {
        const baseStats = BASE_STATS_BY_CLASS[selectedClass as keyof typeof BASE_STATS_BY_CLASS];

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

    const stats = finalStats ?? {
        strength: 0,
        constitution: 0,
        dexterity: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
    };

    const StatRow = ({ label, value }: { label: string; value: number }) => (
        <View style={creation_styles.statRow}>
            <Text style={creation_styles.statLabel}>{label}</Text>

            <View style={creation_styles.barBackground}>
                <View style={[creation_styles.barFill, { width: `${value/20 *100}%` }]} />
            </View>

            <Text style={creation_styles.statValue}>{value}</Text>
        </View>
    );

  return (
    <View style={creation_styles.container}>
      <Text style={creation_styles.title}>Karakter Összegzés</Text>

      <View style={creation_styles.card}>
        <Text style={creation_styles.characterName}>{name}</Text>
        <Text style={creation_styles.characterClass}>
          {CLASS_LABELS_HU[selectedClass]}
        </Text>

        <View style={creation_styles.divider} />

        <StatRow label="Erő" value={stats.strength} />
        <StatRow label="Állóképesség" value={stats.constitution} />
        <StatRow label="Ügyesség" value={stats.dexterity} />
        <StatRow label="Intelligencia" value={stats.intelligence} />
        <StatRow label="Bölcsesség" value={stats.wisdom} />
        <StatRow label="Karizma" value={stats.charisma} />
      </View>
    </View>
  );
}