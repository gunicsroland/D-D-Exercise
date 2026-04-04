import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Register from "../../../src/app/(auth)/register";

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

jest.mock("../../../src/context/AuthContext", () => ({
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
    const { getByTestId } = render(<Register />);

    expect(getByTestId("username-input")).toBeTruthy();
    expect(getByTestId("email-input")).toBeTruthy();
    expect(getByTestId("password-input")).toBeTruthy();
    expect(getByTestId("register-submit-button")).toBeTruthy();
    expect(getByTestId("go-to-login-button")).toBeTruthy();
  });

  it("registers successfully and navigates to home", async () => {
    mockRegister.mockResolvedValueOnce(undefined);

    const { getByTestId } = render(<Register />);

    fireEvent.changeText(getByTestId("username-input"), "testuser");
    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");

    fireEvent.press(getByTestId("register-submit-button"));

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

    const { getByTestId, findByTestId } = render(<Register />);

    fireEvent.changeText(getByTestId("username-input"), "testuser");
    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");

    fireEvent.press(getByTestId("register-submit-button"));

    const error = await findByTestId("register-error");

    expect(error).toBeTruthy();
  });

  it("shows error message when registration fails with non-Error value", async () => {
    mockRegister.mockRejectedValueOnce("Unknown error");

    const { getByTestId, findByTestId } = render(<Register />);

    fireEvent.changeText(getByTestId("username-input"), "testuser");
    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");

    fireEvent.press(getByTestId("register-submit-button"));

    const error = await findByTestId("register-error");

    expect(error).toBeTruthy();
  });

  it("navigates to login screen", () => {
    const { getByTestId } = render(<Register />);

    fireEvent.press(getByTestId("go-to-login-button"));

    expect(mockPush).toHaveBeenCalledWith("login");
  });
});