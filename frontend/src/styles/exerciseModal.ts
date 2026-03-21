import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const exerciseModal_styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "90%",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
  },

  closeButton: {
    backgroundColor: "#7A1E1E",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  closeText: {
    color: "white",
    fontWeight: "bold",
  },

  empty: {
    color: colors.textSecondary,
    textAlign: "center",
    marginVertical: 20,
  },

  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#333",
  },

  exerciseText: {
    color: colors.text,
  },

  removeButton: {
    backgroundColor: "#7A1E1E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  removeText: {
    color: "white",
    fontSize: 12,
  },

  buttons: {
    marginTop: 16,
    gap: 10,
  },

  startButton: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gold,
  },

  startText: {
    color: colors.text,
    fontWeight: "bold",
  },

  clearButton: {
    backgroundColor: "#7A1E1E",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  clearText: {
    color: "white",
    fontWeight: "bold",
  },

  disabledButton: {
    opacity: 0.4,
  },
});
