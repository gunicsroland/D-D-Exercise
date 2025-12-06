import { View, Text } from 'react-native';
import { baseStatsByClass } from '../../constants/baseStats';


export default function StepFinal({
    finalStats, setFinalStats,
    selectedClass, name,
    pushups, runTime, agility}:
    {finalStats:any,
     setFinalStats: (stats:any) => void, 
     selectedClass:string,
     name:string ,
     pushups:number,
     runTime:number,
     agility:number}){
    
    finalStats = baseStatsByClass[selectedClass as keyof typeof baseStatsByClass];
    finalStats.strength = finalStats.strength + (pushups ? Math.floor(pushups / 10) : 0);
    finalStats.constitution = finalStats.constitution + (runTime ? Math.floor((300 - runTime) / 30) : 0);
    finalStats.dexterity = finalStats.dexterity + (agility ? Math.floor(agility / 5) : 0);
    finalStats.intelligence = finalStats.intelligence;
    finalStats.wisdom = finalStats.wisdom;
    finalStats.charisma = finalStats.charisma;

    return (
        <View>
            <Text>Összegzés:</Text>
            <Text>Kiválasztott kaszt: {selectedClass}</Text>
            <Text>Karakter neve: {name}</Text>
            <Text>Alap statisztikák:</Text>
            <Text>Erő: {finalStats.strength}</Text>
            <Text>Állóképesség: {finalStats.dexterity}</Text>
            <Text>Ügyesség: {finalStats.constitution}</Text>
            <Text>Intelligencia: {finalStats.intelligence}</Text>
            <Text>Bölcsesség: {finalStats.wisdom}</Text>
            <Text>Karizma: {finalStats.charisma}</Text>
        </View>
    )
}