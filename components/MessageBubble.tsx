'use client';

import React, { useState } from 'react';
import { ChatMessage } from '@/lib/types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Copy, Check, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  isLastAssistant?: boolean;
  onRegenerate?: () => void;
  onNavigateModule?: (module: 'academy' | 'optimizer' | 'explorer' | 'roadmap') => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
  isLastAssistant = false,
  onRegenerate,
  onNavigateModule,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-6 w-full animate-in fade-in duration-200">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3 bg-gradient-to-r from-aurora-cyan/15 to-aurora-blue/20 dark:from-aurora-cyan/20 dark:to-aurora-blue/25 text-light-primary dark:text-dark-primary border border-aurora-cyan/30 text-[15px] leading-relaxed shadow-glass">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant message - Editorial layout with Aurora glow
  return (
    <div className="flex gap-3.5 mb-8 w-full group animate-in fade-in duration-200">
      {/* Liquid Aurora Icon Mark */}
      <div className="w-8 h-8 rounded-xl shrink-0 mt-0.5 bg-gradient-to-tr from-aurora-teal via-aurora-blue to-aurora-violet p-[1.5px] shadow-aurora-teal">
        <div className="w-full h-full bg-light-surface dark:bg-dark-secondary rounded-[10px] flex items-center justify-center text-aurora-cyan">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-aurora-cyan"
          >
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            <path d="m4.93 4.93 2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Error State */}
        {message.error ? (
          <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/70 dark:bg-red-950/20 text-red-800 dark:text-red-300 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{message.content}</p>
            </div>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                type="button"
                className="self-start sm:self-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/80 text-red-900 dark:text-red-100 font-medium text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Typing Indicator if content is empty during active stream */}
            {isStreaming && !message.content ? (
              <div className="flex items-center gap-1.5 py-2 text-light-muted dark:text-dark-muted">
                <span className="w-2 h-2 rounded-full bg-aurora-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-aurora-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-aurora-violet animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <div className="relative">
                <MarkdownRenderer content={message.content} />
                {/* Blinking aurora cursor while streaming active response */}
                {isStreaming && isLastAssistant && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-aurora-cyan animate-pulse align-middle" />
                )}
              </div>
            )}

            {/* Bottom action bar (Copy, Regenerate, Module Shortcuts) */}
            {message.content && !isStreaming && (
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2">
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleCopyText}
                    type="button"
                    aria-label="Copy assistant answer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {isLastAssistant && onRegenerate && (
                    <button
                      onClick={onRegenerate}
                      type="button"
                      aria-label="Regenerate response"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </button>
                  )}
                </div>

                {/* Contextual deep-linking chips */}
                {onNavigateModule && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-light-muted dark:text-dark-muted opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Explore:</span>
                    <button
                      onClick={() => onNavigateModule('academy')}
                      className="px-2 py-0.5 rounded-md bg-light-surface/80 dark:bg-dark-elevated/80 border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-aurora-cyan hover:border-aurora-cyan/40 transition-colors"
                    >
                      Academy
                    </button>
                    <button
                      onClick={() => onNavigateModule('optimizer')}
                      className="px-2 py-0.5 rounded-md bg-light-surface/80 dark:bg-dark-elevated/80 border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-aurora-teal hover:border-aurora-teal/40 transition-colors"
                    >
                      Cost Optimizer
                    </button>
                    <button
                      onClick={() => onNavigateModule('explorer')}
                      className="px-2 py-0.5 rounded-md bg-light-surface/80 dark:bg-dark-elevated/80 border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-aurora-blue hover:border-aurora-blue/40 transition-colors"
                    >
                      Services
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
