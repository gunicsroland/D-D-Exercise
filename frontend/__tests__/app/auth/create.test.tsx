import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CreateCharacter from "../../../src/app/(protected)/character/create";

// --- MOCKS ---

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
  }),
}));

// Mock auth context
jest.mock("../../../src/context/AuthContext", () => ({
  useAuthContext: () => ({
    user: { id: "user-1" },
    token: "token-123",
  }),
}));

jest.mock("../../../src/services/character_service", () => ({
  createChar: (...args: any[]) => mockCreateChar(...args),
  checkCharacter: () => mockCheckCharacter(),
}));

// Mock step components
jest.mock("../../../src/components/charCreateSteps/stepName", () => {
  return () => null;
});
jest.mock("../../../src/components/charCreateSteps/stepPushups", () => {
  return () => null;
});
jest.mock("../../../src/components/charCreateSteps/stepRun", () => {
  return () => null;
});
jest.mock("../../../src/components/charCreateSteps/stepAgility", () => {
  return () => null;
});
jest.mock("../../../src/components/charCreateSteps/stepFinal", () => {
  return () => null;
});

// Mock services
const mockCreateChar = jest.fn();
const mockCheckCharacter = jest.fn();

// --- TESTS ---

describe("CreateCharacter Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects if character already exists", async () => {
    mockCheckCharacter.mockResolvedValueOnce(true);

    render(<CreateCharacter />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/tabs/character");
    });
  });

  it("navigates through steps using Next and Previous", async () => {
    mockCheckCharacter.mockResolvedValueOnce(false);

    const { getByTestId } = render(<CreateCharacter />);

    const nextButton = getByTestId("next-button");
    const prevButton = getByTestId("prev-button");

    // Initially at step 0
    expect(nextButton).toBeTruthy();
    expect(prevButton.props.accessibilityState.disabled).toBe(true);

    // Go next
    fireEvent.press(nextButton);

    // Go back
    fireEvent.press(prevButton);
  });

  it("disables previous button on first step", () => {
    mockCheckCharacter.mockResolvedValueOnce(false);

    const { getByTestId } = render(<CreateCharacter />);

    const prevButton = getByTestId("prev-button");

    expect(prevButton.props.accessibilityState.disabled).toBe(true);
  });

  it("calls createChar and navigates on final step", async () => {
    mockCheckCharacter.mockResolvedValueOnce(false);
    mockCreateChar.mockResolvedValueOnce({});

    const { getByTestId } = render(<CreateCharacter />);

    const nextButton = getByTestId("next-button");

    // Move through all steps
    for (let i = 0; i < 4; i++) {
      fireEvent.press(nextButton);
    }

    fireEvent.press(nextButton); // final submit

    await waitFor(() => {
      expect(mockCreateChar).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/tabs/character");
    });
  });

  it("shows error if createChar fails", async () => {
    mockCheckCharacter.mockResolvedValueOnce(false);
    mockCreateChar.mockRejectedValueOnce(new Error("Create failed"));

    const { getByTestId, findByTestId } = render(<CreateCharacter />);

    const nextButton = getByTestId("next-button");

    for (let i = 0; i < 4; i++) {
      fireEvent.press(nextButton);
    }

    fireEvent.press(nextButton);

    const error = await findByTestId("creation-error");

    expect(error).toBeTruthy();
  });
});
