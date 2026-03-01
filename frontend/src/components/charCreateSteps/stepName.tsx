import { View, Text, TextInput } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { BASE_STATS_BY_CLASS, CLASS_LABELS_HU } from '../../constants';
import React from 'react';


export default function StepName(
    { charName, setCharName,
      selectedClass, setSelectedClass }:
    { charName: string, setCharName: (name: string) => void,
      selectedClass: string, setSelectedClass: (cls: string) => void }) {
    const classes = Object.keys(BASE_STATS_BY_CLASS);

    return (
        <View>
            <Text>Add meg a karaktered nevét: :</Text>
            <TextInput placeholder="Név"
                value={charName}
                onChangeText={setCharName}
            />

            <Text> Add meg a kasztodat:</Text>

            <Picker
                selectedValue={selectedClass}
                onValueChange={setSelectedClass}
            >
                {classes.map(cls => (
                    <Picker.Item key={cls} label={CLASS_LABELS_HU[cls]} value={cls} />
                ))}
            </Picker>
        </View>
    )
}