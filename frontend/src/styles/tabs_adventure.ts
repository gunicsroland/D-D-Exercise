import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const adventure_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  title: {
    fontSize: 24,
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginBottom: 10,
  },

  panel: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#3A3535",
    color: colors.text,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  sessionCard: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginBottom: 10,
  },

  sessionTitle: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 10,
    fontFamily: "Cinzel_600SemiBold",
  },

  buttonCol: {
    flexDirection: "column",
    justifyContent: "space-between",
  },

  button: {
    backgroundColor: colors.health,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.gold
  },

  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gold
  },

  chooseButton: {
    backgroundColor: colors.health,
  },

  renameButton: {
    backgroundColor: colors.mana
  },

  deleteButton: {
    backgroundColor: "#7A1E1E",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: colors.text,
    fontFamily: "Cinzel_600SemiBold",
  },
});