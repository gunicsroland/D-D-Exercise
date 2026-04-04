import React from "react";
import { render } from "@testing-library/react-native";
import { ExerciseCard } from "./ExerciseCard";
import { useExercisePlanContext } from "../context/ExercisePlanContext";
import { Exercise } from "../types";

jest.mock("../context/ExercisePlanContext", () => ({
  useExercisePlanContext: jest.fn(),
}));

const mockExercise: Exercise = {
  id: 1,
  name: "Push-up",
  category: "strength",
  difficulty: "easy",
  xp_reward: 50,
  quantity: 10,
  media_url: ""
};

it("renders exercise info", () => {
  (useExercisePlanContext as jest.Mock).mockReturnValue({
    addExercise: jest.fn(),
    startPlan: jest.fn(),
  });

  const { getByTestId } = render(<ExerciseCard exercise={mockExercise} />);

  expect(getByTestId("exercise-name-1")).toBeTruthy();
  expect(getByTestId("exercise-xp-1")).toBeTruthy();
  expect(getByTestId("exercise-category-1")).toBeTruthy();
  expect(getByTestId("exercise-difficulty-1")).toBeTruthy();
});

import { fireEvent } from "@testing-library/react-native";

it("calls addExercise when add button is pressed", () => {
  const addExercise = jest.fn();
  const startPlan = jest.fn();

  (useExercisePlanContext as jest.Mock).mockReturnValue({
    addExercise,
    startPlan,
  });

  const { getByTestId } = render(<ExerciseCard exercise={mockExercise} />);

  fireEvent.press(getByTestId("add-button-1"));

  expect(addExercise).toHaveBeenCalledWith(mockExercise);
  expect(startPlan).not.toHaveBeenCalled();
});

it("calls addExercise and startPlan when start button is pressed", () => {
  const addExercise = jest.fn();
  const startPlan = jest.fn();

  (useExercisePlanContext as jest.Mock).mockReturnValue({
    addExercise,
    startPlan,
  });

  const { getByTestId } = render(<ExerciseCard exercise={mockExercise} />);

  fireEvent.press(getByTestId("start-button-1"));

  expect(addExercise).toHaveBeenCalledWith(mockExercise);
  expect(startPlan).toHaveBeenCalled();
});

it("renders both action buttons", () => {
  (useExercisePlanContext as jest.Mock).mockReturnValue({
    addExercise: jest.fn(),
    startPlan: jest.fn(),
  });

  const { getByTestId } = render(<ExerciseCard exercise={mockExercise} />);

  expect(getByTestId("add-button-1")).toBeTruthy();
  expect(getByTestId("start-button-1")).toBeTruthy();
});