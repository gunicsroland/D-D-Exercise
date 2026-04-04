import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CharacterScreen from "../../../src/app/(protected)/tabs/character";

import { useAuthContext } from "../../../src/context/AuthContext";
import { useGameContext } from "../../../src/context/GameContext";
import { lvlUpAbility, updateCharacter } from "../../../src/services/character_service";

jest.mock("../../../src/context/AuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("../../../src/context/GameContext", () => ({
  useGameContext: jest.fn(),
}));

jest.mock("../../../src/hooks/useActiveTimer", () => ({
  useActiveTimer: jest.fn(),
}));

jest.mock("../../../src/services/character_service", () => ({
  lvlUpAbility: jest.fn(),
  updateCharacter: jest.fn(),
}));

jest.mock("../../../src/components/character/AbilityList", () => ({
  AbilityList: ({ handleUpgrade }: any) => {
    const React = require("react");
    const { Text } = require("react-native");

    return (
      <Text
        testID="upgrade-button"
        onPress={() => handleUpgrade("strength")}
      >
        Upgrade
      </Text>
    );
  },
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    Ionicons: (props: any) => {
      return <Text testID="mock-icon">{props.name}</Text>;
    },
  };
});

const mockRefresh = jest.fn();

const mockCharacter = {
  id: 1,
  name: "Hero",
  class_: "Varázsló",
  level: 5,
  xp: 120,
  ability_points: 3,
  abilities: [],
  active_effects: [],
};

beforeEach(() => {
  jest.clearAllMocks();

  (useAuthContext as jest.Mock).mockReturnValue({
    token: "token123",
  });

  (useGameContext as jest.Mock).mockReturnValue({
    character: mockCharacter,
    refreshCharacter: mockRefresh,
  });
});


it("shows loading indicator when no character", () => {
  (useGameContext as jest.Mock).mockReturnValue({
    character: null,
    refreshCharacter: mockRefresh,
  });

  const { getByTestId } = render(<CharacterScreen />);
  expect(getByTestId("loading-indicator")).toBeTruthy();
});

it("renders character info", () => {
  const { getByTestId } = render(<CharacterScreen />);

  expect(getByTestId("character-name").props.children).toBe("Hero");
  expect(getByTestId("ability-points").props.children).toContain(3);
});

it("opens modal when edit button pressed", () => {
  const { getByTestId } = render(<CharacterScreen />);

  fireEvent.press(getByTestId("edit-name-button"));

  expect(getByTestId("name-modal").props.visible).toBe(true);
});

it("closes modal when cancel pressed", () => {
  const { getByTestId, queryByTestId } = render(<CharacterScreen />);

  fireEvent.press(getByTestId("edit-name-button"));
  fireEvent.press(getByTestId("cancel-name-button"));

  expect(queryByTestId("name-modal")).toBeNull();
});

it("updates character name successfully", async () => {
  (updateCharacter as jest.Mock).mockResolvedValueOnce({});

  const { getByTestId } = render(<CharacterScreen />);

  fireEvent.press(getByTestId("edit-name-button"));

  fireEvent.changeText(getByTestId("name-input"), "NewName");

  fireEvent.press(getByTestId("save-name-button"));

  await waitFor(() => {
    expect(updateCharacter).toHaveBeenCalledWith("token123", {
      name: "NewName",
    });
    expect(mockRefresh).toHaveBeenCalled();
  });
});

it("shows error when update fails", async () => {
  (updateCharacter as jest.Mock).mockRejectedValueOnce(
    new Error("Update failed")
  );

  const { getByTestId, findByTestId } = render(<CharacterScreen />);

  fireEvent.press(getByTestId("edit-name-button"));

  fireEvent.changeText(getByTestId("name-input"), "NewName");
  fireEvent.press(getByTestId("save-name-button"));

  const error = await findByTestId("error-text");

  expect(error.props.children).toBe("Update failed");
});

it("calls lvlUpAbility when upgrading", async () => {
  (lvlUpAbility as jest.Mock).mockResolvedValueOnce({});

  const { getByTestId } = render(<CharacterScreen />);

  fireEvent.press(getByTestId("upgrade-button"));

  await waitFor(() => {
    expect(lvlUpAbility).toHaveBeenCalledWith("token123", "strength");
    expect(mockRefresh).toHaveBeenCalled();
  });
});