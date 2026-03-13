import React, { createContext, useContext, useState, useEffect } from "react";
import { Character, InventoryEntry } from "../types/types";
import { getCharacter } from "../services/character_service";
import { getInventory } from "../services/inventory_service";
import { useAuthContext } from "./AuthContext";

interface GameContextType {
  character: Character | null;
  inventory: InventoryEntry[];
  loading: boolean;
  refreshCharacter: () => Promise<void>;
  refreshInventory: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameContext must be used within GameProvider");
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuthContext();
  const [character, setCharacter] = useState<Character | null>(null);
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCharacter = async () => {
    if (!token) return;
    try {
      const data = await getCharacter(token);
      setCharacter(data ?? null);
    } catch (err) {
      console.error("Failed to refresh character", err);
    }
  };

  const refreshInventory = async () => {
    if (!token) return;
    try {
      const data = await getInventory(token);
      setInventory(data ?? []);
    } catch (err) {
      console.error("Failed to refresh inventory", err);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([refreshCharacter(), refreshInventory()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, [token]);

  return (
    <GameContext.Provider value={{ character, inventory, loading, refreshCharacter, refreshInventory, refreshAll }}>
      {children}
    </GameContext.Provider>
  );
};