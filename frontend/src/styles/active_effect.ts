import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const effect_styles = StyleSheet.create({
  title: {
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginBottom: 10,
    fontSize: 18,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  effectText: {
    color: colors.text,
    fontSize: 15,
  },

  timer: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },

  barBackground: {
    height: 6,
    backgroundColor: "#3A3535",
    borderRadius: 4,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 4,
  },
});