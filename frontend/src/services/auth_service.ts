import { API_URL } from "../constants";

export async function loginRequest(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let message = "Login failed";
    try {
      const error = await res.json();
      message = error.detail || error.message || message;
    } catch {
      message = await res.text();
    }
    throw new Error(message);
  }

  return res.json();
}

export async function registerRequest(username: string, email: string, password: string) {
  if (username.length <= 0 || email.length <= 0 || password.length <= 0) {
    throw new Error("Minden mező kitöltése kötelező");
  }

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Register failed");
  }

  return res.json();
}

export async function getMe(token: string) {
  const res = await fetch(`${API_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Invalid token");
  }

  return res.json();
}