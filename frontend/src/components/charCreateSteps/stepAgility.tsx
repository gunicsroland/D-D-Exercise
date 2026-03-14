import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { creation_styles } from '../../styles/creation';

export default function StepAgility({ agility, setAgility }:
    { agility: number, setAgility: (value: number) => void }
) {
  return (
    <View style={creation_styles.container}>
      <Text style={creation_styles.title}>Agilitás felmérése</Text>

      <Text style={creation_styles.label}>
        Mennyire érzed magad hajlékonynak / mozgékonynak?
      </Text>

      <TextInput
        placeholder="Pl. 5"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={agility ? agility.toString() : ""}
        onChangeText={(text) => setAgility(Number(text) || 0)}
        style={creation_styles.input}
      />
    </View>
  );
}