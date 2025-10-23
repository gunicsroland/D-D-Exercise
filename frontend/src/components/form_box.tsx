import React from 'react' 
import {View, Text, TextInput} from 'react-native';

type boxProps = {
    text_value : string,
    placeholder : string
};

const FormBox =(props : boxProps) => {
    return (
        <View>
            <Text>{props.text_value}</Text>
            <TextInput
                placeholder={props.placeholder}
                style={styles.textInput}
                />
        </View>
    )
}

const styles = {
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
    },
};

export default FormBox;