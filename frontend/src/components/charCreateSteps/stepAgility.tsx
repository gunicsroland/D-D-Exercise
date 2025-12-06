import { View, Text, TextInput } from 'react-native';

export default function StepAgility({agility, setAgility} :
    {agility: number, setAgility: (value: number) => void}
) {
    return (
        <View>
            <Text>Add meg mennyire vagy hajlékony:</Text>
            <TextInput
                placeholder="Hajlékonyság szintje"
                keyboardType="numeric"
                value={agility.toString()}
                onChangeText={text => setAgility(Number(text))}
            />
        </View>
    )
}