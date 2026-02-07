import { Children, createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkCharacter } from "../hooks/check_char";
import { useRouter } from "expo-router";
import { User } from "../types/types";

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children, router }: { children: React.ReactNode, router: any }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLogin = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                router.replace("login")
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("http://localhost:8000/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Not authenticated");
                }

                const data = await res.json();
                setUser(data);
            }
            catch (error) {
                await AsyncStorage.removeItem("token");
                router.replace("login");
            }
            finally {
                setLoading(false);
            }
        };

        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
