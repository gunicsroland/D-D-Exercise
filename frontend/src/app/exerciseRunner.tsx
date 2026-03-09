import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useExercisePlanContext } from "../context/ExercisePlanContext";
import { useRouter } from "expo-router";

export default function ExerciseRunner() {
  const { plan, clearPlan } = useExercisePlanContext();
  const router = useRouter();

  const [index, setIndex] = useState(0);

  if (plan.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No exercises in plan</Text>
      </View>
    );
  }

  const exercise = plan[index];

  const nextExercise = () => {
    if (index < plan.length - 1) {
      setIndex(index + 1);
    } else {
      finishWorkout();
    }
  };

  const prevExercise = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const finishWorkout = () => {
    
    clearPlan();
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>

      <View style={{ flex: 3 }}>
        {exercise.media_url ? (
          <WebView source={{ uri: exercise.media_url }} />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>No media for this exercise</Text>
          </View>
        )}
      </View>

      <View
        style={{
          flex: 2,
          padding: 20,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            {exercise.name}
          </Text>

          <Text style={{ fontSize: 18 }}>
            Amount: {exercise.quantity}
          </Text>

          <Text style={{ marginTop: 6 }}>
            Exercise {index + 1} / {plan.length}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={prevExercise}
            style={{
              backgroundColor: "#888",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white" }}>Prev</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextExercise}
            style={{
              backgroundColor: "#10b981",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white" }}>Finished</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextExercise}
            style={{
              backgroundColor: "#ef4444",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white" }}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}