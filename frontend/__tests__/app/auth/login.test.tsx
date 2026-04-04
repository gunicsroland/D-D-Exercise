import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Login from "../../../src/app/(auth)/login";

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

jest.mock("../../../src/context/AuthContext", () => ({
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
    const { getByTestId } = render(<Login />);

    expect(getByTestId("username-input")).toBeTruthy();
    expect(getByTestId("password-input")).toBeTruthy();
    expect(getByTestId("login-button")).toBeTruthy();
    expect(getByTestId("register-button")).toBeTruthy();
  });

  it("logs in successfully and navigates to home", async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    const { getByTestId } = render(<Login />);

    fireEvent.changeText(getByTestId("username-input"), "testuser");
    fireEvent.changeText(getByTestId("password-input"), "password123");

    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser", "password123");
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("shows error message on failed login", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid login"));

    const { getByTestId, findByTestId } = render(<Login />);

    fireEvent.changeText(getByTestId("username-input"), "wrong");
    fireEvent.changeText(getByTestId("password-input"), "wrong");

    fireEvent.press(getByTestId("login-button"));

    const error = await findByTestId("login-error");

    expect(error).toBeTruthy();
  });

  it("navigates to register screen", () => {
    const { getByTestId } = render(<Login />);

    fireEvent.press(getByTestId("register-button"));

    expect(mockPush).toHaveBeenCalledWith("register");
  });
});