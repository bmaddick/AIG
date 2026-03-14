// Dominion Enterprise API types

// --- Auth ---

export interface TokenRequest {
  apiKey: string;
  clientSecret: string;
  grantType: "client_credentials";
}

export interface TokenResponse {
  data: {
    accessToken: string;
  };
}

export interface AuthMeResponse {
  data: {
    clientId: string;
    scopes: string[];
  };
}

// --- Chat Groups ---

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
}

export interface CreateChatGroupRequest {
  name: string;
  description: string;
}

export interface UpdateChatGroupRequest {
  name?: string;
  description?: string;
}

// --- Chats ---

export interface Chat {
  id: string;
  title: string;
  groupId?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
}

export interface SendMessageRequest {
  chatId: string;
  message: {
    content: string;
  };
}

export interface SendIncognitoRequest {
  message: {
    content: string;
  };
  options?: {
    includedDomains?: string[];
  };
}

export interface UpdateChatRequest {
  newTitle?: string;
  newGroupId?: string;
}

// --- API Response wrapper ---

export interface ApiResponse<T> {
  data: T;
}
