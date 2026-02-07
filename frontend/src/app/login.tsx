import React from 'react';
import { useState, useEffect } from 'react';
import {ScrollView, Button, Text, TextInput, Alert} from 'react-native';
import FormBox from '../components/form_box';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { handleLogin } from '../hooks/handle_login';


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

  return (
    <ScrollView>
      <Text>Bejelentkezés</Text>
      <TextInput placeholder="Felhasználónév" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Jelszó" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Bejelentkezés" onPress={() => handleLogin(username, password, router)} />
      <Button title="Regisztráció" onPress={() => router.push("register")} />
    </ScrollView>
  );
};
