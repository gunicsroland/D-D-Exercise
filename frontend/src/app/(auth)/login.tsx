import React from 'react';
import { useState } from 'react';
import { ScrollView, Button, Text, TextInput } from 'react-native';
import { useRouter } from "expo-router";
import { useAuthContext } from '../../context/AuthContext';


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
    <ScrollView>
      <Text>Bejelentkezés</Text>
      {error ? <Text style={{color: "red"}}>{error}</Text> : null}
      <TextInput placeholder="Felhasználónév" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Jelszó" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Bejelentkezés" onPress={handleSubmit} />
      <Button title="Regisztráció" onPress={() => router.push("register")} />
    </ScrollView>
  );
};
