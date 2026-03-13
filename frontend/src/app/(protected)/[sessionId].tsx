import { useEffect, useState } from "react";
import { API_URL } from "../../constants";
import { useAuthContext } from "../../context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { Message } from "../../types/types";
import { View, Text, StyleSheet, KeyboardAvoidingView, FlatList, Platform, TextInput, TouchableOpacity, Button } from "react-native";
import React from "react";

export default function AdventureChatScreen() {
    const { sessionId, title } = useLocalSearchParams();
    const id = Number(sessionId);

    const [error, setError] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [talking, setTalking] = useState(false);

    const { token } = useAuthContext();

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${API_URL}/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error();
            }

            const data = await res.json();
            setMessages(data);
        } catch (err) {
            setError("Nem elérhető a beszélgetési előzményed");
        }
    };

    useEffect(() => {
        if (id)
            fetchMessages();
    }, [id]);

    const sendMessage = async () => {
        if (!newMessage.trim())
            return;

        try {
            setTalking(true);
            const res = await fetch(`${API_URL}/messages/message?message=${encodeURIComponent(newMessage)}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error();
            }
            const data = await res.json();

            setNewMessage("");
            fetchMessages();
        } catch (err) {
            console.error(err);
            setError("Nem sikerült elküldeni az üzenetet");
        }finally{
            setTalking(false);
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isUser = item.role === "user";

        return (
            <View
                style={[
                    styles.messageContainer,
                    isUser ? styles.userContainer : styles.dmContainer,
                ]}
            >
                <Text style={styles.messageText}>{item.content}</Text>
            </View>
        );
    };

      return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
        <View>
            <TouchableOpacity onPress={() => {router.back()}}>
                <Text>Vissza</Text>
            </TouchableOpacity>
        </View>

      <View style={styles.container}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Írj üzenetet..."
            style={styles.input}
          />
          <Button title="Küldés" onPress={sendMessage} disabled={talking}>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 10,
    },
    messageContainer: {
        maxWidth: "75%",
        padding: 10,
        borderRadius: 12,
        marginVertical: 5,
    },
    userContainer: {
        alignSelf: "flex-end",
        backgroundColor: "#007AFF",
    },
    dmContainer: {
        alignSelf: "flex-start",
        backgroundColor: "#E5E5EA",
    },
    messageText: {
        color: "black",
    },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
    },
});