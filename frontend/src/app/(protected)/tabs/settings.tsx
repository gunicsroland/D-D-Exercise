import { View, Text, Button } from "react-native";
import React from 'react';
import { useAuthContext } from "../../../context/AuthContext";


export default function SettingsScreen() {
  
  const {logout} = useAuthContext();

  return (
    <View>
      <Text>Beállítások</Text>
      <Button
        title="Kilépés"
        onPress={logout}
        />
    </View>
  );
}