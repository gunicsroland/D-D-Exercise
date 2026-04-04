import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { QuestCard } from "../../src/components/QuestCard";
import { useExercisePlanContext } from "../../src/context/ExercisePlanContext";

// Mock context
const mockAddExercise = jest.fn();

jest.mock("../context/ExercisePlanContext", () => ({
    useExercisePlanContext: jest.fn(),
}));

// Mock labels (optional, keeps test stable)
jest.mock("../text_labels", () => ({
    DIFFICULTY_LABELS_HU: {
        EASY: "Könnyű",
        MEDIUM: "Közepes",
        HARD: "Nehéz",
    },
}));

const quest = {
    name: "Push Up Quest",
    exercise: {
        name: "Push Up",
        difficulty: "EASY",
    },
    amount: 10,
    xp_reward: 100,
    item: {
        name: "Health Potion",
        effects: [
            {
                increase: true,
                value: 10,
                attribute: "strength",
                duration: 5,
            },
        ],
    },
};

const progress = {
    progress: 4,
};

beforeEach(() => {
    jest.clearAllMocks();

    (useExercisePlanContext as jest.Mock).mockReturnValue({
        addExercise: mockAddExercise,
    });
});

it("renders quest information correctly", () => {
    const { getByTestId } = render(
        <QuestCard quest={quest as any} progress={progress as any} />
    );

    expect(getByTestId("quest-title").props.children).toContain("Push Up Quest");
    expect(getByTestId("quest-exercise").props.children).toContain("Push Up");
    expect(getByTestId("xp-reward").props.children).toEqual(["XP Jutalom: ", 100]);
});

it("renders progress correctly", () => {
    const { getByTestId } = render(
        <QuestCard quest={quest as any} progress={progress as any} />
    );

    expect(getByTestId("progress-text").props.children).toEqual([4, "/", 10, " Darab"])
});

it("calls addExercise when button is pressed", () => {
    const { getByTestId } = render(
        <QuestCard quest={quest as any} progress={progress as any} />
    );

    fireEvent.press(getByTestId("add-to-plan-button"));

    expect(mockAddExercise).toHaveBeenCalledWith(quest.exercise);
});

it("renders item reward section when item exists", () => {
    const { getByTestId } = render(
        <QuestCard quest={quest as any} progress={progress as any} />
    );

    expect(getByTestId("quest-item-section")).toBeTruthy();
    expect(getByTestId("item-reward-name").props.children).toContain(
        "Health Potion"
    );
    expect(getByTestId("quest-effect-0")).toBeTruthy();
});

it("does not crash when no item is provided", () => {
    const questWithoutItem = { ...quest, item: undefined };

    const { queryByTestId } = render(
        <QuestCard quest={questWithoutItem as any} progress={progress as any} />
    );

    expect(queryByTestId("quest-item-section")).toBeNull();
});