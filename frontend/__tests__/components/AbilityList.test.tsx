import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AbilityList } from "../../src/components/character/AbilityList";

import { getAbilityBonus } from "../../src/hooks/useAbilityBonus";
import { Character } from "../../src/types";

jest.mock("../../hooks/useAbilityBonus", () => ({
  getAbilityBonus: jest.fn(),
}));

jest.mock("../../text_labels", () => ({
  ABILITY_LABELS_HU: {
    strength: "Erő",
    agility: "Ügyesség",
  },
}));

beforeEach(() => {
    jest.clearAllMocks();
});

const mockCharacter: Character = {
  id: 1,
  name: "Hero",
  class_: "Barbár",
  level: 1,
  xp: 50,
  ability_points: 1,
  abilities: [
    { ability: "strength", score: 5 },
    { ability: "dexterity", score: 3 },
  ],
  active_effects: []
};

it("renders abilities", () => {
  (getAbilityBonus as jest.Mock).mockReturnValue(0);

  const handleUpgrade = jest.fn();

  const { getByTestId } = render(
    <AbilityList
      character={mockCharacter}
      handleUpgrade={handleUpgrade}
      now={0}
    />
  );

  expect(getByTestId("ability-card-strength")).toBeTruthy();
  expect(getByTestId("ability-card-dexterity")).toBeTruthy();
});

it("calls handleUpgrade when pressed", () => {
  (getAbilityBonus as jest.Mock).mockReturnValue(0);

  const handleUpgrade = jest.fn();

  const { getByTestId } = render(
    <AbilityList
      character={mockCharacter}
      handleUpgrade={handleUpgrade}
      now={0}
    />
  );

  fireEvent.press(getByTestId("upgrade-button-strength"));

  expect(handleUpgrade).toHaveBeenCalledWith("strength");
});

it("disables upgrade button when no ability points", () => {
  (getAbilityBonus as jest.Mock).mockReturnValue(0);

  const handleUpgrade = jest.fn();

  const character = {
    ...mockCharacter,
    ability_points: 0,
  };

  const { getByTestId } = render(
    <AbilityList
      character={character}
      handleUpgrade={handleUpgrade}
      now={0}
    />
  );

  const button = getByTestId("upgrade-button-strength");

  fireEvent.press(button);

  expect(handleUpgrade).not.toHaveBeenCalled();
});

it("shows bonus in value", () => {
  (getAbilityBonus as jest.Mock).mockReturnValue(2);

  const handleUpgrade = jest.fn();

  const { getByTestId } = render(
    <AbilityList
      character={mockCharacter}
      handleUpgrade={handleUpgrade}
      now={0}
    />
  );

  const value = getByTestId("ability-value-strength").props.children;

  expect(value).toBeTruthy();
});