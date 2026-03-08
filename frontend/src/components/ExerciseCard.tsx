import { View, Text } from "react-native"
import { Exercise } from "../types/types"
import React from "react"

export function ExerciseCard({ exercise }: { exercise: Exercise }) {

    return (
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
    )
}