// Thin fetch wrapper. In dev, Vite proxies /api -> http://localhost:4000.
// In production set VITE_API_URL to your deployed backend origin.
const BASE = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export function sendContact(payload: ContactPayload) {
  return request<{ ok: true }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function sendChat(messages: ChatMessage[]) {
  return request<{ reply: string }>("/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });
}
