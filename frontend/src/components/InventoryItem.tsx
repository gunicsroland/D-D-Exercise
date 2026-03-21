import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { InventoryEntry } from "../types/types";
import { ITEM_IMAGES } from "../../assets/itemImages";
import { ABILITY_LABELS_HU } from "../text_labels";
import { consumeItem } from "../services/inventory_service";
import { inventory_styles } from "../styles/tabs_inventory";

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
        style={inventory_styles.slot}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={ITEM_IMAGES[item.item.image_url] || ITEM_IMAGES["default"]}
          style={inventory_styles.image}
          resizeMode="contain"
        />

        <Text style={inventory_styles.name}>{item.item.name}</Text>
        <Text style={inventory_styles.quantity}>x{item.quantity}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={inventory_styles.overlay}>
          <View style={inventory_styles.modalPanel}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={inventory_styles.closeButton}
            >
              <Text style={inventory_styles.closeText}>✕</Text>
            </Pressable>

            <Image
              source={
                ITEM_IMAGES[item.item.image_url] || ITEM_IMAGES["default"]
              }
              style={inventory_styles.modalImage}
              resizeMode="contain"
            />

            <Text style={inventory_styles.modalTitle}>{item.item.name}</Text>

            <Text style={inventory_styles.description}>
              {item.item.description || "Leírás nem elérhető"}
            </Text>

            {item.item.effects && item.item.effects.length > 0 && (
              <View style={inventory_styles.effects}>
                <Text style={inventory_styles.effectsTitle}>Hatások</Text>

                {item.item.effects.map((effect, idx) => (
                  <Text key={idx} style={inventory_styles.effectText}>
                    • {ABILITY_LABELS_HU[effect.attribute]}:{" "}
                    {effect.increase ? "+" : "-"}
                    {effect.value} ({effect.duration} perc)
                  </Text>
                ))}
              </View>
            )}

            <Pressable
              style={inventory_styles.consumeButton}
              onPress={async () => {
                await consumeItem(token, item.item.id);
                await onInventoryChange();
              }}
            >
              <Text style={inventory_styles.consumeText}>Elfogyaszt</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};
