import { Stack } from "expo-router";
import React from 'react';
import { AuthProvider } from "../context/AuthContext";
import { ExercisePlanProvider } from "../context/ExercisePlanContext";
import { GameProvider } from "../context/GameContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ExercisePlanProvider>
          <GameProvider>
            <Stack screenOptions={{ headerShown: false }}/>
          </GameProvider>
      </ExercisePlanProvider>
    </AuthProvider>
  );
}
