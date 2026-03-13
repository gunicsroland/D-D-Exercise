import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const exerciseCard_styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  info: {
    flex: 1,
    marginRight: 10,
  },

  title: {
    fontSize: 18,
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginBottom: 4,
  },

  meta: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  xp: {
    marginTop: 6,
    color: colors.health,
    fontWeight: "bold",
  },

  actions: {
    justifyContent: "center",
    gap: 8,
  },

  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },

  startButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },

  buttonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "bold",
  },
});