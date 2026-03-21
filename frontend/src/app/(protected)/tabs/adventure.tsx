import {
  View,
  Text,
  Alert,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../constants";
import { useAuthContext } from "../../../context/AuthContext";
import { Session } from "../../../types/types";
import { useRouter } from "expo-router";
import { adventure_styles } from "../../../styles/tabs_adventure";
import { colors } from "../../../styles/colors";

export default function KalandScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [title, setTitle] = useState("");

  const { token } = useAuthContext();
  const router = useRouter();

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/adventure/`, {
        headers: { Authorization: `Bearer ${token}` }, // replace with real auth token
      });
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const startAdventure = async () => {
    try {
      const res = await fetch(
        `${API_URL}/adventure/start?title=${encodeURIComponent(title)}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      Alert.alert("Adventure Started!", `Session ID: ${data.session_id}`);
      setTitle("");
      fetchSessions();
    } catch (err) {
      console.error(err);
      Alert.alert("Error starting adventure");
    }
  };

  const deleteSession = async (sessionId: number) => {
    try {
      await fetch(`${API_URL}/adventure/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Session Deleted");
      fetchSessions();
    } catch (err) {
      console.error(err);
      Alert.alert("Error deleting session");
    }
  };

  const updateTitle = async (sessionId: number, newTitle: string) => {
    try {
      await fetch(
        `${API_URL}/adventure/${sessionId}/title?new_title=${encodeURIComponent(newTitle)}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      Alert.alert("Title Updated");
      fetchSessions();
    } catch (err) {
      console.error(err);
      Alert.alert("Error updating title");
    }
  };

  return (
    <View style={adventure_styles.container}>
      <Text style={adventure_styles.title}>Új Kaland indítása</Text>
      <View style={adventure_styles.panel}>
        <TextInput
          placeholder="Kaland címe"
          placeholderTextColor={colors.textTernary}
          value={title}
          onChangeText={setTitle}
          style={adventure_styles.input}
        />
        <Pressable
          style={[
            adventure_styles.button,
            title === "" && adventure_styles.buttonDisabled,
          ]}
          onPress={startAdventure}
          disabled={title === ""}
        >
          <Text style={adventure_styles.buttonText}>Kaland indítása</Text>
        </Pressable>
      </View>

      <Text style={adventure_styles.title}>Korábbi kalandjaid</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={adventure_styles.sessionCard}>
            <Text style={adventure_styles.sessionTitle}>{item.title}</Text>
            <View style={adventure_styles.buttonCol}>
              <Pressable
                style={[
                  adventure_styles.buttonSmall,
                  adventure_styles.chooseButton,
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/[sessionId]",
                    params: {
                      sessionId: item.id,
                      title: item.title,
                    },
                  })
                }
              >
                <Text style={adventure_styles.buttonText}>Kiválasztás</Text>
              </Pressable>

              <Pressable
                style={[
                  adventure_styles.buttonSmall,
                  adventure_styles.renameButton,
                ]}
                onPress={() => {
                  const newTitle = prompt("Add meg az új címet:", item.title);
                  if (newTitle) updateTitle(item.id, newTitle);
                }}
              >
                <Text style={adventure_styles.buttonText}>Átnevezés</Text>
              </Pressable>

              <Pressable
                style={[
                  adventure_styles.buttonSmall,
                  adventure_styles.deleteButton,
                ]}
                onPress={() => deleteSession(item.id)}
              >
                <Text style={adventure_styles.buttonText}>Törlés</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
