import React from 'react';
import {ScrollView, Button} from 'react-native';
import FormBox from '../components/form_box';
import { useRouter } from "expo-router";


const Login = () => {
  const router = useRouter();

  return (
    <ScrollView>
      <FormBox text_value="Felhasználónév" placeholder="Add meg a felhasználóneved" />
      <FormBox text_value="Jelszó" placeholder="Add meg a jelszavad" />
      <Button title="back" onPress={() => router.back()} />
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
};

export default Login;