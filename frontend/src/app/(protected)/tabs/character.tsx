import { router } from "expo-router/build/exports";
import React, {useEffect, useState} from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Character, CharacterAbility } from "../../../types/types";

export default function CharacterScreen() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if(!token) {
          console.error("No token found");
          setLoading(false);
          router.replace("/auth/login");
          return;
        }

        const res = await fetch("http://localhost:8000/character/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });

        if (!res.ok) {
          // TODO: Set error if no char for that person reroute to char creation
          throw new Error("Failed to fetch character");
        }

        const data = await res.json();
        setCharacter(data);

        console.log("Character data fetched:", data);

      } catch (error) {
        console.error("Error fetching character:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <View>
      <Text>{character?.name}</Text>
      <Text>{character?.level}. Szintű {character?.class_}</Text>
      </View>

      <View>
      <Text>{character?.xp} XP</Text>
      </View>

      <Text>Főbb képességek:</Text>
      <FlatList<CharacterAbility>
        data={character?.abilities}
        keyExtractor={(item) => item.ability}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={{ flex: 1, margin: 5, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 }}>
            <Text>{item.ability}: {item.score}</Text>
          </View>
        )}
      />
    </View>
  );
}