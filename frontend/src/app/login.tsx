import React from 'react';
import { useState, useEffect } from 'react';
import {ScrollView, Button, Text, TextInput, Alert} from 'react-native';
import FormBox from '../components/form_box';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";


export default function Login () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token")
      if (token){
        router.replace("/")
      }
    }
    checkToken();
  });

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
      });

      if (res.ok) {
        const data = await res.json();
        await AsyncStorage.setItem("token", data.access_token);
        router.replace("/")
      }
      else {
        const data = await res.json();
        Alert.alert("Hiba", data.detail || "Hibás adatok");
      }
    }
    catch(err){
      Alert.alert("Hiba", "Nem sikerült kapcsolódni a szerverhez. Próbáld újra később");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text>Bejelentkezés</Text>
      <TextInput placeholder="Felhasználónév" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Jelszó" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Bejelentkezés" onPress={handleLogin} />
      <Button title="Regisztráció" onPress={() => router.push("register")} />
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
};
