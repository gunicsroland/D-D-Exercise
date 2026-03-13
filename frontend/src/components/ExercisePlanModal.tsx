import { useState } from "react";
import { Exercise } from "../types/types";
import { Modal, View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useExercisePlanContext } from "../context/ExercisePlanContext";
import { useRouter } from "expo-router";
import { exerciseModal_styles } from "../styles/exerciseModal";

export default function ExercisePlanModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { plan, removeExercise, clearPlan, startPlan } = useExercisePlanContext();
    const router = useRouter();

    return (
        <Modal
            visible={isOpen}
            animationType="fade"
            transparent
            onRequestClose={onClose}
        >
            <View style={exerciseModal_styles.overlay}>
        <View style={exerciseModal_styles.modal}>

          <View style={exerciseModal_styles.header}>
            <Text style={exerciseModal_styles.title}>⚔ Edzés Terv</Text>

            <TouchableOpacity onPress={onClose} style={exerciseModal_styles.closeButton}>
              <Text style={exerciseModal_styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {plan.length === 0 ? (
            <Text style={exerciseModal_styles.empty}>Nincs még gyakorlat a tervben</Text>
          ) : (
            <FlatList
              data={plan}
              keyExtractor={(item) => item.uuid.toString()}
              renderItem={({ item }) => (
                <View style={exerciseModal_styles.exerciseRow}>
                  <Text style={exerciseModal_styles.exerciseText}>
                    {item.exercise.name}  x {item.exercise.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => removeExercise(item.uuid)}
                    style={exerciseModal_styles.removeButton}
                  >
                    <Text style={exerciseModal_styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          <View style={exerciseModal_styles.buttons}>
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
            >
              <Text style={exerciseModal_styles.startText}>▶ Edzés Kezdése</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={clearPlan} style={exerciseModal_styles.clearButton}>
              <Text style={exerciseModal_styles.clearText}>✖ Terv Ürítése</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
        </Modal>
    )
}