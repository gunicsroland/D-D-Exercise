export interface User {
  id: number,
  username: string,
  email: string,
}

export interface ActiveEffect {
  id: number,
  expires_at: string,
  attribute: AbilityType,
  increase: boolean,
  value: number
}

export interface Character {
  id: number;
  name: string;
  class_: Class;
  level: number;
  xp: number;
  ability_points: number;
  abilities: CharacterAbility[];
  active_effects: ActiveEffect[];
}

export interface CharacterAbility {
  ability: AbilityType;
  score: number;
}

export type AbilityType =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";

export type Class = "Barbár" | "Varázsló" | "Bárd"

export interface CharacterUpdatePayload {
  name?: string;
  xp?: number;
  ability_points?: number;
}

export interface Effect {
  attribute: AbilityType,
  increase: boolean,
  value: number,
  duration: number
}

export interface Item {
  id: number,
  name: string;
  description: string;
  item_type: string;
  image_url: string;
  effects: Effect[];
}

export interface InventoryEntry {
  id: number;
  user_id: number;
  quantity: number;
  item: Item;
};

export interface Session {
  id: number,
  character_id: number,
  user_id: number,
  title: string
}

export type ChatRole = "user" | "dm" | "system"

export interface Message {
  id: number,
  session_id: number,
  role: ChatRole,
  content: string
}

export type ExerciseCategory = "strength" | "cardio" | "flexibility"
 | "core"

export type ExerciseDifficulty = "very_easy" | "easy"
  | "medium" | "hard" | "very_hard"
  | "nearly_impossible"

export interface Exercise {
  id: number,
  name: string,
  category: ExerciseCategory,
  difficulty: ExerciseDifficulty,
  quantity: number,
  xp_reward: number,
  media_url: string | null
}

export type OfflineExercise = {
  exerciseId: number;
  timestamp: number;
};

export type ExercisePlan = {
  exercise: Exercise;
  uuid: number;
}

export interface Quest {
  id: number,
  name: string,
  amount: number,
  xp_reward: number,
  exercise: Exercise,
  item: Item | null
}

export interface QuestProgress {
    id: number,
    quest_id: number,
    progress: number,
    completed: boolean
}