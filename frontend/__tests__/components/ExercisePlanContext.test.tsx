import React from "react";
import { render, act } from "@testing-library/react-native";
import { ExercisePlanProvider, useExercisePlanContext } from "../../src/context/ExercisePlanContext";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

const TestComponent = () => {
    const { plan, addExercise, removeExercise, clearPlan, startPlan } =
        useExercisePlanContext();

    return null;
};

beforeEach(() => {
    jest.clearAllMocks();
});

it("throws error when used outside provider", () => {
    expect(() => {
        render(<TestComponent />);
    }).toThrow("useUserContext must be used with a Provider");
});

it("adds an exercise to the plan", () => {
    let contextValue: any;

    const TestWrapper = () => {
        contextValue = useExercisePlanContext();
        return null;
    };

    render(
        <ExercisePlanProvider>
            <TestWrapper />
        </ExercisePlanProvider>
    );

    act(() => {
        contextValue.addExercise({
            id: 1,
            name: "Push Up",
        });
    });

    expect(contextValue.plan.length).toBe(1);
    expect(contextValue.plan[0].exercise.name).toBe("Push Up");
});

it("removes an exercise from the plan", () => {
    let contextValue: any;

    const TestWrapper = () => {
        contextValue = useExercisePlanContext();
        return null;
    };

    render(
        <ExercisePlanProvider>
            <TestWrapper />
        </ExercisePlanProvider>
    );

    act(() => {
        contextValue.addExercise({ id: 1, name: "Push Up" });
    });

    const uuid = contextValue.plan[0].uuid;

    act(() => {
        contextValue.removeExercise(uuid);
    });

    expect(contextValue.plan.length).toBe(0);
});

it("clears the plan", () => {
    let contextValue: any;

    const TestWrapper = () => {
        contextValue = useExercisePlanContext();
        return null;
    };

    render(
        <ExercisePlanProvider>
            <TestWrapper />
        </ExercisePlanProvider>
    );

    act(() => {
        contextValue.addExercise({ id: 1, name: "Push Up" });
        contextValue.addExercise({ id: 2, name: "Squat" });
    });

    expect(contextValue.plan.length).toBe(2);

    act(() => {
        contextValue.clearPlan();
    });

    expect(contextValue.plan.length).toBe(0);
});

it("navigates to exerciseRunner when startPlan is called", () => {
    let contextValue: any;

    const TestWrapper = () => {
        contextValue = useExercisePlanContext();
        return null;
    };

    render(
        <ExercisePlanProvider>
            <TestWrapper />
        </ExercisePlanProvider>
    );

    act(() => {
        contextValue.startPlan();
    });

    expect(mockPush).toHaveBeenCalledWith("/exerciseRunner");
});