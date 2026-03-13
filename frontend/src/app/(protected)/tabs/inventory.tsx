import React, { useRef, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, AppState } from "react-native";
import { useAuthContext } from "../../../context/AuthContext";
import { InventoryItem } from "../../../components/InventoryItem";
import { useGameContext } from "../../../context/GameContext";

export default function InventoryScreen() {
  const { token } = useAuthContext();
  const {inventory, loading, refreshAll} = useGameContext();

  if (!token) return <ActivityIndicator size="large" color="#0000ff" />;

  const paddedItems = [...inventory];
  while (paddedItems.length % 3 !== 0) {
    paddedItems.push({ id: `empty-${paddedItems.length}`, isEmpty: true } as any);
  }

  return (
    <FlatList
      data={paddedItems}
      keyExtractor={(entry) => entry.id.toString()}
      numColumns={3}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => ("isEmpty" in item ? <View
         style={{ flex: 1, margin: 5, padding: 10, backgroundColor: "#c6c0c0", borderRadius: 8 }} /> 
         : <InventoryItem item={item} token={token} onInventoryChange={refreshAll} />)}
      ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Az eszköztár üres.</Text>}
    />
  );
}