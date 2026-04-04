import { View, Text } from "react-native";
import { Character } from "../../types";
import { getRemainingTime } from "../../hooks/useRemainingTime";
import React from "react";
import { effect_styles } from "../../styles/active_effect";
import { colors } from "../../styles/colors";
import { ABILITY_LABELS_HU } from "../../text_labels";

export const ActiveEffects = ({
  character,
  now,
}: {
  character: Character;
  now: number;
}) => {
  const activeEffects = character.active_effects.filter(
    (effect) => new Date(effect.expires_at).getTime() > now,
  );

  return (
    <View testID="active-effects-container">
      <Text style={effect_styles.title}>Aktív hatások:</Text>
      {activeEffects.length === 0 && (
        <Text style={{ color: colors.textSecondary }} testID="no-effects">
          Nincsenek aktív hatások
        </Text>
      )}

      {activeEffects.map((effect) => {
        const expires = new Date(effect.expires_at).getTime();
        const remainingDuration = expires - now;

        const percentage = Math.max(
          0,
          remainingDuration / (1000 * 60 * effect.value),
        );
        const widthPercent = Math.min(1, percentage) * 100;

        const isBuff = effect.increase;

        return (
          <View
            key={effect.id}
            style={effect_styles.card}
            testID={`effect-${effect.id}`}
          >
            <Text
              style={effect_styles.effectText}
              testID={`effect-text-${effect.id}`}
            >
              {effect.increase ? "+" : "-"}
              {effect.value} {ABILITY_LABELS_HU[effect.attribute]}
            </Text>

            <Text
              style={effect_styles.timer}
              testID={`effect-timer-${effect.id}`}
            >
              {getRemainingTime(effect.expires_at, now)}
            </Text>

            <View
              style={effect_styles.barBackground}
              testID={`effect-bar-${effect.id}`}
            >
              <View
                style={[
                  effect_styles.barFill,
                  {
                    width: `${widthPercent}%`,
                    backgroundColor: isBuff ? colors.health : colors.damage,
                  },
                ]}
                testID={`effect-bar-fill-${effect.id}`}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};
