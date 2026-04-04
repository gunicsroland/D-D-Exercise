import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { InventoryItem } from "../../src/components/InventoryItem";
import { consumeItem } from "../../src/services/inventory_service";

jest.mock("../../src/services/inventory_service", () => ({
    consumeItem: jest.fn(),
}));

const mockEntry = {
    item: {
        id: "item-1",
        name: "Health Potion",
        image_url: "http://image.url",
        description: "Restores health",
        effects: [
            { attribute: "strength", increase: true, value: 10, duration: 5 },
        ],
    },
    quantity: 2,
};

const onInventoryChange = jest.fn();
const token = "token123";

beforeEach(() => {
    jest.clearAllMocks();
});

it("renders item correctly", () => {
    const { getByTestId } = render(
        <InventoryItem
            entry={mockEntry as any}
            onInventoryChange={onInventoryChange}
            token={token}
        />
    );

    expect(getByTestId("item-name").props.children).toBe("Health Potion");
    expect(getByTestId("item-quantity").props.children).toEqual(["x", 2]);
});

it("opens modal on press", () => {
    const { getByTestId, queryByTestId } = render(
        <InventoryItem
            entry={mockEntry as any}
            onInventoryChange={onInventoryChange}
            token={token}
        />
    );

    fireEvent.press(getByTestId("inventory-item"));
    expect(queryByTestId("modal-panel")).toBeTruthy();
});

it("closes modal when close button is pressed", () => {
    const { getByTestId, queryByTestId } = render(
        <InventoryItem
            entry={mockEntry as any}
            onInventoryChange={onInventoryChange}
            token={token}
        />
    );

    fireEvent.press(getByTestId("inventory-item"));
    fireEvent.press(getByTestId("close-button"));

    expect(queryByTestId("modal-panel")).toBeNull();
});

it("calls consumeItem and refreshes inventory", async () => {
    (consumeItem as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByTestId } = render(
        <InventoryItem
            entry={mockEntry as any}
            onInventoryChange={onInventoryChange}
            token={token}
        />
    );

    fireEvent.press(getByTestId("inventory-item"));
    fireEvent.press(getByTestId("consume-button"));

    await waitFor(() => {
        expect(consumeItem).toHaveBeenCalledWith(token, "item-1");
        expect(onInventoryChange).toHaveBeenCalled();
    });
});