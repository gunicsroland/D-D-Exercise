export const BASE_STATS_BY_CLASS = {
  Barbarian: { strength: 12, dexterity: 10, constitution: 12, intelligence: 8, wisdom: 10, charisma: 10 },
  Wizard: { strength: 6, dexterity: 11, constitution: 8, intelligence: 12, wisdom: 12, charisma: 10 },
  Bard: { strength: 6, dexterity: 12, constitution: 8, intelligence: 10, wisdom: 10, charisma: 12 },
};

export const API_URL = "http://localhost:8000"
export const TOKEN_KEY = "token"

export const XP_LEVELS: Record<number, number> = {
    1: 0,
    2: 300,
    3: 900,
    4: 2700,
    5: 6500,
    6: 14000,
    7: 23000,
    8: 34000,
    9: 48000,
    10: 64000,
    11: 85000,
    12: 100000,
    13: 120000,
    14: 140000,
    15: 165000,
    16: 195000,
    17: 225000,
    18: 265000,
    19: 305000,
    20: 355000,
}
export const MAX_LEVEL = 20