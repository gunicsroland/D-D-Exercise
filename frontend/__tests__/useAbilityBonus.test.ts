import { getAbilityBonus } from "../src/hooks/useAbilityBonus";
import { Character } from "../src/types";

const mockNow = new Date("2026-01-01T12:00:00Z").getTime();

const mockCharacter: Character = {
  id: 1,
  name: "Hero",
  class_: "Varázsló",
  level: 5,
  xp: 120,
  ability_points: 3,
  abilities: [],
  active_effects: [],
};

it("returns 0 if character is null", () => {
  expect(getAbilityBonus(null, "strength", mockNow)).toBe(0);
});

it("returns 0 if no active effects", () => {
  expect(getAbilityBonus(mockCharacter, "strength", mockNow)).toBe(0);
});

it("sums only matching ability effects", () => {
  const character: Character = {
    active_effects: [
      {
        attribute: "strength",
        value: 5,
        increase: true,
        expires_at: "2026-01-01T13:00:00Z",
      },
      {
        attribute: "dexterity",
        value: 10,
        increase: true,
        expires_at: "2026-01-01T13:00:00Z",
      },
    ],
  } as Character;

  expect(getAbilityBonus(character, "strength", mockNow)).toBe(5);
});

it("ignores expired effects", () => {
  const character: Character = {
    active_effects: [
      {
        attribute: "strength",
        value: 5,
        increase: true,
        expires_at: "2026-01-01T11:00:00Z",
      },
    ],
  } as Character;

  expect(getAbilityBonus(character, "strength", mockNow)).toBe(0);
});

it("handles decrease effects correctly", () => {
  const character: Character = {
    active_effects: [
      {
        attribute: "strength",
        value: 5,
        increase: true,
        expires_at: "2026-01-01T13:00:00Z",
      },
      {
        attribute: "strength",
        value: 2,
        increase: false,
        expires_at: "2026-01-01T13:00:00Z",
      },
    ],
  } as Character;

  expect(getAbilityBonus(character, "strength", mockNow)).toBe(3);
});

it("handles multiple effects correctly", () => {
  const character: Character = {
    active_effects: [
      {
        attribute: "strength",
        value: 5,
        increase: true,
        expires_at: "2026-01-01T13:00:00Z",
      },
      {
        attribute: "strength",
        value: 3,
        increase: true,
        expires_at: "2026-01-01T13:00:00Z",
      },
    ],
  } as Character;

  expect(getAbilityBonus(character, "strength", mockNow)).toBe(8);
});
