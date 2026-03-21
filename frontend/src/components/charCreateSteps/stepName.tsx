import { View, Text, TextInput } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { BASE_STATS_BY_CLASS } from '../../constants';
import { CLASS_LABELS_HU } from "../../text_labels";
import React from 'react';
import { colors } from '../../styles/colors';
import { creation_styles } from '../../styles/creation';


export default function StepName(
    { charName, setCharName,
        selectedClass, setSelectedClass }:
        {
            charName: string, setCharName: (name: string) => void,
            selectedClass: string, setSelectedClass: (cls: string) => void
        }) {
    const classes = Object.keys(BASE_STATS_BY_CLASS);

      return (
    <View style={creation_styles.container}>
      <View style={creation_styles.card}>
        <Text style={creation_styles.title}>⚔️ Karakter létrehozása</Text>

        <Text style={creation_styles.label}>Karakter neve</Text>

        <TextInput
          placeholder="Add meg a neved"
          placeholderTextColor="#888"
          value={charName}
          onChangeText={setCharName}
          style={creation_styles.input}
        />

        <Text style={creation_styles.label}>Kaszt választása</Text>

        <View>
          <Picker
            selectedValue={selectedClass}
            onValueChange={setSelectedClass}
            dropdownIconColor={colors.gold}
            style={creation_styles.pickerWrapper}
          >
            {classes.map((cls) => (
              <Picker.Item
                key={cls}
                label={CLASS_LABELS_HU[cls]}
                value={cls}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}