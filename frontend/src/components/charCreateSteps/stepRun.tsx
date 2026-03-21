import React from "react";
import { View, Text, TextInput } from "react-native";
import { creation_styles } from "../../styles/creation";

export default function StepRun({
  runTime,
  setRunTime,
}: {
  runTime: number;
  setRunTime: (value: number) => void;
}) {
  return (
    <View style={creation_styles.container}>
      <Text style={creation_styles.title}>🏃 Állóképesség felmérése</Text>

      <Text style={creation_styles.label}>
        Hány percig tudsz futni megállás nélkül?
      </Text>

      <TextInput
        placeholder="Pl. 10"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={runTime ? runTime.toString() : ""}
        onChangeText={(text) => setRunTime(Number(text) || 0)}
        style={creation_styles.input}
      />
    </View>
  );
}
