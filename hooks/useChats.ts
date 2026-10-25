'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatConversation, ChatMessage } from '@/lib/types';
import {
  loadConversationsFromStorage,
  saveConversationsToStorage,
  loadActiveConversationId,
  saveActiveConversationId,
  clearStorage,
} from '@/lib/storage';

export function useChats() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Initial SSR-safe hydration from localStorage
  useEffect(() => {
    const stored = loadConversationsFromStorage();
    const storedActiveId = loadActiveConversationId();

    setConversations(stored);

    if (storedActiveId && stored.some((c) => c.id === storedActiveId)) {
      setActiveId(storedActiveId);
    } else if (stored.length > 0) {
      setActiveId(stored[0].id);
    } else {
      setActiveId(null);
    }

    setIsHydrated(true);
  }, []);

  // Sync to localStorage upon conversation state changes after hydration
  useEffect(() => {
    if (!isHydrated) return;
    saveConversationsToStorage(conversations);
  }, [conversations, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveActiveConversationId(activeId);
  }, [activeId, isHydrated]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  /**
   * Creates a new conversation and sets it active.
   */
  const createNewChat = useCallback(() => {
    const newId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newConv: ChatConversation = {
      id: newId,
      title: 'New conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newId);
    setStreamError(null);
    return newId;
  }, []);

  /**
   * Switches to an existing conversation.
   */
  const selectChat = useCallback((id: string) => {
    setActiveId(id);
    setStreamError(null);
  }, []);

  /**
   * Deletes a specific conversation by ID.
   */
  const deleteChat = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== id);
        if (activeId === id) {
          const nextActive = filtered.length > 0 ? filtered[0].id : null;
          setActiveId(nextActive);
        }
        return filtered;
      });
    },
    [activeId]
  );

  /**
   * Clears all conversations from memory and storage.
   */
  const clearAllChats = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setConversations([]);
    setActiveId(null);
    setStreamError(null);
    clearStorage();
  }, []);

  /**
   * Aborts current generation stream.
   */
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  /**
   * Sends a message in the active conversation, or creates one if none exists.
   */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setStreamError(null);

      // Determine or create target conversation
      let targetConvId = activeId;
      let currentConvs = conversations;

      if (!targetConvId || !currentConvs.some((c) => c.id === targetConvId)) {
        const newId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newConv: ChatConversation = {
          id: newId,
          title: trimmed.slice(0, 32) + (trimmed.length > 32 ? '...' : ''),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        targetConvId = newId;
        currentConvs = [newConv, ...currentConvs];
        setActiveId(newId);
      }

      const userMsg: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        role: 'user',
        content: trimmed,
        createdAt: Date.now(),
      };

      const assistantMsgId = `msg_${Date.now()}_assistant`;
      const placeholderAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      };

      // Update state with user message and empty assistant placeholder
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === targetConvId) {
            const isFirst = conv.messages.length === 0;
            const updatedTitle = isFirst
              ? trimmed.slice(0, 36) + (trimmed.length > 36 ? '...' : '')
              : conv.title;
            return {
              ...conv,
              title: updatedTitle,
              messages: [...conv.messages, userMsg, placeholderAssistantMsg],
              updatedAt: Date.now(),
            };
          }
          return conv;
        })
      );

      // Prepare payload with prior messages
      const activeConv = currentConvs.find((c) => c.id === targetConvId);
      const historyToSend = (activeConv ? activeConv.messages : [])
        .concat(userMsg)
        .map((m) => ({ role: m.role, content: m.content }));

      setIsStreaming(true);
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyToSend }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let errorMessage = `Server error (${response.status})`;
          try {
            const errorJson = await response.json();
            if (errorJson.error) {
              errorMessage = errorJson.error;
            }
          } catch {
            // response was not JSON
          }
          throw new Error(errorMessage);
        }

        if (!response.body) {
          throw new Error('ReadableStream not supported by browser.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          // Update message in conversation
          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.id === targetConvId) {
                return {
                  ...conv,
                  messages: conv.messages.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                  ),
                  updatedAt: Date.now(),
                };
              }
              return conv;
            })
          );
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // User aborted generation, keep whatever was generated
          console.log('[useChats] Generation stopped by user.');
        } else {
          const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
          console.error('[useChats] Streaming error:', msg);
          setStreamError(msg);

          // Mark assistant message as failed or append error indicator
          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.id === targetConvId) {
                return {
                  ...conv,
                  messages: conv.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content:
                            m.content ||
                            '⚠️ Failed to generate a response. Please check your connection or Groq API key.',
                          error: true,
                        }
                      : m
                  ),
                };
              }
              return conv;
            })
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [activeId, conversations, isStreaming]
  );

  /**
   * Retries generating the last assistant response in the active chat.
   */
  const regenerateLastResponse = useCallback(async () => {
    if (!activeConversation || isStreaming) return;
    const msgs = activeConversation.messages;
    if (msgs.length === 0) return;

    // Find the last user message
    let lastUserIndex = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const userMessageContent = msgs[lastUserIndex].content;

    // Trim messages back to before that user message, and re-send
    const trimmedMessages = msgs.slice(0, lastUserIndex);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, messages: trimmedMessages, updatedAt: Date.now() }
          : c
      )
    );

    // Call sendMessage with userMessageContent
    setTimeout(() => {
      sendMessage(userMessageContent);
    }, 50);
  }, [activeConversation, isStreaming, sendMessage]);

  return {
    conversations,
    activeConversation,
    activeId,
    isHydrated,
    isStreaming,
    streamError,
    createNewChat,
    selectChat,
    deleteChat,
    clearAllChats,
    sendMessage,
    stopGeneration,
    regenerateLastResponse,
  };
}
