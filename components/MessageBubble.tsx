'use client';

import React, { useState } from 'react';
import { ChatMessage } from '@/lib/types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Copy, Check, RotateCcw, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  isLastAssistant?: boolean;
  onRegenerate?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
  isLastAssistant = false,
  onRegenerate,
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
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3 bg-[#F0EEE6] dark:bg-[#30302E] text-[#1F1E1D] dark:text-[#F5F4EE] border border-[#E5E2D8] dark:border-[#3E3E3A] text-[15px] leading-relaxed shadow-soft">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant message - Claude-style editorial layout
  return (
    <div className="flex gap-3.5 mb-8 w-full group animate-in fade-in duration-200">
      {/* Small Terracotta Avatar */}
      <div className="w-7 h-7 rounded-lg shrink-0 mt-0.5 bg-[#FDF5F2] dark:bg-[#3B221B] border border-[#C96442]/30 flex items-center justify-center text-[#C96442]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-[#C96442]"
        >
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          <path d="m4.93 4.93 2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="2.5" fill="#C96442" fillOpacity="0.25" />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Error State */}
        {message.error ? (
          <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20 text-red-800 dark:text-red-300 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft">
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
                Retry
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Typing Indicator if content is empty during active stream */}
            {isStreaming && !message.content ? (
              <div className="flex items-center gap-1.5 py-2 text-[#73726C] dark:text-[#9E9C96]">
                <span className="w-2 h-2 rounded-full bg-[#C96442] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#C96442] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#C96442] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <div className="relative">
                <MarkdownRenderer content={message.content} />
                {/* Blinking cursor while streaming active response */}
                {isStreaming && isLastAssistant && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-[#C96442] animate-pulse align-middle" />
                )}
              </div>
            )}

            {/* Bottom action bar (Copy & Regenerate) */}
            {message.content && !isStreaming && (
              <div className="flex items-center gap-1 mt-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleCopyText}
                  type="button"
                  aria-label="Copy assistant answer"
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-[#73726C] dark:text-[#9E9C96] hover:text-[#1F1E1D] dark:hover:text-[#F5F4EE] hover:bg-[#EAE7DD] dark:hover:bg-[#383835] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
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
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-[#73726C] dark:text-[#9E9C96] hover:text-[#1F1E1D] dark:hover:text-[#F5F4EE] hover:bg-[#EAE7DD] dark:hover:bg-[#383835] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
