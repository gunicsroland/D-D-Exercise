import { useAuthContext } from "../../../context/AuthContext";
import {
  getDailyQuests,
  getExercises,
  getQuestProgress,
} from "../../../services/quest_service";
import { setQuestDifficulty } from "../../../services/quest_service";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import ExerciseScreen from "./exercise";
import React from "react";


jest.mock("../../../context/AuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("../../../services/quest_service", () => ({
  getDailyQuests: jest.fn(),
  getExercises: jest.fn(),
  getQuestProgress: jest.fn(),
  setQuestDifficulty: jest.fn(),
}));

jest.mock("../../../components/QuestCard", () => ({
  QuestCard: ({ quest }: any) => {
    const React = require("react");
    const { Text } = require("react-native");
    return <Text testID={`quest-${quest.id}`}>{quest.name}</Text>;
  },
}));

jest.mock("../../../components/ExerciseCard", () => ({
  ExerciseCard: ({ exercise }: any) => {
    const React = require("react");
    const { Text } = require("react-native");
    return <Text testID={`exercise-${exercise.id}`}>{exercise.name}</Text>;
  },
}));

jest.mock("../../../components/ExercisePlanModal", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return (props: any) =>
    props.isOpen ? <Text testID="exercise-modal">Modal</Text> : null;
});

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (cb: any) => cb(),
}));

const mockQuests = [
  { id: 1, name: "Quest 1", amount: 1, xp_reward: 10, exercise: null, item: null },
];

const mockExercises = [
  {
    id: 1,
    name: "Pushup",
    category: "strength",
    difficulty: "easy",
    quantity: 10,
    xp_reward: 5,
    media_url: null,
  },
  {
    id: 2,
    name: "Run",
    category: "cardio",
    difficulty: "medium",
    quantity: 5,
    xp_reward: 8,
    media_url: null,
  },
];

const mockProgress = [
  { id: 1, quest_id: 1, progress: 0, completed: false },
];

beforeEach(() => {
  jest.clearAllMocks();

  (useAuthContext as jest.Mock).mockReturnValue({
    token: "token123",
  });

  (getDailyQuests as jest.Mock).mockResolvedValue(mockQuests);
  (getExercises as jest.Mock).mockResolvedValue(mockExercises);
  (getQuestProgress as jest.Mock).mockResolvedValue(mockProgress);
});

it("renders quests and exercises", async () => {
  const { findByTestId } = render(<ExerciseScreen />);

  expect(await findByTestId("quest-1")).toBeTruthy();
  expect(await findByTestId("exercise-1")).toBeTruthy();

  await waitFor(() => expect(getDailyQuests).toHaveBeenCalled());
});


it("opens modal when start button pressed", async () => {
  const { getByTestId, findByTestId } = render(<ExerciseScreen />);

  await act(async () => {
    fireEvent.press(getByTestId("start-button"));
  })

  expect(await findByTestId("exercise-modal")).toBeTruthy();
});


it("filters exercises by category", async () => {
  const { findByTestId, queryByTestId } = render(<ExerciseScreen />);

  await findByTestId("exercise-1");

  await act(async () => {
    fireEvent.press(await findByTestId("category-filter-strength"));
  });

  expect(queryByTestId("exercise-1")).toBeTruthy();
  expect(queryByTestId("exercise-2")).toBeNull();
});

it("filters exercises by difficulty", async () => {
  const { findByTestId, queryByTestId } = render(<ExerciseScreen />);

  await findByTestId("exercise-1");

  await act(async () => {
    fireEvent.press(await findByTestId("exercise-difficulty-easy"));
  })

  expect(queryByTestId("exercise-1")).toBeTruthy();
  expect(queryByTestId("exercise-2")).toBeNull();
});

it("sorts exercises by category", async () => {
  const { findAllByTestId, getByTestId } = render(<ExerciseScreen />);

  await findAllByTestId(/exercise-/);

  await act(async () => {
    fireEvent.press(getByTestId("sort-category"));
  })

  const items = await findAllByTestId(/exercise-\d+/);

  expect(items.length).toBe(2);
});

it("updates quest difficulty", async () => {
  const { findByTestId } = render(<ExerciseScreen />);

  const button = await findByTestId("quest-difficulty-easy");

  await act(async () => {
    fireEvent.press(button);
  })

  expect(setQuestDifficulty).toHaveBeenCalledWith("token123", "easy");
});

it("shows error when quest fetch fails", async () => {
  (getDailyQuests as jest.Mock).mockRejectedValueOnce({});

  const { findByText } = render(<ExerciseScreen />);

  expect(
    await findByText(/Nem sikerült a napi küldetéseket/)
  ).toBeTruthy();
});