import { getDominionBaseUrl } from "@/lib/config";
import type {
  TokenRequest,
  TokenResponse,
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
} from "@/types/api";

async function dominionFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = getDominionBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Dominion API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

// --- Auth ---

export async function obtainToken(
  req: TokenRequest,
): Promise<TokenResponse> {
  return dominionFetch<TokenResponse>("/auth/token", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getAuthMe(token: string): Promise<AuthMeResponse> {
  return dominionFetch<AuthMeResponse>("/auth/me", {
    headers: authHeaders(token),
  });
}

// --- Chat Groups ---

export async function listChatGroups(
  token: string,
  listChats = false,
): Promise<ApiResponse<ChatGroup[]>> {
  const params = listChats ? "?listChats=true" : "";
  return dominionFetch<ApiResponse<ChatGroup[]>>(`/v1/groups${params}`, {
    headers: authHeaders(token),
  });
}

export async function createChatGroup(
  token: string,
  data: CreateChatGroupRequest,
): Promise<ApiResponse<ChatGroup>> {
  return dominionFetch<ApiResponse<ChatGroup>>("/v1/groups", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function updateChatGroup(
  token: string,
  groupId: string,
  data: UpdateChatGroupRequest,
): Promise<ApiResponse<ChatGroup>> {
  return dominionFetch<ApiResponse<ChatGroup>>(`/v1/groups/${groupId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function deleteChatGroup(
  token: string,
  groupId: string,
): Promise<void> {
  await dominionFetch(`/v1/groups/${groupId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

// --- Chats ---

export async function listChats(
  token: string,
): Promise<ApiResponse<Chat[]>> {
  return dominionFetch<ApiResponse<Chat[]>>("/v1/chats", {
    headers: authHeaders(token),
  });
}

export async function getChatMessages(
  token: string,
  chatId: string,
): Promise<ApiResponse<ChatMessage[]>> {
  return dominionFetch<ApiResponse<ChatMessage[]>>(
    `/v1/chats/${chatId}/messages`,
    { headers: authHeaders(token) },
  );
}

export async function sendMessage(
  token: string,
  data: SendMessageRequest,
): Promise<ApiResponse<ChatMessage>> {
  return dominionFetch<ApiResponse<ChatMessage>>("/v1/chats/messages", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function sendMessageStream(
  token: string,
  data: SendMessageRequest,
): Promise<Response> {
  const baseUrl = getDominionBaseUrl();
  return fetch(`${baseUrl}/v1/chats/messages/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
}

export async function sendIncognito(
  token: string,
  data: SendIncognitoRequest,
): Promise<ApiResponse<ChatMessage>> {
  return dominionFetch<ApiResponse<ChatMessage>>("/v1/chats/incognito", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function sendIncognitoStream(
  token: string,
  data: SendIncognitoRequest,
): Promise<Response> {
  const baseUrl = getDominionBaseUrl();
  return fetch(`${baseUrl}/v1/chats/incognito/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
}

export async function updateChat(
  token: string,
  chatId: string,
  data: UpdateChatRequest,
): Promise<ApiResponse<Chat>> {
  return dominionFetch<ApiResponse<Chat>>(`/v1/chats/${chatId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function deleteChat(
  token: string,
  chatId: string,
): Promise<void> {
  await dominionFetch(`/v1/chats/${chatId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function deleteChatMessages(
  token: string,
  chatId: string,
): Promise<void> {
  await dominionFetch(`/v1/chats/${chatId}/messages`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
