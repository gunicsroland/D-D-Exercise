import { ReactElement, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
import { creation_styles } from "../../../styles/creation";

export default function CreateCharacter() {
    const classes = Object.keys(BASE_STATS_BY_CLASS);
    const [name, setName] = useState("");
    const [selectedClass, setSelectedClass] = useState(classes[0]);
    const [pushups, setPushups] = useState(0);
    const [runTime, setRunTime] = useState(0);
    const [agility, setAgility] = useState(0);

    const [finalStats, setFinalStats] = useState(null);
    const [step, setStep] = useState(0);
    const [error, setError] = useState("");

    const { user, token } = useAuthContext();
    const router = useRouter();

    type Step = {
        id: string;
        element: ReactElement;
    };

    const steps: Step[] = [
        {
            id: "step-name",
            element: <StepName charName={name} setCharName={setName} selectedClass={selectedClass} setSelectedClass={setSelectedClass} />,
        },
        {
            id: "step-pushups",
            element: <StepPushups pushups={pushups} setPushups={setPushups} />,
        },
        {
            id: "step-run",
            element: <StepRun runTime={runTime} setRunTime={setRunTime} />,
        },
        {
            id: "step-agility",
            element: <StepAgility agility={agility} setAgility={setAgility} />,
        },
        {
            id: "ste-final",
            element: <StepFinal finalStats={finalStats} setFinalStats={setFinalStats} selectedClass={selectedClass}
                name={name} pushups={pushups} runTime={runTime} agility={agility} />
        }
    ]

    useEffect(() => {
        const verifyCharacter = async () => {
            if (!user || !token) return;

            const hasCharacter = await checkCharacter(token);

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
            try {
                const res = await createChar(name, selectedClass, finalStats, user.id, token);

                if (res?.ok) {
                    router.replace("/tabs/character");
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(String(err));
                }
            }
        }
    }

    const goPrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    }

    return (
        <View style={creation_styles.screen}>
            <View style={creation_styles.stepCard}>
                {steps[step].element}
            </View>

            {error ? <Text style={creation_styles.error}>{error}</Text> : null}

            <View style={creation_styles.navigation}>
                <TouchableOpacity
                    onPress={goPrev}
                    disabled={step === 0}
                    style={[
                        creation_styles.button,
                        creation_styles.secondaryButton,
                        step === 0 && creation_styles.disabledButton
                    ]}
                >
                    <Text style={creation_styles.buttonText}>◀ Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={goNext}
                    style={[creation_styles.button, creation_styles.primaryButton]}
                >
                    <Text style={creation_styles.buttonText}>
                        {step === steps.length - 1 ? "⚔ Finish" : "Next ▶"}
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );

}


