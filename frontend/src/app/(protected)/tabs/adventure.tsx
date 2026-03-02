import { View, Text, Alert, Button, FlatList, TextInput, StyleSheet } from "react-native";
import React, { useEffect, useState } from 'react';
import { API_URL } from "../../../constants";
import { useAuthContext } from "../../../context/AuthContext";
import { Session } from "../../../types/types";
import { useRouter } from "expo-router";

export default function KalandScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [title, setTitle] = useState("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

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
      const res = await fetch(`${API_URL}/adventure/start?title=${encodeURIComponent(title)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
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
      await fetch(`${API_URL}/adventure/${sessionId}/title?new_title=${encodeURIComponent(newTitle)}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Title Updated");
      fetchSessions();
    } catch (err) {
      console.error(err);
      Alert.alert("Error updating title");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Új Kaland indítása</Text>
      <TextInput
        placeholder="Adventure Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Button title="Start Adventure" onPress={startAdventure} />

      <Text style={styles.heading}>Korábbi kalandjaid</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.session}>
            <Text style={styles.sessionTitle}>{item.title}</Text>
            <Button title="Select" onPress={() => {
              setSelectedSession(item);
              router.push({
                pathname: "/[sessionId]",
                params: {
                  sessionId: item.id,
                  title: item.title
                },
              });
            }
            } />
            <Button title="Delete" onPress={() => deleteSession(item.id)} color="red" />
            <Button
              title="Update Title"
              onPress={() => {
                const newTitle = prompt("Enter new title:", item.title); // web only, for RN you may need a modal
                if (newTitle) updateTitle(item.id, newTitle);
              }}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  session: { marginBottom: 10, padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 5 },
  sessionTitle: { fontSize: 16, marginBottom: 5 },
  chatContainer: { marginTop: 20 },
});
