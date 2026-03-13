import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, Button, AppState, Modal, TextInput } from "react-native";
import { useAuthContext } from "../../../context/AuthContext";
import { useGameContext } from "../../../context/GameContext";
import { useActiveTimer } from "../../../hooks/useActiveTimer";
import { XPBar } from "../../../components/character/XPBar";
import { ActiveEffects } from "../../../components/character/ActiveEffects";
import { AbilityList } from "../../../components/character/AbilityList";
import { lvlUpAbility, updateCharacter } from "../../../services/character_service";

export default function CharacterScreen() {
  const { token } = useAuthContext();
  const { character, refreshCharacter } = useGameContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(character?.name || "");
  const [error, setError] = useState("");
  const now = useActiveTimer();

  const appState = useRef(AppState.currentState);

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
    <View>
      <Text>{character.name}</Text>
      <Button title="Név változtatása" onPress={() => setModalVisible(true)} />
      <Text>{character.level}. Szintű {character.class_}</Text>

      <XPBar level={character.level} xp={character.xp} />
      <Text>Ability Points: {character.ability_points}</Text>

      <ActiveEffects character={character} now={now} />
      <AbilityList character={character} handleUpgrade={handleUpgrade} />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000080" }}>
          <View style={{ width: "80%", padding: 20, backgroundColor: "white", borderRadius: 10 }}>
            <Text>Új név:</Text>
            <TextInput value={newName} onChangeText={setNewName} placeholder="Adj meg egy nevet" style={{ borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 20 }} />
            <Button title="Mentés" onPress={handleChangeName} />
            <Button title="Mégse" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
}