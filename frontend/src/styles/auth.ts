import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const auth_styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  title: {
    fontSize: 28,
    textAlign: "center",
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: "#333",
  },

  submitButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.gold,
  },

  submitText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },

  subButton: {
    marginTop: 12,
    alignItems: "center",
  },

  subText: {
    color: colors.gold,
  },

  error: {
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 10,
  },
});