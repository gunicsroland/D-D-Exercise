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
      <ScrollView>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Napi küldetések
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 10 }}>
            {Object.keys(DIFFICULTY_ORDER).map((diff) => (
              <TouchableOpacity
                key={diff}
                onPress={() => updateQuestDifficulty(token, diff as ExerciseDifficulty)}
                style={{
                  marginRight: 8,
                  marginBottom: 6,
                  padding: 6,
                  borderRadius: 6,
                  backgroundColor:
                    questDifficulty === diff ? "#4CAF50" : "#ccc",
                }}
              >
                <Text>{diff}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {questError ? (
            <Text style={{ color: "red", marginVertical: 6 }}>{questError}</Text>
          ) : null}
          {progressError ? (
            <Text style={{ color: "red", marginVertical: 6 }}>{progressError}</Text>
          ) : null}

          <FlatList
            data={dailyQuests}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <QuestCard quest={item} progress={getProgressForQuest(item.id)} />}
          />
        </View>

        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Edzések</Text>
          <Text style={{ fontSize: 18 }}>Szűrők</Text>

          <View style={{ flexDirection: "row", marginVertical: 8 }}>
            {["strength", "cardio", "flexibility", "core"].map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === cat ? null : cat
                  )
                }
                style={{ marginRight: 8 }}
              >
                <Text>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 8 }}>
            {Object.keys(DIFFICULTY_ORDER).map((diff) => (
              <TouchableOpacity
                key={diff}
                onPress={() =>
                  setSelectedDifficulty(
                    selectedDifficulty === diff ? null : diff
                  )
                }
                style={{ marginRight: 8, marginBottom: 6 }}
              >
                <Text>{diff}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: "row", marginVertical: 8 }}>
            <TouchableOpacity
              onPress={() => setSortBy("difficulty")}
              style={{ marginRight: 12 }}
            >
              <Text>Sort by Difficulty</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSortBy("category")}>
              <Text>Sort by Category</Text>
            </TouchableOpacity>
          </View>
        </View>

        {ExerciseError ? (
          <Text style={{ color: "red", marginVertical: 6 }}>{ExerciseError}</Text>
        ) : null}
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => <ExerciseCard exercise={item}></ExerciseCard>
          }
        />


      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#10b981",
          padding: 16,
          borderRadius: 32,
          elevation: 4,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Start</Text>
      </TouchableOpacity>

      <ExercisePlanModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}