import { View, Text } from "react-native";
import { Character } from "../../types/types";
import { getRemainingTime } from "../../hooks/useRemainngTime";
import React from "react";

export const ActiveEffects = ({ character, now }: { character: Character; now: number }) => {
  const activeEffects = character.active_effects.filter(effect => new Date(effect.expires_at).getTime() > now);

  return (
    <View>
      <Text>Aktív hatások:</Text>
      {activeEffects.length === 0 && <Text>Nincsenek aktív hatások</Text>}
      {activeEffects.map(effect => (
        <View key={effect.id} style={{ padding: 6 }}>
          <Text>
            {effect.increase ? "+" : "-"}
            {effect.value} {effect.attribute} ({getRemainingTime(effect.expires_at, now)})
          </Text>
        </View>
      ))}
    </View>
  );
};