import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, QUEUE_KEY } from "../constants";
import { ExerciseDifficulty } from "../types/types";
import { addExerciseToQueue, getOfflineCompletions } from "./offlineStorage";

export async function getExercises(token: string) {
  const res = await fetch(`${API_URL}/exercises/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch exercies");
  }

  return res.json();
}

export async function getDailyQuests(token: string) {
  const res = await fetch(`${API_URL}/quests/daily_quests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch daily quests");
  }

  return res.json();
}

export async function getQuestProgress(token: string) {
  const res = await fetch(`${API_URL}/quests/quest_progress`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch progress for daily quests");
  }

  return res.json();
}

export async function setQuestDifficulty(
  token: string,
  difficulty: ExerciseDifficulty,
) {
  const res = await fetch(`${API_URL}/user/quest_difficulty`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      quest_difficulty: difficulty,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to update difficulty");
  }

  return await res.json();
}

export async function finishExercise(token: string, id: number) {
  try {
    const res = await fetch(`${API_URL}/exercises/finish/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    console.log("Finished exercise", id);
  } catch (error) {
    console.log("Offline, saving exercise for sync:", id);
    console.error(error);
    await addExerciseToQueue(id);
  }
}

export async function syncFinishedExercises(token: string) {
  const queue = await getOfflineCompletions();

  if (queue.length === 0) return;

  const remaining = [];

  for (const item of queue) {
    try {
      const res = await fetch(
        `${API_URL}/exercises/finish/${item.exerciseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Server error");
    } catch {
      remaining.push(item);
    }
  }

  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
}
