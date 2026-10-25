import { ChatConversation } from './types';

const STORAGE_KEY = 'cloudmentor_conversations_v1';
const ACTIVE_ID_KEY = 'cloudmentor_active_id_v1';

/**
 * Checks if running in a browser environment with localStorage available.
 */
function isClient(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadConversationsFromStorage(): ChatConversation[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load conversations from localStorage:', error);
    return [];
  }
}

export function saveConversationsToStorage(conversations: ChatConversation[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Failed to save conversations to localStorage:', error);
  }
}

export function loadActiveConversationId(): string | null {
  if (!isClient()) return null;
  try {
    return localStorage.getItem(ACTIVE_ID_KEY);
  } catch {
    return null;
  }
}

export function saveActiveConversationId(id: string | null): void {
  if (!isClient()) return;
  try {
    if (id) {
      localStorage.setItem(ACTIVE_ID_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_ID_KEY);
    }
  } catch {
    // Ignore storage quota or disabled storage
  }
}

export function clearStorage(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_ID_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
