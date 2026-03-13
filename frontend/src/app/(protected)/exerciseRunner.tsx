import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useExercisePlanContext } from "../../context/ExercisePlanContext";
import { useRouter } from "expo-router";
import { useAuthContext } from "../../context/AuthContext";
import { finishExercise } from "../../services/quest_service";
import { ExercisePlan } from "../../types/types";

export default function ExerciseRunner() {
    const { plan, clearPlan } = useExercisePlanContext();
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
            setIndex(prev => prev + 1);
            return;
        }

        const timer = setTimeout(() => {
            setPauseTime(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [pauseTime, isPause]);

    if (plan.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>No exercises in plan</Text>
            </View>
        );
    }

    const exercise = plan[index].exercise;

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

    const completeCurrentExercise = () => {

        setCompleted(prevCompleted => prevCompleted.add(plan[index]))

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
            } catch (err) {
                console.error("Failed exercise:", exercisePlan.exercise.id);
            }
        }

        clearPlan();
        router.back();
    };

    if (isPause) {
        const nextExercise = plan[index + 1].exercise;

        return (
            <View style={{ flex: 1, justifyContent: "space-between", padding: 20 }}>

                <View style={{ alignItems: "center", marginTop: 60 }}>
                    <Text style={{ fontSize: 36, fontWeight: "bold" }}>
                        {pauseTime}s
                    </Text>

                    <Text style={{ fontSize: 18, marginTop: 20 }}>
                        Next Exercise
                    </Text>

                    <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>
                        {nextExercise.name}
                    </Text>

                    <Text style={{ fontSize: 18 }}>
                        Amount: {nextExercise.quantity}
                    </Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity
                        onPress={() => setPauseTime(prev => prev + 10)}
                        style={{
                            backgroundColor: "#3b82f6",
                            padding: 14,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: "white" }}>+10s</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            setIsPause(false);
                            setIndex(prev => prev + 1);
                        }}
                        style={{
                            backgroundColor: "#ef4444",
                            padding: 14,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: "white" }}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

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
                        onPress={completeCurrentExercise}
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