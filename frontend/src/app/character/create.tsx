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

    const goNext = () => {
        if (step < 5) {
            setStep(step + 1);
        }
        else {
            //submit to backend
        }
    }

    const goPrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    }

    const steps = [
        <StepName />,
        <StepPushups />,
        <StepRun />,
        <StepAgility />,
        <StepFinal />
    ]


    return (
        <View>
            <View>
                {steps[step]}
            </View>
        </View>
    )
    
}


