import { StyleSheet } from "react-native";

export const questCard_styles = StyleSheet.create({
  card: {
    backgroundColor: "#2c2c2c",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  subText: {
    color: "#ddd",
  },
  progressContainer: {
    height: 24,
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "#4caf50",
  },
  progressText: {
    color: "#000",
    fontWeight: "bold",
  },
  xpText: {
    color: "#ffd700",
  },
  addButton: {
    marginTop: 5,
    width: "50%",
    padding: 8,
    backgroundColor: "#4caf50",
    borderRadius: 6,
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