import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState } from 'react';
import { API_URL } from "../../../constants";
import { useAuthContext } from "../../../context/AuthContext";
import { InventoryEntry, Item } from "../../../types/types";
import { ITEM_IMAGES } from "../../../../assets/itemImages";

type InventoryListItem =
  | InventoryEntry
  | { id: string; isEmpty: true };

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryEntry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuthContext();

  useEffect(() => {
    const getInventory = async () => {

      try {
        const res = await fetch(`${API_URL}/inventory/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error();
        }

        const fetchedItems = await res.json();
        setItems(fetchedItems);


      } catch (err: any) {
        setError("Nem érhető el az eszköztárad!");
      } finally {
        setLoading(false);
      }
    };

    getInventory();
  }, [token]);

  if (!token) {
    return (
      <View>
        <Text>Bejelentkezés szükséges.</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const paddedItems: InventoryListItem[] = [...items];

  while (paddedItems.length % 3 !== 0) {
    paddedItems.push({
      id: `empty-${paddedItems.length}`,
      isEmpty: true,
    });
  }

  return (
    <FlatList
      data={paddedItems}
      keyExtractor={(entry) => entry.id.toString()}
      numColumns={3}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => {
        if ("isEmpty" in item){
          return <View style={{
              flex: 1,
              margin: 5,
              padding: 10,
              backgroundColor: "#c6c0c0",
              borderRadius: 8,
              alignItems: "center",
            }} />;
        }

        return (
          <View
            style={{
              flex: 1,
              margin: 5,
              padding: 10,
              backgroundColor: "#c6c0c0",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Image
              source={ITEM_IMAGES[item.item.image_url] || ITEM_IMAGES['default']}
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />

            <Text style={{ color: "white", fontWeight: "bold", marginTop: 5 }}>
              {item.item.name}
            </Text>

            <Text style={{ color: "#323131" }}>
              x{item.quantity}
            </Text>
          </View>
        );
      }}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Az eszköztár üres.
        </Text>
      }
    />
  );
}