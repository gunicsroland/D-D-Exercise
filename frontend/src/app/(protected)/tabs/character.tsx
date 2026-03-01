import { router } from "expo-router/build/exports";
import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, FlatList, Button, AppState } from "react-native";


import { Character, CharacterAbility, AbilityType } from "../../../types/types";
import { XP_LEVELS } from "../../../constants";
import { useAuthContext } from "../../../context/AuthContext";
import { checkCharacter, getCharacter, lvlUpAbility } from "../../../services/character_service";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function CharacterScreen() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  const { token } = useAuthContext();

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

            const data = await getCharacter(token);
            setCharacter(data);
        }

        appState.current = nextState
      }
    );

    return () => {
      subsription.remove();
    };
  }, [token]);

if (loading || !character) {
  return (
    <View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

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

const sortedAbilities = [...(character?.abilities ?? [])].sort((a, b) =>
  a.ability.localeCompare(b.ability)
)


return (
  <View>
    <View>
      <Text>{character.name}</Text>
      <Text>{character.level}. Szintű {character.class_}</Text>
    </View>

    <View>
      <XPBar level={character.level} xp={character.xp} />
    </View>

    <View>
      <Text>Ability Points: {character.ability_points}</Text>
    </View>

    <Text>Képességek:</Text>
    <FlatList<CharacterAbility>
      data={character?.abilities}
      keyExtractor={(item) => item.ability}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={{ flex: 1, margin: 5, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 }}>
          <Text>{item.ability}: {item.score}</Text>
          <Button
            title="+"
            onPress={() => handleUpgrade(item.ability)}
            disabled={character.ability_points <= 0}
          />
        </View>
      )}
    />
  </View>
);
}