import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';

export default function StepPushups({pushups, setPushups} :
     {pushups: number, setPushups: (value: number) => void}) {

    return (
        <View>
            <Text>Add meg, hogy hány fekvőtámaszt tudsz megcsinálni egy perc alatt:</Text>
            <TextInput
                placeholder="Fekvőtámaszok száma"
                keyboardType="numeric"
                value={pushups.toString()}
                onChangeText={text => setPushups(Number(text))}
            />
        </View>
    )
}