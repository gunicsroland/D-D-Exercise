import React from "react";
import { useAuthContext } from "../../../src/context/AuthContext";
import { useGameContext } from "../../../src/context/GameContext";
import InventoryScreen from "../../../src/app/(protected)/tabs/inventory";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";

jest.mock("../../../src/context/AuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("../../../src/context/GameContext", () => ({
  useGameContext: jest.fn(),
}));

jest.mock("../../../src/components/InventoryItem", () => ({
  InventoryItem: ({ entry }: any) => {
    const React = require("react");
    const { View, Text } = require("react-native");

    return (
      <View testID={`inventory-item-${entry.id}`}>
        <Text>{entry.item.name}</Text>
      </View>
    );
  },
}));

const mockInventory = [
  {
    id: 1,
    user_id: 1,
    quantity: 1,
    item: {
      id: 1,
      name: "Sword",
      description: "",
      item_type: "",
      image_url: "",
      effects: [],
    },
  },
  {
    id: 2,
    user_id: 1,
    quantity: 1,
    item: {
      id: 2,
      name: "Shield",
      description: "",
      item_type: "",
      image_url: "",
      effects: [],
    },
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

it("shows loader when no token", () => {
  (useAuthContext as jest.Mock).mockReturnValue({ token: null });

  (useGameContext as jest.Mock).mockReturnValue({
    inventory: [],
    refreshAll: jest.fn(),
  });

  const { getByTestId } = render(<InventoryScreen />);

  expect(getByTestId("inventory-loader")).toBeTruthy();
});

it("shows empty message when inventory is empty", () => {
  (useAuthContext as jest.Mock).mockReturnValue({ token: "token" });

  (useGameContext as jest.Mock).mockReturnValue({
    inventory: [],
    refreshAll: jest.fn(),
  });

  const { getByTestId, getByText } = render(<InventoryScreen />);

  expect(getByTestId("inventory-list")).toBeTruthy();
  expect(getByText("Az eszköztár üres.")).toBeTruthy();
});

it("renders inventory items", async () => {
  (useAuthContext as jest.Mock).mockReturnValue({ token: "token" });

  (useGameContext as jest.Mock).mockReturnValue({
    inventory: mockInventory,
    refreshAll: jest.fn(),
  });

  const { findByTestId } = render(<InventoryScreen />);

  expect(await findByTestId("inventory-item-1")).toBeTruthy();
});

it("renders grid with multiple items", async () => {
  (useAuthContext as jest.Mock).mockReturnValue({ token: "token" });

  (useGameContext as jest.Mock).mockReturnValue({
    inventory: mockInventory,
    refreshAll: jest.fn(),
  });

  const { findByTestId } = render(<InventoryScreen />);

  expect(await findByTestId("inventory-item-1")).toBeTruthy();
  expect(await findByTestId("inventory-item-2")).toBeTruthy();
});
