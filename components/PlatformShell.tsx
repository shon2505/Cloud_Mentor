'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { PlatformModule } from '@/lib/platformTypes';
import { useChats } from '@/hooks/useChats';
import { Navigation } from './Navigation';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { ScrollToBottom } from './ScrollToBottom';
import { CloudAcademyModule } from './modules/CloudAcademyModule';
import { CloudCostOptimizerModule } from './modules/CloudCostOptimizerModule';
import { CloudExplorerModule } from './modules/CloudExplorerModule';
import { CloudFutureModule } from './modules/CloudFutureModule';
import { CloudRoadmapModule } from './modules/CloudRoadmapModule';
import { Menu, Plus, Sparkles } from 'lucide-react';

interface PlatformShellProps {
  initialModule?: PlatformModule;
}

export const PlatformShell: React.FC<PlatformShellProps> = ({
  initialModule = 'mentor',
}) => {
  const [activeModule, setActiveModule] = useState<PlatformModule>(initialModule);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  // Chat Hook Integration (100% preserves existing Groq chat)
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => activeConversation?.messages || [], [activeConversation?.messages]);

  // Scroll management
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

  useEffect(() => {
    if (!userScrolledUp && activeModule === 'mentor') {
      scrollToBottom(false);
    }
  }, [messages, isStreaming, userScrolledUp, scrollToBottom, activeModule]);

  // Contextual action: Ask Cloud Mentor AI from another module
  const handleAskMentor = (prompt: string) => {
    setActiveModule('mentor');
    sendMessage(prompt);
  };

  // Switch module
  const handleSelectModule = (mod: PlatformModule) => {
    setActiveModule(mod);
  };

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'mentor':
        return activeConversation?.title || 'Cloud Mentor AI';
      case 'academy':
        return 'Cloud Academy';
      case 'optimizer':
        return 'Cloud Cost Optimizer';
      case 'explorer':
        return 'Cloud Explorer';
      case 'future':
        return 'Cloud Future';
      case 'roadmap':
        return 'My Learning Roadmap';
      default:
        return 'CloudMentor';
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-light-bg dark:bg-dark-bg">
        <div className="flex items-center gap-3 text-sm text-light-muted dark:text-dark-muted liquid-glass p-6 rounded-2xl shadow-glass">
          <span className="w-3 h-3 rounded-full bg-aurora-cyan animate-ping" />
          <span className="font-serif font-medium">Loading CloudMentor Platform...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-transparent text-light-primary dark:text-dark-primary relative z-10">
      {/* Primary Global Navigation */}
      <Navigation
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        conversations={conversations}
        activeChatId={activeId}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onClearAllChats={clearAllChats}
        mobileOpen={mobileNavOpen}
        onToggleMobile={() => setMobileNavOpen((prev) => !prev)}
      />

      {/* Main Module Content View */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative bg-light-surface/40 dark:bg-dark-bg/40 backdrop-blur-xs overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-light-border dark:border-dark-border liquid-glass shrink-0 z-20">
          <button
            onClick={() => setMobileNavOpen(true)}
            type="button"
            aria-label="Open navigation menu"
            className="p-1.5 rounded-lg text-light-muted dark:text-dark-muted hover:bg-light-hover dark:hover:bg-dark-hover"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="font-serif font-medium text-sm tracking-tight text-light-primary dark:text-dark-primary truncate max-w-[200px]">
            {getModuleTitle()}
          </span>

          <div className="flex items-center gap-1">
            {activeModule === 'mentor' ? (
              <button
                onClick={createNewChat}
                type="button"
                aria-label="New chat"
                className="p-1.5 rounded-lg text-aurora-cyan hover:bg-light-hover dark:hover:bg-dark-hover"
              >
                <Plus className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setActiveModule('mentor')}
                type="button"
                aria-label="Open AI Tutor"
                className="p-1.5 rounded-lg text-aurora-cyan hover:bg-light-hover dark:hover:bg-dark-hover"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {/* 1. CLOUD MENTOR AI ASSISTANT VIEW */}
        {activeModule === 'mentor' && (
          <div className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden">
            {/* Scrollable Message Container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 md:px-8 pt-6 pb-2"
            >
              <div className="max-w-3xl mx-auto flex flex-col min-h-full">
                {messages.length === 0 ? (
                  <EmptyState
                    onSelectPrompt={sendMessage}
                    onNavigateModule={handleSelectModule}
                  />
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
                          onNavigateModule={handleSelectModule}
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
            <div className="shrink-0 bg-gradient-to-t from-light-bg dark:from-dark-bg via-light-bg/80 dark:via-dark-bg/80 to-transparent pt-3 z-10">
              <ChatInput
                onSend={sendMessage}
                onStop={stopGeneration}
                isStreaming={isStreaming}
              />
            </div>
          </div>
        )}

        {/* 2. CLOUD ACADEMY MODULE */}
        {activeModule === 'academy' && (
          <CloudAcademyModule
            onAskMentor={handleAskMentor}
            onAddToRoadmap={(title) => {
              // Contextual roadmap focus
              setActiveModule('roadmap');
            }}
          />
        )}

        {/* 3. CLOUD COST OPTIMIZER MODULE */}
        {activeModule === 'optimizer' && (
          <CloudCostOptimizerModule onAskMentor={handleAskMentor} />
        )}

        {/* 4. CLOUD EXPLORER MODULE */}
        {activeModule === 'explorer' && (
          <CloudExplorerModule
            onAskMentor={handleAskMentor}
            onLaunchCostOptimizer={() => setActiveModule('optimizer')}
          />
        )}

        {/* 5. CLOUD FUTURE MODULE */}
        {activeModule === 'future' && (
          <CloudFutureModule
            onAskMentor={handleAskMentor}
            onAddToRoadmap={() => setActiveModule('roadmap')}
          />
        )}

        {/* 6. MY LEARNING ROADMAP MODULE */}
        {activeModule === 'roadmap' && (
          <CloudRoadmapModule onAskMentor={handleAskMentor} />
        )}
      </main>
    </div>
  );
};
