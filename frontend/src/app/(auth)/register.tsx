import { useState } from "react";
import { ScrollView, TextInput, Button, Text } from "react-native";
import { useRouter } from "expo-router";
import FormBox from '../../components/form_box';
import { handleRegister } from "../../hooks/handle_register";

export default function Register(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    return (
        <ScrollView>
            <Text>Regisztráció</Text>
            <TextInput placeholder="Felhasználónév" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Jelszó" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Regisztráció" onPress={() => handleRegister(username, email, password, router)} />
            <Button title="Már van fiókom" onPress={() => router.push("login")} />
        </ScrollView>
    )
}