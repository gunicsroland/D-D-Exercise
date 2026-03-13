import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, Pressable } from "react-native";
import { InventoryEntry } from "../types/types";
import { ITEM_IMAGES } from "../../assets/itemImages";
import { ABILITY_LABELS_HU } from "../constants";
import { consumeItem } from "../services/inventory_service";

type Props = {
    item: InventoryEntry;
    onInventoryChange: () => void;
    token: string;
};

export const InventoryItem = ({ item, onInventoryChange, token }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <TouchableOpacity
                style={{
                    flex: 1,
                    margin: 5,
                    padding: 10,
                    backgroundColor: "#c6c0c0",
                    borderRadius: 8,
                    alignItems: "center",
                }}
                onPress={() => setModalVisible(true)}
            >
                <Image
                    source={ITEM_IMAGES[item.item.image_url] || ITEM_IMAGES["default"]}
                    style={{ width: 60, height: 60 }}
                    resizeMode="contain"
                />
                <Text style={{ color: "white", fontWeight: "bold", marginTop: 5 }}>{item.item.name}</Text>
                <Text style={{ color: "#323131" }}>x{item.quantity}</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000080" }}>
                    <View style={{ width: "80%", padding: 20, backgroundColor: "white", borderRadius: 10 }}>
                        <Pressable
                            onPress={() => setModalVisible(false)}
                            style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                backgroundColor: "red",
                                borderRadius: 15,
                                width: 30,
                                height: 30,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
                        </Pressable>

                        <Image
                            source={ITEM_IMAGES[item.item.image_url] || ITEM_IMAGES["default"]}
                            style={{ width: 100, height: 100 }}
                            resizeMode="contain"
                        />

                        <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 10 }}>{item.item.name}</Text>
                        <Text style={{ marginTop: 10, textAlign: "center" }}>
                            {item.item.description || "Leírás nem elérhető"}
                        </Text>

                        {item.item.effects && item.item.effects.length > 0 && (
                            <View style={{ marginTop: 15 }}>
                                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Hatások:</Text>
                                {item.item.effects.map((effect, idx) => (
                                    <Text key={idx} style={{ marginLeft: 10, marginBottom: 3 }}>
                                        - {ABILITY_LABELS_HU[effect.attribute]}: {effect.increase ? "+" : "-"}
                                        {effect.value}, időtartam: {effect.duration} perc
                                    </Text>
                                ))}
                            </View>
                        )}

                        <Pressable
                            onPress={async () => {
                                if (item.quantity > 1) {
                                    item.quantity -= 1;
                                }
                                await consumeItem(token, item.item.id);
                                await onInventoryChange();
                            }}
                            style={{
                                marginTop: 20,
                                backgroundColor: "#31b90c",
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderRadius: 5,
                                alignSelf: "center",
                            }}
                        >
                            <Text>Elfogyaszt</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    );
};