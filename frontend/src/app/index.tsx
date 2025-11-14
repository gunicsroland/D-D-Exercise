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
         router.replace("login")
         return;
      }

      try {
        const res = await fetch("http://localhost:8000/has_character/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (!data.has_character) {
            router.replace("character/create");
            return;
          }
        }
      }
      catch (err) {
        console.error(err);
      }

      try {
        const res = await fetch("http://localhost:8000/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        }
        else {
          await AsyncStorage.removeItem("token");
          router.replace("login");
        }
      }
      catch (err) {
        console.error(err);
        await AsyncStorage.removeItem("token");
        router.replace("login");
      }
    };

    checkLogin();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("login");
  };

  return (
    <View>
      <Text>Üdv, {username}!</Text>
      <Button title="Kijelentkezés" onPress={handleLogout} />
    </View>
  );
}
