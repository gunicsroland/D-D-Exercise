import { use, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { baseStatsByClass } from "../../constants/baseStats";
import StepName from "../../components/charCreateSteps/stepName"
import StepPushups from "../../components/charCreateSteps/stepPushups"
import StepRun from "../../components/charCreateSteps/stepRun"
import StepAgility from "../../components/charCreateSteps/stepAgility"
import StepFinal from "../../components/charCreateSteps/stepFinal"
import { createChar } from "../../hooks/createCharacter";

export default function CreateCharacter() {
    const classes = Object.keys(baseStatsByClass);
    const [name, setName] = useState("");
    const [selectedClass, setSelectedClass] = useState(classes[0]);
    const [pushups, setPushups] = useState(0);
    const [runTime, setRunTime] = useState(0);
    const [agility, setAgility] = useState(0);

    const [finalStats, setFinalStats] = useState(null);
    const [step, setStep] = useState(0);
    const router = useRouter();

    const steps = [
        <StepName charName={name} setCharName={setName} selectedClass={selectedClass} setSelectedClass={setSelectedClass} />,
        <StepPushups pushups={pushups} setPushups={setPushups} />,
        <StepRun runTime={runTime} setRunTime={setRunTime} />,
        <StepAgility agility={agility} setAgility={setAgility} />,
        <StepFinal finalStats={finalStats} setFinalStats={setFinalStats} selectedClass={selectedClass}
         name={name} pushups={pushups} runTime={runTime} agility={agility} />
    ]

    const goNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        }
        else {
            console.log("Final stats:", finalStats);
            createChar(name, selectedClass, finalStats, router);
        }
    }

    const goPrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    }




    return (
        <View>
            <View>
                {steps[step]}
            </View>

            <View>
                <Button title="Previous" onPress={goPrev} disabled={step === 0} />
                <Button title={step === steps.length - 1 ? "Finish" : "Next"} onPress={goNext} />
            </View>
        </View>
    )
    
}


