import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { checkCharacter } from "../hooks/check_char";
import { useAuth } from "../hooks/useAuth";


export default function Home() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    router.replace("login");
  };

  return (
    <View>
      <Text>Üdv, {user?.username}!</Text>
      <Button title="Kijelentkezés" onPress={handleLogout} />
    </View>
  );
}
