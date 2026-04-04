import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const questCard_styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.gold,
  },
  subText: {
    color: colors.text,
  },
  progressContainer: {
    height: 24,
    width: "100%",
    backgroundColor: "#3A3535",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.secondary
  },
  progressBar: {
    position: "absolute",
    left:  0,
    top:0,
    bottom:0,
    height: "100%",
    backgroundColor: colors.health,
  },
  progressText: {
    color: colors.text,
    fontWeight: "bold",
  },
  xpText: {
    color: colors.gold,
  },
  addButton: {
    marginTop: 5,
    width: "10%",
    padding: 8,
    backgroundColor: colors.primary,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gold
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  itemSection: {
    marginTop: 10,
  },
  itemTitle: {
    color: "#7dd3fc",
  },
  effectText: {
    color: "#bbb",
  },
});