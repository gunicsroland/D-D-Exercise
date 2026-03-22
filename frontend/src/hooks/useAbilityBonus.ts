import { Character, AbilityType } from "../types/types";

export const getAbilityBonus = (
  character: Character | null,
  ability: AbilityType,
  now: number
): number => {
  if (!character) return 0;

  return character.active_effects
    .filter(effect => new Date(effect.expires_at).getTime() > now)
    .reduce((sum, effect) => {
      if (effect.attribute !== ability) return sum;
      return sum + (effect.increase ? effect.value : -effect.value);
    }, 0);
};
