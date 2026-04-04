import { API_URL } from "../../src/constants";
import {
  consumeItem,
  getInventory,
} from "../../src/services/inventory_service";

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("consumeItem", () => {
  const token = "token123";

  it("calls API with correct params", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({});

    await consumeItem(token, 42);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/inventory/consume/42`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  });

  it("throw if request fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    await expect(consumeItem(token, 42)).rejects.toThrow("Network error");
  });
});

describe("getInventory", () => {
  const token = "token123";

  it("returns inventory data on success", async () => {
    const mockInventory = [{ id: 1, name: "Potion" }];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockInventory,
    });

    const result = await getInventory(token);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/inventory/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    expect(result).toEqual(mockInventory);
  });

  it("throws error if request fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(getInventory(token)).rejects.toThrow(
      "Failed to fetch character",
    );
  });
});
