'use client';

import React from 'react';
import { PlatformModule } from '@/lib/platformTypes';
import { ThemeToggle } from './ThemeToggle';
import {
  MessageSquare,
  GraduationCap,
  Calculator,
  Compass,
  Sparkles,
  Milestone,
  Plus,
  Trash2,
  X,
  Menu,
} from 'lucide-react';
import { ChatConversation } from '@/lib/types';

interface NavigationProps {
  activeModule: PlatformModule;
  onSelectModule: (module: PlatformModule) => void;
  // Cloud Mentor Chat specific props (when activeModule === 'mentor')
  conversations?: ChatConversation[];
  activeChatId?: string | null;
  onSelectChat?: (id: string) => void;
  onNewChat?: () => void;
  onDeleteChat?: (id: string) => void;
  onClearAllChats?: () => void;
  // Mobile drawer state
  mobileOpen: boolean;
  onToggleMobile: () => void;
}

export const MODULE_NAV_ITEMS: {
  id: PlatformModule;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
}[] = [
  {
    id: 'mentor',
    label: 'Cloud Mentor',
    shortLabel: 'AI Tutor',
    icon: MessageSquare,
    description: 'AI Cloud Tutor & Technical Architect',
  },
  {
    id: 'academy',
    label: 'Cloud Academy',
    shortLabel: 'Academy',
    icon: GraduationCap,
    description: 'Free Courses, Labs & Certifications',
    badge: 'Free',
  },
  {
    id: 'optimizer',
    label: 'Cost Optimizer',
    shortLabel: 'Optimizer',
    icon: Calculator,
    description: 'Workload Cost Comparison & Sizing',
    badge: 'Popular',
  },
  {
    id: 'explorer',
    label: 'Cloud Explorer',
    shortLabel: 'Explorer',
    icon: Compass,
    description: 'Providers, Services & Free Tiers',
  },
  {
    id: 'future',
    label: 'Cloud Future',
    shortLabel: 'Future',
    icon: Sparkles,
    description: 'Emerging Tech, AI Infrastructure & Careers',
    badge: 'New',
  },
  {
    id: 'roadmap',
    label: 'My Roadmap',
    shortLabel: 'Roadmap',
    icon: Milestone,
    description: 'Personalized Cloud Learning Journey',
  },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onSelectModule,
  conversations = [],
  activeChatId = null,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onClearAllChats,
  mobileOpen,
  onToggleMobile,
}) => {
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  // Chronological chat grouping for Cloud Mentor
  const chatGroups = React.useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
    const startOf7Days = startOfToday - 6 * 24 * 60 * 60 * 1000;

    const res: {
      today: ChatConversation[];
      yesterday: ChatConversation[];
      last7Days: ChatConversation[];
      older: ChatConversation[];
    } = { today: [], yesterday: [], last7Days: [], older: [] };

    conversations.forEach((conv) => {
      const time = conv.updatedAt || conv.createdAt;
      if (time >= startOfToday) res.today.push(conv);
      else if (time >= startOfYesterday) res.yesterday.push(conv);
      else if (time >= startOf7Days) res.last7Days.push(conv);
      else res.older.push(conv);
    });

    return res;
  }, [conversations]);

  const renderChatGroup = (title: string, list: ChatConversation[]) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-3">
        <h4 className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted">
          {title}
        </h4>
        <div className="space-y-0.5">
          {list.map((conv) => {
            const isActive = conv.id === activeChatId;
            return (
              <div
                key={conv.id}
                className={`group relative flex items-center justify-between rounded-xl px-3 py-1.5 text-xs transition-all ${
                  isActive
                    ? 'bg-aurora-cyan/15 dark:bg-aurora-cyan/20 font-medium text-light-primary dark:text-dark-primary border border-aurora-cyan/30'
                    : 'text-light-muted dark:text-dark-muted hover:bg-light-hover dark:hover:bg-dark-hover hover:text-light-primary dark:hover:text-dark-primary'
                }`}
              >
                <button
                  onClick={() => {
                    if (onSelectChat) onSelectChat(conv.id);
                    if (mobileOpen) onToggleMobile();
                  }}
                  type="button"
                  className="flex items-center gap-2 flex-1 min-w-0 text-left"
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{conv.title || 'Conversation'}</span>
                </button>
                {onDeleteChat && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(conv.id);
                    }}
                    type="button"
                    aria-label={`Delete chat ${conv.title}`}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 rounded transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const navContent = (
    <div className="flex flex-col h-full bg-light-surface/90 dark:bg-dark-secondary/85 backdrop-blur-xl border-r border-light-border dark:border-dark-border select-none">
      {/* Brand Header */}
      <div className="p-4 flex flex-col gap-3 border-b border-light-border dark:border-dark-border">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              onSelectModule('mentor');
              if (mobileOpen) onToggleMobile();
            }}
            type="button"
            className="flex items-center gap-2.5 text-left group"
          >
            {/* Liquid Aurora Icon Mark */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-aurora-teal via-aurora-blue to-aurora-violet p-[1.5px] shadow-aurora-teal group-hover:shadow-aurora-glow transition-all">
              <div className="w-full h-full bg-light-surface dark:bg-dark-secondary rounded-[10px] flex items-center justify-center text-aurora-cyan">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4">
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
                  <path d="m4.93 4.93 2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.4" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-semibold text-base text-light-primary dark:text-dark-primary tracking-tight">
                CloudMentor
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-aurora-cyan">
                AI Cloud Platform
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {mobileOpen && (
              <button
                onClick={onToggleMobile}
                type="button"
                aria-label="Close menu"
                className="md:hidden p-1.5 rounded-lg text-light-muted dark:text-dark-muted hover:bg-light-hover dark:hover:bg-dark-hover"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Modules Navigation */}
      <div className="p-3 border-b border-light-border dark:border-dark-border">
        <div className="text-[10px] font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted px-3 mb-2">
          Platform Modules
        </div>
        <nav className="space-y-1">
          {MODULE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectModule(item.id);
                  if (mobileOpen) onToggleMobile();
                }}
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-aurora-cyan/20 to-aurora-blue/20 text-light-primary dark:text-dark-primary border border-aurora-cyan/40 shadow-xs'
                    : 'text-light-muted dark:text-dark-muted hover:bg-light-hover dark:hover:bg-dark-hover hover:text-light-primary dark:hover:text-dark-primary'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isSelected ? 'text-aurora-cyan' : 'opacity-70'
                    }`}
                  />
                  <span className="truncate text-[13px]">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-aurora-cyan text-dark-bg font-extrabold'
                        : 'bg-aurora-cyan/15 text-aurora-cyan'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Cloud Mentor Conversations Section (Visible when in mentor module) */}
      {activeModule === 'mentor' && (
        <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">
              Recent Chats
            </span>
            {onNewChat && (
              <button
                onClick={() => {
                  onNewChat();
                  if (mobileOpen) onToggleMobile();
                }}
                type="button"
                title="Start a new chat"
                className="flex items-center gap-1 text-[11px] font-medium text-aurora-blue hover:text-aurora-cyan transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-6 px-3 text-xs text-light-muted dark:text-dark-muted">
                No conversations yet. Ask your first question!
              </div>
            ) : (
              <>
                {renderChatGroup('Today', chatGroups.today)}
                {renderChatGroup('Yesterday', chatGroups.yesterday)}
                {renderChatGroup('Previous 7 Days', chatGroups.last7Days)}
                {renderChatGroup('Older', chatGroups.older)}
              </>
            )}
          </div>

          {conversations.length > 0 && onClearAllChats && (
            <div className="pt-2 border-t border-light-border dark:border-dark-border">
              <button
                onClick={() => setShowClearConfirm(true)}
                type="button"
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-light-muted dark:text-dark-muted hover:text-red-500 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear history</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Non-mentor module info badge / quick tip */}
      {activeModule !== 'mentor' && (
        <div className="flex-1 p-3 flex flex-col justify-end">
          <div className="rounded-xl p-3 bg-aurora-blue/10 dark:bg-aurora-blue/15 border border-aurora-blue/20 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-light-primary dark:text-dark-primary mb-1">
              <Sparkles className="w-3.5 h-3.5 text-aurora-cyan" />
              <span>AI Connected</span>
            </div>
            <p className="text-[11px] leading-relaxed text-light-muted dark:text-dark-muted mb-2">
              Need technical clarification? Ask Cloud Mentor at any point to break down concepts or explain trade-offs.
            </p>
            <button
              onClick={() => onSelectModule('mentor')}
              type="button"
              className="text-[11.5px] font-semibold text-aurora-cyan hover:underline"
            >
              Open AI Assistant →
            </button>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && onClearAllChats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border p-5 shadow-glass animate-in fade-in zoom-in-95">
            <h3 className="font-serif font-semibold text-base text-light-primary dark:text-dark-primary mb-2">
              Clear all chat history?
            </h3>
            <p className="text-xs text-light-muted dark:text-dark-muted mb-5 leading-relaxed">
              This will permanently delete all saved AI conversation sessions in this browser.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-light-muted dark:text-dark-muted hover:bg-light-hover dark:hover:bg-dark-hover"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllChats();
                  setShowClearConfirm(false);
                }}
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
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
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 h-screen shrink-0 flex-col z-20">
        {navContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onToggleMobile}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
