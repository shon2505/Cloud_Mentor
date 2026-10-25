'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-[#1F1E1D] dark:text-[#F5F4EE] leading-relaxed text-[15px]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded text-[13.5px] font-mono bg-[#EAE7DD] dark:bg-[#383835] text-[#A24424] dark:text-[#E89578] font-normal"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : ''}
                code={String(children).replace(/\n$/, '')}
              />
            );
          },
          h1: ({ children }) => (
            <h1 className="font-serif text-2xl font-normal mt-6 mb-3 text-[#1F1E1D] dark:text-[#F5F4EE] tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-xl font-normal mt-5 mb-2.5 text-[#1F1E1D] dark:text-[#F5F4EE] tracking-tight border-b border-[#E5E2D8]/60 dark:border-[#3E3E3A]/60 pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-sans text-base font-semibold mt-4 mb-2 text-[#1F1E1D] dark:text-[#F5F4EE]">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-3.5 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-3.5 space-y-1.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-3.5 space-y-1.5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#C96442] pl-4 my-4 italic text-[#73726C] dark:text-[#9E9C96]">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C96442] hover:text-[#B5573A] underline underline-offset-2 decoration-[#C96442]/40 hover:decoration-[#B5573A]"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-[#E5E2D8] dark:border-[#3E3E3A]">
              <table className="min-w-full divide-y divide-[#E5E2D8] dark:divide-[#3E3E3A] text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#F0EEE6] dark:bg-[#1F1E1D]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#73726C] dark:text-[#9E9C96]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 text-sm border-t border-[#E5E2D8]/50 dark:border-[#3E3E3A]/50">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
