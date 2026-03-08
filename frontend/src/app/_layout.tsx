import { Stack } from "expo-router";
import React from 'react';
import { AuthProvider } from "../context/AuthContext";
import { ExercisePlanProvider } from "../context/ExercisePlanContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ExercisePlanProvider>
            <Stack screenOptions={{ headerShown: false }}/>
      </ExercisePlanProvider>
    </AuthProvider>
  );
}
