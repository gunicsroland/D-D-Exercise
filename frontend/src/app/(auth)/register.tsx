import { useState } from "react";
import { ScrollView, TextInput, Button, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { registerRequest } from "../../services/auth_service";
import React from "react";
import { useAuthContext } from "../../context/AuthContext";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { register } = useAuthContext();
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            await register(username, email, password);
            router.replace("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <ScrollView>
            <Text>Regisztráció</Text>
            {error ? <Text style={{color: "red"}}>{error}</Text> : null}
            <TextInput placeholder="Felhasználónév" value={username} onChangeText={setUsername} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Jelszó" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Regisztráció" onPress={handleSubmit} />
            <Button title="Már van fiókom" onPress={() => router.push("login")} />
        </ScrollView>
    )
}