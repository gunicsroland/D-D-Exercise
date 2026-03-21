import { View, Text, TouchableOpacity } from "react-native"
import { Exercise } from "../types/types"
import React from "react"
import { useExercisePlanContext } from "../context/ExercisePlanContext";
import { exerciseCard_styles } from "../styles/exerciseCard";
import { DIFFICULTY_LABELS_HU, EXERCISE_TYPE_LABELS_HU } from "../text_labels";

export function ExerciseCard({ exercise }: { exercise: Exercise}) {
    const { plan, addExercise, startPlan } = useExercisePlanContext();

    const  startSingleExercise = (exercise: Exercise) => {
        addExercise(exercise);
        startPlan();
    }

  return (
    <View style={exerciseCard_styles.card}>
      <View style={exerciseCard_styles.info}>
        <Text style={exerciseCard_styles.title}>{exercise.name}</Text>

        <Text style={exerciseCard_styles.meta}>Kategória: {EXERCISE_TYPE_LABELS_HU[exercise.category]}</Text>
        <Text style={exerciseCard_styles.meta}>Nehézség: {DIFFICULTY_LABELS_HU[exercise.difficulty]}</Text>

        <Text style={exerciseCard_styles.xp}>+{exercise.xp_reward} XP</Text>
      </View>

      <View style={exerciseCard_styles.actions}>
        <TouchableOpacity
          onPress={() => addExercise(exercise)}
          style={exerciseCard_styles.addButton}
        >
          <Text style={exerciseCard_styles.buttonText}>+ Tervhez</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => startSingleExercise(exercise)}
          style={exerciseCard_styles.startButton}
        >
          <Text style={exerciseCard_styles.buttonText}>⚔ Indít</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}