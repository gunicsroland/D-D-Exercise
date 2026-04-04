import React from "react";
import { render } from "@testing-library/react-native";
import { ActiveEffects } from "./ActiveEffects";
import { getRemainingTime } from "../../hooks/useRemainingTime";
import { Character } from "../../types";

jest.mock("../../hooks/useRemainingTime", () => ({
    getRemainingTime: jest.fn(() => "5m"),
}));

jest.mock("../../text_labels", () => ({
    ABILITY_LABELS_HU: {
        strength: "Erő",
        agility: "Ügyesség",
    },
}));

const now = 1000000;

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
    active_effects: [
        {
            id: 1,
            attribute: "strength",
            value: 10,
            increase: true,
            expires_at: new Date(now + 600000).toISOString(),
        },
        {
            id: 2,
            attribute: "dexterity",
            value: 5,
            increase: false,
            expires_at: new Date(now - 1000).toISOString(),
        },
    ],
};

const emptyCharacter: Character = {
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
    active_effects: [],
};


it("renders only active effects", () => {
    const { queryByTestId, getByTestId } = render(
        <ActiveEffects character={mockCharacter} now={now} />
    );

    expect(getByTestId("effect-1")).toBeTruthy();
    expect(queryByTestId("effect-2")).toBeNull();
});

it("shows empty state when no active effects", () => {

  const { getByTestId } = render(
    <ActiveEffects character={emptyCharacter} now={now} />
  );

  expect(getByTestId("no-effects")).toBeTruthy();
});

it("renders effect text correctly", () => {
  const { getByTestId } = render(
    <ActiveEffects character={mockCharacter} now={now} />
  );

  const text = getByTestId("effect-text-1").props.children;

  expect(text).toBeTruthy();
});

it("calls getRemainingTime with correct args", () => {
  const { getByTestId } = render(
    <ActiveEffects character={mockCharacter} now={now} />
  );

  expect(getRemainingTime).toHaveBeenCalledWith(
    mockCharacter.active_effects[0].expires_at,
    now
  );

  expect(getRemainingTime).toHaveBeenCalled();
});

it("renders progress bar", () => {
  const { getByTestId } = render(
    <ActiveEffects character={mockCharacter} now={now} />
  );

  const fill = getByTestId("effect-bar-fill-1");

  expect(fill.props.style).toBeTruthy();
});