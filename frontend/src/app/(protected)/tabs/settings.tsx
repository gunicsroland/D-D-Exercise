import { View, Text, Pressable } from "react-native";
import React from 'react';
import { useAuthContext } from "../../../context/AuthContext";
import { settings_styles } from "../../../styles/tabs_settings";


export default function SettingsScreen() {
  
  const {logout} = useAuthContext();

  return (
    <View style={settings_styles.container}>
      <Pressable
        style={settings_styles.button}
        onPress={logout}>
          <Text style={settings_styles.buttonText}>Kilépés</Text>
        </Pressable>
    </View>
  );
}