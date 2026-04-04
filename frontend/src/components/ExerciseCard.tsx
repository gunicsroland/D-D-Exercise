import { View, Text, TouchableOpacity } from "react-native";
import { Exercise } from "../types";
import React from "react";
import { useExercisePlanContext } from "../context/ExercisePlanContext";
import { exerciseCard_styles } from "../styles/exerciseCard";
import { DIFFICULTY_LABELS_HU, EXERCISE_TYPE_LABELS_HU } from "../text_labels";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const { addExercise, startPlan } = useExercisePlanContext();

  const startSingleExercise = (exercise: Exercise) => {
    addExercise(exercise);
    startPlan();
  };

  return (
    <View style={exerciseCard_styles.card} testID={`exercise-card-${exercise.id}`}>
      <View style={exerciseCard_styles.info}>
        <Text style={exerciseCard_styles.title} testID={`exercise-name-${exercise.id}`}>{exercise.name}</Text>

        <Text style={exerciseCard_styles.meta} testID={`exercise-category-${exercise.id}`}>
          Kategória: {EXERCISE_TYPE_LABELS_HU[exercise.category]}
        </Text>
        <Text style={exerciseCard_styles.meta} testID={`exercise-difficulty-${exercise.id}`}>
          Nehézség: {DIFFICULTY_LABELS_HU[exercise.difficulty]}
        </Text>

        <Text style={exerciseCard_styles.xp} testID={`exercise-xp-${exercise.id}`}>+{exercise.xp_reward} XP</Text>
      </View>

      <View style={exerciseCard_styles.actions}>
        <TouchableOpacity
          onPress={() => addExercise(exercise)}
          style={exerciseCard_styles.addButton}
          testID={`add-button-${exercise.id}`}
        >
          <Text style={exerciseCard_styles.buttonText}>+ Tervhez</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => startSingleExercise(exercise)}
          style={exerciseCard_styles.startButton}
          testID={`start-button-${exercise.id}`}
        >
          <Text style={exerciseCard_styles.buttonText}>⚔ Indít</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
