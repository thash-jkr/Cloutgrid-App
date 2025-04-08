import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getCSRFToken = async () => {
  try {
    const response = await axios.get('http://192.168.1.106:8001/get-csrf-token/');
    const csrfToken = response.data.csrfToken;

    // Store the CSRF token securely
    await SecureStore.setItemAsync('csrf_token', csrfToken);
    return csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

export const getStoredCSRFToken = async () => {
  const csrfToken = await SecureStore.getItemAsync('csrf_token');
  return csrfToken;
};
