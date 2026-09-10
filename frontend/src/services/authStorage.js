import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'maia.authToken';

export async function getAuthToken() {
  if (Platform.OS === 'web') {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  }

  return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

export async function saveAuthToken(token) {
  if (Platform.OS === 'web') {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

export async function clearAuthToken() {
  if (Platform.OS === 'web') {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}
