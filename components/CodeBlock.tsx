'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'text', code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code snippet:', err);
    }
  };

  const cleanLang = language.replace(/^language-/, '') || 'code';

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-[#E5E2D8] dark:border-[#3E3E3A] bg-[#F7F5EE] dark:bg-[#1E1E1C] text-sm">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#E5E2D8] dark:border-[#3E3E3A] bg-[#ECE9DE]/60 dark:bg-[#1A1A18]/60 text-xs font-mono text-[#73726C] dark:text-[#9E9C96]">
        <span className="font-medium tracking-wide uppercase">{cleanLang}</span>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans transition-colors hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 text-[#1F1E1D] dark:text-[#F5F4EE]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
        <pre className="!bg-transparent !p-0 !m-0">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
