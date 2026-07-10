// Thin fetch wrapper. In dev, Vite proxies /api -> http://localhost:4000.
// In production set VITE_API_URL to your deployed backend origin.
const BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Portal auth token, attached to every request when set (see lib/auth.tsx).
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? `Request failed (${res.status})`, res.status);
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

// --- Portal auth --------------------------------------------------------------

export type PortalUser = { id: string; username: string };

export function login(username: string, password: string) {
  return request<{ token: string; user: PortalUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// --- Mundial 2026 sticker tracker ----------------------------------------------

export function getCollection() {
  return request<{ stickers: Record<string, number> }>("/mundial/collection");
}

export function updateSticker(code: string, delta: 1 | -1) {
  return request<{ code: string; count: number }>("/mundial/collection/update", {
    method: "POST",
    body: JSON.stringify({ code, delta }),
  });
}

export type Trade = {
  id: string;
  name: string;
  status: "abierto" | "completado";
  give: Record<string, number>;
  receive: Record<string, number>;
  updatedAt: string;
};

export function getTrades() {
  return request<{ trades: Trade[] }>("/mundial/trades");
}

export function createTrade(name: string) {
  return request<{ trade: Trade }>("/mundial/trades", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function updateTrade(
  id: string,
  patch: Partial<Pick<Trade, "name" | "give" | "receive">>,
) {
  return request<{ trade: Trade }>(`/mundial/trades/${id}`, {
    method: "POST",
    body: JSON.stringify(patch),
  });
}

export function deleteTrade(id: string) {
  return request<{ ok: true }>(`/mundial/trades/${id}/delete`, { method: "POST" });
}

export function authorizeTrade(id: string) {
  return request<{ trade: Trade; stickers: Record<string, number> }>(
    `/mundial/trades/${id}/authorize`,
    { method: "POST" },
  );
}

// --- D&D character builder ------------------------------------------------------

// Kept loose here; the real shape lives in apps/dnd/types.ts.
export type DndCharacter<TBuild = unknown> = {
  id: string;
  build: TBuild;
  updatedAt: string;
};

export function getDndCharacters<T>() {
  return request<{ characters: DndCharacter<T>[] }>("/dnd/characters");
}

export function createDndCharacter<T>(build: T) {
  return request<{ character: DndCharacter<T> }>("/dnd/characters", {
    method: "POST",
    body: JSON.stringify({ build }),
  });
}

export function updateDndCharacter<T>(id: string, build: T) {
  return request<{ character: DndCharacter<T> }>(`/dnd/characters/${id}`, {
    method: "POST",
    body: JSON.stringify({ build }),
  });
}

export function deleteDndCharacter(id: string) {
  return request<{ ok: true }>(`/dnd/characters/${id}/delete`, { method: "POST" });
}

// --- Finanzas (session-only, nothing stored server-side) -----------------------

export type ScannedTransaction = {
  date: string; // YYYY-MM-DD
  description: string;
  amount: number; // positive; direction carries the sign
  direction: "in" | "out";
  category: string;
};

export function scanStatement(pdfBase64: string) {
  return request<{ transactions: ScannedTransaction[] }>("/finanzas/scan", {
    method: "POST",
    body: JSON.stringify({ pdf: pdfBase64 }),
  });
}
