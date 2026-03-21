import React, { useState } from "react";
import { View, Text, ActivityIndicator, Button, AppState, Modal, TextInput, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuthContext } from "../../../context/AuthContext";
import { useGameContext } from "../../../context/GameContext";
import { useActiveTimer } from "../../../hooks/useActiveTimer";
import { XPBar } from "../../../components/character/XPBar";
import { ActiveEffects } from "../../../components/character/ActiveEffects";
import { AbilityList } from "../../../components/character/AbilityList";
import { lvlUpAbility, updateCharacter } from "../../../services/character_service";
import { character_styles } from "../../../styles/tabs_character";
import { CLASS_LABELS_HU } from "../../../text_labels";
import { colors } from "../../../styles/colors";

export default function CharacterScreen() {
  const { token } = useAuthContext();
  const { character, refreshCharacter } = useGameContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(character?.name || "");
  const [error, setError] = useState("");
  const now = useActiveTimer();

  const handleUpgrade = async (ability: any) => {
    if (!token) return;
    await lvlUpAbility(token, ability);
    await refreshCharacter();
  };

  const handleChangeName = async () => {
    if (!newName?.trim() || !token) return;
    try {
      await updateCharacter(token, { name: newName });
      await refreshCharacter();
      setModalVisible(false);
    } catch (err: any) {
      setError(err.message || "Nem sikerült a név változtatása");
    }
  };

  if (!character || !token) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={character_styles.container}>
      <View style={character_styles.panel}>
        <View style={character_styles.nameRow}>
          <Text style={character_styles.name}>{character.name}</Text>

          <Pressable
            style={character_styles.editButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="pencil" size={20} color={colors.gold} />
          </Pressable>
        </View>
        <Text style={character_styles.classText}>
          {character.level}. Szintű {CLASS_LABELS_HU[character.class_]}
        </Text>

        <XPBar level={character.level} xp={character.xp} />
        <Text style={character_styles.abilityPoints}>
          Ability Points: {character.ability_points}
        </Text>
      </View>

      <View style={character_styles.panel}>
        <ActiveEffects character={character} now={now} />
      </View>

      <View style={character_styles.panel}>
        <AbilityList character={character} handleUpgrade={handleUpgrade} />
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={character_styles.modalOverlay}>
          <View style={character_styles.modalPanel}>
            <Text style={character_styles.modalTitle}>Új karakter név:</Text>

            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Adj meg egy nevet"
              style={character_styles.input} />

            {error ? <Text style={character_styles.error}>{error}</Text> : null}

            <View style={character_styles.modalButtons}>
              <Pressable style={character_styles.button} onPress={handleChangeName}>
                <Text style={character_styles.buttonText}>Mentés</Text>
              </Pressable>

              <Pressable
                style={[character_styles.button, character_styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={character_styles.buttonText}>Mégse</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}