import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
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
                        <Ionicons name="bag-outline" size={size} color={color} />
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