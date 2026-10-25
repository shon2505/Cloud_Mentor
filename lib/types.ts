export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  error?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export type GuardVerdict = 'IN_SCOPE' | 'GREETING' | 'OUT_OF_SCOPE';

export interface ChatRequestPayload {
  messages: {
    role: string;
    content: string;
  }[];
}

export interface ApiErrorResponse {
  error: string;
  code?: 'RATE_LIMIT' | 'CONFIG_ERROR' | 'INVALID_INPUT' | 'UPSTREAM_ERROR';
}
