import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from 'react';
import NetInfo from "@react-native-community/netinfo";
import { useAuthContext } from "../../../context/AuthContext";
import { syncFinishedExercises } from "../../../services/quest_service";

import { useFonts, Cinzel_600SemiBold } from "@expo-google-fonts/cinzel";
import { colors } from "../../../styles/colors";

export default function TabsLayout() {

    const { token } = useAuthContext();
    const [fontsLoaded] = useFonts({ Cinzel_600SemiBold });

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected && token) {
                syncFinishedExercises(token);
            }
        })

        unsubscribe();
    }, [token]);

    const ICON_SIZE = 20;

    return (
        <Tabs screenOptions={{
            headerShown: true,
            tabBarAllowFontScaling: false,
            headerTitleAllowFontScaling: false,
            headerStyle: {
                backgroundColor: colors.surface,
                borderColor: colors.secondary,
                height: 40
            },
            headerTitleStyle: {
                color: colors.gold,
                fontFamily: "Cinzel_600SemiBold",
                fontSize: 25,
                height: 70
            },
            tabBarStyle: {
                backgroundColor: colors.surface,
                borderTopColor: colors.secondary,
                height: 60
            },
            tabBarActiveTintColor: colors.gold,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarLabelStyle: {
                fontFamily: "Cinzel_600SemiBold",
                fontSize: 12,
            },
        }}>
            <Tabs.Screen
                name="adventure"
                options={{
                    title: "Kaland",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="compass" size={ICON_SIZE} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="inventory"
                options={{
                    title: "Eszköztár",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="briefcase-outline" size={ICON_SIZE} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="exercise"
                options={{
                    title: "Edzés",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="barbell-outline" size={ICON_SIZE} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="character"
                options={{
                    title: "Karakter",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-outline" size={ICON_SIZE} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Beállítások",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings-outline" size={ICON_SIZE} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}