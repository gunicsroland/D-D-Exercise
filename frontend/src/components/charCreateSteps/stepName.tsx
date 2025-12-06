import { View, Text, TextInput } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { baseStatsByClass } from '../../constants/baseStats';


export default function StepName(
    { charName, setCharName,
      selectedClass, setSelectedClass }:
    { charName: string, setCharName: (name: string) => void,
      selectedClass: string, setSelectedClass: (cls: string) => void }) {
    const classes = Object.keys(baseStatsByClass);

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
                    <Picker.Item key={cls} label={cls.charAt(0).toUpperCase() + cls.slice(1)} value={cls} />
                ))}
            </Picker>
        </View>
    )
}