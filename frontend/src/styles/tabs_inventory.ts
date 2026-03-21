import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const inventory_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  grid: {
    padding: 12,
  },

  row: {
    justifyContent: "space-between",
  },

  emptySlot: {
    flex: 1,
    margin: 6,
    aspectRatio: 1,
    backgroundColor: "#3A3535",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: colors.textSecondary,
    fontFamily: "Cinzel_600SemiBold",
  },

  slot: {
    flex: 1,
    margin: 6,
    padding: 10,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  image: {
    width: 60,
    height: 60,
  },

  name: {
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginTop: 5,
    fontSize: 13,
    textAlign: "center",
  },

  quantity: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  overlay: {
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
    alignItems: "center",
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#7A1E1E",
    justifyContent: "center",
    alignItems: "center",
  },

  closeText: {
    color: "white",
    fontWeight: "bold",
  },

  modalImage: {
    width: 100,
    height: 100,
  },

  modalTitle: {
    fontSize: 20,
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginTop: 10,
  },

  description: {
    marginTop: 10,
    color: colors.text,
    textAlign: "center",
  },

  effects: {
    marginTop: 15,
    width: "100%",
  },

  effectsTitle: {
    color: colors.gold,
    fontFamily: "Cinzel_600SemiBold",
    marginBottom: 6,
  },

  effectText: {
    color: colors.text,
    marginLeft: 8,
  },

  consumeButton: {
    marginTop: 20,
    backgroundColor: colors.health,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gold,
  },

  consumeText: {
    color: colors.text,
    fontFamily: "Cinzel_600SemiBold",
  },
});
