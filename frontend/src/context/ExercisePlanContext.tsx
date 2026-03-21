import React, { createContext, useContext, useState, ReactNode } from "react";
import { Exercise, ExercisePlan } from "../types/types";
import { useRouter } from "expo-router";

type ExercisePlanContextType = {
  plan: ExercisePlan[];
  addExercise: (ex: Exercise) => void;
  removeExercise: (id: number) => void;
  clearPlan: () => void;
  startPlan: () => void;
};

const ExercisePlanContext = createContext<ExercisePlanContextType | undefined>(
  undefined,
);

export function useExercisePlanContext() {
  const context: ExercisePlanContextType | undefined =
    useContext(ExercisePlanContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used with a Provider");
  }

  return context;
}

export const ExercisePlanProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<ExercisePlan[]>([]);
  const router = useRouter();

  const addExercise = (ex: Exercise) => {
    const newPlan: ExercisePlan = {
      exercise: ex,
      uuid: Date.now() + Math.random(),
    };

    setPlan((prev) => [...prev, newPlan]);
  };

  const removeExercise = (uuid: number) => {
    setPlan((prev) => prev.filter((e) => e.uuid !== uuid));
  };

  const clearPlan = () => setPlan([]);

  const startPlan = () => {
    router.push("/exerciseRunner");
  };

  return (
    <ExercisePlanContext.Provider
      value={{ plan, addExercise, removeExercise, clearPlan, startPlan }}
    >
      {children}
    </ExercisePlanContext.Provider>
  );
};
