import AsyncStorage from "@react-native-async-storage/async-storage";
import { QUEUE_KEY } from "../constants";
import { OfflineExercise } from "../types/types";

export async function addExerciseToQueue(exerciseId: number) {
  const existing = await AsyncStorage.getItem(QUEUE_KEY);
  const completeions: OfflineExercise[] = existing ? JSON.parse(existing) : [];

  completeions.push({
    exerciseId,
    timestamp: Date.now(),
  });

  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(completeions));
}

export async function getOfflineCompletions(): Promise<OfflineExercise[]> {
  const data = await AsyncStorage.getItem(QUEUE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function clearOfflineCompletions() {
  await AsyncStorage.removeItem(QUEUE_KEY);
}
