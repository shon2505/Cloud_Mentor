'use client';

import React, { useState, useMemo } from 'react';
import { ChatConversation } from '@/lib/types';
import { ThemeToggle } from './ThemeToggle';
import {
  Plus,
  MessageSquare,
  Trash2,
  X,
  Menu,
  AlertTriangle,
} from 'lucide-react';

interface SidebarProps {
  conversations: ChatConversation[];
  activeId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onClearAllChats: () => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
}

interface GroupedChats {
  today: ChatConversation[];
  yesterday: ChatConversation[];
  last7Days: ChatConversation[];
  older: ChatConversation[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onClearAllChats,
  isOpenMobile,
  onToggleMobile,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Group conversations chronologically
  const grouped = useMemo<GroupedChats>(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
    const startOf7Days = startOfToday - 6 * 24 * 60 * 60 * 1000;

    const res: GroupedChats = {
      today: [],
      yesterday: [],
      last7Days: [],
      older: [],
    };

    conversations.forEach((conv) => {
      const time = conv.updatedAt || conv.createdAt;
      if (time >= startOfToday) {
        res.today.push(conv);
      } else if (time >= startOfYesterday) {
        res.yesterday.push(conv);
      } else if (time >= startOf7Days) {
        res.last7Days.push(conv);
      } else {
        res.older.push(conv);
      }
    });

    return res;
  }, [conversations]);

  const renderGroup = (title: string, list: ChatConversation[]) => {
    if (list.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#73726C] dark:text-[#9E9C96]">
          {title}
        </h3>
        <div className="space-y-0.5">
          {list.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <div
                key={conv.id}
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-[#EAE7DD] dark:bg-[#30302E] font-medium text-[#1F1E1D] dark:text-[#F5F4EE]'
                    : 'text-[#73726C] dark:text-[#9E9C96] hover:bg-[#EAE7DD]/60 dark:hover:bg-[#30302E]/60 hover:text-[#1F1E1D] dark:hover:text-[#F5F4EE]'
                }`}
              >
                <button
                  onClick={() => {
                    onSelectChat(conv.id);
                    if (isOpenMobile) onToggleMobile();
                  }}
                  type="button"
                  className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="truncate text-[13.5px]">{conv.title || 'Conversation'}</span>
                </button>

                {/* Delete button appears on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(conv.id);
                  }}
                  type="button"
                  aria-label={`Delete chat ${conv.title}`}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 rounded transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F0EEE6] dark:bg-[#1F1E1D] border-r border-[#E5E2D8] dark:border-[#3E3E3A]">
      {/* Header: Brand & New Chat */}
      <div className="p-3.5 flex flex-col gap-3 border-b border-[#E5E2D8] dark:border-[#3E3E3A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Logo mark */}
            <div className="w-7 h-7 rounded-lg bg-[#C96442] flex items-center justify-center text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                <path d="m4.93 4.93 2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <span className="font-serif font-medium text-base text-[#1F1E1D] dark:text-[#F5F4EE] tracking-tight">
              CloudMentor
            </span>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {isOpenMobile && (
              <button
                onClick={onToggleMobile}
                type="button"
                aria-label="Close sidebar"
                className="md:hidden p-1.5 rounded-lg text-[#73726C] dark:text-[#9E9C96] hover:bg-[#EAE7DD] dark:hover:bg-[#30302E]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => {
            onNewChat();
            if (isOpenMobile) onToggleMobile();
          }}
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#E5E2D8] dark:border-[#3E3E3A] bg-white dark:bg-[#30302E] hover:bg-[#FAF9F5] dark:hover:bg-[#383835] text-[#1F1E1D] dark:text-[#F5F4EE] text-sm font-medium shadow-soft hover:shadow transition-all active:scale-[0.99]"
        >
          <Plus className="w-4 h-4 text-[#C96442]" />
          <span>New chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {conversations.length === 0 ? (
          <div className="text-center py-8 px-4 text-xs text-[#73726C] dark:text-[#9E9C96]">
            No previous conversations. Start asking a cloud question!
          </div>
        ) : (
          <>
            {renderGroup('Today', grouped.today)}
            {renderGroup('Yesterday', grouped.yesterday)}
            {renderGroup('Previous 7 Days', grouped.last7Days)}
            {renderGroup('Older', grouped.older)}
          </>
        )}
      </div>

      {/* Footer Actions */}
      {conversations.length > 0 && (
        <div className="p-3 border-t border-[#E5E2D8] dark:border-[#3E3E3A]">
          <button
            onClick={() => setShowClearConfirm(true)}
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#73726C] dark:text-[#9E9C96] hover:text-red-600 dark:hover:text-red-400 hover:bg-[#EAE7DD] dark:hover:bg-[#30302E] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear all conversations</span>
          </button>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#30302E] border border-[#E5E2D8] dark:border-[#3E3E3A] p-5 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-medium text-[#1F1E1D] dark:text-[#F5F4EE]">Clear all chats?</h3>
            </div>
            <p className="text-xs text-[#73726C] dark:text-[#9E9C96] mb-5 leading-relaxed">
              This will permanently delete all your conversation history stored in this browser. This
              action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#73726C] dark:text-[#9E9C96] hover:bg-[#F0EEE6] dark:hover:bg-[#383835] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllChats();
                  setShowClearConfirm(false);
                }}
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors shadow-xs"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed width) */}
      <aside className="hidden md:flex w-64 h-screen shrink-0 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            onClick={onToggleMobile}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
