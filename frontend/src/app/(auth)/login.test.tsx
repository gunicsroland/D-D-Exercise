import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Login from "./login";

// --- MOCKS ---

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockLogin = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuthContext: () => ({
    login: mockLogin,
  }),
}));

// --- TESTS ---

describe("Login Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all elements", () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    expect(getByPlaceholderText("Felhasználónév")).toBeTruthy();
    expect(getByPlaceholderText("Jelszó")).toBeTruthy();
    expect(getByText("Belépés")).toBeTruthy();
    expect(getByText("Regisztráció")).toBeTruthy();
  });

  it("logs in successfully and navigates to home", async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(<Login />);

    fireEvent.changeText(
      getByPlaceholderText("Felhasználónév"),
      "testuser"
    );
    fireEvent.changeText(
      getByPlaceholderText("Jelszó"),
      "password123"
    );

    fireEvent.press(getByText("Belépés"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser", "password123");
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("shows error message on failed login", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid login"));

    const { getByPlaceholderText, getByText, findByText } = render(<Login />);

    fireEvent.changeText(
      getByPlaceholderText("Felhasználónév"),
      "wrong"
    );
    fireEvent.changeText(
      getByPlaceholderText("Jelszó"),
      "wrong"
    );

    fireEvent.press(getByText("Belépés"));

    const error = await findByText("Sikertelen bejelentkezés");

    expect(error).toBeTruthy();
  });

  it("navigates to register screen", () => {
    const { getByText } = render(<Login />);

    fireEvent.press(getByText("Regisztráció"));

    expect(mockPush).toHaveBeenCalledWith("register");
  });
});