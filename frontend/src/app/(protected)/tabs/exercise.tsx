import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Exercise, ExerciseDifficulty, Quest, QuestProgress } from "../../../types/types";
import { getDailyQuests, getExercises, getQuestProgress, setQuestDifficulty } from "../../../services/quest_service";
import { useAuthContext } from "../../../context/AuthContext";
import { DIFFICULTY_ORDER } from "../../../constants";
import { QuestCard } from "../../../components/QuestCard";
import { ExerciseCard } from "../../../components/ExerciseCard";
import { useExercisePlanContext } from "../../../context/ExercisePlanContext";
import ExercisePlanModal from "../../../components/ExercisePlanModal";
import { useFocusEffect } from "@react-navigation/native";
import { exercise_styles } from "../../../styles/tabs_exercise";

export default function ExerciseScreen() {
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [questProgress, setQuestProgress] = useState<QuestProgress[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);

  const [questError, setQuestError] = useState("");
  const [progressError, setProgressError] = useState("");
  const [ExerciseError, setExerciseError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"difficulty" | "category" | null>(null);

  const [questDifficulty, setLocalQuestDifficulty] = useState<ExerciseDifficulty>("very_easy");
  const [modalVisible, setModalVisible] = useState(false);

  const { token } = useAuthContext();

  const fetchInitialData = async () => {
    if (!token) {
      console.log("no token, not getting data")
      return;
    }

    try {

      const quests = await getDailyQuests(token);
      setDailyQuests(quests);
    } catch {
      setQuestError("Nem sikerült a napi küldetéseket lekérni, ellenőrizd a kapcsolatod!");
    }

    try {

      const exercises = await getExercises(token);
      setAllExercises(exercises);
    } catch {
      setExerciseError("Nem sikerült a edzéseket elérni, ellenőrizd a kapcsolatod!");
    }

    try {

      const progesses = await getQuestProgress(token)
      setQuestProgress(progesses);
    } catch {
      setProgressError("Nem sikerült a haladásodat elérni, ellenőrizd a kapcsolatod!");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInitialData();
    }, [token])
  )

  const filteredExercises = useMemo(() => {
    let filtered = [...allExercises];

    if (selectedCategory) {
      filtered = filtered.filter(
        (ex) => ex.category === selectedCategory
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(
        (ex) => ex.difficulty === selectedDifficulty
      );
    }

    if (sortBy === "difficulty") {
      filtered.sort(
        (a, b) =>
          DIFFICULTY_ORDER[a.difficulty] -
          DIFFICULTY_ORDER[b.difficulty]
      );
    }

    if (sortBy === "category") {
      filtered.sort((a, b) =>
        a.category.localeCompare(b.category)
      );
    }

    return filtered;
  }, [allExercises, selectedCategory, selectedDifficulty, sortBy])

  const updateQuestDifficulty = async (token: string, difficulty: ExerciseDifficulty) => {
    setQuestDifficulty(token, difficulty);
    setLocalQuestDifficulty(difficulty);
  }

  const getProgressForQuest = (questId: number) => {
    return questProgress.find((p) => p.quest_id === questId);
  };

  return (token &&
    <>
      <ScrollView style={exercise_styles.screen}>
        <View style={exercise_styles.section}>
          <Text style={exercise_styles.title}>
            Napi küldetések
          </Text>

          <View style={exercise_styles.filterRow}>
            {Object.keys(DIFFICULTY_ORDER).map((diff) => (
              <TouchableOpacity
                key={diff}
                onPress={() => updateQuestDifficulty(token, diff as ExerciseDifficulty)}
                style={[exercise_styles.filterButton, questDifficulty === diff && exercise_styles.filterActive]}
              >
                <Text style={exercise_styles.filterText}>{diff}</Text>
              </TouchableOpacity>
            ))}
          </View>


          {questError ? <Text style={exercise_styles.error}>{questError}</Text> : null}
          {progressError ? <Text style={exercise_styles.error}>{progressError}</Text> : null}

          <FlatList
            data={dailyQuests}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <QuestCard
                quest={item}
                progress={getProgressForQuest(item.id)}
              />
            )}
          />
        </View>

        <View style={exercise_styles.section}>
          <Text style={exercise_styles.title}>Edzések</Text>
          <Text style={exercise_styles.subtitle}>Szűrők</Text>

          <View style={exercise_styles.filterRow}>
            {["strength", "cardio", "flexibility", "core"].map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() =>
                  setSelectedCategory(selectedCategory === cat ? null : cat)
                }
                style={[
                  exercise_styles.filterButton,
                  selectedCategory === cat && exercise_styles.filterActive,
                ]}
              >
                <Text style={exercise_styles.filterText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={exercise_styles.filterRow}>
            {Object.keys(DIFFICULTY_ORDER).map((diff) => (
              <TouchableOpacity
                key={diff}
                onPress={() =>
                  setSelectedDifficulty(
                    selectedDifficulty === diff ? null : diff
                  )
                }
                style={[
                  exercise_styles.filterButton,
                  selectedDifficulty === diff && exercise_styles.filterActive,
                ]}
              >
                <Text style={exercise_styles.filterText}>{diff}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={exercise_styles.sortRow}>
            <TouchableOpacity onPress={() => setSortBy("difficulty")}>
              <Text style={exercise_styles.sortText}>Sort by Difficulty</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSortBy("category")}>
              <Text style={exercise_styles.sortText}>Sort by Category</Text>
            </TouchableOpacity>
          </View>
        </View>

        {ExerciseError ? <Text style={exercise_styles.error}>{ExerciseError}</Text> : null}

        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => <ExerciseCard exercise={item} />}
        />
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={exercise_styles.startButton}
      >
        <Text style={exercise_styles.startText}>⚔ Start</Text>
      </TouchableOpacity>

      <ExercisePlanModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}