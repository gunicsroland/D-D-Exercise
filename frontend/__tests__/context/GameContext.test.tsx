import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";
import { AppState } from "react-native";
import { useGameContext, GameProvider } from "../../src/context/GameContext";
import { getCharacter } from "../../src/services/character_service";
import { getInventory } from "../../src/services/inventory_service";

jest.mock("../../src/context/AuthContext", () => ({
  useAuthContext: () => ({
    token: "token123",
  }),
}));

jest.mock("../../src/services/character_service", () => ({
  getCharacter: jest.fn(),
}));

jest.mock("../../src/services/inventory_service", () => ({
  getInventory: jest.fn(),
}));

const TestComponent = () => {
  const {
    character,
    inventory,
    loading,
    refreshCharacter,
    refreshInventory,
    refreshAll,
  } = useGameContext();

  return null;
};

beforeEach(() => {
  jest.clearAllMocks();
});

it("throws error when used outside provider", () => {
  expect(() => {
    render(<TestComponent />);
  }).toThrow("useGameContext must be used within GameProvider");
});

it("loads character and inventory on mount", async () => {
  (getCharacter as jest.Mock).mockResolvedValue({
    id: "char1",
    name: "Hero",
  });

  (getInventory as jest.Mock).mockResolvedValue([
    { item: { id: "item1", name: "Potion" }, quantity: 1 },
  ]);

  let contextValue: any;

  const TestWrapper = () => {
    contextValue = useGameContext();
    return null;
  };

  render(
    <GameProvider>
      <TestWrapper />
    </GameProvider>,
  );

  await waitFor(() => {
    expect(getCharacter).toHaveBeenCalledWith("token123");
    expect(getInventory).toHaveBeenCalledWith("token123");

    expect(contextValue.character).toEqual({
      id: "char1",
      name: "Hero",
    });

    expect(contextValue.inventory.length).toBe(1);
    expect(contextValue.loading).toBe(false);
  });
});

it("handles refreshCharacter manually", async () => {
  (getCharacter as jest.Mock).mockResolvedValue({
    id: "char2",
    name: "Mage",
  });

  let contextValue: any;

  const TestWrapper = () => {
    contextValue = useGameContext();
    return null;
  };

  render(
    <GameProvider>
      <TestWrapper />
    </GameProvider>,
  );

  await act(async () => {
    await contextValue.refreshCharacter();
  });

  expect(getCharacter).toHaveBeenCalledWith("token123");
  expect(contextValue.character).toEqual({
    id: "char2",
    name: "Mage",
  });
});

it("handles refreshInventory manually", async () => {
  (getInventory as jest.Mock).mockResolvedValue([
    { item: { id: "item2", name: "Sword" }, quantity: 2 },
  ]);

  let contextValue: any;

  const TestWrapper = () => {
    contextValue = useGameContext();
    return null;
  };

  render(
    <GameProvider>
      <TestWrapper />
    </GameProvider>,
  );

  await act(async () => {
    await contextValue.refreshInventory();
  });

  expect(getInventory).toHaveBeenCalledWith("token123");
  expect(contextValue.inventory.length).toBe(1);
});

it("refreshAll updates both character and inventory", async () => {
  (getCharacter as jest.Mock).mockResolvedValue({
    id: "char3",
    name: "Warrior",
  });

  (getInventory as jest.Mock).mockResolvedValue([]);

  let contextValue: any;

  const TestWrapper = () => {
    contextValue = useGameContext();
    return null;
  };

  render(
    <GameProvider>
      <TestWrapper />
    </GameProvider>,
  );

  await act(async () => {
    await contextValue.refreshAll();
  });

  expect(getCharacter).toHaveBeenCalled();
  expect(getInventory).toHaveBeenCalled();

  expect(contextValue.character).toEqual({
    id: "char3",
    name: "Warrior",
  });

  expect(contextValue.inventory).toEqual([]);
});

it("refreshAll sets loading state correctly", async () => {
  (getCharacter as jest.Mock).mockResolvedValue({});
  (getInventory as jest.Mock).mockResolvedValue([]);

  let contextValue: any;

  const TestWrapper = () => {
    contextValue = useGameContext();
    return null;
  };

  render(
    <GameProvider>
      <TestWrapper />
    </GameProvider>,
  );

  expect(contextValue.loading).toBe(true);

  await waitFor(() => {
    expect(contextValue.loading).toBe(false);
  });
});
