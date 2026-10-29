'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useChats } from '@/hooks/useChats';
import { Sidebar } from './Sidebar';
import { EmptyState } from './EmptyState';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ScrollToBottom } from './ScrollToBottom';
import { Menu, Plus } from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const {
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
  } = useChats();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => activeConversation?.messages || [], [activeConversation?.messages]);

  // Handle scroll events to detect if user has scrolled up
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isUp = distanceFromBottom > 120;
    setUserScrolledUp(isUp);
    setShowScrollBottom(isUp);
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
    setUserScrolledUp(false);
    setShowScrollBottom(false);
  }, []);

  // Auto-scroll when messages update, unless user scrolled up
  useEffect(() => {
    if (!userScrolledUp) {
      scrollToBottom(false);
    }
  }, [messages, isStreaming, userScrolledUp, scrollToBottom]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FAF9F5] dark:bg-[#262624]">
        <div className="flex items-center gap-2 text-sm text-[#73726C] dark:text-[#9E9C96]">
          <span className="w-2 h-2 rounded-full bg-[#C96442] animate-ping" />
          <span>Loading CloudMentor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAF9F5] dark:bg-[#262624] text-[#1F1E1D] dark:text-[#F5F4EE]">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onClearAllChats={clearAllChats}
        isOpenMobile={mobileSidebarOpen}
        onToggleMobile={() => setMobileSidebarOpen((prev) => !prev)}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-[#E5E2D8] dark:border-[#3E3E3A] bg-[#FAF9F5] dark:bg-[#262624] shrink-0 z-10">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            type="button"
            aria-label="Open sidebar"
            className="p-1.5 rounded-lg text-[#73726C] dark:text-[#9E9C96] hover:bg-[#EAE7DD] dark:hover:bg-[#30302E]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="font-serif font-medium text-sm tracking-tight text-[#1F1E1D] dark:text-[#F5F4EE]">
            {activeConversation?.title || 'CloudMentor'}
          </span>

          <button
            onClick={createNewChat}
            type="button"
            aria-label="New chat"
            className="p-1.5 rounded-lg text-[#C96442] hover:bg-[#EAE7DD] dark:hover:bg-[#30302E]"
          >
            <Plus className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Message Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 md:px-8 pt-6 pb-2"
        >
          <div className="max-w-3xl mx-auto flex flex-col min-h-full">
            {messages.length === 0 ? (
              <EmptyState onSelectPrompt={sendMessage} />
            ) : (
              <div className="flex-1">
                {messages.map((msg, index) => {
                  const isLastAssistant =
                    msg.role === 'assistant' && index === messages.length - 1;
                  return (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isStreaming={isStreaming && isLastAssistant}
                      isLastAssistant={isLastAssistant}
                      onRegenerate={regenerateLastResponse}
                    />
                  );
                })}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Scroll To Bottom Button */}
        <ScrollToBottom visible={showScrollBottom} onClick={() => scrollToBottom(true)} />

        {/* Pinned Bottom Input */}
        <div className="shrink-0 bg-gradient-to-t from-[#FAF9F5] dark:from-[#262624] via-[#FAF9F5] dark:via-[#262624] to-transparent pt-3">
          <ChatInput
            onSend={sendMessage}
            onStop={stopGeneration}
            isStreaming={isStreaming}
          />
        </div>
      </main>
    </div>
  );
};
