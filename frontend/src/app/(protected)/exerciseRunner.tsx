import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useExercisePlanContext } from "../../context/ExercisePlanContext";
import { useRouter } from "expo-router";
import { useAuthContext } from "../../context/AuthContext";
import { finishExercise } from "../../services/quest_service";
import { ExercisePlan } from "../../types";
import { exerciseRunner_styles } from "../../styles/exerciseRunner";
import { useGameContext } from "../../context/GameContext";

export default function ExerciseRunner() {
  const { plan, clearPlan } = useExercisePlanContext();
  const { refreshAll } = useGameContext();
  const { token } = useAuthContext();
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<ExercisePlan>>(new Set());

  const [isPause, setIsPause] = useState(false);
  const [pauseTime, setPauseTime] = useState(20);

  useEffect(() => {
    if (!isPause) return;

    if (pauseTime <= 0) {
      setIsPause(false);
      setIndex((prev) => prev + 1);
      return;
    }

    const timer = setTimeout(() => {
      setPauseTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pauseTime, isPause]);

  if (plan.length === 0) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        testID="empty-plan"
      >
        <Text>Nincsen edzés kiválasztva</Text>
      </View>
    );
  }

  const exercise = plan[index].exercise;

  const nextExercise = () => {
    if (index < plan.length - 1) {
      setPauseTime(20);
      setIsPause(true);
    } else {
      finishWorkout();
    }
  };

  const prevExercise = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  const completeCurrentExercise = () => {
    setCompleted((prevCompleted) => prevCompleted.add(plan[index]));

    if (index < plan.length - 1) {
      setPauseTime(20);
      setIsPause(true);
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = async () => {
    if (!token) return;

    for (const exercisePlan of completed) {
      try {
        await finishExercise(token, exercisePlan.exercise.id);
      } catch {
        console.error("Failed exercise:", exercisePlan.exercise.id);
      }
    }

    clearPlan();
    refreshAll();
    router.back();
  };

  if (isPause) {
    const nextExercise = plan[index + 1].exercise;

    return (
      <View style={exerciseRunner_styles.screen} testID="pause-screen">
        <View style={exerciseRunner_styles.pauseContainer}>
          <Text style={exerciseRunner_styles.pauseTimer} testID="pause-timer">
            {pauseTime}s
          </Text>

          <Text
            style={exerciseRunner_styles.pauseLabel}
            testID="pause-next-label"
          >
            Következő feladat
          </Text>

          <Text
            style={exerciseRunner_styles.pauseTitle}
            testID="pause-next-name"
          >
            {nextExercise.name}
          </Text>

          <Text style={exerciseRunner_styles.text}>
            Mennyiség: {nextExercise.quantity}
          </Text>
        </View>

        <View style={exerciseRunner_styles.pauseButtons}>
          <TouchableOpacity
            onPress={() => setPauseTime((prev) => prev + 10)}
            style={[
              exerciseRunner_styles.button,
              exerciseRunner_styles.blueButton,
            ]}
            testID="pause-add-10"
          >
            <Text style={exerciseRunner_styles.buttonText}>+10s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsPause(false);
              setIndex((prev) => prev + 1);
            }}
            style={[
              exerciseRunner_styles.button,
              exerciseRunner_styles.redButton,
            ]}
            testID="pause-skip"
          >
            <Text style={exerciseRunner_styles.buttonText}>Kihagyás</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={exerciseRunner_styles.screen} testID="exercise-runner-screen">
      <View style={exerciseRunner_styles.info}>
        <View>
          <Text style={exerciseRunner_styles.title} testID="exercise-name">
            {exercise.name}
          </Text>

          <Text style={exerciseRunner_styles.text} testID="exercise-quantity">
            Mennyiség: {exercise.quantity}
          </Text>

          <View style={exerciseRunner_styles.descriptionBox}>
            <Text style={exerciseRunner_styles.description}>
              {exercise.media_url}
            </Text>
          </View>

          <Text
            style={exerciseRunner_styles.progress}
            testID="exercise-progress"
          >
            Feladat: {index + 1} / {plan.length}
          </Text>
        </View>

        <View style={exerciseRunner_styles.controls}>
          <TouchableOpacity
            onPress={prevExercise}
            style={[
              exerciseRunner_styles.button,
              exerciseRunner_styles.grayButton,
            ]}
            testID="prev-button"
          >
            <Text style={exerciseRunner_styles.buttonText}>Előző</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={completeCurrentExercise}
            style={[
              exerciseRunner_styles.button,
              exerciseRunner_styles.greenButton,
            ]}
            testID="complete-button"
          >
            <Text style={exerciseRunner_styles.buttonText}>Befejezve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextExercise}
            style={[
              exerciseRunner_styles.button,
              exerciseRunner_styles.redButton,
            ]}
            testID="skip-button"
          >
            <Text style={exerciseRunner_styles.buttonText}>Kihagyás</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
