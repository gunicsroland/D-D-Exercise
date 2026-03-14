import React from 'react';
import { useState } from 'react';
import { ScrollView, Button, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import { useAuthContext } from '../../context/AuthContext';
import { colors } from '../../styles/colors';
import { auth_styles } from '../../styles/auth';


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async () => {
  try {
    await login(username, password);
    router.replace("/");
  } catch {
    setError("Sikertelen bejelentkezés");
  }
};

  return (
    <ScrollView contentContainerStyle={auth_styles.container}>
      <View style={auth_styles.card}>

        <Text style={auth_styles.title}>⚔ Bejelentkezés</Text>

        {error ? <Text style={auth_styles.error}>{error}</Text> : null}

        <TextInput
          placeholder="Felhasználónév"
          placeholderTextColor={colors.textSecondary}
          value={username}
          onChangeText={setUsername}
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
          <Text style={auth_styles.submitText}>Belépés</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={auth_styles.subButton}
          onPress={() => router.push("register")}
        >
          <Text style={auth_styles.subText}>Regisztráció</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};
