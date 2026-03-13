import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const character_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  panel: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginBottom: 15,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  editButton: {
    marginLeft: 8,
    padding: 4,
  },

  name: {
    fontSize: 28,
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginBottom: 10,
  },

  classText: {
    color: colors.text,
    marginBottom: 10,
  },

  abilityPoints: {
    color: colors.text,
    marginTop: 10,
  },

  smallButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  cancelButton: {
    backgroundColor: "#7A1E1E",
  },

  buttonText: {
    color: colors.text,
    fontFamily: "Cinzel_600SemiBold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },

  modalPanel: {
    width: "80%",
    backgroundColor: colors.surface,
    padding: 25,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  modalTitle: {
    fontSize: 20,
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginBottom: 15,
  },

  input: {
    backgroundColor: "#3A3535",
    color: colors.text,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  error: {
    color: "#C0392B",
    marginBottom: 10,
  },

    card: {
    flex: 1,
    margin: 6,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  abilityName: {
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginBottom: 6,
  },

  value: {
    fontSize: 18,
    color: colors.text,
  },

  bonus: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  upgradeButton: {
    marginTop: 10,
    backgroundColor: colors.mana,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.4,
  }
});