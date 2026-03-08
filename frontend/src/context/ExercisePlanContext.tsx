import React, { createContext, useContext, useState, ReactNode } from "react";
import { Exercise } from "../types/types";
import { useRouter } from "expo-router";

type ExercisePlanContextType = {
  plan: Exercise[];
  addExercise: (ex: Exercise) => void;
  removeExercise: (id: number) => void;
  clearPlan: () => void;
  startPlan: () => void;
};

const ExercisePlanContext = createContext<ExercisePlanContextType | undefined>(undefined);

export function useExercisePlanContext() {
    const context : ExercisePlanContextType | undefined = useContext(ExercisePlanContext);

    if (context === undefined) {
        throw new Error("useUserContext must be used with a Provider");
    }
    for (let child in context) {
        if (child === null) {
            throw new Error("useUserContext must be used with a Provider");
        }
    }

    return context;
}

export const ExercisePlanProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<Exercise[]>([]);
  const router = useRouter();

  const addExercise = (ex: Exercise) => {
    setPlan((prev) => (prev.find((e) => e.id === ex.id) ? prev : [...prev, ex]));
  };

  const removeExercise = (id: number) => {
    setPlan((prev) => prev.filter((e) => e.id !== id));
  };

  const clearPlan = () => setPlan([]);

  const startPlan = () => {
    router.push("/exerciseRunner");
    clearPlan();
  }

  return (
    <ExercisePlanContext.Provider value={{ plan, addExercise, removeExercise, clearPlan, startPlan }}>
      {children}
    </ExercisePlanContext.Provider>
  );
};