import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const exercise_styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  section: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginBottom: 8,
    borderColor: colors.gold,
    borderBottomWidth: 1,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 6,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
    padding: 5,
  },

  filterButton: {
    marginRight: 8,
    marginBottom: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gold,
  },

  filterActive: {
    backgroundColor: colors.secondary,
  },

  filterText: {
    color: colors.text,
  },

  sortRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 20,
  },

  sortText: {
    color: colors.gold,
  },

  startButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.gold,
    elevation: 5,
  },

  startText: {
    color: colors.text,
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 16,
  },

  error: {
    color: "#ff6b6b",
    marginVertical: 6,
  },
});
