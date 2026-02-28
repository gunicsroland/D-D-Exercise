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

