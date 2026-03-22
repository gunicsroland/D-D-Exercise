import { View, Text, FlatList, Pressable } from "react-native";
import { Character, CharacterAbility, AbilityType } from "../../types/types";
import { getAbilityBonus } from "../../hooks/useAbilityBonus";
import React, { useEffect, useState } from "react";
import { character_styles } from "../../styles/tabs_character";
import { colors } from "../../styles/colors";
import { ABILITY_LABELS_HU } from "../../text_labels";

export const AbilityList = ({
  character,
  handleUpgrade,
  now
}: {
  character: Character;
  handleUpgrade: (ability: AbilityType) => void;
  now: number;
}) => {
  const [sortedAbilities, setSortedAbilities] = useState<CharacterAbility[]>([]);

  useEffect(() => {
  setSortedAbilities([...(character?.abilities ?? [])].sort((a, b) =>
    a.ability.localeCompare(b.ability),
  ));
  }, [character])

  return (
    <FlatList<CharacterAbility>
      data={sortedAbilities}
      keyExtractor={(item) => item.ability}
      scrollEnabled={false}
      numColumns={2}
      renderItem={({ item }) => {
        const bonus = getAbilityBonus(character, item.ability, now);
        const total = item.score + bonus;

        const bonusColor =
          bonus > 0 ? colors.health : bonus < 0 ? colors.damage : colors.text;

        return (
          <View style={character_styles.card}>
            <Text style={character_styles.abilityName}>
              {ABILITY_LABELS_HU[item.ability]}
            </Text>

            <Text style={character_styles.value}>
              <Text style={{ color: bonusColor }}>{total}</Text>
              {bonus !== 0 && (
                <Text style={character_styles.bonus}>
                  {` (${item.score}${bonus > 0 ? "+" : ""}${bonus})`}
                </Text>
              )}
            </Text>

            <Pressable
              style={[
                character_styles.upgradeButton,
                character.ability_points <= 0 &&
                character_styles.disabledButton,
              ]}
              onPress={() => handleUpgrade(item.ability)}
              disabled={character.ability_points <= 0}
            >
              <Text style={character_styles.buttonText}>+</Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
};
