import React from 'react';
import { useState } from 'react';
import { ScrollView, Button, Text, TextInput, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { useAuthContext } from '../../context/AuthContext';


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await login(username, password);
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Hiba", err.message);
    }
  };

  return (
    <ScrollView>
      <Text>Bejelentkezés</Text>
      <TextInput placeholder="Felhasználónév" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Jelszó" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Bejelentkezés" onPress={handleSubmit} />
      <Button title="Regisztráció" onPress={() => router.push("register")} />
    </ScrollView>
  );
};
