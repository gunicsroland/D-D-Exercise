import { View, Text, TouchableOpacity } from "react-native";
import { Quest, QuestProgress } from "../types/types";
import { Bar } from 'react-native-progress';
import React from "react";
import { useExercisePlanContext } from "../context/ExercisePlanContext";
import { exerciseCard_styles } from "../styles/exerciseCard";
import { DIFFICULTY_LABELS_HU } from "../text_labels";

export function QuestCard({ quest, progress }: { quest: Quest, progress: QuestProgress | undefined }) {
    const { plan, addExercise, startPlan } = useExercisePlanContext();

    return (
        <View
            style={{
                backgroundColor: "#2c2c2c",
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
            }}
        >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
                {quest.name} ({DIFFICULTY_LABELS_HU[quest.exercise.difficulty]})
            </Text>

            <Text style={{ color: "#ddd" }}>
                Edzés: {quest.exercise.name}
            </Text>

            <View>
                <Text style={{ color: "#ddd" }}>
                </Text>
                <View style={{ height: 24, width: "100%", backgroundColor: "#ddd", borderRadius: 10, overflow: "hidden", marginVertical: 5 }}>
                    <View style={{ height: "100%", width: `${(progress?.progress ?? 0) / quest.amount * 100}%`, backgroundColor: "#4caf50", position: "absolute" }} />
                    <Text style={{ color: "#000", fontWeight: "bold", alignSelf: "center", zIndex: 1, }}>{progress?.progress}/{quest.amount} Darab</Text>
                </View>
            </View>


            <Text style={{ color: "#ffd700" }}>
                XP Jutalom: {quest.xp_reward}
            </Text>

            <TouchableOpacity
                onPress={() => addExercise(quest.exercise)}
                style={[exerciseCard_styles.addButton, {width: "50%", marginTop: 5}]}
            >
                <Text style={exerciseCard_styles.buttonText}>+ Tervhez</Text>
            </TouchableOpacity>

            {quest.item && (
                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: "#7dd3fc" }}>
                        Tárgy Jutalom: {quest.item.name}
                    </Text>

                    {quest.item.effects.map((effect, index) => (
                        <Text key={index} style={{ color: "#bbb" }}>
                            {effect.increase ? "+" : "-"}
                            {effect.value} {effect.attribute} ({effect.duration} perc)
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
}