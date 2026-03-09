import { useState } from "react";
import { Exercise } from "../types/types";
import { Modal, View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useExercisePlanContext } from "../context/ExercisePlanContext";
import { useRouter } from "expo-router";

export default function ExercisePlanModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { plan, addExercise, removeExercise, clearPlan, startPlan } = useExercisePlanContext();
    const router = useRouter();

    return (
        <Modal
            visible={isOpen}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: "90%",
                        backgroundColor: "white",
                        borderRadius: 12,
                        padding: 16,
                    }}
                >
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>

                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
                        Edzés Terv
                    </Text>
                    <TouchableOpacity
                    onPress={onClose}>
                        <Text>X</Text>
                    </TouchableOpacity>
                    </View>

                    {plan.length === 0 ? (
                        <Text style={{ color: "#666" }}>No exercises yet</Text>
                    ) : (
                        <FlatList
                            data={plan}
                            keyExtractor={(item) => item.uuid.toString()}
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        paddingVertical: 6,
                                    }}
                                >
                                    <Text>{item.exercise.name} x {item.exercise.quantity}</Text>
                                    <TouchableOpacity onPress={() => removeExercise(item.uuid)}>
                                        <Text style={{ color: "red" }}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    )}

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                onClose();
                                startPlan();}}
                            style={{
                                marginTop: 12,
                                padding: 12,
                                backgroundColor: "#10b981",
                                borderRadius: 8,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "700" }}>Edzés Kezdése</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={clearPlan}
                            style={{
                                marginTop: 12,
                                padding: 12,
                                backgroundColor: "#b91010",
                                borderRadius: 8,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "700" }}>Edzés Terv Ürítése</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}