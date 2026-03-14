import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { creation_styles } from '../../styles/creation';

export default function StepPushups({ pushups, setPushups }:
    { pushups: number, setPushups: (value: number) => void }) {

    return (
        <View style={creation_styles.container}>
            <Text style={creation_styles.title}>Erő felmérése</Text>

            <Text style={creation_styles.label}>
                Hány fekvőtámaszt tudsz megcsinálni 1 perc alatt?
            </Text>

            <TextInput
                placeholder="Pl. 25"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={pushups ? pushups.toString() : ""}
                onChangeText={(text) => setPushups(Number(text) || 0)}
                style={creation_styles.input}
            />
        </View>
    );
}