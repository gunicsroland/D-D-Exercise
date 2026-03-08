import { API_URL } from "../constants";
import { ExerciseDifficulty } from "../types/types";

export async function getExercises(token: string) {
    const res = await fetch(`${API_URL}/exercises/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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
            "Authorization": `Bearer ${token}`
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
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch progress for daily quests");
    }

    return res.json();
}

export async function setQuestDifficulty(token:string, difficulty: ExerciseDifficulty) {
    const res = await fetch(`${API_URL}/user/quest_difficulty`, {
        method: "PUT",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            quest_difficulty: difficulty
        }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to update difficulty");
    }

    return await res.json();
}