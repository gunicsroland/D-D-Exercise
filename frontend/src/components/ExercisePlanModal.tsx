import { Modal, View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useExercisePlanContext } from "../context/ExercisePlanContext";
import { exerciseModal_styles } from "../styles/exerciseModal";

export default function ExercisePlanModal({
  isOpen,
  onClose,
  testId,
}: {
  isOpen: boolean;
  onClose: () => void;
  testId: string;
}) {
  const { plan, removeExercise, clearPlan, startPlan } =
    useExercisePlanContext();

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      testID={testId}
    >
      <View style={exerciseModal_styles.overlay} testID="overlay">
        <View style={exerciseModal_styles.modal} testID="modal-container">
          <View style={exerciseModal_styles.header} testID="header">
            <Text style={exerciseModal_styles.title} testID="title">
              ⚔ Edzés Terv
            </Text>

            <TouchableOpacity
              onPress={onClose}
              style={exerciseModal_styles.closeButton}
              testID="close-button"
            >
              <Text style={exerciseModal_styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {plan.length === 0 ? (
            <Text style={exerciseModal_styles.empty} testID="empty-text">
              Nincs még gyakorlat a tervben
            </Text>
          ) : (
            <FlatList
              data={plan}
              keyExtractor={(item) => item.uuid.toString()}
              testID="plan-list"
              renderItem={({ item }) => (
                <View
                  style={exerciseModal_styles.exerciseRow}
                  testID={`exercise-row-${item.uuid}`}
                >
                  <Text
                    style={exerciseModal_styles.exerciseText}
                    testID={`exercise-text-${item.uuid}`}
                  >
                    {item.exercise.name} x {item.exercise.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => removeExercise(item.uuid)}
                    style={exerciseModal_styles.removeButton}
                    testID={`remove-button-${item.uuid}`}
                  >
                    <Text style={exerciseModal_styles.removeText}>
                      Eltávolítás
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          <View style={exerciseModal_styles.buttons} testID="footer">
            <TouchableOpacity
              onPress={() => {
                onClose();
                startPlan();
              }}
              style={[
                exerciseModal_styles.startButton,
                plan.length === 0 && exerciseModal_styles.disabledButton,
              ]}
              disabled={plan.length === 0}
              testID="start-button"
            >
              <Text style={exerciseModal_styles.startText}>
                ▶ Edzés Kezdése
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={clearPlan}
              style={exerciseModal_styles.clearButton}
              testID="clear-button"
            >
              <Text style={exerciseModal_styles.clearText}>✖ Terv Ürítése</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
