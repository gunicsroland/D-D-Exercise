import { API_URL } from "../../src/constants";
import {
  loginRequest,
  registerRequest,
  getMe,
} from "../../src/services/auth_service";

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

// --------------------
// LOGIN
// --------------------
describe("loginRequest", () => {
  it("returns data on success", async () => {
    const mockResponse = { token: "abc123" };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await loginRequest("user", "pass");

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "user", password: "pass" }),
    });

    expect(result).toEqual(mockResponse);
  });

  it("throws error with JSON detail", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "Invalid credentials" }),
    });

    await expect(loginRequest("user", "wrong")).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("falls back to text error", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error();
      },
      text: async () => "Server down",
    });

    await expect(loginRequest("user", "pass")).rejects.toThrow("Server down");
  });
});

// --------------------
// REGISTER
// --------------------
describe("registerRequest", () => {
  it("throws if fields are empty", async () => {
    await expect(registerRequest("", "email", "pass")).rejects.toThrow(
      "Minden mező kitöltése kötelező",
    );
  });

  it("returns data on success", async () => {
    const mockResponse = { id: 1 };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await registerRequest("user", "test@test.com", "pass");

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "user",
        email: "test@test.com",
        password: "pass",
      }),
    });

    expect(result).toEqual(mockResponse);
  });

  it("throws API error message", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "User already exists" }),
    });

    await expect(
      registerRequest("user", "test@test.com", "pass"),
    ).rejects.toThrow("User already exists");
  });
});

// --------------------
// GET ME
// --------------------
describe("getMe", () => {
  it("returns user data on success", async () => {
    const mockUser = { id: 1, username: "test" };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    });

    const result = await getMe("token123");

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/user/me`, {
      headers: {
        Authorization: "Bearer token123",
      },
    });

    expect(result).toEqual(mockUser);
  });

  it("throws on invalid token", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(getMe("bad-token")).rejects.toThrow("Invalid token");
  });
});
