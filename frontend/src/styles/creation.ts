import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const creation_styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
    padding: 20,
  },

  container: {
    padding: 20,
    alignItems: "center",
  },

  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  title: {
    fontSize: 22,
    color: colors.gold,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    color: colors.gold,
    marginBottom: 6,
    marginTop: 10,
    fontSize: 14,
  },

  input: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: "#333",
  },

  pickerWrapper: {
    marginTop: 6,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    color: colors.text,
    padding: 5,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },

  primaryButton: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.gold,
  },

  secondaryButton: {
    backgroundColor: "#444",
  },

  disabledButton: {
    opacity: 0.4,
  },

  buttonText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },

  error: {
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 10,
  },
  characterName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
  },

  characterClass: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 10,
  },

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  statLabel: {
    width: 110,
    color: colors.text,
  },

  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#333",
    borderRadius: 6,
    marginHorizontal: 8,
  },

  barFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 6,
  },

  statValue: {
    width: 30,
    textAlign: "right",
    color: colors.text,
  },
});
