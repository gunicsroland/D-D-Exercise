import { API_URL } from "../../src/constants";
import { createChar, checkCharacter, getCharacter, lvlUpAbility, updateCharacter } from "../../src/services/character_service";
import { Stats } from "../../src/types";


global.fetch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

const mockStats: Stats = {
    strength: 10,
    constitution: 10,
    dexterity: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
};

// --------------------
// CREATE CHARACTER
// --------------------
describe("createChar", () => {
    const token = "token123";

    it("creates character successfully", async () => {
        const mockResponse = { id: 1 };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await createChar(
            "Hero",
            "warrior",
            mockStats,
            1,
            token
        );

        expect(fetch).toHaveBeenCalledWith(`${API_URL}/character/1`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: "Hero",
                class_: "warrior",
                abilities: mockStats,
            }),
        });

        expect(result).toEqual(mockResponse);
    });

    it("throws error with status and text", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 400,
            text: async () => "Bad request",
        });

        await expect(
            createChar("Hero", "warrior", {} as any, 1, token)
        ).rejects.toThrow("Failed to create character: 400 Bad request");
    });
});

// --------------------
// CHECK CHARACTER
// --------------------
describe("checkCharacter", () => {
    const token = "token123";

    it("returns true if character exists", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ has_character: true }),
        });

        const result = await checkCharacter(token);

        expect(result).toBe(true);
    });

    it("returns false if character does not exist", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ has_character: false }),
        });

        const result = await checkCharacter(token);

        expect(result).toBe(false);
    });

    it("returns undefined if request fails", async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

        const result = await checkCharacter(token);

        expect(result).toBeUndefined();
    });
});

// --------------------
// GET CHARACTER
// --------------------
describe("getCharacter", () => {
    const token = "token123";

    it("returns character data", async () => {
        const mockCharacter = { id: 1, name: "Hero" };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockCharacter,
        });

        const result = await getCharacter(token);

        expect(result).toEqual(mockCharacter);
    });

    it("throws error if request fails", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
        });

        await expect(getCharacter(token)).rejects.toThrow(
            "Failed to fetch character"
        );
    });
});

// --------------------
// LEVEL UP ABILITY
// --------------------
describe("lvlUpAbility", () => {
    const token = "token123";

    it("upgrades ability successfully", async () => {
        const mockResponse = { success: true };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await lvlUpAbility(token, "strength");

        expect(fetch).toHaveBeenCalledWith(
            `${API_URL}/character/upgrade_ability?ability=strength`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        expect(result).toEqual(mockResponse);
    });

    it("throws API error message", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ detail: "Not enough points" }),
        });

        await expect(
            lvlUpAbility(token, "strength")
        ).rejects.toThrow("Not enough points");
    });

    it("falls back to default error", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(
            lvlUpAbility(token, "strength")
        ).rejects.toThrow("Upgrade failed");
    });
});

// --------------------
// UPDATE CHARACTER
// --------------------
describe("updateCharacter", () => {
    const token = "token123";

    it("returns response on success", async () => {
        const mockResponse = { ok: true };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
        });

        const result = await updateCharacter(token, { name: "NewName" } as any);

        expect(result).toEqual({ ok: true });
    });

    it("returns error message string on failure", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
        });

        const result = await updateCharacter(token, { name: "NewName" } as any);

        expect(result).toBe("Nem sikerült a név módosítás");
    });

    it("handles thrown errors", async () => {
        (global.fetch as jest.Mock).mockRejectedValue(
            new Error("Network error")
        );

        const result = await updateCharacter(token, { name: "NewName" } as any);

        expect(result).toBe("Network error");
    });
});