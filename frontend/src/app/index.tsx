import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { checkCharacter } from "../services/character_service";
import React from 'react';
import { useAuthContext } from "../context/AuthContext";
import { colors } from "../styles/colors";

export default function Home() {
    const router = useRouter();
    const {token, loading} = useAuthContext();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                if (!token && !loading) {
                    router.replace("/login");
                } else if (token){
                    const hasChar = await checkCharacter(token);
                    if (!hasChar) {
                        router.replace("/character/create");
                    } else {
                        router.replace("/tabs/character");
                    }
                }
            } catch (error) {
                console.log("Error checking login:", error);
                router.replace("/login");
            }
        };

        checkLogin();
    }, [token, loading]);

    return (
        <View style={{backgroundColor: colors.background}}>
            <ActivityIndicator size="large" color={colors.gold}></ActivityIndicator>
        </View>
    );
}
