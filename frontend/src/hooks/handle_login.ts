import {Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function handleLogin(username:string, password:string, router:any) {
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