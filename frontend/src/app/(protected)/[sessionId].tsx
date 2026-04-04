import { useEffect, useRef, useState } from "react";
import { API_URL } from "../../constants";
import { useAuthContext } from "../../context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { Message } from "../../types";
import {
  View,
  Text,
  KeyboardAvoidingView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { colors } from "../../styles/colors";
import { session_styles } from "../../styles/session";

export default function AdventureChatScreen() {
  const { sessionId } = useLocalSearchParams();
  const id = Number(sessionId);

  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [talking, setTalking] = useState(false);

  const { token } = useAuthContext();
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setMessages(data);
    } catch {
      setError("Nem elérhető a beszélgetési előzményed");
    }
  };

  useEffect(() => {
    if (id && token) fetchMessages();
  }, [id, token]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    let tempDMId: number | null = null;

    setTalking(true);

    try {
      tempDMId = Date.now();
      const messageToSend = newMessage;

      const userMsg: Message = {
        id: tempDMId - 1,
        session_id: -1,
        role: "user",
        content: messageToSend,
      };

      const tempDM: Message = {
        id: tempDMId,
        session_id: -1,
        role: "dm",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, tempDM]);
      setNewMessage("");
      setError("");

      const res = await fetch(
        `${API_URL}/messages/${id}?message=${encodeURIComponent(messageToSend)}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const resClone = res.clone();

      try {
        if (res.body && typeof res.body.getReader === "function") {
          const reader = res.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let partialMessage = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            partialMessage += chunk;

            if (tempDMId !== null) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === tempDMId ? { ...m, content: partialMessage } : m,
                ),
              );
            }
          }
        } else {
          const data = await res.json();
          const fullMessage = data.content || data.message;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempDMId ? { ...m, content: fullMessage } : m,
            ),
          );
        }
      } catch (streamError) {
        console.warn("Streaming failed, falling back:", streamError);

        try {
          const text = await resClone.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch {
            // Not JSON → treat as plain text
            data = { message: text };
          }

          const fullMessage = data.content || data.message || text;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempDMId ? { ...m, content: fullMessage } : m
            )
          );
        } catch (jsonError) {
          console.error("Fallback JSON parsing failed:", jsonError);
        }
      }

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
        testID={`message-${item.id}`}
      >
        <Text
          style={session_styles.messageText}
          testID={`message-text-${item.id}`}
        >
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={"padding"}
      keyboardVerticalOffset={80}
      testID="chat-screen"
    >
      <View style={session_styles.header}>
        <TouchableOpacity onPress={() => router.back()} testID="back-button">
          <Text style={session_styles.backText}>Vissza</Text>
        </TouchableOpacity>
      </View>

      <View style={session_styles.container}>
        {error ? (
          <Text style={session_styles.error} testID="error-text">
            {error}
          </Text>
        ) : null}

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          style={session_styles.container}
          testID="messages-list"
        />
      </View>

      <View style={session_styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Írj üzenetet..."
          style={session_styles.input}
          testID="message-input"
        />

        <Pressable
          style={[
            session_styles.sendButton,
            talking && session_styles.disabledButton,
          ]}
          onPress={sendMessage}
          disabled={talking}
          testID="send-button"
        >
          <Text style={session_styles.sendText}>Küldés</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
