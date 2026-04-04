import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Quest, QuestProgress } from "../types";
import { useExercisePlanContext } from "../context/ExercisePlanContext";
import { questCard_styles } from "../styles/questCard";
import { ABILITY_LABELS_HU, DIFFICULTY_LABELS_HU } from "../text_labels";

type Props = {
  quest: Quest;
  progress: QuestProgress | undefined;
};

export function QuestCard({ quest, progress }: Props) {
  const { addExercise } = useExercisePlanContext();

  const progressValue = progress?.progress ?? 0;
  const total = quest.amount;
  const progressPercent = total > 0 ? (progressValue / total) * 100 : 0;

  return (
    <View style={questCard_styles.card} testID="quest-card">
      <Text style={questCard_styles.title} testID="quest-title">
        {quest.name} ({DIFFICULTY_LABELS_HU[quest.exercise.difficulty]})
      </Text>

      <Text style={questCard_styles.subText} testID="quest-exercise">
        Edzés: {quest.exercise.name}
      </Text>

      <View
        style={questCard_styles.progressContainer}
        testID="progress-container"
      >
        <View
          style={[
            questCard_styles.progressBar,
            { width: `${progressPercent}%` },
          ]}
          testID="progress-bar"
        />

        <Text style={questCard_styles.progressText} testID="progress-text">
          {progress?.progress}/{quest.amount} Darab{" "}
          {progress?.completed && "✔️"}
        </Text>
      </View>

      <Text style={questCard_styles.xpText} testID="xp-reward">
        XP Jutalom: {quest.xp_reward}
      </Text>

      <TouchableOpacity
        onPress={() => addExercise(quest.exercise)}
        style={questCard_styles.addButton}
        testID="add-to-plan-button"
      >
        <Text style={questCard_styles.buttonText}>+ Tervhez</Text>
      </TouchableOpacity>

      {quest.item && (
        <View style={questCard_styles.itemSection} testID="quest-item-section">
          <Text style={questCard_styles.itemTitle} testID="item-reward-name">
            Tárgy Jutalom: {quest.item.name}
          </Text>

          {quest.item.effects.map((effect, index) => (
            <Text
              key={index}
              style={questCard_styles.effectText}
              testID={`quest-effect-${index}`}
            >
              {effect.increase ? "+" : "-"}
              {effect.value} {ABILITY_LABELS_HU[effect.attribute]} (
              {effect.duration} perc)
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
