import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "../constants";

export const storage = {
  setToken: (token: string) =>
    AsyncStorage.setItem(TOKEN_KEY, token),

  getToken: () =>
    AsyncStorage.getItem(TOKEN_KEY),

  removeToken: () =>
    AsyncStorage.removeItem(TOKEN_KEY),
};