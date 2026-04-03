import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CreateCharacter from "./create";

// --- MOCKS ---

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
  }),
}));

// Mock auth context
jest.mock("../../../context/AuthContext", () => ({
  useAuthContext: () => ({
    user: { id: "user-1" },
    token: "token-123",
  }),
}));

// Mock services
const mockCreateChar = jest.fn();
const mockCheckCharacter = jest.fn();

jest.mock("../../../services/character_service", () => ({
  createChar: (...args: any[]) => mockCreateChar(...args),
  checkCharacter: () => mockCheckCharacter(),
}));

// Mock step components (simplify UI)
jest.mock("../../../components/charCreateSteps/stepName", () => {
  return () => null;
});
jest.mock("../../../components/charCreateSteps/stepPushups", () => {
  return () => null;
});
jest.mock("../../../components/charCreateSteps/stepRun", () => {
  return () => null;
});
jest.mock("../../../components/charCreateSteps/stepAgility", () => {
  return () => null;
});
jest.mock("../../../components/charCreateSteps/stepFinal", () => {
  return () => null;
});

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

    const { getByText } = render(<CreateCharacter />);

    // Initially at step 0
    expect(getByText("Next ▶")).toBeTruthy();

    // Go next
    fireEvent.press(getByText("Next ▶"));
    expect(getByText("Next ▶")).toBeTruthy();

    // Go back
    fireEvent.press(getByText("◀ Previous"));
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

    const { getByText } = render(<CreateCharacter />);

    for (let i = 0; i < 4; i++) {
      fireEvent.press(getByText("Next ▶"));
    }

    const finishButton = getByText("⚔ Finish");

    fireEvent.press(finishButton);

    await waitFor(() => {
      expect(mockCreateChar).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/tabs/character");
    });
  });

  it("shows error if createChar fails", async () => {
    mockCheckCharacter.mockResolvedValueOnce(false);
    mockCreateChar.mockRejectedValueOnce(new Error("Create failed"));

    const { getByText, findByText } = render(<CreateCharacter />);

    for (let i = 0; i < 4; i++) {
      fireEvent.press(getByText("Next ▶"));
    }

    fireEvent.press(getByText("⚔ Finish"));

    const error = await findByText("Create failed");

    expect(error).toBeTruthy();
  });
});