import { Alert } from "react-native";

export async function handleRegister(username: string, email: string, password: string, router: any) {

    try {
        const res = await fetch("http://localhost:8000/register",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            }
        );

        if (res.ok) {
            Alert.alert("Siker!", "Sikeres regisztráció!");
            router.replace("login")
        }
        else {
            const data = await res.json();
            Alert.alert("Hiba", data.detail || "Regisztráció sikertelen");
        }
    }
    catch (err) {
        Alert.alert("Hiba", "Nem sikerült kapcsolódni a szerverhez. Próbáld újra később.");
    }
}