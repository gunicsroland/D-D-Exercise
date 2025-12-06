import AsyncStorage from "@react-native-async-storage/async-storage";

export async function createChar(name: string, selectedClass: string, finalStats: any, router: any) {
    try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch("http://localhost:8000/create", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                name: name,
                char_class: selectedClass,
                stats: finalStats
            })
        });

        if (res.ok) {
            router.replace("/character/list");
        }
        else {
            const data = await res.json();
            console.error("Error creating character:", data.detail || "Unknown error");
        }
    }
    catch (error) {
        console.error("An error occurred:", error);
    }
}