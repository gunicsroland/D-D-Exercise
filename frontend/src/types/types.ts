export interface User {
    id: number,
    username: string,
    email: string,
}

export interface Character {
  id: number;
  name: string;
  class_: Class;
  level: number;
  xp: number;
  ability_points: number;
  abilities: CharacterAbility[];
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

export interface Item {
  id: number,
  name: string;
  description: string;
  item_type: string;
  image_url: string;
}

export interface InventoryEntry {
  id: number;
  user_id: number;
  quantity: number;
  item: Item;
};