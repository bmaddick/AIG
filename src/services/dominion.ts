import { getDominionBaseUrl } from "@/lib/config";
import { getAccessToken, clearToken } from "@/lib/token-manager";
import type {
  AuthMeResponse,
  ChatGroup,
  CreateChatGroupRequest,
  UpdateChatGroupRequest,
  Chat,
  ChatMessage,
  SendMessageRequest,
  SendIncognitoRequest,
  UpdateChatRequest,
  ApiResponse,
  DominionApiError,
} from "@/types/api";

class DominionApiErrorImpl extends Error implements DominionApiError {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string, body?: string) {
    super(`Dominion API error ${status}: ${statusText}${body ? ` — ${body}` : ""}`);
    this.name = "DominionApiError";
    this.status = status;
    this.statusText = statusText;
    this.message = body ?? statusText;
  }
}

/**
 * Authenticated fetch wrapper. Automatically injects a valid Bearer token
 * (refreshing if needed) and retries once on 401.
 */
async function authedFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const baseUrl = getDominionBaseUrl();
  const url = `${baseUrl}${path}`;

  const doFetch = async (token: string) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-client-user-id": "aig-demo-visitor",
        ...options.headers,
      },
    });

  let token = await getAccessToken();
  let res = await doFetch(token);

  // Retry once on 401 with a fresh token
  if (res.status === 401) {
    clearToken();
    token = await getAccessToken();
    res = await doFetch(token);
  }

  return res;
}

async function authedJson<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await authedFetch(path, options);

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new DominionApiErrorImpl(res.status, res.statusText, body);
  }

  return res.json();
}

// ────────────────────────────────────────────────────────────
// Auth
// ────────────────────────────────────────────────────────────

export async function getAuthMe(): Promise<AuthMeResponse> {
  return authedJson<AuthMeResponse>("/auth/me");
}

// ────────────────────────────────────────────────────────────
// Chat Groups
// ────────────────────────────────────────────────────────────

export async function listChatGroups(
  listChats = false,
): Promise<ApiResponse<ChatGroup[]>> {
  const params = listChats ? "?listChats=true" : "";
  return authedJson<ApiResponse<ChatGroup[]>>(`/v1/groups${params}`);
}

export async function createChatGroup(
  data: CreateChatGroupRequest,
): Promise<ApiResponse<ChatGroup>> {
  return authedJson<ApiResponse<ChatGroup>>("/v1/groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateChatGroup(
  groupId: string,
  data: UpdateChatGroupRequest,
): Promise<ApiResponse<ChatGroup>> {
  return authedJson<ApiResponse<ChatGroup>>(`/v1/groups/${encodeURIComponent(groupId)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteChatGroup(groupId: string): Promise<void> {
  const res = await authedFetch(`/v1/groups/${encodeURIComponent(groupId)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new DominionApiErrorImpl(res.status, res.statusText, body);
  }
}

// ────────────────────────────────────────────────────────────
// Chats
// ────────────────────────────────────────────────────────────

export async function listChats(): Promise<ApiResponse<Chat[]>> {
  return authedJson<ApiResponse<Chat[]>>("/v1/chats");
}

export async function getChatMessages(
  chatId: string,
): Promise<ApiResponse<ChatMessage[]>> {
  return authedJson<ApiResponse<ChatMessage[]>>(
    `/v1/chats/${encodeURIComponent(chatId)}/messages`,
  );
}

export async function sendMessage(
  data: SendMessageRequest,
): Promise<ApiResponse<ChatMessage>> {
  return authedJson<ApiResponse<ChatMessage>>("/v1/chats/messages", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Send a message to an existing chat and return the raw streaming Response.
 * Use parseSSEStream() or streamTextContent() from @/lib/stream to consume.
 */
export async function sendMessageStream(
  data: SendMessageRequest,
): Promise<Response> {
  const res = await authedFetch("/v1/chats/messages/stream", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new DominionApiErrorImpl(res.status, res.statusText, body);
  }
  return res;
}

export async function sendIncognito(
  data: SendIncognitoRequest,
): Promise<ApiResponse<ChatMessage>> {
  return authedJson<ApiResponse<ChatMessage>>("/v1/chats/incognito", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Send an incognito message and return the raw streaming Response.
 * Use parseSSEStream() or streamTextContent() from @/lib/stream to consume.
 */
export async function sendIncognitoStream(
  data: SendIncognitoRequest,
): Promise<Response> {
  const res = await authedFetch("/v1/chats/incognito/stream", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new DominionApiErrorImpl(res.status, res.statusText, body);
  }
  return res;
}

export async function updateChat(
  chatId: string,
  data: UpdateChatRequest,
): Promise<ApiResponse<Chat>> {
  return authedJson<ApiResponse<Chat>>(`/v1/chats/${encodeURIComponent(chatId)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteChat(chatId: string): Promise<void> {
  const res = await authedFetch(`/v1/chats/${encodeURIComponent(chatId)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new DominionApiErrorImpl(res.status, res.statusText, body);
  }
}

export async function deleteChatMessages(chatId: string): Promise<void> {
  const res = await authedFetch(`/v1/chats/${encodeURIComponent(chatId)}/messages`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new DominionApiErrorImpl(res.status, res.statusText, body);
  }
}
