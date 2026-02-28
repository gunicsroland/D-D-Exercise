import { useEffect, useState } from "react";
import { View, Button } from "react-native";
import { useRouter } from "expo-router";
import { BASE_STATS_BY_CLASS } from "../../../constants";
import StepName from "../../../components/charCreateSteps/stepName"
import StepPushups from "../../../components/charCreateSteps/stepPushups"
import StepRun from "../../../components/charCreateSteps/stepRun"
import StepAgility from "../../../components/charCreateSteps/stepAgility"
import StepFinal from "../../../components/charCreateSteps/stepFinal"
import { createChar, checkCharacter } from "../../../services/character_service";
import React from "react";
import { useAuthContext } from "../../../context/AuthContext";

export default function CreateCharacter() {
    const classes = Object.keys(BASE_STATS_BY_CLASS);
    const [name, setName] = useState("");
    const [selectedClass, setSelectedClass] = useState(classes[0]);
    const [pushups, setPushups] = useState(0);
    const [runTime, setRunTime] = useState(0);
    const [agility, setAgility] = useState(0);

    const [finalStats, setFinalStats] = useState(null);
    const [step, setStep] = useState(0);

    const { user, token } = useAuthContext();
    const router = useRouter();

    const steps = [
        <StepName charName={name} setCharName={setName} selectedClass={selectedClass} setSelectedClass={setSelectedClass} />,
        <StepPushups pushups={pushups} setPushups={setPushups} />,
        <StepRun runTime={runTime} setRunTime={setRunTime} />,
        <StepAgility agility={agility} setAgility={setAgility} />,
        <StepFinal finalStats={finalStats} setFinalStats={setFinalStats} selectedClass={selectedClass}
            name={name} pushups={pushups} runTime={runTime} agility={agility} />
    ]

    useEffect(() => {
        const verifyCharacter = async () => {
            if (!user || !token) return;

            const hasCharacter = await checkCharacter(token, user.id);

            if (hasCharacter) {
                router.replace("/tabs/character");
            }
        };

        verifyCharacter();
    }, [user, token]);

    const goNext = async () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        }
        else {
            if (!user || !token) {
                return null;
            }

            console.log("Final stats:", finalStats);
            const res = await createChar(name, selectedClass, finalStats, user.id, token);

            if (res?.ok) {
                router.replace("/tabs/character");
            }
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


