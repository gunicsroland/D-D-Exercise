import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ExercisePlanModal from "../../src/components/ExercisePlanModal";

const mockRemoveExercise = jest.fn();
const mockClearPlan = jest.fn();
const mockStartPlan = jest.fn();

jest.mock("../../src/context/ExercisePlanContext", () => ({
  useExercisePlanContext: () => ({
    plan: [
      {
        uuid: "1",
        exercise: { name: "Push Up", quantity: 10 },
      },
    ],
    removeExercise: mockRemoveExercise,
    clearPlan: mockClearPlan,
    startPlan: mockStartPlan,
  }),
}));

const onClose = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

it("renders correctly when open", () => {
  const { getByTestId } = render(
    <ExercisePlanModal isOpen={true} onClose={onClose} testId="modal" />,
  );

  expect(getByTestId("modal")).toBeTruthy();
  expect(getByTestId("title")).toBeTruthy();
  expect(getByTestId("plan-list")).toBeTruthy();
});

it("calls onClose when close button is pressed", () => {
  const { getByTestId } = render(
    <ExercisePlanModal isOpen={true} onClose={onClose} testId="modal" />,
  );

  fireEvent.press(getByTestId("close-button"));
  expect(onClose).toHaveBeenCalled();
});

it("calls removeExercise when remove button is pressed", () => {
  const { getByTestId } = render(
    <ExercisePlanModal isOpen={true} onClose={onClose} testId="modal" />,
  );

  fireEvent.press(getByTestId("remove-button-1"));
  expect(mockRemoveExercise).toHaveBeenCalledWith("1");
});

it("calls clearPlan when clear button is pressed", () => {
  const { getByTestId } = render(
    <ExercisePlanModal isOpen={true} onClose={onClose} testId="modal" />,
  );

  fireEvent.press(getByTestId("clear-button"));
  expect(mockClearPlan).toHaveBeenCalled();
});

it("calls startPlan and onClose when start button is pressed", () => {
  const { getByTestId } = render(
    <ExercisePlanModal isOpen={true} onClose={onClose} testId="modal" />,
  );

  fireEvent.press(getByTestId("start-button"));
  expect(onClose).toHaveBeenCalled();
  expect(mockStartPlan).toHaveBeenCalled();
});
