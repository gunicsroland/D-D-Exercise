import { View, Text, Button, FlatList } from "react-native";
import { Character, CharacterAbility, AbilityType } from "../../types/types";
import { getAbilityBonus } from "../../hooks/useAbilityBonus";
import React from "react";

export const AbilityList = ({ character, handleUpgrade }: { character: Character; handleUpgrade: (ability: AbilityType) => void }) => {
  const sortedAbilities = [...(character?.abilities ?? [])].sort((a, b) => a.ability.localeCompare(b.ability));

  return (
    <FlatList<CharacterAbility>
      data={sortedAbilities}
      keyExtractor={item => item.ability}
      numColumns={2}
      renderItem={({ item }) => {
        const bonus = getAbilityBonus(character, item.ability);
        const total = item.score + bonus;

        return (
          <View style={{ flex: 1, margin: 5, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 }}>
            <Text>
              {item.ability}:{" "}
              <Text style={{ color: bonus > 0 ? "green" : bonus < 0 ? "red" : "black" }}>{total}</Text>
              {bonus !== 0 && <Text style={{ color: "gray" }}> ({item.score} {bonus > 0 ? "+" : ""}{bonus})</Text>}
            </Text>
            <Button title="+" onPress={() => handleUpgrade(item.ability)} disabled={character.ability_points <= 0} />
          </View>
        );
      }}
    />
  );
};