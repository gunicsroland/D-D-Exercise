import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";


export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if(!token){
         router.replace("/login")
      }
      else{
        setUsername("test");
      }
      
    };

    checkLogin();
  })

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <View>
      <Text>Üdv, {username}!</Text>
      <Button title="Kijelentkezés" onPress={handleLogout} />
    </View>
  );
}
