import { useState } from "react";
import { ScrollView, TextInput, Button, Alert, Text } from "react-native";
import { useRouter } from "expo-router";
import FormBox from '../components/form_box';

export default function Register(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            const res = await fetch("http://localhost:8000/register",
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({username, email, password})
                }
            );

            if (res.ok){
                Alert.alert("Siker!", "Sikeres regisztráció!");
                router.replace("/login")
            }
            else{
                const data = await res.json();
                Alert.alert("Hiba", data.detail || "Regisztráció sikertelen");
            }
        }
        catch (err){
            Alert.alert("Hiba", "Nem sikerült kapcsolódni a szerverhez. Próbáld újra később.");
        }
    };

    return (
        <ScrollView>
            <Text>Regisztráció</Text>
            <TextInput placeholder="Felhasználónév" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Jelszó" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Regisztráció" onPress={handleRegister} />
            <Button title="Már van fiókom" onPress={() => router.push("/login")} />
        </ScrollView>
    )
}