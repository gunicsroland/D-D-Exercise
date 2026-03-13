import { View, Text } from "react-native";
import { XP_LEVELS } from "../../constants";
import React from "react";

export const XPBar = ({ level, xp }: { level: number; xp: number }) => {
  const currentLevelXP = XP_LEVELS[level] ?? 0;
  const nextLevelXP = XP_LEVELS[level + 1] ?? currentLevelXP;
  const progress = Math.min(Math.max((xp - currentLevelXP) / (nextLevelXP - currentLevelXP), 0), 1);

  return (
    <View style={{ height: 24, width: "100%", backgroundColor: "#ddd", borderRadius: 10, overflow: "hidden", marginVertical: 5 }}>
      <View style={{ height: "100%", width: `${progress * 100}%`, backgroundColor: "#4caf50", position: "absolute" }} />
      <Text style={{ color: "#000", fontWeight: "bold", alignSelf: "center", zIndex: 1 }}>
        {xp}/{nextLevelXP} XP
      </Text>
    </View>
  );
};