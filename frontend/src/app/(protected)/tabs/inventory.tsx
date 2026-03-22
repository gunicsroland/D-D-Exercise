import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useAuthContext } from "../../../context/AuthContext";
import { InventoryItem } from "../../../components/InventoryItem";
import { useGameContext } from "../../../context/GameContext";
import { inventory_styles } from "../../../styles/tabs_inventory";
import { colors } from "../../../styles/colors";

export default function InventoryScreen() {
  const { token } = useAuthContext();
  const { inventory, refreshAll } = useGameContext();

  if (!token)
    return (
      <View style={inventory_styles.loader}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );

  const paddedItems = [...inventory];
  while (paddedItems.length % 3 !== 0) {
    paddedItems.push({
      id: -paddedItems.length,
      user_id: 0,
      quantity: 0,
      item: {
        id: -1,
        name: "",
        description: "",
        item_type: "empty",
        image_url: "",
        effects: [],
      },
    });
  }

  return (
    <View style={inventory_styles.container}>
      <FlatList
        data={paddedItems}
        keyExtractor={(entry) => entry.id.toString()}
        numColumns={3}
        columnWrapperStyle={inventory_styles.row}
        contentContainerStyle={inventory_styles.grid}
        renderItem={({ item }) =>
          item.id < 0 ? (
            <View style={inventory_styles.emptySlot} />
          ) : (
            <InventoryItem
              entry={item}
              token={token}
              onInventoryChange={refreshAll}
            />
          )
        }
        ListEmptyComponent={
          <Text style={inventory_styles.emptyText}>Az eszköztár üres.</Text>
        }
      />
    </View>
  );
}
