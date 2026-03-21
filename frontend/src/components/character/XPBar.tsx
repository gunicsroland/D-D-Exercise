import { View, Text, StyleSheet } from "react-native";
import { XP_LEVELS } from "../../constants";
import React from "react";
import { colors } from "../../styles/colors";

export const XPBar = ({ level, xp }: { level: number; xp: number }) => {
  const currentLevelXP = XP_LEVELS[level] ?? 0;
  const nextLevelXP = XP_LEVELS[level + 1] ?? currentLevelXP;
  const progress = Math.min(
    Math.max((xp - currentLevelXP) / (nextLevelXP - currentLevelXP), 0),
    1,
  );

  return (
    <View style={styles.container}>
      <View style={[styles.fill, { width: `${progress * 100}%` }]} />

      <Text style={styles.text}>
        {xp}/{nextLevelXP} XP
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 26,
    width: "100%",
    backgroundColor: "#3A3535",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    justifyContent: "center",
  },

  fill: {
    position: "absolute",
    height: "100%",
    backgroundColor: colors.health,
  },

  text: {
    alignSelf: "center",
    color: colors.text,
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 13,
  },
});
