import { useState } from "react";
import { ScrollView, TextInput, Button, Text, Alert, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { registerRequest } from "../../services/auth_service";
import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import { auth_styles } from "../../styles/auth";
import { colors } from "../../styles/colors";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { register } = useAuthContext();
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            await register(username, email, password);
            router.replace("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

  return (
    <ScrollView contentContainerStyle={auth_styles.container}>
      <View style={auth_styles.card}>
        <Text style={auth_styles.title}>🛡 Regisztráció</Text>

        {error ? <Text style={auth_styles.error}>{error}</Text> : null}

        <TextInput
          placeholder="Felhasználónév"
          placeholderTextColor={colors.textSecondary}
          value={username}
          onChangeText={setUsername}
          style={auth_styles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          style={auth_styles.input}
        />

        <TextInput
          placeholder="Jelszó"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={auth_styles.input}
        />

        <TouchableOpacity style={auth_styles.submitButton} onPress={handleSubmit}>
          <Text style={auth_styles.submitText}>Karakter létrehozása</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={auth_styles.subButton}
          onPress={() => router.push("login")}
        >
          <Text style={auth_styles.subText}>Már van fiókom</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}