import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const exerciseRunner_styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  media: {
    flex: 3,
  },

  info: {
    flex: 2,
    padding: 20,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 24,
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginBottom: 6,
  },

  text: {
    color: colors.text,
    fontSize: 16,
  },

  progress: {
    marginTop: 6,
    color: colors.textSecondary,
  },

  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  button: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },

  greenButton: {
    backgroundColor: colors.primary,
  },

  redButton: {
    backgroundColor: colors.damage,
  },

  blueButton: {
    backgroundColor: colors.mana,
  },

  grayButton: {
    backgroundColor: "#555",
  },

  pauseContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  pauseTimer: {
    fontSize: 44,
    fontWeight: "bold",
    color: colors.gold,
  },

  pauseLabel: {
    fontSize: 18,
    marginTop: 20,
    color: colors.textSecondary,
  },

  pauseTitle: {
    fontSize: 26,
    color: colors.gold,
    marginTop: 10,
    fontFamily: "Cinzel_600SemiBold",
  },

  pauseButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
