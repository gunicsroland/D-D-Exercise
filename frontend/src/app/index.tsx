import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { checkCharacter } from "../hooks/check_char";


export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("login");
  };

  return (
    <View>
      <Button title="Kijelentkezés" onPress={handleLogout} />
    </View>
  );
}
