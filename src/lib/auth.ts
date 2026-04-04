import func2url from "../../backend/func2url.json";

const TOKEN_KEY = "ld_auth_token";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  plan: string;
  subscription_expires_at: string | null;
  subscription_days_left: number | null;
  subscription_active: boolean;
  created_at: string;
}

const authUrl = func2url["auth"];

async function authRequest(action: string, body: object = {}, token?: string): Promise<Response> {
  return fetch(authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { "X-Auth-Token": token } : {}) },
    body: JSON.stringify({ action, ...body }),
  });
}

export async function register(email: string, password: string, name: string): Promise<{ token: string }> {
  const res = await authRequest("register", { email, password, name });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
  return data;
}

export async function login(email: string, password: string): Promise<{ token: string }> {
  const res = await authRequest("login", { email, password });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Неверный email или пароль");
  return data;
}

export async function getMe(token: string): Promise<User> {
  const res = await authRequest("me", {}, token);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Сессия истекла");
  return data;
}

export async function logout(token: string): Promise<void> {
  await authRequest("logout", {}, token);
}

export async function trackGame(game: { filename: string; title: string; emoji: string; category: string }): Promise<number | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(func2url["track-game"], {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    body: JSON.stringify(game),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.session_id ?? null;
}

export async function finishGameSession(sessionId: number, durationSeconds: number): Promise<void> {
  const token = getToken();
  if (!token || !sessionId) return;
  await fetch(func2url["track-game"], {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    body: JSON.stringify({ session_id: sessionId, duration_seconds: durationSeconds }),
  });
}