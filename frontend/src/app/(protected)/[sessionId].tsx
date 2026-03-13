import { useEffect, useState } from "react";
import { API_URL } from "../../constants";
import { useAuthContext } from "../../context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { Message } from "../../types/types";
import { View, Text, StyleSheet, KeyboardAvoidingView, FlatList, Platform, TextInput, TouchableOpacity, Button, Pressable } from "react-native";
import React from "react";
import { colors } from "../../styles/colors";
import { session_styles } from "../../styles/session";

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
            const res = await fetch(`${API_URL}/messages/${id}?message=${encodeURIComponent(newMessage)}`, {
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
            setError("Nem sikerült elküldeni az üzenetet!");
        } finally {
            setTalking(false);
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isUser = item.role === "user";

        return (
            <View
                style={[
                    session_styles.messageContainer,
                    isUser ? session_styles.userContainer : session_styles.dmContainer,
                ]}
            >
                <Text style={session_styles.messageText}>{item.content}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={80}
        >
            <View style={session_styles.header}>
                <TouchableOpacity onPress={() => { router.back() }}>
                    <Text style={session_styles.backText}>Vissza</Text>
                </TouchableOpacity>
            </View>

            <View style={session_styles.container}>
                {error ? <Text style={session_styles.error}>{error}</Text> : null}

                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 10 }}
                />

                <View style={session_styles.inputContainer}>
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Írj üzenetet..."
                        style={session_styles.input}
                    />
                    <Pressable
                        style={[session_styles.sendButton, talking && session_styles.disabledButton]}
                        onPress={sendMessage}
                        disabled={talking}
                    >
                        <Text style={session_styles.sendText}>Küldés</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );

}