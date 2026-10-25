'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, Square } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

const MAX_CHARS = 2000;

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStop,
  isStreaming,
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit content, up to ~8 lines (approx 200px)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const charCount = input.length;
  const isNearLimit = charCount > 1500;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-2">
      {/* Input container card */}
      <div className="relative rounded-2xl bg-white dark:bg-[#30302E] border border-[#E5E2D8] dark:border-[#3E3E3A] shadow-card focus-within:border-[#C96442]/60 focus-within:ring-2 focus-within:ring-[#C96442]/20 transition-all duration-150">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about cloud computing..."
          rows={1}
          disabled={disabled}
          aria-label="Ask anything about cloud computing"
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-11 text-[15px] leading-relaxed text-[#1F1E1D] dark:text-[#F5F4EE] placeholder-[#73726C]/70 dark:placeholder-[#9E9C96]/70 focus:outline-none"
        />

        {/* Bottom controls row */}
        <div className="absolute bottom-2.5 left-4 right-3 flex items-center justify-between pointer-events-none">
          {/* Character counter (shows up when approaching 2,000 limit) */}
          <div className="text-[11px] font-mono pointer-events-auto">
            {isNearLimit && (
              <span
                className={`transition-colors ${
                  isOverLimit
                    ? 'text-red-500 font-bold'
                    : 'text-[#73726C] dark:text-[#9E9C96]'
                }`}
              >
                {charCount}/{MAX_CHARS}
              </span>
            )}
          </div>

          {/* Action button: Send or Stop */}
          <div className="pointer-events-auto flex items-center gap-2">
            {isStreaming ? (
              <button
                onClick={onStop}
                type="button"
                aria-label="Stop generating response"
                title="Stop generating"
                className="w-8 h-8 rounded-full bg-[#1F1E1D] dark:bg-[#F5F4EE] text-white dark:text-[#1F1E1D] flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                type="button"
                disabled={!input.trim() || isOverLimit || disabled}
                aria-label="Send message"
                title="Send message (Enter)"
                className="w-8 h-8 rounded-full bg-[#C96442] hover:bg-[#B5573A] disabled:bg-[#E5E2D8] dark:disabled:bg-[#3E3E3A] disabled:text-[#73726C]/50 dark:disabled:text-[#9E9C96]/50 text-white flex items-center justify-center transition-all active:scale-95 shadow-sm disabled:cursor-not-allowed"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <p className="mt-2 text-center text-[11px] text-[#73726C] dark:text-[#9E9C96]">
        CloudMentor only answers cloud computing questions and can make mistakes. Verify important
        details in official docs.
      </p>
    </div>
  );
};
