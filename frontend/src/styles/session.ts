import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const session_styles = StyleSheet.create({
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: colors.secondary,
  },

  backText: {
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 16,
  },

  container: {
    flex: 1,
  },

  error: {
    color: "#C0392B",
    textAlign: "center",
    marginTop: 10,
  },

  messageContainer: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 14,
    marginVertical: 5,
  },

  userContainer: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },

  dmContainer: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  messageText: {
    color: colors.text,
    fontSize: 15,
  },

  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: colors.secondary,
    backgroundColor: colors.surface,
  },

  input: {
    flex: 1,
    backgroundColor: "#3A3535",
    color: colors.text,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },

  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gold,
  },

  sendText: {
    color: colors.text,
    fontFamily: "Cinzel_600SemiBold",
  },

  disabledButton: {
    opacity: 0.5,
  },
});