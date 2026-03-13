import { View, Text, TouchableOpacity } from "react-native"
import { Exercise } from "../types/types"
import React from "react"
import { useExercisePlanContext } from "../context/ExercisePlanContext";

export function ExerciseCard({ exercise }: { exercise: Exercise}) {
    const { plan, addExercise, startPlan } = useExercisePlanContext();

    const  startSingleExercise = (exercise: Exercise) => {
        addExercise(exercise);
        startPlan();
    }

    return (
        <View
            style={{
                flexDirection: "row"
            }}>
            <View
                style={{
                    padding: 12,
                    backgroundColor: "#f4f4f4",
                    marginHorizontal: 16,
                    marginBottom: 10,
                    borderRadius: 8,
                }}
            >
                <Text style={{ fontWeight: "bold" }}>{exercise.name}</Text>
                <Text>Kategória: {exercise.category}</Text>
                <Text>Nehézség: {exercise.difficulty}</Text>
                <Text>XP: {exercise.xp_reward}</Text>
            </View>
            <View>
                <TouchableOpacity onPress={() => addExercise(exercise)}
                    style={{ padding: 6, backgroundColor: "#4caf50", borderRadius: 6 }}>
                    <Text style={{color: "white"}}>+ Hozzáadás tervhez</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => startSingleExercise(exercise)}
                    style={{ padding: 6, backgroundColor: "#4caf50", borderRadius: 6 }}>
                    <Text style={{color: "white"}}>+ Elindít</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}