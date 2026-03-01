import React, { createContext, ReactNode, use, useContext, useEffect, useState } from 'react';
import { User } from "../types/types";
import { storage } from '../services/storage_service';
import { loginRequest, registerRequest, getMe } from '../services/auth_service';
import { router, useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';

type AuthContextType = {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
    const context: AuthContextType | undefined = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useUserContext must be used with a Provider");
    }
    for (let child in context){
        if (child === null){
            throw new Error("useUserContext must be used with a Provider");
        }
    }

    return context;
}

export const AuthProvider = ({ children, }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(
        () => {
            restoreSession();
        }, []
    );

    const restoreSession = async () => {
        try {
            const storedToken = await storage.getToken();

            if (!storedToken) {
                setLoading(false);
                return;
            }

            setToken(storedToken);

            const userData = await getMe(storedToken);
            setUser(userData);
        }
        catch (error) {
            await storage.removeToken();
            setUser(null);
            setToken(null);
        }
        finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        const data = await loginRequest(username, password);

        await storage.setToken(data.access_token);
        setToken(data.access_token);

        const userData = await getMe(data.access_token);
        setUser(userData);

        return data;
    };

    const register = async (username: string, email: string, password: string) => {
        await registerRequest(username, email, password);
        await login(username, password);
    };

    const logout = async () => {
        await storage.removeToken();
        setUser(null);
        setToken(null);
        const router = useRouter();
        router.replace("/login")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
