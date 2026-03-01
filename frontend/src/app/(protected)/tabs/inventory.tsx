import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal, Pressable } from "react-native";
import React, { useEffect, useState } from 'react';
import { ABILITY_LABELS_HU, API_URL } from "../../../constants";
import { useAuthContext } from "../../../context/AuthContext";
import { InventoryEntry, Item } from "../../../types/types";
import { ITEM_IMAGES } from "../../../../assets/itemImages";
import { consumeItem } from "../../../services/inventory_service";

type InventoryListItem =
  | InventoryEntry
  | { id: string; isEmpty: true };

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryEntry[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryEntry | null>(null);
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
          const data = await res.json();
          console.log(data);
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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
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
    <View style={{ flex: 1 }}>
      <FlatList
        data={paddedItems}
        keyExtractor={(entry) => entry.id.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => {
          if ("isEmpty" in item) {
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
            <TouchableOpacity
              style={{
                flex: 1,
                margin: 5,
                padding: 10,
                backgroundColor: "#c6c0c0",
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={() => setSelectedItem(item)}
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
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Az eszköztár üres.
          </Text>
        }
      />

      <Modal
        visible={selectedItem ? true : false}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000080" }}>
          <View style={{ width: "80%", padding: 20, backgroundColor: "white", borderRadius: 10 }}>

            <Pressable
              onPress={() => setSelectedItem(null)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "red",
                borderRadius: 15,
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
            </Pressable>

            {
              selectedItem && (
                <>
                  <Image
                    source={ITEM_IMAGES[selectedItem.item.image_url] || ITEM_IMAGES['default']}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                  />
                  <Text style={{ color: "white" }}>X</Text>

                  <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 10 }}>
                    {selectedItem.item.name}
                  </Text>
                  <Text style={{ marginTop: 10, textAlign: "center" }}>
                    {selectedItem.item.description || "Leírás nem elérhető"}
                  </Text>

                  {selectedItem.item.effects && selectedItem.item.effects.length > 0 && (
                    <View style={{ marginTop: 15 }}>
                      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Hatások:</Text>
                      {selectedItem.item.effects.map((effect, idx) => (
                        <Text key={idx} style={{ marginLeft: 10, marginBottom: 3 }}>
                          - {ABILITY_LABELS_HU[effect.attribute]}: {effect.increase ? "+" : "-"}{effect.value}, időtartam: {effect.duration} perc
                        </Text>
                      ))}
                    </View>
                  )}

                  <Pressable
                    onPress={() => {
                      setSelectedItem(null);
                      consumeItem(token, selectedItem?.item.id);
                    }}
                    style={{
                      marginTop: 20,
                      backgroundColor: "#31b90c",
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 5,
                      alignSelf: "center"
                    }}
                  >
                    <Text>Elfogyaszt</Text>
                  </Pressable>
                </>
              )}



          </View>
        </View>
      </Modal>
    </View>
  );
}