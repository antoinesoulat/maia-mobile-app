import { API_URL } from '../config/env';

async function requestAuth(path, payload) {
  const response = await fetch(`${API_URL}${path}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || 'Une erreur est survenue.');
  }

  return result.data;
}

export function registerUser(payload) {
  return requestAuth('/auth/register', payload);
}

export function loginUser(payload) {
  return requestAuth('/auth/login', payload);
}
