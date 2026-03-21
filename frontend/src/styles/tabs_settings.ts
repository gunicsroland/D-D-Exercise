import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const settings_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },

  title: {
    fontSize: 28,
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginBottom: 40,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gold,
  },

  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Cinzel_600SemiBold",
  },
});
