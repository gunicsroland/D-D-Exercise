import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Register from "./register";

// --- MOCKS ---

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockRegister = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuthContext: () => ({
    register: mockRegister,
  }),
}));

// --- TESTS ---

describe("Register Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all inputs and buttons", () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    expect(getByPlaceholderText("Felhasználónév")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Jelszó")).toBeTruthy();
    expect(getByText("Karakter létrehozása")).toBeTruthy();
    expect(getByText("Már van fiókom")).toBeTruthy();
  });

  it("registers successfully and navigates to home", async () => {
    mockRegister.mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(<Register />);

    fireEvent.changeText(
      getByPlaceholderText("Felhasználónév"),
      "testuser"
    );
    fireEvent.changeText(
      getByPlaceholderText("Email"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Jelszó"),
      "password123"
    );

    fireEvent.press(getByText("Karakter létrehozása"));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "testuser",
        "test@example.com",
        "password123"
      );
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("shows error message when registration fails with Error", async () => {
    mockRegister.mockRejectedValueOnce(new Error("Registration failed"));

    const { getByPlaceholderText, getByText, findByText } = render(<Register />);

    fireEvent.changeText(
      getByPlaceholderText("Felhasználónév"),
      "testuser"
    );
    fireEvent.changeText(
      getByPlaceholderText("Email"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Jelszó"),
      "password123"
    );

    fireEvent.press(getByText("Karakter létrehozása"));

    const error = await findByText("Registration failed");

    expect(error).toBeTruthy();
  });

  it("shows error message when registration fails with non-Error value", async () => {
    mockRegister.mockRejectedValueOnce("Unknown error");

    const { getByPlaceholderText, getByText, findByText } = render(<Register />);

    fireEvent.changeText(
      getByPlaceholderText("Felhasználónév"),
      "testuser"
    );
    fireEvent.changeText(
      getByPlaceholderText("Email"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Jelszó"),
      "password123"
    );

    fireEvent.press(getByText("Karakter létrehozása"));

    const error = await findByText("Unknown error");

    expect(error).toBeTruthy();
  });

  it("navigates to login screen", () => {
    const { getByText } = render(<Register />);

    fireEvent.press(getByText("Már van fiókom"));

    expect(mockPush).toHaveBeenCalledWith("login");
  });
});