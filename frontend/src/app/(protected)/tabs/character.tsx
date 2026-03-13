import { router } from "expo-router/build/exports";
import React, { useEffect, useState, useRef } from "react";
import {
  View, Text, ActivityIndicator, FlatList, Button, AppState, Modal,
  Alert, TextInput
} from "react-native";


import { Character, CharacterAbility, AbilityType } from "../../../types/types";
import { XP_LEVELS } from "../../../constants";
import { useAuthContext } from "../../../context/AuthContext";
import { checkCharacter, getCharacter, lvlUpAbility, updateCharacter } from "../../../services/character_service";

export default function CharacterScreen() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [pageLoading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(character?.name);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  const appState = useRef(AppState.currentState);

  const { token, loading } = useAuthContext();

  useEffect(() => {
    const hasCharacter = async () => {
      if (!token) return;

      const exists = await checkCharacter(token);
      if (!exists) {
        router.replace("/character/create")
      }
    }

    const loadCharacter = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const data = await getCharacter(token);
        setCharacter(data ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    hasCharacter();
    loadCharacter();
  }, [token]);

  useEffect(() => {
    const subsription = AppState.addEventListener('change', async (nextState) => {
      console.log("AppState:", nextState);
      if (appState.current.match(/inactive|background/) &&
        nextState === 'active') {
        if (!token) return;

        try {
          const data = await getCharacter(token);
          setCharacter(data);
        } catch {
          setError("Nem sikerült betölteni a karaktered, Póbáld újra!");
        }

      }

      appState.current = nextState
    }
    );

    return () => {
      subsription.remove();
    };
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (pageLoading || !character || !token) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleUpgrade = async (ability: AbilityType) => {
    if (!token) return;

    try {
      await lvlUpAbility(token, ability);

      const updatedChar = await getCharacter(token);
      setCharacter(updatedChar);
    } catch (err) {
      console.error(err);
    }
  }

  const handleChangeName = async () => {
    if (!newName?.trim()) {
      Alert.alert("Hiba", "A név nem lehet üres");
      return;
    }

    try {
      const updated = await updateCharacter(token, { name: newName });

      const updatedChar = await getCharacter(token);
      setCharacter(updatedChar);
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert("Hiba", err.message || "Nem sikerült a név változtatása");
    }
  };

  const XPBar = ({ level, xp }: { level: number, xp: number }) => {
    const currentLevelXP = XP_LEVELS[level] ?? 0;
    const nextLevelXP = XP_LEVELS[level + 1] ?? currentLevelXP;
    const progress = Math.min(
      Math.max(
        (xp - currentLevelXP) / (nextLevelXP - currentLevelXP), 0),
      1
    )

    return (
      <View style={{ height: 24, width: "100%", backgroundColor: "#ddd", borderRadius: 10, overflow: "hidden", marginVertical: 5 }}>
        <View style={{ height: "100%", width: `${progress * 100}%`, backgroundColor: "#4caf50", position: "absolute" }} />
        <Text style={{ color: "#000", fontWeight: "bold", alignSelf: "center", zIndex: 1, }}>{xp}/{nextLevelXP} XP</Text>
      </View>
    )
  }

  const getAbilityBonus = (ability: AbilityType) => {
    if (!character) return 0;

    return character.active_effects.reduce((sum, effect) => {
      if (effect.attribute !== ability) return sum;

      return sum + (effect.increase ? effect.value : -effect.value);
    }, 0);
  };

  const getRemainingTime = (expiresAt: string) => {
    console.log(expiresAt)
    const diff = new Date(expiresAt).getTime() - now;
    console.log(diff)

    if (diff <= 0) return "0s";

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const sortedAbilities = [...(character?.abilities ?? [])].sort((a, b) =>
    a.ability.localeCompare(b.ability)
  )

  const active_effects = character.active_effects.filter(
  effect => new Date(effect.expires_at).getTime() > now
);

  return (
    <View>
      <View>
        <Text>{character.name}</Text>
        <Button title="Név változtatása" onPress={() => setModalVisible(true)} />
        <Text>{character.level}. Szintű {character.class_}</Text>
      </View>

      <View>
        <XPBar level={character.level} xp={character.xp} />
      </View>

      <View>
        <Text>Ability Points: {character.ability_points}</Text>
      </View>

      <View>
        <Text>Aktív hatások:</Text>

        {active_effects.length === 0 && <Text>Nincsenek aktív hatások</Text>}

        {active_effects.map(effect => (
          <View key={effect.id} style={{ padding: 6 }}>
            <Text>
              {effect.increase ? "+" : "-"}
              {effect.value} {effect.attribute}
              ({getRemainingTime(effect.expires_at)})
            </Text>
          </View>
        ))}
      </View>

      <Text>Képességek:</Text>
      <FlatList<CharacterAbility>
        data={sortedAbilities}
        keyExtractor={(item) => item.ability}
        numColumns={2}
        renderItem={({ item }) => {
          const bonus = getAbilityBonus(item.ability);
          const total = item.score + bonus;

          return (
            <View style={{ flex: 1, margin: 5, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 }}>
              <Text>
                {item.ability}:{" "}
                <Text style={{ color: bonus > 0 ? "green" : bonus < 0 ? "red" : "black" }}>
                  {total}
                </Text>

                {bonus !== 0 && (
                  <Text style={{ color: "gray" }}>
                    {" "}({item.score} {bonus > 0 ? "+" : ""}{bonus})
                  </Text>
                )}
              </Text>

              <Button
                title="+"
                onPress={() => handleUpgrade(item.ability)}
                disabled={character.ability_points <= 0}
              />
            </View>
          );
        }}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000080" }}>
          <View style={{ width: "80%", padding: 20, backgroundColor: "white", borderRadius: 10 }}>
            <Text>Új név:</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Adj meg egy nevet"
              style={{ borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 20 }}
            />
            <Button title="Mentés" onPress={handleChangeName} />
            <Button title="Mégse" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>

    </View>
  );
}