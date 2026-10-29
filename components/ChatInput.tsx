'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, Square, Sparkles } from 'lucide-react';

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
  const [personaDepth, setPersonaDepth] = useState<'standard' | 'beginner' | 'architect' | 'examprep'>('standard');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit content
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

    let finalPrompt = trimmed;
    if (personaDepth === 'beginner' && !trimmed.toLowerCase().includes('beginner')) {
      finalPrompt = `[Explanation Level: Beginner - Use everyday analogies and simple language]\n${trimmed}`;
    } else if (personaDepth === 'architect' && !trimmed.toLowerCase().includes('architect')) {
      finalPrompt = `[Explanation Level: Solutions Architect - Include high availability, security, and cost trade-offs]\n${trimmed}`;
    } else if (personaDepth === 'examprep' && !trimmed.toLowerCase().includes('exam')) {
      finalPrompt = `[Explanation Level: Cloud Certification Exam Prep - Highlight key testable concepts and scenarios]\n${trimmed}`;
    }

    onSend(finalPrompt);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const charCount = input.length;
  const isNearLimit = charCount > 1500;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-1">
      {/* Mode / Depth Chips */}
      <div className="flex items-center justify-between mb-2 px-1 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-light-muted dark:text-dark-muted hidden sm:inline">
            Mode:
          </span>
          {[
            { id: 'standard', label: 'Balanced' },
            { id: 'beginner', label: 'Beginner' },
            { id: 'architect', label: 'Architect' },
            { id: 'examprep', label: 'Exam Prep' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setPersonaDepth(mode.id as any)}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                personaDepth === mode.id
                  ? 'bg-aurora-cyan text-dark-bg font-bold shadow-xs'
                  : 'bg-light-surface/70 dark:bg-dark-elevated/70 text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary border border-light-border dark:border-dark-border'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <span className="text-[10.5px] text-light-muted dark:text-dark-muted hidden sm:inline">
          Enter to send • Shift+Enter for new line
        </span>
      </div>

      {/* Input container card */}
      <div className="relative rounded-2xl liquid-glass focus-within:border-aurora-cyan/60 focus-within:ring-2 focus-within:ring-aurora-cyan/20 transition-all duration-150 shadow-glass">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about cloud computing (AWS, Azure, GCP, Kubernetes, Docker, Terraform)..."
          rows={1}
          disabled={disabled}
          aria-label="Ask anything about cloud computing"
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-11 text-[15px] leading-relaxed text-light-primary dark:text-dark-primary placeholder-light-muted/70 dark:placeholder-dark-muted/70 focus:outline-none"
        />

        {/* Bottom controls row */}
        <div className="absolute bottom-2.5 left-4 right-3 flex items-center justify-between pointer-events-none">
          {/* Character counter */}
          <div className="text-[11px] font-mono pointer-events-auto">
            {isNearLimit && (
              <span
                className={`transition-colors ${
                  isOverLimit
                    ? 'text-red-500 font-bold'
                    : 'text-light-muted dark:text-dark-muted'
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
                className="w-8 h-8 rounded-full bg-light-primary dark:bg-dark-primary text-light-bg dark:text-dark-bg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm"
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
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-aurora-cyan to-aurora-blue hover:opacity-95 disabled:opacity-40 text-dark-bg flex items-center justify-center transition-all active:scale-95 shadow-aurora-teal disabled:cursor-not-allowed font-bold"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.8]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <p className="mt-2 text-center text-[10.5px] text-light-muted dark:text-dark-muted">
        CloudMentor AI uses verified domain knowledge for cloud computing and certifications. Always verify critical architecture details in official documentation.
      </p>
    </div>
  );
};
