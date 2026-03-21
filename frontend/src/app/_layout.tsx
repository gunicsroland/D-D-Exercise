import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { ExercisePlanProvider } from "../context/ExercisePlanContext";
import { GameProvider } from "../context/GameContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <AuthProvider>
        <ExercisePlanProvider>
          <GameProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </GameProvider>
        </ExercisePlanProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}
