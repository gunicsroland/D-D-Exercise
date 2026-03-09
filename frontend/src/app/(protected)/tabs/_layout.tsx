import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from 'react';
import NetInfo from "@react-native-community/netinfo";
import { useAuthContext } from "../../../context/AuthContext";
import { syncFinishedExercises } from "../../../services/quest_service";

export default function TabsLayout() {

    const {token} = useAuthContext();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected && token){
                syncFinishedExercises(token);
            }
        })

        unsubscribe();
    }, [token]);

    return (
        <Tabs screenOptions={{ headerShown: true }}>
            <Tabs.Screen
                name="adventure"
                options={{
                    title: "Kaland",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="compass" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name = "inventory"
                options={{
                    title: "Eszköztár",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="briefcase-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name = "exercise"
                options={{
                    title: "Edzés",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="barbell-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name = "character"
                options={{
                    title: "Karakter",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name = "settings"
                options={{
                    title: "Beállítások",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}