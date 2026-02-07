import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { checkCharacter } from "../hooks/check_char";


export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const checkLogin = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                router.replace("/login");
            }
            else {
                const hasChar = await checkCharacter(token, router);
                if (!hasChar) {
                    router.replace("/character/create");
                }
                else {
                    router.replace("/tabs/character");
                }
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
            <Button title="Kijelentkezés" onPress={handleLogout} />
        </View>
    );
}
