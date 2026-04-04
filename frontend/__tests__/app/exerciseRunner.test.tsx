import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";

import ExerciseRunner from "../../src/app/(protected)/exerciseRunner";

import { useExercisePlanContext } from "../../src/context/ExercisePlanContext";
import { useAuthContext } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";
import { finishExercise } from "../../src/services/quest_service";
import { useGameContext } from "../../src/context/GameContext";

jest.mock("../../src/context/AuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("../../src/context/ExercisePlanContext", () => ({
  useExercisePlanContext: jest.fn(),
}));

jest.mock("../../src/context/GameContext", () => ({
  useGameContext: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../src/services/quest_service", () => ({
  finishExercise: jest.fn(),
}));

jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();

  (useGameContext as jest.Mock).mockReturnValue({
  refreshAll: jest.fn(),
});
});

it("shows empty state when no plan", () => {
  (useExercisePlanContext as jest.Mock).mockReturnValue({
    plan: [],
    clearPlan: jest.fn(),
  });

  (useAuthContext as jest.Mock).mockReturnValue({ token: "token" });

  const { getByTestId, getByText } = render(<ExerciseRunner />);

  expect(getByTestId("empty-plan")).toBeTruthy();
  expect(getByText("Nincsen edzés kiválasztva")).toBeTruthy();
});

it("renders first exercise", () => {
  (useExercisePlanContext as jest.Mock).mockReturnValue({
    plan: [
      {
        exercise: { id: 1, name: "Pushups", quantity: 10, media_url: "url" },
      },
    ],
    clearPlan: jest.fn(),
  });

  (useAuthContext as jest.Mock).mockReturnValue({ token: "token" });

  const { getByTestId } = render(<ExerciseRunner />);

  expect(getByTestId("exercise-name").props.children).toBe("Pushups");
  expect(getByTestId("exercise-quantity")).toBeTruthy();
});

it("starts pause when next is pressed", () => {
  const plan = [
    { exercise: { id: 1, name: "A", quantity: 10, media_url: "" } },
    { exercise: { id: 2, name: "B", quantity: 5, media_url: "" } },
  ];

  (useExercisePlanContext as jest.Mock).mockReturnValue({
    plan,
    clearPlan: jest.fn(),
  });

  (useAuthContext as jest.Mock).mockReturnValue({ token: "token" });

  const { getByTestId } = render(<ExerciseRunner />);

  fireEvent.press(getByTestId("skip-button"));

  expect(getByTestId("pause-screen")).toBeTruthy();
});

it("counts down pause timer", () => {
  const plan = [
    { exercise: { id: 1, name: "A", quantity: 10, media_url: "" } },
    { exercise: { id: 2, name: "B", quantity: 5, media_url: "" } },
  ];

  (useExercisePlanContext as jest.Mock).mockReturnValue({
    plan,
    clearPlan: jest.fn(),
  });

  (useAuthContext as jest.Mock).mockReturnValue({ token: "token" });

  const { getByTestId } = render(<ExerciseRunner />);

  fireEvent.press(getByTestId("skip-button"));

  expect(getByTestId("pause-timer").props.children).toEqual([20, "s"]);

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(getByTestId("pause-timer").props.children).toEqual([19, "s"]);
});

it("calls finishExercise when workout completes", async () => {
  const clearPlanMock = jest.fn();
  const routerBackMock = jest.fn();
  const refreshAllMock = jest.fn();

  (useExercisePlanContext as jest.Mock).mockReturnValue({
    plan: [
      { exercise: { id: 1, name: "A", quantity: 10, media_url: "" } },
    ],
    clearPlan: clearPlanMock,
  });

  (useAuthContext as jest.Mock).mockReturnValue({ token: "token" });

  (useGameContext as jest.Mock).mockReturnValue({
    refreshAll: refreshAllMock,
  });

  (useRouter as jest.Mock).mockReturnValue({
    back: routerBackMock,
  });

  const { getByTestId } = render(<ExerciseRunner />);

  await act(async () => {
    fireEvent.press(getByTestId("complete-button"));
  });

  expect(finishExercise).toHaveBeenCalledWith("token", 1);
  expect(clearPlanMock).toHaveBeenCalled();
  expect(refreshAllMock).toHaveBeenCalled();
  expect(routerBackMock).toHaveBeenCalled();
});